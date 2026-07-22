<div align="center">

# 🎓 CPA 注册会计师 Skill

**零基础友好 · 中文为主 · 跨 AI 平台**

*「把任意 AI 变成你的 CPA 私人辅导老师」*

![Skill](https://img.shields.io/badge/Skill-任意%20AI%20通用-D97757?style=flat-square)
![CPA](https://img.shields.io/badge/CPA-2026-2E7D32?style=flat-square)
![专业阶段](https://img.shields.io/badge/专业阶段-6科+综合-1565C0?style=flat-square)
![定位](https://img.shields.io/badge/定位-零基础友好-7B1FA2?style=flat-square)
![语言](https://img.shields.io/badge/语言-中文为主·术语标英-455A64?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

[部署](#-部署-deployment各-ai-工具) · [接入资料](#-上传你自己的学习资料-connect-your-own-materials可选强烈推荐) · [使用](#-使用方式-usage) · [其他 AI 工具](#-在其他-ai-工具上使用-use-on-other-ai-tools) · [真实示例](#-真实运行示例-live-examples) · [版权](#-版权声明-copyright请务必阅读)

</div>

---

一个可装进**任意 AI 助手**的 **Skill（技能）**，把**任意 AI**变成一位针对 **2026 年注册会计师全国
统一考试（CPA）** 的私人辅导老师，专为**财会/法律基础薄弱**的考生设计。它会：

- 🧠 **通俗讲解难点**——用生活化类比和具体例子讲清概念，每个术语都解释，绝不用术语解释术语；
- 🎯 **拆解例题、指出考点**——告诉你"这道题到底在考什么"，逐步解题，并说明每个错误选项的陷阱；
- 📝 **生成同考点练习题**——按各科**真实 CPA 题型**（单选/多选/简答/计算分析/综合/案例分析）出题；
- 📐 **用大纲精准定位**——内置 2026 官方考试大纲，每个知识点都告诉你属于哪科、考到哪个**能力等级**；
- 📖 **扎根你自己的资料**——可读取你**本地上传**的教材/讲义，用你书里的原话和例题来讲，而非泛泛而谈。

回答以**中文为主**，关键术语后标注英文（贴近真实考试，也帮你拿 5 分英文作答附加题）。

---

## ✨ 功能特性 Features

- 📚 **覆盖全科**：专业阶段 6 科（会计 / 审计 / 财务成本管理 / 公司战略与风险管理 / 经济法 / 税法）
  + 综合阶段（职业能力综合测试）。
- 🧭 **大纲打底、能力等级分级**：内置官方大纲全文，按"能力等级 1/2/3"告诉你每个点该掌握到什么程度，
  帮你把精力按比例分配，不在低频点上空耗。
- 🪜 **零基础讲解四步法**：一句话本质 → 生活化类比 → 正式定义+公式/分录 → 考点定位 → 易混淆点。
- 🧩 **真实题型练习**：会计有计算分析/综合题、审计有简答题、经济法有案例分析、税法有计算分析……
  先出题让你做，再给分步解析，每个干扰项都点破"错在哪"。
- ⏱️ **考情提醒**：各科考试时间、题型分布、法规截止口径（多数 2025-12-31；审计、增值税法 2026-01-31）。
- 📥 **自主上传资料**：把你**自己合法持有**的教材/讲义导入 `corpus/`，讲解立刻贴合你在读的那本书。
- 🧾 **防丢失学习日志**：每次记录单独追加，Markdown 汇总页可重建；写后自动核对旧记录是否完整。
- 🔒 **不绑数据**：本仓库**不含任何 CPA 备考资料/教材**，资料完全由你自己提供（见下方版权声明）。

---

## 🚀 部署 Deployment（各 AI 工具）

这是一个标准的 **Agent Skill**，核心就是把整个 `cpa-tutor/` 文件夹放到对应工具能发现的位置。下面给出
Codex、Claude 等常见 AI 工具的部署方式（具体 UI 以各产品最新版本为准）。技能名是 `cpa-tutor`，仓库名是 `CPA-Skill`。
部署时请将本仓库克隆或复制到 AI 工具的 skills 目录下，并将目标文件夹命名为 `cpa-tutor`。

### 🤖 OpenAI Codex（App / CLI / IDE 扩展）

可以直接使用。本仓库根目录包含带 `name` 和 `description` 元数据的 `SKILL.md`，并将脚本、参考资料和大纲
放在同一个 skill 文件夹中，符合 Codex Agent Skill 的目录结构。Codex App、Codex CLI 和 IDE 扩展均支持 skills。

个人安装推荐放到 `~/.agents/skills/cpa-tutor/`：

**Windows PowerShell**

```powershell
New-Item -ItemType Directory -Force "$HOME\.agents\skills"
git clone https://github.com/lyra81604/CPA-Skill.git "$HOME\.agents\skills\cpa-tutor"
```

**macOS / Linux**

```bash
mkdir -p ~/.agents/skills
git clone https://github.com/lyra81604/CPA-Skill.git \
  ~/.agents/skills/cpa-tutor
```

也可以把它作为项目专用 skill，克隆到项目根目录的 `.agents/skills/cpa-tutor/`，这样该项目的协作者也能使用。

安装后新开一个 Codex 会话。Codex 通常会自动发现新增或更新的 skill；若没有出现，请重启 Codex。使用时可以：

- 显式调用：`$cpa-tutor 解释一下递延所得税`
- 在 CLI / IDE 中输入 `/skills`，或键入 `$` 后选择 `cpa-tutor`
- 直接提出 CPA 备考问题，由 Codex 根据 `description` 自动触发

> 官方说明：[Agent Skills in Codex](https://developers.openai.com/codex/skills)。导入自己的讲义时仍需 Node.js；
> `scripts/docx-to-text.js` 还会调用 `unzip`，Windows 用户需要另行安装可用的 `unzip` 命令，或先把 `.docx`
> 转为纯文本后放进 `corpus/`。

### 💻 Claude Code（命令行）

放进个人技能目录即可自动发现，无需配置：

| 平台 | 路径 |
|------|------|
| 🪟 Windows | `C:\Users\<你>\.claude\skills\cpa-tutor\` |
| 🍎 macOS / 🐧 Linux | `~/.claude/skills/cpa-tutor/` |

```bash
git clone https://github.com/lyra81604/CPA-Skill.git \
  ~/.claude/skills/cpa-tutor
```

> 需要 [Node.js](https://nodejs.org/) 和系统自带的 `unzip`（用于把你的 Word 讲义转成可搜索文本）。

### 🖥️ Claude Desktop（桌面应用）

1. 打开 **Settings 设置 → Capabilities / Skills（能力 / 技能）**，启用 Skills。
2. 将 `cpa-tutor/` 放入桌面应用的技能目录（与 Claude Code 共用同一个 `~/.claude/skills/`），或通过
   界面里的 **Add / Upload Skill** 导入打包好的 `.skill` 文件（见下方"打包"）。
3. 重启应用后，在对话中即可被自动触发。

### 🌐 Claude.ai（网页版）

网页版无法访问你本地文件，需**上传打包文件**：

1. 把技能打包成单个 `.skill`（见下方"打包"）。
2. 在 **Settings 设置 → Capabilities → Skills** 里 **上传（Upload）** 这个 `.skill` 文件。
3. 上传后在对话里按需触发。
   > ⚠️ 网页版用不了本地 `corpus/` 上传脚本，"接入自己的教材"功能主要适用于 Claude Code / 桌面版。

### 🧩 通过插件市场 / Plugin（可选）

若你用插件市场分发，可将本 skill 作为插件的一部分发布，安装后同样会出现在可用技能列表中。

### 📦 打包成 `.skill`（供桌面/网页上传）

```bash
# 使用官方 skill-creator 的打包脚本
python -m scripts.package_skill /path/to/cpa-tutor
# 产物：cpa-tutor.skill —— 上传到 Claude Desktop / Claude.ai 即可
```

---

## 📂 上传你自己的学习资料 Connect your own materials（可选，强烈推荐）

本仓库**不含任何教材/讲义内容**（见下方版权声明）。把你**自己合法持有**的资料导入本地的 `corpus/`，
辅导讲解就会贴合你正在读的那本书的措辞和例题：

```bash
cd ~/.claude/skills/cpa-tutor
node scripts/docx-to-text.js "/path/to/你的会计讲义.docx" "corpus/accounting-notes.txt"
node scripts/docx-to-text.js "/path/to/你的税法讲义.docx" "corpus/tax-notes.txt"
```

- 📄 只有 PDF？先在 Word 里"打开 → 另存为 .docx"，或转成纯文本再放进 `corpus/`。
- 🙆 没有上传也能用：会退回到通用 CPA 知识 + 内置大纲，只是无法引用你书里的具体例题。

详见 [corpus/README.md](corpus/README.md)。

---

## 💬 使用方式 Usage

新开一个会话，三种方式：

1. ▶️ **直接呼出**：`/cpa-tutor 解释一下递延所得税`
2. 🤖 **自动触发**：在备考语境里提问即可，例如"合并报表抵销看不懂"，或直接**粘贴一道题/一段教材**问"这题考啥"。
3. 🧪 **出题巩固**：例如"给我出 3 道增值税应纳税额的练习题"。

---

## 🧾 防丢失学习日志 Study log

当你要求 AI“记录本次进度 / 更新学习日志”时，本地版会使用追加式日志工具。请把日志放在你自己的持久目录，
不要放进 skill 安装目录或临时分析目录：

```bash
node scripts/study-log.js status --dir "D:\CPA-data\cpa-study-log"
node scripts/study-log.js append --dir "D:\CPA-data\cpa-study-log" --subject "经济法" --topic "票据法律制度" --summary "完成第九章第一单元练习" --result "20 题，错 3 题" --weak-points "提示付款期限、票据抗辩"
node scripts/study-log.js verify --dir "D:\CPA-data\cpa-study-log"
```

- `events/*.json` 是不可变的历史事实；`study-log.md` 只是自动生成的阅读版，误改后可用 `rebuild` 恢复。
- 旧版只有一个 Markdown 日志时，用 `import-markdown` 迁移，切勿直接初始化并覆盖。
- Claude.ai / 普通聊天若没有真实的持久文件权限，只能生成日志文本；请下载到本地或云盘。Artifact 可先从版本
  选择器找回旧版本，但仍建议保留外部备份。

完整流程见 [`references/study-log.md`](references/study-log.md)。

---

## 🌍 在其他 AI 工具上使用 Use on other AI tools

不止 Claude——本技能的"大脑"是纯文本指令，可部署到 ChatGPT 自定义 GPT、Gemini Gem、Kimi / 豆包 /
Coze 智能体、腾讯 Marvis（马维斯）、WorkBuddy、Cursor 等。见 [`portable/`](portable/)：

- 🧩 **`portable/SYSTEM_PROMPT.md`** — 自包含、工具中性的指令，直接粘进任意平台的"指令框 / 系统提示"。
- 🛠️ **`portable/DEPLOY.md`** — 各平台部署步骤（指令放哪、你自己的资料怎么上传）。

> ⚠️ 同样的版权规则适用：**备考资料只在你自己的 GPT / Gem / 本地工具里私用，切勿公开分享**。

---

## 🎬 真实运行示例 Live examples

下面是这个 skill 实际运行的回答（点击展开）。

<details>
<summary>🧠 <b>示例一 · 讲解难点：「递延所得税到底是什么，完全看不懂」</b></summary>

<br>

好嘞，咱们从零开始，保证讲到你能听懂。

**1️⃣ 一句话本质**
公司算"自己赚了多少、该交多少税"用的是**会计的算法**，而税务局算"你该交多少税"用的是**税法的算法**。
两套算法对同一笔事算出来的数常常**不一样**。这个差额，有的以后会"补交"、有的以后能"少交"——把这部分
**以后才结清的税**先记下来，就是**递延所得税（Deferred Tax，递延=推迟）**。

**2️⃣ 生活化类比**
想象你和朋友 AA 一顿饭。你先用自己的卡把 200 元全付了，但其中 100 元是朋友该出的。
- 这 100 元朋友迟早要还你 → 对你是一项"**以后能收回的钱**"（资产）。
- 反过来，如果是朋友先替你垫了 100，你迟早要还 → 对你是"**以后要还的钱**"（负债）。

递延所得税一模一样：会计和税法暂时不一致，导致**有些税你以后能少交（像别人欠你 → 递延所得税资产
Deferred Tax Asset, DTA）**，**有些税你以后得补交（像你欠别人 → 递延所得税负债 Deferred Tax
Liability, DTL）**。

**3️⃣ 正式定义 + 怎么来的**
- **计税基础（Tax Base）**：税法眼里这项资产/负债"值多少"。
- **暂时性差异（Temporary Difference）**：会计账面价值 − 计税基础。它叫"暂时"，是因为这个差额未来
  会转回、抹平。
  - 账面 > 计税基础（资产）→ 以后要多交税 → **应纳税暂时性差异** → 确认 **递延所得税负债 DTL**
  - 账面 < 计税基础（资产）→ 以后能少交税 → **可抵扣暂时性差异** → 确认 **递延所得税资产 DTA**
- 金额 = 暂时性差异 × 适用税率。典型分录：
  ```
  借：所得税费用
    贷：应交税费——应交所得税   （税法当期真要交的）
        递延所得税负债          （以后才补交的那部分）
  ```

**4️⃣ 考点定位**
属于**会计**科目第十九章「所得税」，主线是：计税基础 → 暂时性差异 → 确认计量递延所得税资产/负债 →
所得税费用。大纲把这一章整体标为**应用 / 综合层级（能力等级 2–3）**——也就是说**不只是看懂，要会算、
会判断**，而且它特别爱出现在**综合题**里（和资产减值、公允价值变动等串着考）。是会计的高频硬骨头。

**5️⃣ 易混淆点 / 坑**
- ⚠️ **方向最容易反**：资产"账面 > 计税基础"对应的是**负债**（DTL），不是资产。记口诀:资产账面高→
  以后多缴→负债。
- ⚠️ 别把"**暂时性差异**"和"**永久性差异**"搞混:罚款、国债利息这类税法永远不认/永远不征的,是
  **永久性差异**,**不产生**递延所得税。

要不要我出 **3 道递延所得税的小题**(从判断方向到算金额)帮你巩固一下?

</details>

<details>
<summary>🎯 <b>示例二 · 拆解例题：一道增值税计算分析题（税法）</b></summary>

<br>

> **题目**：某增值税一般纳税人 2026 年 1 月销售自产货物取得不含税销售额 100 万元，当月购进原材料取得
> 增值税专用发票注明税额 6.5 万元，购进一辆自用小汽车取得专用发票注明税额 2.6 万元。货物适用税率
> 13%。计算当月应纳增值税额。

**1️⃣ 考点是什么**
这道题考的是**增值税一般计税方法下应纳税额的计算**（税法·第二章「增值税法」·一般计税方法：销项税额、
进项税额、应纳税额的计算）。核心公式只有一个：

> **当期应纳增值税 = 当期销项税额 − 当期准予抵扣的进项税额**

真正的"坑"在于：**哪些进项税额可以抵扣**。

**2️⃣ 逐步解题**
- 销项税额 = 100 × 13% = **13 万元**
- 准予抵扣的进项税额 = 6.5（原材料）+ 2.6（自用小汽车）= **9.1 万元**
  - 关键判断：**自 2013 年 8 月起，购进自用小汽车的进项税额准予抵扣**（不再属于"不得抵扣"项目）。
- 应纳增值税 = 13 − 9.1 = **3.9 万元** ✅

**3️⃣ 常见错误（干扰项陷阱）**
- ❌ 算成 13 − 6.5 = **6.5 万元**：误以为自用小汽车进项不得抵扣，漏掉 2.6 万——这是最典型的
  "**进项能否抵扣判断错**"。
- ❌ 算成 100 × 13% = **13 万元**：忘了减进项，把销项当成应纳税额。
- ❌ 用含税价倒算或税率取错：把 100 万当含税销售额去换算。

**4️⃣ 变体提醒**
同一个考点还可能这样考：把小汽车换成**购进用于集体福利的货物**（这种进项**不得抵扣**，要从进项里剔除）；
或加入**取得普通发票**（不能抵扣）、**当月发生非正常损失需做进项税额转出**——本质都在考"你会不会判断
进项能不能抵扣"。

要不要我按这个考点出 **3 道练习题**(混进"不得抵扣"的干扰情形)给你练手?

</details>

<details>
<summary>📝 <b>示例三 · 出练习题：审计「风险评估」单选 + 多选</b></summary>

<br>

好的，按审计科目的真实题型来（单选 1 道 + 多选 1 道）。**先自己做，下面折叠的是答案**。

**第 1 题（单选）** 关于注册会计师实施风险评估程序，下列说法中正确的是：
A. 风险评估程序本身可以为发表审计意见提供充分、适当的审计证据
B. 风险评估程序包括询问、分析程序、观察和检查
C. 风险评估程序只需在审计开始时实施一次，无需在审计过程中调整
D. 了解被审计单位内部控制不属于风险评估程序

**第 2 题（多选）** 下列各项中，属于"针对财务报表层次重大错报风险的总体应对措施"的有：
A. 向项目组强调保持职业怀疑
B. 分派更有经验的审计人员
C. 对某一具体账户实施函证
D. 在程序的性质、时间、范围上增加不可预见性

<details>
<summary>👉 点击看答案与解析</summary>

<br>

**第 1 题答案：B**
- ✅ B：风险评估程序的方法正是询问、分析程序、观察和检查。
- ❌ A：风险评估程序**不能单独**作为发表意见的充分适当证据，还须实施控制测试和/或实质性程序。
- ❌ C：风险贯穿审计全程，需要**持续修正**评估结果，不是"一次性"。
- ❌ D：了解内部控制**正是**风险评估程序的重要组成部分。
- 📌 考点：风险评估程序的**含义与方法**（审计·风险导向审计流程）。

**第 2 题答案：ABD**
- ✅ A/B/D 都是针对**财务报表层次**（整体层面）的总体应对。
- ❌ C 是针对**认定层次**某个具体账户的**进一步审计程序**，层次不同——这是本题最大的干扰项。
- ⚠️ 多选题**少选、错选均不得分**，必须把 A、B、D 全选齐。
- 📌 考点：区分"财务报表层次"与"认定层次"的应对措施（审计·风险应对）。

</details>
</details>

---

## 🗂️ 目录结构 Structure

```
cpa-tutor/
├── 📄 SKILL.md                       # 技能主文件（辅导风格、三件事、诚实原则）
├── 📄 README.md
├── 📄 LICENSE                        # MIT（仅限技能代码，不含任何备考资料）
├── 🚫 .gitignore                     # 屏蔽 corpus、学习日志与上传的源文件
├── 📁 syllabus/                      # 内置 2026 CPA 官方大纲全文（公开文件，随 skill 分发）
│   ├── 01-accounting.txt             # 会计
│   ├── 02-audit.txt                  # 审计
│   ├── 03-financial-cost-mgmt.txt    # 财务成本管理
│   ├── 04-strategy-risk.txt          # 公司战略与风险管理
│   ├── 05-economic-law.txt           # 经济法
│   ├── 06-tax-law.txt                # 税法
│   └── 07-comprehensive.txt          # 综合阶段（职业能力综合测试）
├── 📁 references/
│   ├── curriculum-map.md             # 考试结构、各科章节/高频考点、能力等级、题型、复习建议
│   ├── question-style.md             # 各科真实题型 + 怎么出"像真考试"的练习题
│   └── study-log.md                  # 追加式日志、迁移、验证与故障恢复流程
├── 📁 scripts/
│   ├── docx-to-text.js               # 把 .docx 转成可搜索文本（导入讲义 / 刷新大纲）
│   └── study-log.js                  # 防丢失的追加式学习日志工具
├── 📁 portable/                      # 在其他 AI（ChatGPT/Gemini/Kimi/Cursor…）上使用
│   ├── SYSTEM_PROMPT.md              # 工具中性、自包含的系统提示
│   └── DEPLOY.md                     # 各平台部署步骤
└── 📁 corpus/                        # 你自己上传的教材/讲义（本地生成，.gitignore 屏蔽）
    └── README.md
```

---

## ⚠️ 版权声明 Copyright（请务必阅读）

> **本 skill 不包含任何 CPA 备考资料（教材、讲义、习题、培训讲义等）。**

- ✅ 仓库**只包含原创的技能代码与说明**（`SKILL.md`、`references/`、`scripts/`、`README.md`），
  外加 `syllabus/` 里的 **2026 年注册会计师全国统一考试大纲**——这是 CICPA 考委会**公开发布**的官方
  考试大纲，属于公共参考资料，**不是受版权保护的备考教材**。
- 🚫 任何**教材 / 讲义 / 习题集 / 培训机构资料**均为各自权利人所有，**不在本仓库内，也禁止提交或分发**。
- 📥 这些备考资料**完全由用户自己合法持有并在本地导入** `corpus/`；`corpus/*.txt`、`*.docx`、`*.pdf`
  已被 `.gitignore` 屏蔽，**请勿提交或分享**。
- 🔗 本项目与财政部注册会计师考试委员会、中国注册会计师协会（CICPA）及任何培训机构**无任何关联，
  也未获其背书**。

---

## 📄 许可 License

技能代码与文档以 **MIT** 许可发布，详见 [LICENSE](LICENSE)。
许可**不适用于**任何第三方备考资料；`syllabus/` 为官方公开大纲，仅作参考转载。
