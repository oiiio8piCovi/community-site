# AC社区 架构文档 v1.0

> 状态：一期实装 + 二期草案 ｜ 更新：2026-08-23

## 一、技术栈

| 层 | 选型 | 版本/说明 |
|----|------|----------|
| 前端 | HTML/CSS/JS | 零依赖、零构建，`site/` 下静态文件 |
| 后端 | Python FastAPI | Python 3.9，草案阶段，`site/api/` |
| Web 服务器 | nginx | 静态文件 + `/api/` 反向代理 |
| 数据库 | mock_db（内存） | 二期草案用，重启即失，后续换 SQLite/MySQL |

## 二、目录结构

```
site/
├── index.html          # 首页（品牌区 + 四个功能区块）
├── assets/
│   ├── style.css       # 主题：暗色 + 淡紫蓝点缀
│   └── app.js          # 页面脚本：fetch 各接口
├── services/           # 插件板块（一期占位）
├── blog/               # 内容区（一期占位）
└── api/                # 后端 FastAPI（二期草案）
    ├── main.py         # 入口：挂路由、CORS、全局异常
    ├── schemas.py      # Pydantic 模型（请求/响应格式）
    ├── mock_db.py      # 内存数据（留言表/访问统计/文章）
    ├── utils.py        # 工具函数
    ├── requirements.txt
    └── routers/
        ├── __init__.py
        ├── message.py  # 留言板
        ├── visit.py    # 访问计数
        └── search.py   # 站内搜索
```

## 三、后端 API 一览

| 方法 | 路径 | 作用 | 参数 |
|------|------|------|------|
| GET | `/api/health` | 健康检测 | — |
| GET | `/api/message/list` | 留言列表（最新在前） | `limit`（默认 20） |
| POST | `/api/message/add` | 提交留言 | JSON：`nickname` `content` |
| GET | `/api/visit/count` | 访问统计（每次调用 +1） | — |
| GET | `/api/search/query` | 关键词搜文章标题/内容 | `keyword`（必填） |

错误统一返回：`{"code": 错误码, "msg": "说明"}`。

## 四、部署架构

```
浏览器 ──> nginx :18080（演示端口）
              ├── /           → site/ 静态文件（index.html, assets/）
              └── /api/       → 反代到 127.0.0.1:8010（uvicorn）
                                   └── FastAPI app（main.py）
```

- 后端只绑 `127.0.0.1`，不对公网直接暴露，所有请求走 nginx
- 演示期端口 `18080`；正式期计划域名 `ac.anonnet.top`（80 端口）
- nginx 配置：`/etc/nginx/conf.d/ac-demo.conf`（塔上）

## 五、开发环境启动

**后端**：

```bash
cd site/api
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn main:app --reload   # 默认 127.0.0.1:8010
```

**前端**：浏览器直接开 `site/index.html`（页面脚本走相对路径 `/api/`，需要经 nginx 反代才通；纯本地看效果可用 CORS 或起 uvicorn 后访问 8010）。

## 六、已知的草案问题（待二期处理）

| 问题 | 位置 | 说明 |
|------|------|------|
| `today_visit` 类型 | schemas.py / visit.py | 用 `str` 存数字，应改 `int` |
| 死代码 | schemas.py | `Optional`/`List` 导入没用上；`SearchQuery` 未使用 |
| CORS 通配 | main.py | `allow_origins=["*"]`，上线前改白名单 |
| 内存数据 | mock_db.py | 重启丢数据，二期换数据库 |
