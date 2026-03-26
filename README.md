# ⚛️ ArthaNova — The Agentic Financial Sentinel 🇮🇳

<p align="center">
  <img src="https://img.shields.io/badge/ArthaNova-v2.0.0-C4FF00?style=for-the-badge&logo=react&logoColor=black" alt="ArthaNova Version" />
  <img src="https://img.shields.io/badge/LangGraph-Multi--Agent-black?style=for-the-badge&logo=langchain&logoColor=white" alt="LangGraph" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs" alt="Node.js Version" />
  <img src="https://img.shields.io/badge/UI-Modern%20&%20High%20Impact-FF6AC1?style=for-the-badge" alt="Modern UI" />
  <img src="https://img.shields.io/badge/Database-Turso%20(libSQL)-4ea94b?style=for-the-badge&logo=sqlite" alt="Database" />
</p>

---

## 💎 The ArthaNova Vision
**ArthaNova** is a premium, institutional-grade financial intelligence platform meticulously crafted for the Indian equity market. By marrying high-frequency data pipelines with **Stateful Multi-Agent AI Orchestration (LangGraph)**, ArthaNova democratizes sophisticated market analysis for every retail investor. We wrap this powerful engine in a striking, high-impact modern design system.

---

## 🤖 Agentic Intelligence (Core Engine)
The heart of ArthaNova is its LangGraph-powered Multi-Agent architecture. Unlike standard LLM wrappers, ArthaNova utilizes a suite of specialized, stateful agents that collaborate to find alpha:

- **🕵️ SignalAgent**: Scours financial APIs for raw market events (Bulk deals, technical breakouts, volume surges).
- **⚖️ ContextAgent**: Audits signals against your localized portfolio data and historical earnings using persistent memory.
- **🧠 AnalystAgent**: Synthesizes the final high-conviction alerts, resolving conflicting indicators (e.g., RSI vs FII activity).
- **💾 Agent Persistence (Memory)**: Built-in state checkpointing (Thread IDs) allows agents to "remember" your portfolio context, past risk tolerance, and historical breakout failures across sessions.

---

## 🚀 Platform Ecosystem

### 📊 Markets & Analytics
- **🎯 Opportunity Radar**: Real-time breakout detection using algorithmic anomalies.
- **📰 News Intelligence**: NLP pipelines that categorize Indian financial media (MoneyControl, ET, Mint) as bullish/bearish.
- **🛡️ Portfolio Health**: Deep-dive risk scoring and concentration analytics simulated against live macro-events.
- **💬 AI Chat (RAG)**: Conversational quant interface powered by Groq/Llama-3 to query company filings instantly.

### 🛠️ Architecture & Tech Stack

| Layer | Technical Stack | Core Capabilities |
| :--- | :--- | :--- |
| **🧠 Intelligence** | `LangGraph (JS)`, `LangChain`, `Groq` | Stateful agent memory, Sequential graph execution, Rapid LLM inference. |
| **🌐 API Core** | `Node.js`, `Express.js`, `Zod` | Asynchronous concurrency, schema validation, robust REST endpoints. |
| **⚛️ App Shell** | `React 18`, `Vite 6`, `Zustand` | Persistent global state, Atomic routing, high-performance DOM updates. |
| **💾 Persistence**| `Turso (libSQL)` | Ultra-low latency edge database, SQLite compatibility, high read-throughput. |
| **🎨 Design** | `Vanilla CSS Modules` | Custom modern design tokens, high-contrast aesthetics, zero-bloat. |

---

## 🚦 System Initialization (Quickstart)

### 1️⃣ Backend Setup (The AI Engine)
```bash
# Enter the backend directory
cd backend

# Install dependencies (Express, LangGraph, Turso client)
npm install

# Launch the Sentinel Engine
npm run dev  # Serving on http://localhost:8000
```

### 2️⃣ Frontend Setup (The Dashboard)
```bash
# Enter the frontend directory
cd frontend

# Install UI Dependencies
npm install

# Boot the Interactive Dashboard
npm run dev  # Serving on http://localhost:5173
```

---

## 📂 Project Hierarchy

```text
ArthaNova/
├── 🌐 backend/                 # Node.js + Express + LangGraph Engine
│   ├── src/
│   │   ├── controllers/        # Route handlers
│   │   ├── routes/             # API Endpoints registry
│   │   ├── services/           # AI Multi-Agent Logic (aiAgentService.js)
│   │   └── models/             # Turso Database Client (db.js)
│   ├── .env                    # System Variables & API Keys
│   └── package.json            # Backend dependencies
├── ⚛️ frontend/                # React Vite Application
│   ├── src/
│   │   ├── components/         # Reusable high-impact UI components
│   │   ├── pages/              # Dashboards, Agentic UI, Portfolio
│   │   ├── styles/             # Modular CSS for styling and Popups
│   │   └── store/              # Zustand global state (Auth/User)
└── 📄 README.md                # Integrated Documentation Hub
```

---

## 👨‍💻 Author & Connect

**Ritesh Kumar**  
Software Engineer & Quantitative AI Enthusiast  

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/riteshkumar-tech/)  
[![GitHub](https://img.shields.io/badge/GitHub-Follow-black?style=for-the-badge&logo=github)](https://github.com/RiteshKumar2e)  
[![Email](https://img.shields.io/badge/Email-Contact-red?style=for-the-badge&logo=gmail)](mailto:riteshkumar90359@gmail.com)

---
*Architected for the upcoming wave of autonomous finance. Built with ❤️ for the Indian Investor.*
