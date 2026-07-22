#!/usr/bin/env node
"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const SCHEMA_VERSION = 1;
const VIEW_NAME = "study-log.md";
const EVENTS_NAME = "events";
const BACKUPS_NAME = "backups";
const LOCK_NAME = ".study-log.lock";
const MAX_VIEW_BACKUPS = 20;

function usage() {
  return `CPA study log (append-only)

Usage:
  node scripts/study-log.js status --dir <persistent-log-directory>
  node scripts/study-log.js init --dir <persistent-log-directory>
  node scripts/study-log.js append --dir <directory> --subject <subject> --topic <topic> --summary <summary> [options]
  node scripts/study-log.js import-markdown --dir <directory> --file <legacy-markdown> [--subject <subject>]
  node scripts/study-log.js rebuild --dir <persistent-log-directory>
  node scripts/study-log.js verify --dir <persistent-log-directory>

Append options:
  --details <text>       Longer notes
  --result <text>        Score or practice result
  --weak-points <text>   Mistakes or weak areas
  --next-step <text>     Planned follow-up
  --source <text>        Source material or question range
  --recorded-at <ISO>    Override timestamp (must be a valid ISO date)
`;
}

function die(message, exitCode = 1) {
  console.error(`ERROR: ${message}`);
  process.exit(exitCode);
}

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const options = {};

  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    if (!token.startsWith("--")) {
      die(`Unexpected argument: ${token}\n\n${usage()}`);
    }

    const key = token.slice(2);
    const value = rest[index + 1];
    if (!value || value.startsWith("--")) {
      die(`Missing value for --${key}`);
    }
    options[key] = value;
    index += 1;
  }

  return { command, options };
}

function requiredOption(options, key) {
  const value = options[key];
  if (typeof value !== "string" || value.trim() === "") {
    die(`--${key} is required.`);
  }
  return value.trim();
}

function optionalOption(options, key) {
  const value = options[key];
  return typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
}

function logPaths(options) {
  const root = path.resolve(requiredOption(options, "dir"));
  return {
    root,
    events: path.join(root, EVENTS_NAME),
    backups: path.join(root, BACKUPS_NAME),
    view: path.join(root, VIEW_NAME),
    lock: path.join(root, LOCK_NAME),
  };
}

function ensureDirectories(paths) {
  fs.mkdirSync(paths.root, { recursive: true });
  fs.mkdirSync(paths.events, { recursive: true });
  fs.mkdirSync(paths.backups, { recursive: true });
}

