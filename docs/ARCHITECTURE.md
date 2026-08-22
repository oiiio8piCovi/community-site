# AC社区 架构

## 技术栈

| 层 | 选型 | 说明 |
|----|------|------|
| 前端 | HTML/CSS/JS | 零依赖、零构建，`site/` 静态文件 |
| 后端 | Python FastAPI | `site/api/` |
| Web 服务器 | nginx | 静态文件 + `/api/` 反向代理 |
| 数据 | mock_db（内存） | 重启即失，二期换 SQLite |

## 目录结构

```
site/
├── index.html          # 首页
├── assets/
│   ├── style.css       # 主题：暗色 + 淡紫蓝点缀
│   └── app.js          # 页面脚本：fetch 各接口
├── services/           # 插件板块
├── blog/               # 内容区
└── api/                # 后端 FastAPI
    ├── main.py         # 入口：挂路由、CORS、全局异常
    ├── schemas.py      # Pydantic 模型（请求/响应格式）
    ├── mock_db.py      # 内存数据（留言/访问统计/文章）
    ├── utils.py        # 工具函数
    ├── requirements.txt
    └── routers/
        ├── __init__.py
        ├── message.py  # 留言板
        ├── visit.py    # 访问计数
        └── search.py   # 站内搜索
```

## API

| 方法 | 路径 | 作用 | 参数 |
|------|------|------|------|
| GET | `/api/health` | 健康检测 | — |
| GET | `/api/message/list` | 留言列表（最新在前） | `limit`（默认 20） |
| POST | `/api/message/add` | 提交留言 | JSON：`nickname` `content` |
| GET | `/api/visit/count` | 访问统计 | — |
| GET | `/api/search/query` | 关键词搜文章 | `keyword`（必填） |

## 部署

```
浏览器 ──> nginx
              ├── /         → 静态文件（index.html、assets/）
              └── /api/     → 反代到本机后端（uvicorn + FastAPI）
```

- 后端只绑本机，不对公网暴露，所有请求走 nginx
- 正式域名计划 `ac.anonnet.top`

## 开发环境启动

**后端**：

```bash
cd site/api
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn main:app --reload
```

**前端**：浏览器直接开 `site/index.html`（页面脚本走 `/api/` 相对路径，需经 nginx 反代才通）。

## 草案问题清单（待二期处理）

| 问题 | 位置 | 说明 |
|------|------|------|
| `today_visit` 类型 | schemas.py / visit.py | 用 `str` 存数字，应改 `int` |
| 死代码 | schemas.py | `Optional`/`List` 导入没用上；`SearchQuery` 未使用 |
| CORS 通配 | main.py | `allow_origins=["*"]`，上线前改白名单 |
| 内存数据 | mock_db.py | 重启丢数据，二期换数据库 |

## 下一步

看 [路线图](ROADMAP.md)。
