# ⚛️ ArthaNova — The Agentic Financial Sentinel 🇮🇳

[![Version](https://img.shields.io/badge/ArthaNova-v2.1.0-C4FF00?style=for-the-badge&logo=react&logoColor=black)](https://github.com/RiteshKumar2e/ArthaNova)
[![Engine](https://img.shields.io/badge/LangGraph-Multi--Agent-black?style=for-the-badge&logo=langchain&logoColor=white)](https://github.com/langchain-ai/langgraphjs)
[![Backend](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Turso-libSQL-4ea94b?style=for-the-badge&logo=sqlite)](https://turso.tech/)
[![Security](https://img.shields.io/badge/Passkey-Google%20OTP-blue?style=for-the-badge&logo=google)](https://developers.google.com/identity/gsi/web)

---


## 💎 The ArthaNova Vision
**ArthaNova** is a premium, institutional-grade financial intelligence platform meticulously crafted for the Indian equity market. By marrying high-frequency data pipelines with **Stateful Multi-Agent AI Orchestration (LangGraph)**, ArthaNova democratizes sophisticated market analysis for retail investors. 

The platform features a striking **Neo-Brutalist** design system, combining raw performance with a high-impact visual experience.

---

## 🤖 Agentic Intelligence (Core Engine)
The heart of ArthaNova is its LangGraph-powered Multi-Agent architecture. Unlike standard LLM wrappers, ArthaNova utilizes a suite of specialized, stateful agents:

- **🕵️ SignalAgent**: Autonomously scours financial APIs for raw market events (Bulk deals, technical breakouts, volume surges).
- **⚖️ ContextAgent**: Audits signals against localized portfolio data and historical earnings using persistent memory.
- **🧠 AnalystAgent**: Synthesizes high-conviction alerts by resolving conflicting technical and fundamental indicators.
- **💾 Stateful Persistence**: Checkpointing allows agents to maintain context across sessions, remembering your risk tolerance.

---

## 🚀 Key Features

### 🔐 Advanced Security
*   **Google OAuth 2.0 Integration**: Seamless login with industry-standard security using a tailored **Neo-Brutalist Google Sign-In button**.
*   **Dual-Layer Verification**: Custom Google Sign-In flow coupled with a secondary **Email OTP (via Brevo)** for high-security account protection.
*   **Admin Command Center**: Secure override mechanisms for platform administrators to manage ecosystem health.

### 📊 Markets & Analytics
*   **🎯 Opportunity Radar**: algorithmic detection of price/volume anomalies and breakout patterns.
*   **📰 News Intel**: NLP-driven sentiment analysis of major Indian financial media (MoneyControl, ET, Mint).
*   **🛡️ Risk Sentinel**: Real-time portfolio concentration analytics and macro-event simulation.
*   **💬 AI Quant Chat**: Conversational RAG (Retrieval-Augmented Generation) interface to query company filings and technical data via Groq/Llama-3.

---

## 🛠️ Technical Architecture

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Intelligence** | `LangGraph JS`, `LangChain`, `Groq` | Multi-agent orchestration, state management, and RAG. |
| **API Core** | `Node.js (LTS)`, `Express.js`, `Axios` | High-performance middleware and external API integration. |
| **Frontend** | `React 18`, `Vite 6`, `Zustand` | Reactive UI shell with global state management. |
| **Design** | `Native CSS Modules`, `Neo-Brutalism` | Custom-themed modular styles without CSS bloat. |
| **Storage** | `Turso (libSQL)`, `Redis` | Edge-optimized database for low-latency market data. |

---

## 📂 Project Hierarchy

```text
ArthaNova/
├── 🌐 backend/                 # Node.js + Express Engine
│   ├── src/
│   │   ├── routes/             # API Endpoints (Auth, AI, Markets)
│   │   ├── services/           # Agent Logic & Mail Services (Brevo)
│   │   ├── config/             # System settings & Environment mappers
│   │   └── utils/              # Security & Auth helpers
│   └── setup_db.js             # One-click Database Initializer
├── ⚛️ frontend/                # React Vite Application
│   ├── src/
│   │   ├── components//        # Atomic UI & Security Modals
│   │   ├── pages/auth/         # High-impact Auth & OTP flows
│   │   ├── store/              # Centralized State (Zustand)
│   │   └── styles/             # Neo-Brutalist Design Tokens
└── 📄 README.md                # Integrated Documentation Hub
```

---

## 🚦 Quick Start Guide

### 1. Prerequisites
- Node.js v18+
- A Google Cloud Project (for OAuth)
- A Brevo API Key (for OTP emails)
- A Turso/SQLite Database setup

### 2. Installation & Setup

**Backend:**
```bash
cd backend
npm install
# Configure your .env (see .env.example)
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
# Configure your .env (VITE_GOOGLE_CLIENT_ID)
npm run dev
```

---

## 👨‍💻 Developed By

**Ritesh Kumar**  
*Software Engineer & Quantitative AI Enthusiast*

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/riteshkumar-tech/)  
[![GitHub](https://img.shields.io/badge/GitHub-Follow-black?style=for-the-badge&logo=github)](https://github.com/RiteshKumar2e)  
[![Email](https://img.shields.io/badge/Email-Contact-red?style=for-the-badge&logo=gmail)](mailto:riteshkumar90359@gmail.com)

---

## 📜 License

This project is protected under a **Proprietary Software License** — see the [LICENSE](LICENSE) file for full details.

**© 2026 Ritesh Kumar. All Rights Reserved.**  
Unauthorized use, copying, modification, distribution, or reproduction of this software or its design — in whole or in part — is strictly prohibited without prior written permission from the author.

---

*Architected for the upcoming wave of autonomous finance. Built with ❤️ for the Indian Investor.*
