# AC社区

**Animation & Computer Science Community**

组内共建的二次元风格社区站：挂服务、挂资源、挂工具，写文章、做交流，每个人都能留名。

## 内容板块

首页 / 工具 / 资源 / 文章 / 社区

## 技术栈

| 层 | 选型 |
|----|------|
| 前端 | HTML/CSS/JS 静态 |
| 后端 | Python FastAPI |
| 数据 | mock_db 起步 → SQLite |

## 仓库结构

```
community-site/
├── README.md        # 本文件
├── docs/            # 章程、架构、协作、路线图
└── site/            # 网站代码
    ├── index.html   # 首页
    ├── assets/      # 主题 CSS/JS
    ├── services/    # 插件、工具
    ├── blog/        # 文章、笔记
    └── api/         # 后端
```

## 快速开始

```bash
git clone https://github.com/oiiio8piCovi/community-site.git
```

**前端**：浏览器直接打开 `site/index.html`

**后端**：

```bash
cd site/api
pip install -r requirements.txt
uvicorn main:app --reload
```

## 文档

[章程](docs/PROJECT-PLAN.md) · [架构](docs/ARCHITECTURE.md) · [协作规范](docs/COLLABORATION.md) · [路线图](docs/ROADMAP.md)

先读 README → 章程 → 协作规范
