# 在各 AI 平台上部署 CPA 辅导老师

本技能的"大脑"是一段纯文本指令（[`SYSTEM_PROMPT.md`](SYSTEM_PROMPT.md)），任何能"设定系统提示 / 角色 +
上传文件"的 AI 都能跑。下面给出常见平台的部署步骤。各平台 UI 会变，以你看到的最新界面为准。

> 📎 两类要素：**① 指令**（把 `SYSTEM_PROMPT.md` 全文粘进去）+ **② 资料**（你自己的教材/讲义/官方大纲，
> 上传给平台让它检索）。绝大多数现代平台会**自动检索上传的文件**，不需要你额外配置搜索工具。

---

## 🤖 ChatGPT 自定义 GPT（Custom GPT）

1. 进入 **Explore GPTs → Create**（或 Create a GPT）。
2. 在 **Configure → Instructions** 里粘入 `SYSTEM_PROMPT.md` 全文。
3. 在 **Knowledge** 里上传你的教材/讲义/大纲（PDF 或 .txt 均可），GPT 会在回答时自动检索。
4. 起名"CPA 辅导老师"，保存。之后对话即按该角色回答。

## ✨ Google Gemini Gem

1. 打开 **Gems → New Gem**（Gem manager）。
2. 在 **Instructions** 里粘入 `SYSTEM_PROMPT.md` 全文。
3. 上传你的资料文件作为知识；Gemini 会自动参考。
4. 保存并选用该 Gem 开始对话。

## 🇨🇳 Kimi / 豆包 / Coze / 智谱清言等国内平台

- **有"智能体 / Bot / 应用"功能时**（如 Coze、豆包智能体、Kimi+）：新建一个智能体，把
  `SYSTEM_PROMPT.md` 粘进"人设与回复逻辑 / 系统提示"，再上传你的资料作为"知识库"。
- **只有普通对话框时**：在新会话**第一条消息**里先粘入 `SYSTEM_PROMPT.md` 全文，再贴上你要问的题目
  /教材片段。资料无法持久上传时，就在提问时把相关原文一并贴进来。

## 💻 代码编辑器（Cursor / Cline / Windsurf 等）

1. 把 `SYSTEM_PROMPT.md` 的内容放进项目规则文件（如 Cursor 的 `.cursorrules` 或 Project Rules）。
2. 用本仓库的 `scripts/docx-to-text.js` 把你的讲义转成 `.txt` 放进项目目录，让编辑器的 AI 能直接
   读取/检索这些文本。
3. 在编辑器内对话即可。

## 🧱 自己搭应用 / 调 API

- 把 `SYSTEM_PROMPT.md` 作为 system message 传给模型。
- 资料检索需你**自行实现 RAG**（检索增强生成）：把教材切块、做向量检索，把命中片段拼进上下文，
  再让模型作答。

---

## ⚠️ 版权提醒

- `SYSTEM_PROMPT.md` 本身是原创指令，可自由使用。
- **你上传的教材 / 讲义 / 习题属于第三方版权**：只在**你自己的 GPT / Gem / 智能体 / 本地工具**里**私用**，
  **切勿公开发布或分享**含这些资料的智能体。
- 官方**考试大纲**为公开文件，可作参考资料上传。
