#!/usr/bin/env node
/*
 * docx-to-text.js — convert a .docx into a searchable plain-text/markdown file.
 *
 * Why this exists: the Schweser Word files are ~18MB each, far too big to read
 * whole. We extract the text ONCE into corpus/*.txt so that at study time the
 * tutor can Grep the text to locate the exact passage the user is asking about,
 * then ground its explanation in the real notes.
 *
 * Usage:
 *   node docx-to-text.js "<input.docx>" "<output.txt>"
 *
 * Approach: a .docx is a ZIP. We pull word/document.xml via `unzip -p`, then turn
 * <w:p> paragraphs into newlines and <w:t> runs into text. Paragraphs styled as
 * headings get a markdown "#"/"##" prefix so the output is skimmable and Grep
 * results carry section context. Equation/image content (which Word stores as
 * pictures or OMML) won't survive as text — that's expected; the user can paste
 * any specific formula image if needed.
 */
const { execFileSync } = require("child_process");

function getDocumentXml(docxPath) {
  // unzip -p writes the entry to stdout. maxBuffer bumped for large docs.
  return execFileSync("unzip", ["-p", docxPath, "word/document.xml"], {
    maxBuffer: 1024 * 1024 * 512,
    encoding: "utf8",
  });
}

function decodeEntities(s) {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&amp;/g, "&");
}

function xmlToText(xml) {
  const out = [];
  // Split into paragraphs.
  const paras = xml.split(/<w:p[ >]/);
  for (const para of paras) {
    // Detect heading level from the paragraph style, e.g. <w:pStyle w:val="Heading2"/>
    let prefix = "";
    const style = para.match(/<w:pStyle[^>]*w:val="([^"]*)"/);
    if (style) {
      const m = /Heading(\d)/i.exec(style[1]);
      if (m) prefix = "#".repeat(Math.min(Number(m[1]), 4)) + " ";
      else if (/^Title$/i.test(style[1])) prefix = "# ";
    }
    // Collect text runs. Honor tabs and explicit breaks as spaces.
    let text = "";
    const runRe = /<w:(t|tab|br)\b([^>]*)>([\s\S]*?)<\/w:\1>|<w:(tab|br)\b[^>]*\/>/g;
    let mm;
    while ((mm = runRe.exec(para)) !== null) {
      const tag = mm[1] || mm[4];
      if (tag === "t") text += mm[3];
      else text += " "; // tab or break
    }
    text = decodeEntities(text).replace(/ /g, " ").trim();
    if (text) out.push(prefix + text);
  }
  // Collapse runs of blank lines.
  return out.join("\n").replace(/\n{3,}/g, "\n\n") + "\n";
}

function main() {
  const [, , input, output] = process.argv;
  if (!input || !output) {
    console.error('Usage: node docx-to-text.js "<input.docx>" "<output.txt>"');
    process.exit(1);
  }
  const xml = getDocumentXml(input);
  const text = xmlToText(xml);
  require("fs").writeFileSync(output, text, "utf8");
  const lines = text.split("\n").length;
  console.log(`Wrote ${output} (${(text.length / 1024).toFixed(0)} KB, ${lines} lines)`);
}

main();