function acquireLock(paths) {
  ensureDirectories(paths);
  let descriptor;
  try {
    descriptor = fs.openSync(paths.lock, "wx");
    fs.writeFileSync(
      descriptor,
      `${JSON.stringify({ pid: process.pid, createdAt: new Date().toISOString() })}\n`,
      "utf8"
    );
  } catch (error) {
    if (error.code === "EEXIST") {
      die(
        `Log is locked: ${paths.lock}. Another update may be running. ` +
          "Do not delete the lock until you have checked that no writer is active."
      );
    }
    throw error;
  } finally {
    if (descriptor !== undefined) fs.closeSync(descriptor);
  }

  return () => {
    try {
      fs.unlinkSync(paths.lock);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  };
}

function validateRecord(record, filename) {
  const requiredStrings = ["id", "recordedAt", "subject", "topic", "summary"];
  if (!record || record.schema !== SCHEMA_VERSION) {
    throw new Error(`${filename}: unsupported or missing schema.`);
  }
  for (const field of requiredStrings) {
    if (typeof record[field] !== "string" || record[field].trim() === "") {
      throw new Error(`${filename}: missing non-empty ${field}.`);
    }
  }
  if (Number.isNaN(Date.parse(record.recordedAt))) {
    throw new Error(`${filename}: recordedAt is not a valid date.`);
  }
}

function readRecords(paths) {
  if (!fs.existsSync(paths.events)) return [];

  const filenames = fs
    .readdirSync(paths.events)
    .filter((name) => name.toLowerCase().endsWith(".json"))
    .sort();

  const records = filenames.map((filename) => {
    const fullPath = path.join(paths.events, filename);
    let record;
    try {
      record = JSON.parse(fs.readFileSync(fullPath, "utf8"));
    } catch (error) {
      throw new Error(`${filename}: invalid JSON (${error.message}).`);
    }
    validateRecord(record, filename);
    return { ...record, _filename: filename };
  });

  records.sort((left, right) => {
    const timeDifference = Date.parse(left.recordedAt) - Date.parse(right.recordedAt);
    return timeDifference || left.id.localeCompare(right.id);
  });
  return records;
}

function recordWithoutFilename(record) {
  const { _filename, ...clean } = record;
  return clean;
}

function sourceDigest(records) {
  const canonical = JSON.stringify(records.map(recordWithoutFilename));
  return crypto.createHash("sha256").update(canonical, "utf8").digest("hex");
}

function normalizeInline(value) {
  return String(value).replace(/\r?\n/g, " / ").trim();
}

function renderView(records) {
  const digest = sourceDigest(records);
  const lines = [
    "# CPA 学习日志",
    "",
    "> 此文件由 `scripts/study-log.js` 根据 `events/` 自动生成。请勿直接编辑；需要恢复时运行 `rebuild`。",
    "",
    `<!-- cpa-study-log:v${SCHEMA_VERSION} event-count=${records.length} source-sha256=${digest} -->`,
    "",
    `- 记录数：${records.length}`,
    `- 最后生成：${new Date().toISOString()}`,
    "",
  ];

  let currentDate;
  for (const record of records) {
    const date = record.recordedAt.slice(0, 10);
    if (date !== currentDate) {
      currentDate = date;
      lines.push(`## ${date}`, "");
    }

    lines.push(`### ${normalizeInline(record.subject)} · ${normalizeInline(record.topic)}`, "");
    lines.push(`- 记录时间：${normalizeInline(record.recordedAt)}`);
    lines.push(`- 摘要：${normalizeInline(record.summary)}`);
    if (record.result) lines.push(`- 结果：${normalizeInline(record.result)}`);
    if (record.weakPoints) lines.push(`- 薄弱点：${normalizeInline(record.weakPoints)}`);
    if (record.nextStep) lines.push(`- 下一步：${normalizeInline(record.nextStep)}`);
    if (record.source) lines.push(`- 来源：${normalizeInline(record.source)}`);
    lines.push(`- 事件 ID：\`${record.id}\``, "");
    if (record.details) {
      lines.push("#### 详细记录", "", record.details.trim(), "");
    }
  }

  return `${lines.join("\n").trimEnd()}\n`;
}

function backupName() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `${VIEW_NAME}.${timestamp}.${crypto.randomUUID()}.bak`;
}

function pruneViewBackups(paths) {
  const generatedBackups = fs
    .readdirSync(paths.backups)
    .filter((name) => name.startsWith(`${VIEW_NAME}.`) && name.endsWith(".bak"))
    .sort();

  for (const oldBackup of generatedBackups.slice(0, -MAX_VIEW_BACKUPS)) {
    fs.unlinkSync(path.join(paths.backups, oldBackup));
  }
}

function writeView(paths, content) {
  ensureDirectories(paths);
  const temporary = path.join(
    paths.root,
    `.${VIEW_NAME}.${process.pid}.${crypto.randomUUID()}.tmp`
  );
  fs.writeFileSync(temporary, content, { encoding: "utf8", flag: "wx" });

  let backup;
  try {
    if (fs.existsSync(paths.view)) {
      backup = path.join(paths.backups, backupName());
      fs.renameSync(paths.view, backup);
    }
    fs.renameSync(temporary, paths.view);
    pruneViewBackups(paths);
  } catch (error) {
    if (!fs.existsSync(paths.view) && backup && fs.existsSync(backup)) {
      fs.renameSync(backup, paths.view);
    }
    throw error;
  } finally {
    if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
  }
}

