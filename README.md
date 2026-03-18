# ⚛️ ArthaNova — The AI-Powered Financial Sentinel 🇮🇳

<p align="center">
  <img src="https://img.shields.io/badge/ArthaNova-v1.0.0-blue?style=for-the-badge&logo=react" alt="ArthaNova Version" />
  <img src="https://img.shields.io/badge/Python-3.10+-yellow?style=for-the-badge&logo=python" alt="Python Version" />
  <img src="https://img.shields.io/badge/FastAPI-Framework-green?style=for-the-badge&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Frontend-React%2018-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Database-SQLAlchemy%202.0-red?style=for-the-badge&logo=sqlite" alt="Database" />
</p>

---

## 💎 The ArthaNova Vision
**ArthaNova** is a premium, institutional-grade financial intelligence platform meticulously crafted for the Indian equity market. By marrying high-frequency data pipelines with localized AI inference, ArthaNova democratizes sophisticated market analysis for every retail and institutional investor.

---

## 🚀 Platform Ecosystem

### 🧠 Intelligence & Analytics
- **🎯 Opportunity Radar**: Real-time breakout detection using institutional volume and technical pattern recognition.
- **📰 Sentiment AI**: Quantified news analytics from major Indian financial media (MoneyControl, ET, Mint) using NLP pipelines.
- **🛡️ Portfolio Health**: Deep-dive risk scoring, sector diversification analytics, and 1-click portfolio optimization.
- **💬 Artha AI (RAG)**: Conversational interface with Retrieval-Augmented Generation (RAG) to query company filings and market reports.

### 🎬 Media Engine
- **Automated Video Summaries**: Daily stock performance and IPO summaries generated automatically via rendering pipelines.
- **Smart Thumbnails**: Dynamic UI generation for market alerts and breaking news triggered by AI signals.

### 🛠️ Admin Command Center (Governance)
- **👥 User Lifecycle**: Comprehensive management of accounts, roles, and administrative statuses.
- **🤖 AI Model Monitoring**: Real-time health tracking of Sentiment models, Technical Recognizers, and inference latencies.
- **🎬 Render Cluster Control**: Centralized oversight for GPU-accelerated video rendering pipelines.
- **🔔 Global Dispatch**: Command center for push notifications, broadcast alerts, and system-wide messaging.

---

## 🏗️ Advanced Architecture

| Layer | Technical Stack | Core Capabilities |
| :--- | :--- | :--- |
| **🌐 API Core** | `FastAPI`, `Pydantic v2`, `Uvicorn` | Asynchronous high-concurrency requests, automatic schema validation. |
| **⚛️ App Shell** | `React 18`, `Vite 6`, `Zustand` | Persistent global state, Atomic design system, Optimized HMR. |
| **🔐 Security** | `JWT (PyJWT)`, `Bcrypt`, `RBAC Guards` | Multi-tiered authorization, Token rotation, Encrypted persistence. |
| **💾 Persistence** | `SQLAlchemy 2.0`, `Async Engines` | Clean relational mapping with asynchronous database orchestration. |
| **🎨 Design** | `SCSS Modules`, `Glassmorphism` | Scalable design tokens, Variable-driven theming, Premium aesthetics. |

---

## 🚦 System Initialization (Quickstart)

### 1️⃣ Backend Setup (The API Engine)
```bash
# Enter the backend directory
cd backend

# Initialize Virtual Environment
python -m venv venv
source venv/bin/activate  # Windows: venv\\Scripts\\activate

# Install Institutional-grade Dependencies
pip install -r requirements.txt

# Seed the Ecosystem (Pre-configured User & Admin)
python seed_demo.py

# Launch the Sentinel Engine
python main.py  # Serving on http://127.0.0.1:8000
```

### 2️⃣ Frontend Setup (The Dashboard)
```bash
# Enter the frontend directory
cd frontend

# Install Dependencies
npm install

# Boost the Development Server
npm run dev  # Serving on http://localhost:5173
```

---

## 🔐 Demonstration Access

Explore the platform using these pre-configured profiles:

| Role Icon | Identity | Password | Operational Access |
| :---: | :--- | :--- | :--- |
| **🛠️** | `admin@arthanova.in` | `Admin@1234` | System Configuration, User Management, AI Oversight |
| **📈** | `user@arthanova.in` | `User@1234` | Portfolio Analytics, AI Chat, Radar Signals |

---

## 📂 Project Hierarchy

```text
ArthaNova/
├── 🌐 backend/                 # Python FastAPI Microservices
│   ├── app/                    # Application logic
│   │   ├── api/v1/             # Modular Routers (Auth, User, Admin, etc.)
│   │   ├── core/               # Configuration, Security, Dependencies
│   │   ├── models/             # SQLAlchemy Relational Models
│   │   ├── services/           # External Business Logic & Integrations
│   │   └── schemas/            # Pydantic Response/Request Objects
│   ├── tests/                  # Integrity verification suite
│   └── seed_demo.py            # Data orchestration script
├── ⚛️ frontend/                # React Fiber Interface
│   ├── src/                    # Source architecture
│   │   ├── components/         # Atomic UI (Common, Admin, Layout)
│   │   ├── pages/              # View-level Logic & Redirection
│   │   ├── store/              # Reactive State (Zustand Persistent)
│   │   └── styles/             # Design System Tokens & SCSS
│   └── public/                 # Static graphical assets
└── 📄 README.md                # Integrated Documentation Hub
```

---

## 🛠️ Security & Compliance
- **RBAC Enforcement**: Strict server-side dependency injection for administrative endpoints.
- **Audit Trails**: Every platform mutation is captured in the system audit logs for accountability.
- **Hardware Isolation**: Separate computational pipelines for AI inference and Video rendering to prevent system bottlenecks.

---
*Built with ❤️ for the Indian Investor by the ArthaNova Engineering Team.*
