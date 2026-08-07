# GEO Intelligence Platform

企业级生成式引擎优化（Generative Engine Optimization）智能系统 — 帮助企业量化并提升品牌在 ChatGPT / Claude / Gemini / Perplexity / Google AI Overview 等生成式搜索中的曝光与推荐概率。

本目录与仓库根目录中已有的「佰利涂装应用学院」站点相互独立，互不影响。

## 技术栈

- 前端：Next.js 14（App Router）+ TypeScript + Tailwind CSS
- 后端：Python + FastAPI
- 数据库：PostgreSQL（业务数据）+ Redis（缓存/任务队列）+ Qdrant（向量检索）
- 异步任务：Celery
- 部署：Docker Compose

## 快速开始

```bash
cd geo-platform
cp .env.example .env
docker compose up --build
```

- 前端：http://localhost:3000
- 后端 API：http://localhost:8000
- API 健康检查：http://localhost:8000/api/v1/health

## 目录结构

```
geo-platform/
├── apps/
│   ├── web/     # Next.js 14 前端
│   └── api/     # FastAPI 后端
├── packages/    # 前后端共享代码（后续按需添加）
└── docker-compose.yml
```

## Phase 1 MVP 范围

- [x] Monorepo 骨架 + Docker Compose
- [ ] 数据库模型 + Alembic 迁移
- [ ] 登录系统（注册/登录/JWT/角色）
- [ ] AIProvider 抽象层 + Mock Provider
- [ ] 关键词监测模块
- [ ] GEO 评分算法 v1
- [ ] GEO 驾驶舱 Dashboard

AI 厂商调用在 Phase 1 默认使用 `AI_PROVIDER_MODE=mock`，业务全流程可在没有真实 API Key 的情况下打通；在 `.env` 中填入真实 Key 并设置 `AI_PROVIDER_MODE=live` 即可切换为真实调用，无需改动业务代码。
