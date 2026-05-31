# Perception Mapper AI

Perception Mapper AI is an enterprise-grade, high-fidelity cognitive bias, tone, and multilingual sentiment analysis platform. Designed for journalists, content teams, and enterprises, it processes text in **English**, **Tamil (தமிழ்)**, and **Sinhala (සිංහල)** to identify cognitive distortions (e.g., Confirmation Bias, Sensationalism, Over-generalization), deliver progress-metered emotional tone breakdowns, and suggest objective alternative rephrasings in real-time.

---

## 🚀 Key Features

*   **Multilingual Analysis Engine:** High-accuracy natural language processing tailored for English, Tamil, and Sinhala content.
*   **Cognitive Bias Classifier:** Automatically flags cognitive distortions with detailed linguistic explanations and context-aware rephrasing suggestions.
*   **Tone Breakdown Analytics:** Progress-metered tracking of key emotional and communication tones (Informative, Formal, Assertive, Cooperative) driven by keyword scoring algorithms.
*   **Interactive Team Customization:** Team Plan subscribers can build, test, and deploy custom regex parsing rules directly from the configuration panel to target custom vocabularies.
*   **Developer API Console & Playground:** Self-service developer console offering real-time credentials management and a live playground for generating code snippets.
*   **Enterprise Security:** Dual-layer guard architecture featuring local JWT token decoding via Clerk (`ClerkGuard`) and secure developer key validation (`ApiKeyGuard`).
*   **High-Fidelity Reporting:** Prints clean, beautifully-styled assessment reports using native browser print streams and print-optimized stylesheets.
*   **Production-Ready DevOps:** Complete multi-stage Docker deployment configurations integrated with GitHub Actions workflows for automated continuous integration.

---

## 🛠️ System Architecture & Tech Stack

Perception Mapper AI utilizes a containerized monorepo workspace to orchestrate its microservices:

```
Perception_Mapper_AI/
├── apps/
│   ├── web/               # Next.js 14 Frontend Application (Tailwind CSS, Clerk, next-intl)
│   ├── api/               # NestJS Core Gateway API (TypeScript, Prisma ORM, WebSockets)
│   └── nlp-engine/        # Python FastAPI NLP Sidecar (SpaCy, regex classifiers)
├── packages/
│   └── ui/                # Shared glassmorphic React Tailwind component library
├── .github/
│   └── workflows/         # Automated parallel-build CI/CD pipeline
```

*   **Frontend Client:** Next.js 14 (App Router), Tailwind CSS, `@clerk/nextjs` for user management, and `next-intl` for comprehensive internationalization (i18n).
*   **Gateway API Server:** NestJS (Node.js), Prisma ORM (PostgreSQL database handler), and WebSockets for real-time telemetry streaming.
*   **NLP Evaluation Engine:** Python 3.10, FastAPI, SpaCy tokenization, and `langdetect` classifiers.
*   **Infrastructure:** Docker, Docker Compose, GitHub Actions, and AWS ECS Fargate readiness.

---

## ⚡ Quick Start & Development Setup

Ensure you have **Node.js 18+**, **pnpm/npm**, and **Python 3.10+** installed on your system.

### 1. Start the Frontend and Gateway Services
From the monorepo root directory, install dependencies and start the development servers:

```bash
# Install root and workspace dependencies
npm install

# Start Next.js and NestJS servers in development mode
npm run dev
```

*   **Interactive Web Portal:** [http://localhost:3009](http://localhost:3009)
*   **NestJS Core Gateway API:** [http://localhost:3001/api](http://localhost:3001/api)

### 2. Start the NLP Sidecar Service
Navigate to the `nlp-engine` directory, configure the environment, and run the Python service:

```bash
cd apps/nlp-engine

# Install Python requirements
pip install -r requirements.txt

# Start the FastAPI reload server
python -m uvicorn main:app --reload --port 8000
```

*   **Interactive API Swaggers:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🔌 Developer Integration API

Enterprise subscribers can integrate the analysis engine into external systems using the developer API.

### Endpoint: Analyze Text via Developer Key

```bash
curl -X POST http://localhost:3001/api/analyze/developer \
  -H "X-API-Key: pm_key_team_pro_2026" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "This is an absolute disaster and completely unbelievable."
  }'
```

### Response Schema

```json
{
  "success": true,
  "language": "English",
  "scores": {
    "sentiment": 15,
    "objectivity": 40,
    "biasIndex": 75
  },
  "tones": [
    { "name": "Assertive", "score": 85, "color": "from-red-500 to-orange-500" },
    { "name": "Informative", "score": 30, "color": "from-blue-500 to-indigo-500" }
  ],
  "biases": [
    {
      "name": "Sensationalism",
      "explanation": "Use of high-intensity emotional language ('absolute disaster', 'unbelievable') to amplify response.",
      "rephrase": "This is a significant setback and unexpected."
    }
  ]
}
```

---

## 🐳 Docker Deployment

To spin up the entire production environment locally, utilize the root Docker Compose orchestrator:

```bash
# Start all microservices in background containers
docker-compose up -d --build
```
