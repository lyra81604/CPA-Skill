# corpus/ —— 你自己的教材/讲义（本地导入，不进仓库）

这个文件夹存放**你自己上传的** CPA 教材、讲义、笔记（从 Word/PDF 转出的纯文本）。导入后，辅导老师会
靠 `Grep` 这些文件，让讲解和例题贴合你正在读的那本书的措辞与编排。

它和 `syllabus/`（官方大纲）互补：
- `syllabus/` 管"**考不考、考多深**"（大纲 + 能力等级）。
- `corpus/` 管"**怎么讲、有什么例题**"（你自己的教材）。

## 怎么导入自己的资料

在 skill 根目录下执行（把路径换成你的讲义；可起任意文件名）：

```bash
node scripts/docx-to-text.js "/path/to/你的会计讲义.docx" "corpus/accounting-notes.txt"
node scripts/docx-to-text.js "/path/to/你的税法讲义.docx" "corpus/tax-notes.txt"
```

- 脚本靠 `unzip` 解开 .docx，需要 **Node.js**。
- **PDF**：先转成 .docx 或纯文本，再放进这个文件夹（直接把 `.txt` 拷进来也行）。
- 文件名随意，但建议带上科目，方便辅导老师按科目检索。

## 没有这些文件也能用

没有上传任何资料时，辅导老师照常工作——只是会改用通用 CPA 知识 + 内置大纲，而不能引用你书里的
具体例题和措辞。

> 这里的内容是你**自己合法持有**的学习资料，已被 `.gitignore` 屏蔽，不会、也不应上传到任何仓库。
