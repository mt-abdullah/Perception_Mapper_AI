# Perception Mapper AI

Perception Mapper AI is an enterprise-grade multilingual sentiment, tone, and cognitive bias analyzer designed to examine content across **English**, **Tamil (தமிழ்)**, and **Sinhala (සිංහල)**. 

Built as a high-fidelity SaaS platform utilizing a containerized monorepo, it empowers writers, journalists, and teams to uncover hidden emotional tones and cognitive distortions (Confirmation Bias, Sensationalism, Over-generalization) with live alternative rephrasings.

---

## 🚀 Key Features

*   **Multilingual Analysis Engine:** Evaluates text segments dynamically in English, Tamil, and Sinhala.
*   **Tone Breakdown Progress Meters:** Tracks multiple emotional tones (Informative, Formal, Assertive, Cooperative) using custom keyword scoring algorithms.
*   **Cognitive Bias Classifier:** Flag distortions (Confirmation Bias, Sensationalism, Over-generalization) with detailed explanations and suggest balanced, objective rephrase alternatives.
*   **Custom Bias Rule Editor:** Allows Team Plan subscribers to submit custom regex parsing rules directly from the dashboard to target custom vocabularies.
*   **Developer API Console:** Active `X-API-Key` credentials dashboard providing direct curl triggers for automation.
*   **High-Fidelity PDF Exporter:** Renders a clean print stylesheet report and triggers the native browser print dialogue.
*   **Dual Authentication Guards:** Secured with local JWT token decoders via Clerk (`ClerkGuard`) and developer key matching (`ApiKeyGuard`).
*   **DevOps & CI/CD Pipelines:** Ready-to-deploy Dockerfiles for all microservices, backed by a unified GitHub Actions workflow running on main triggers.

---

## 🛠️ Technology Stack

*   **Monorepo Workspace:** Turborepo, pnpm workspaces, TypeScript.
*   **Web Frontend Client:** Next.js 14 (App Router), Tailwind CSS, `@clerk/nextjs`, `next-intl` (i18n).
*   **Gateway API Server:** NestJS (Node.js + TS), Prisma ORM, `jsonwebtoken`, `jwks-rsa`.
*   **NLP Evaluation Engine:** Python 3.10, FastAPI, `langdetect`, `spacy` tokenization.
*   **Infrastructure:** Docker, GitHub Actions, AWS ECS Fargate readiness.

---

## 📁 Repository Directory Structure

```
Perception_Mapper_AI/
├── apps/
│   ├── web/               # Next.js 14 Frontend Application
│   │   ├── app/           # App Router localized layouts and page views
│   │   ├── messages/      # English, Tamil, Sinhala localized JSON sheets
│   │   └── Dockerfile     # Multi-stage production node container
│   ├── api/               # NestJS Core Backend API Gateway
│   │   ├── src/           # Clerk JWT Guards, ApiKey Guards, Prisma controllers
│   │   ├── prisma/        # PostgreSQL Prisma database schema models
│   │   └── Dockerfile     # Production NestJS node runner container
│   └── nlp-engine/        # Python FastAPI NLP Sidecar Service
│       ├── engine.py      # Language scanners and regex token maps
│       ├── main.py        # Analysis endpoints routing
│       └── Dockerfile     # Python runtime container
├── packages/
│   └── ui/                # Shared glassmorphic React Tailwind component library
├── .github/
│   └── workflows/         # GitHub Actions parallel build CI/CD pipeline
├── package.json           # Global monorepo tasks
├── pnpm-workspace.yaml    # Workspace configuration path
└── turbo.json             # Turborepo caching pipelines
```

---

## ⚡ Quick Start & Local Execution

Ensure you have Node.js 18+ and Python 3.10+ installed.

### Step 1: Start the TypeScript services
From the monorepo root directory, install dependencies and run the development orchestrator:
```bash
npx pnpm install
npx pnpm run dev
```
*   **Interactive Web Portal:** [http://localhost:3000](http://localhost:3000)
*   **NestJS Core Gateway API:** [http://localhost:3001/api](http://localhost:3001/api)

### Step 2: Start the Python FastAPI NLP Service
Navigate to the `nlp-engine` directory, restore requirements, and run the server:
```bash
cd apps/nlp-engine
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```
*   **API Swaggers Documentation:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🔌 Developer Key Integration

Team Plan subscribers can run automated CLI perception audits by passing their active `X-API-Key` token:

```bash
curl -X POST http://localhost:3001/api/analyze/developer \
  -H "X-API-Key: pm_key_team_pro_2026" \
  -H "Content-Type: application/json" \
  -d '{"text": "Obviously unbelievable disaster."}'
```
