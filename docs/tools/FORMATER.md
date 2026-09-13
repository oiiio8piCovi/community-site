# 网页文件格式化脚本

**位置**：`./format_web_files.py`

## 概述

本脚本用于递归扫描当前目录下的所有 `.js`、`.css`、`.html` 文件，并调用业界标准的 **Prettier** 格式化引擎对它们进行代码格式化。  
它适合在提交代码前运行，以统一项目代码风格，避免因不同编辑器的自动格式化插件导致大量与功能无关的变更行混入提交记录。

---

## 功能特性

- 自动识别 `.js`、`.css`、`.html` 文件（包括所有子目录）。
- 使用 **Prettier**（通过 Node.js 的 `npx`）进行格式化，保证与主流前端工具链一致。
- **自动检测 Node.js/npx** 环境，若缺失则给出明确的安装指引。
- 支持**忽略特定文件**（通过命令行 `-i` 参数或 `format_ignore.txt` 配置文件）。
- 兼容 Windows / Linux / macOS。
- 格式化输出清晰，显示每个文件的处理状态和耗时。

---

## 依赖安装

### 必需环境
- **Node.js**（建议 v16+）：脚本依赖 Node.js 自带的 `npx` 命令来运行 Prettier。  
  如果系统中未安装 Node.js，脚本会提示安装方法。

### 一键安装 Node.js（建议）
- **Windows**：`winget install nodejs`
- **macOS**：`brew install node`
- **Linux（Ubuntu/Debian）**：`sudo apt update && sudo apt install nodejs npm`

安装完成后，**请重新打开终端**，确保 `npx` 命令可用。

### Prettier 自动下载
无需手动安装 Prettier。脚本首次运行时，`npx` 会自动下载 Prettier 到临时缓存，后续运行将复用缓存，无需重复下载。

---

## 使用方法

### 基础用法
```bash
python format_web_files.py
```

运行后，脚本会遍历当前目录及所有子目录，格式化所有匹配的文件，并在终端输出处理结果。

### 忽略指定文件（命令行）
使用 `-i` 或 `--ignore` 参数，可以指定**一个或多个**需要跳过的文件或模式（支持 Prettier 的 glob 语法）。

```bash
# 忽略单个文件
python format_web_files.py -i ./site/index.html

# 忽略多个文件
python format_web_files.py -i ./site/index.html frontend-v2/index.html

# 忽略多个模式（如所有 HTML 或特定目录下的 CSS）
python format_web_files.py -i "*.html" "frontend-v2/**/*.css"
```

> 路径分隔符在 Windows 下可用 `\` 或 `/`，建议统一使用 `/`。

### 忽略指定文件（持久化配置文件）
若某些文件**需要长期保持**原始格式（如第三方库文件、自动生成的文件），可以在脚本同级目录下创建 `format_ignore.txt`，每行一个忽略模式（语法类似 `.gitignore`）。

**格式规则**：
- 支持 `*`（单层任意字符）、`?`（单字符）、`**`（任意层级递归）。
- 以 `#` 开头的行视为注释，会被忽略。
- 空行自动跳过。

**示例 `format_ignore.txt`**：
```txt
# 忽略所有 HTML 文件（全局）
*.html

# 忽略 site 目录下的所有文件
site/**

# 忽略特定文件
frontend-draft/index.html
frontend-v2/assets/legacy.js
```

> 命令行参数和配置文件会**合并**生效，最终匹配任意一个模式的文件都会被跳过。

---

## 输出说明

脚本运行时会显示 Prettier 的处理输出，包括每个文件的处理时间（例如 `a.js 164ms`）。  
如果某个文件解析失败（如 HTML 语法错误），脚本会打印错误信息但**继续处理后续文件**，不会中断整个流程。

示例输出片段：
```
✅ 找到 npx: C:\Program Files\nodejs\npx.CMD
正在格式化 . 目录下所有 .js, .css, .html 文件...
执行: npx prettier --write **/*.js
a.js 164ms
frontend-draft/js/ripple.js 21ms
...
执行: npx prettier --write **/*.html
frontend-draft/index.html 41ms
frontend-draft/pages/about.html 16ms
...
```

---

## 配置（高级）

Prettier 的格式化行为可以通过在项目根目录创建 `.prettierrc` 配置文件来定制（如缩进、换行、分号等）。  
脚本会自动遵循项目中的 Prettier 配置（如果存在），无需额外设置。

---

## 常见问题（FAQ）

### Q1: 脚本提示找不到 `npx` 怎么办？
**A**: 请确保已安装 Node.js，并**重新打开终端**使 PATH 生效。若仍不行，可手动将 Node.js 安装目录（如 `C:\Program Files\nodejs`）添加到系统 PATH。

### Q2: 为什么某个 HTML 文件格式化失败了？
**A**: Prettier 对 HTML 语法要求严格，常见错误包括：
- 自闭合标签（如 `<wbr>`）不应有结束标签 `</wbr>`。
- 属性值缺少引号等。  
请修正语法后重新运行脚本。

### Q3: 能否只格式化某类文件（比如仅 HTML）？
**A**: 可以，修改脚本开头的 `FILE_EXTENSIONS` 列表，移除不需要的扩展名即可。

### Q4: 脚本会覆盖原文件吗？
**A**: 是的，会直接覆盖。建议在版本控制（如 Git）下运行，以便必要时回滚。

---

## 注意事项

- 脚本会**直接覆盖**原文件，建议在运行前提交当前更改。
- 首次运行 Prettier 时，`npx` 会下载 Prettier 包，可能需要网络连接。
- Prettier 对 HTML 语法要求严格，若文件有错误，请先修复再运行格式化。

---

## 维护与扩展

- 脚本完全开源，可根据项目需求自由修改。
- 如需增加对其他文件类型的支持（如 `.vue`、`.scss`），可在 `FILE_EXTENSIONS` 中添加对应扩展名，Prettier 会自动处理。
- 如需锁定 Prettier 版本，可修改脚本中的 `PRETTIER_VERSION` 变量（目前使用最新版）。

---

**最后更新**：2026-08-30