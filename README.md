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

**前端**：

网站首页位于 `site/index.html`

需要避免在浏览器中直接通过`file://`协议打开，否则浏览器会禁止绝大多数的JS功能。建议使用python http.server或其他工具搭建本地服务器模拟线上环境

```powershell
python -m http.server 18080
# 在另一个终端内：
start http://localhost:18080/
# ↑ windows下
# 其实更推荐直接浏览器访问
```

**后端**：

```bash
cd site/api
pip install -r requirements.txt
uvicorn main:app --reload
```

## 文档

所有文档位于`docs`文件夹中

- [AC社区项目核心章程](docs/PROJECT-PLAN.md)
- [AC社区架构文档](docs/ARCHITECTURE.md)
- [开发者协作规范](docs/COLLABORATION.md)
- [AC社区开发路线图](docs/ROADMAP.md)

推荐阅读顺序： README → 章程 → 协作规范