function viewStatus(paths, records) {
  if (!fs.existsSync(paths.view)) {
    return { ok: false, reason: `${VIEW_NAME} is missing.` };
  }

  const text = fs.readFileSync(paths.view, "utf8");
  const marker = text.match(
    /<!-- cpa-study-log:v(\d+) event-count=(\d+) source-sha256=([a-f0-9]{64}) -->/
  );
  if (!marker) return { ok: false, reason: `${VIEW_NAME} has no valid generated marker.` };

  const expectedDigest = sourceDigest(records);
  if (Number(marker[1]) !== SCHEMA_VERSION) {
    return { ok: false, reason: `${VIEW_NAME} uses a different schema version.` };
  }
  if (Number(marker[2]) !== records.length) {
    return { ok: false, reason: `${VIEW_NAME} has a stale event count.` };
  }
  if (marker[3] !== expectedDigest) {
    return { ok: false, reason: `${VIEW_NAME} does not match events/.` };
  }
  return { ok: true, reason: "view matches all event files" };
}

function assertNoUntrackedLegacyView(paths, records) {
  if (records.length === 0 && fs.existsSync(paths.view)) {
    const status = viewStatus(paths, records);
    if (!status.ok) {
      throw new Error(
        `Found an existing ${paths.view} that is not backed by events/. ` +
          "Do not overwrite it. Run import-markdown first."
      );
    }
  }
}

function createRecord(options, overrides = {}) {
  const recordedAtInput = optionalOption(options, "recorded-at");
  const recordedAtDate = recordedAtInput ? new Date(recordedAtInput) : new Date();
  if (Number.isNaN(recordedAtDate.getTime())) die("--recorded-at must be a valid ISO date.");

  return {
    schema: SCHEMA_VERSION,
    id: crypto.randomUUID(),
    recordedAt: recordedAtDate.toISOString(),
    subject: overrides.subject || requiredOption(options, "subject"),
    topic: overrides.topic || requiredOption(options, "topic"),
    summary: overrides.summary || requiredOption(options, "summary"),
    ...(optionalOption(options, "details") && { details: optionalOption(options, "details") }),
    ...(optionalOption(options, "result") && { result: optionalOption(options, "result") }),
    ...(optionalOption(options, "weak-points") && {
      weakPoints: optionalOption(options, "weak-points"),
    }),
    ...(optionalOption(options, "next-step") && { nextStep: optionalOption(options, "next-step") }),
    ...(optionalOption(options, "source") && { source: optionalOption(options, "source") }),
    ...overrides.extra,
  };
}

function eventFilename(record) {
  const timestamp = record.recordedAt.replace(/[-:.]/g, "");
  return `${timestamp}_${record.id}.json`;
}

function appendRecord(paths, record, { allowLegacyView = false } = {}) {
  const release = acquireLock(paths);
  let eventPath;
  let eventWritten = false;
  try {
    const before = readRecords(paths);
    if (!allowLegacyView) assertNoUntrackedLegacyView(paths, before);
    const previousFilenames = new Set(before.map((item) => item._filename));

    const filename = eventFilename(record);
    eventPath = path.join(paths.events, filename);
    fs.writeFileSync(eventPath, `${JSON.stringify(record, null, 2)}\n`, {
      encoding: "utf8",
      flag: "wx",
    });
    eventWritten = true;

    const after = readRecords(paths);
    if (after.length !== before.length + 1) {
      throw new Error("Post-write check failed: event count did not increase by exactly one.");
    }
    for (const oldFilename of previousFilenames) {
      if (!after.some((item) => item._filename === oldFilename)) {
        throw new Error(`Post-write check failed: old event disappeared (${oldFilename}).`);
      }
    }
    if (!after.some((item) => item.id === record.id)) {
      throw new Error("Post-write check failed: the new event cannot be read back.");
    }

    writeView(paths, renderView(after));
    const status = viewStatus(paths, after);
    if (!status.ok) throw new Error(`Post-write check failed: ${status.reason}`);

    console.log(
      JSON.stringify(
        {
          ok: true,
          eventId: record.id,
          eventFile: eventPath,
          eventCount: after.length,
          view: paths.view,
        },
        null,
        2
      )
    );
  } catch (error) {
    if (eventWritten) {
      throw new Error(
        `${error.message}\nThe new event is already durable at ${eventPath}. ` +
          "Do not append it again; fix the view with rebuild."
      );
    }
    throw error;
  } finally {
    release();
  }
}

