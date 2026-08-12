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

## Phase 1 MVP 范围（已全部完成）

- [x] Monorepo 骨架 + Docker Compose
- [x] 数据库模型 + Alembic 迁移
- [x] 登录系统（注册/登录/JWT/角色）
- [x] AIProvider 抽象层 + Mock Provider
- [x] 关键词监测模块
- [x] GEO 评分算法 v1
- [x] GEO 驾驶舱 Dashboard

## Phase 2 AI 能力

- [x] 竞品品牌分析（对比 + 机会点提示）
- [x] AI 内容优化助手（GEO 文章 + FAQ + Schema JSON-LD）
- [x] 每日 AI 策略生成（驾驶舱「今日任务」）
- [x] 企业知识库（PDF/Word/Excel/图片上传 + OCR + 向量化 + 检索）
- [x] 真实 AI 厂商接入（OpenAI/Claude/Gemini/Perplexity，代码已实现，**未用真实 Key 做过端到端验证**，见下方说明）
- [ ] 自动化报告导出（`reports` 表已在数据库设计中，尚未实现生成/导出接口）

AI 厂商调用默认使用 `AI_PROVIDER_MODE=mock`，业务全流程可在没有真实 API Key 的情况下打通；在 `.env` 中填入真实 Key 并设置 `AI_PROVIDER_MODE=live` 即可切换为真实调用，无需改动业务代码（`app/services/ai_providers/factory.py` 是唯一的派发点）。**重要**：由于当前环境没有真实的 OpenAI/Anthropic/Google/Perplexity API Key，`live` 模式下的四个 Provider 实现只做了单元测试级别的验证（mock 掉网络调用、验证解析逻辑与工厂派发），未做过真实网络请求的端到端验证——接入生产环境前建议先用真实 Key 跑一遍关键词监测确认可用。Google AI Overview 没有官方公开 API，`live` 模式下会自动回退到 Mock。

企业知识库的向量检索同理默认使用 `EMBEDDING_PROVIDER_MODE=mock`（基于文本哈希的确定性向量），检索结果不具备真实语义相似度，仅验证链路正确性；接入真实 embedding 模型是后续可选增强。

## 运行测试

```bash
cd geo-platform/apps/api
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements-dev.txt
pytest -v
```

## 后续可选增强

自动化报告导出、真实 embedding 模型接入、Google AI Overview 数据源（需接入第三方 SERP 抓取服务）、SaaS 多租户与会员套餐（Phase 3）。
