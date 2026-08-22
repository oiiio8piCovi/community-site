# AC社区

> **Animation & Computer Science Community**
> 共建 · 共享 · 成长

组内共建的二次元风格社区站——不只是群介绍，是挂服务、资源、工具，学习交流和个人展示的地方。

![版本](https://img.shields.io/badge/版本-v1.0.0-blue)
![状态](https://img.shields.io/badge/状态-一期进行中-green)
![后端](https://img.shields.io/badge/后端-FastAPI-orange)
![前端](https://img.shields.io/badge/前端-零依赖HTML/CSS/JS-lightgrey)

## 📋 项目信息

| 项目 | 内容 |
|------|------|
| 全称 | Animation & Computer Science Community |
| 正式地址（计划） | `ac.anonnet.top` |
| 演示站（内网） | `http://192.168.1.13:18080/` |
| 代码仓库 | [oiiio8piCovi/community-site](https://github.com/oiiio8piCovi/community-site) |
| 服务器 + 域名 | 组长提供（塔，anonnet.top） |

## 🧩 五个职能板块

按**职能**分工：每人一个明确的技术角色，各练各的，又互相配合。

| 板块 | 干什么 | 负责人 |
|------|--------|--------|
| **维护** | 服务器、部署、监控、安全 | 组长 |
| **前端** | 网站壳、页面、UI/交互 | 池棠 + 凉心白日 |
| **后端** | Python API、动态功能、数据 | 池棠 + 凉心白日 |
| **插件** | 小工具、第三方集成、资源导航 | 小狄 + 组长等 |
| **设计** | 视觉风格、素材、品牌 | 池棠 |

## 📑 内容板块（规划）

| 板块 | 放什么 |
|------|--------|
| 首页 | 名字、口号、最新动态 |
| 工具 | 在线小工具 |
| 资源 | 资源导航 + 友链 |
| 文章 | 学习笔记、教程、更新记录 |
| 留言 | 交流板 |

## 🛠 技术栈（统一，不搞多语言混搭）

| 层 | 选型 | 理由 |
|----|------|------|
| 前端 | HTML/CSS/JS 静态壳 | 零依赖、零构建、谁都看得懂、个性化简单 |
| 后端 | Python FastAPI | 团队交集最大的语言 |
| 部署 | nginx + 组长服务器 | 现成的 |

## 📁 仓库结构

```
community-site/
├── README.md        # 本文件：项目门面
├── docs/            # 文档：章程、架构、协作、路线图
└── site/            # 网站代码（一期）
    ├── index.html   # 首页
    ├── assets/      # 壳：主题 CSS/JS
    ├── services/    # 插件板块：小工具、资源导航
    ├── blog/        # 内容区：文章、笔记
    └── api/         # 后端：Python 服务（二期）
```

## 🚀 快速开始

```bash
git clone https://github.com/oiiio8piCovi/community-site.git
cd community-site
```

**前端**：`site/index.html` 浏览器直接打开，或部署到 nginx。

**后端**（二期草案）：

```bash
cd site/api
pip install -r requirements.txt
uvicorn main:app --reload
```

## 📚 文档

| 文档 | 内容 |
|------|------|
| [项目章程](docs/PROJECT-PLAN.md) | 为什么做、目标、板块定义、范围 |
| [架构文档](docs/ARCHITECTURE.md) | 技术栈、目录结构、后端接口、部署 |
| [协作规范](docs/COLLABORATION.md) | Git 流程、职责、提交要求 |
| [路线图](docs/ROADMAP.md) | 一期/二期/三期 + 每期交付物 |

**新成员先读 README → 章程 → 协作规范**。