function commandInit(paths) {
  const release = acquireLock(paths);
  try {
    const records = readRecords(paths);
    assertNoUntrackedLegacyView(paths, records);
    writeView(paths, renderView(records));
    console.log(`Initialized append-only CPA study log at ${paths.root}`);
  } finally {
    release();
  }
}

function commandAppend(paths, options) {
  appendRecord(paths, createRecord(options));
}

function commandImportMarkdown(paths, options) {
  const sourceFile = path.resolve(requiredOption(options, "file"));
  if (!fs.existsSync(sourceFile) || !fs.statSync(sourceFile).isFile()) {
    die(`Legacy Markdown file not found: ${sourceFile}`);
  }
  const details = fs.readFileSync(sourceFile, "utf8").trim();
  if (!details) die(`Legacy Markdown file is empty: ${sourceFile}`);

  const subject = optionalOption(options, "subject") || "历史日志";
  const record = createRecord(
    { ...options, subject, topic: "旧版日志导入", summary: `导入 ${path.basename(sourceFile)}` },
    {
      subject,
      topic: "旧版日志导入",
      summary: `导入 ${path.basename(sourceFile)}`,
      extra: { details, source: sourceFile, recovered: true },
    }
  );
  appendRecord(paths, record, { allowLegacyView: true });
}

function commandRebuild(paths) {
  const release = acquireLock(paths);
  try {
    const records = readRecords(paths);
    assertNoUntrackedLegacyView(paths, records);
    writeView(paths, renderView(records));
    const status = viewStatus(paths, records);
    if (!status.ok) throw new Error(status.reason);
    console.log(`Rebuilt ${paths.view} from ${records.length} event(s).`);
  } finally {
    release();
  }
}

function commandStatus(paths, strict) {
  let records;
  try {
    records = readRecords(paths);
  } catch (error) {
    die(`Event verification failed: ${error.message}`);
  }

  const status = viewStatus(paths, records);
  const subjects = [...new Set(records.map((record) => record.subject))];
  const output = {
    ok: status.ok,
    directory: paths.root,
    eventCount: records.length,
    subjects,
    lastEvent: records.length ? recordWithoutFilename(records[records.length - 1]) : null,
    view: status.reason,
  };
  console.log(JSON.stringify(output, null, 2));
  if (strict && !status.ok) process.exitCode = 2;
}

function main() {
  const { command, options } = parseArgs(process.argv.slice(2));
  if (!command || command === "help" || command === "--help") {
    console.log(usage());
    return;
  }

  const paths = logPaths(options);
  try {
    switch (command) {
      case "init":
        commandInit(paths);
        break;
      case "append":
        commandAppend(paths, options);
        break;
      case "import-markdown":
        commandImportMarkdown(paths, options);
        break;
      case "rebuild":
        commandRebuild(paths);
        break;
      case "status":
        commandStatus(paths, false);
        break;
      case "verify":
        commandStatus(paths, true);
        break;
      default:
        die(`Unknown command: ${command}\n\n${usage()}`);
    }
  } catch (error) {
    die(error.stack || error.message);
  }
}

main();
