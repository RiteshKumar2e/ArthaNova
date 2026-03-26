# ArthaNova — AI Agent Architecture

> **AI-Powered Financial Intelligence for the Indian Retail Investor**

---

## 🎯 Overview

ArthaNova employs a **multi-agent autonomous system** that processes real-time market signals through a 3-step reasoning pipeline to deliver actionable, portfolio-aware intelligence.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                 │
│    📱 USER                    🤖 AI AGENTS                    📊 DATA SOURCES   │
│                                                                                 │
│    ┌─────────┐               ┌─────────────┐                ┌─────────────┐    │
│    │ React   │ ◄──────────── │ Orchestrator│ ◄───────────── │ NSE India   │    │
│    │ Frontend│               │             │                │ Finnhub     │    │
│    └─────────┘               │  ┌───────┐  │                │ NewsData.io │    │
│                              │  │Agent 1│  │                │ Groq LLM    │    │
│                              │  │Agent 2│  │                └─────────────┘    │
│                              │  │Agent 3│  │                                   │
│                              │  └───────┘  │                                   │
│                              └─────────────┘                                   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                                    PRESENTATION LAYER                                │
├──────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│   ┌────────────────────────────────────────────────────────────────────────────┐    │
│   │                         REACT FRONTEND (Vite)                              │    │
│   │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │    │
│   │  │  Dashboard   │  │ Opportunity  │  │  Portfolio   │  │   Artha AI   │   │    │
│   │  │              │  │    Radar     │  │   Health     │  │     Chat     │   │    │
│   │  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │    │
│   └────────────────────────────────────────────────────────────────────────────┘    │
│                                          │                                           │
│                                          ▼                                           │
│                                   REST API (JSON)                                    │
│                                                                                      │
└──────────────────────────────────────────────────────────────────────────────────────┘
                                           │
                                           ▼
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                                    APPLICATION LAYER                                 │
├──────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│   ┌────────────────────────────────────────────────────────────────────────────┐    │
│   │                      EXPRESS.JS BACKEND (Node.js)                          │    │
│   │                                                                            │    │
│   │   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   │    │
│   │   │    Auth     │   │     AI      │   │   Market    │   │  Portfolio  │   │    │
│   │   │ Controller  │   │ Controller  │   │ Controller  │   │ Controller  │   │    │
│   │   └──────┬──────┘   └──────┬──────┘   └──────┬──────┘   └──────┬──────┘   │    │
│   │          │                 │                 │                 │          │    │
│   │          └─────────────────┼─────────────────┼─────────────────┘          │    │
│   │                            ▼                 ▼                             │    │
│   │                 ┌─────────────────────────────────────┐                   │    │
│   │                 │      🧠 AI AGENT ORCHESTRATOR       │                   │    │
│   │                 │                                     │                   │    │
│   │                 │   Coordinates multi-step reasoning  │                   │    │
│   │                 │   across specialized AI agents      │                   │    │
│   │                 └─────────────────────────────────────┘                   │    │
│   │                                    │                                      │    │
│   └────────────────────────────────────┼──────────────────────────────────────┘    │
│                                        │                                            │
└────────────────────────────────────────┼────────────────────────────────────────────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    ▼                    ▼                    ▼
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                                    AGENT LAYER                                       │
├──────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│   ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐            │
│   │  📑 BULK DEAL      │  │  📈 BREAKOUT       │  │  📰 PORTFOLIO      │            │
│   │     AGENT          │  │     AGENT          │  │     NEWS AGENT     │            │
│   ├────────────────────┤  ├────────────────────┤  ├────────────────────┤            │
│   │ Distress vs        │  │ Pattern detection  │  │ P&L impact on      │            │
│   │ Routine detection  │  │ + signal conflict  │  │ user holdings      │            │
│   │ from NSE filings   │  │ resolution         │  │ prioritization     │            │
│   ├────────────────────┤  ├────────────────────┤  ├────────────────────┤            │
│   │ Steps:             │  │ Steps:             │  │ Steps:             │            │
│   │ 1. Fetch filings   │  │ 1. Fetch OHLCV     │  │ 1. Load portfolio  │            │
│   │ 2. Cross-ref news  │  │ 2. Calculate RSI   │  │ 2. Fetch news      │            │
│   │ 3. AI analysis     │  │ 3. Resolve signals │  │ 3. Rank by impact  │            │
│   └────────────────────┘  └────────────────────┘  └────────────────────┘            │
│                                                                                      │
└──────────────────────────────────────────────────────────────────────────────────────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    ▼                    ▼                    ▼
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                                   SERVICE LAYER                                      │
├──────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│   ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐               │
│   │  Market Data      │  │  Groq LLM         │  │  Portfolio        │               │
│   │  Service          │  │  Service          │  │  Service          │               │
│   ├───────────────────┤  ├───────────────────┤  ├───────────────────┤               │
│   │ • getStockQuote   │  │ • chat()          │  │ • getHoldings     │               │
│   │ • getBulkDeals    │  │ • 40+ model       │  │ • calculatePnL    │               │
│   │ • getInsiderTrade │  │   fallback        │  │ • sectorMapping   │               │
│   │ • getCandlestick  │  │ • temp: 0.3       │  │                   │               │
│   │ • detectPatterns  │  │                   │  │                   │               │
│   └───────────────────┘  └───────────────────┘  └───────────────────┘               │
│                                                                                      │
└──────────────────────────────────────────────────────────────────────────────────────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    ▼                    ▼                    ▼
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                                  EXTERNAL SERVICES                                   │
├──────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐               │
│   │   🇮🇳 NSE    │  │  📊 Finnhub │  │  📰 News    │  │  🤖 Groq    │               │
│   │   India     │  │             │  │  Data.io    │  │   LLM       │               │
│   ├─────────────┤  ├─────────────┤  ├─────────────┤  ├─────────────┤               │
│   │ Bulk Deals  │  │ Real-time   │  │ Indian      │  │ llama-3.3   │               │
│   │ Insider     │  │ Quotes      │  │ Business    │  │ 70b         │               │
│   │ Trades      │  │ OHLCV       │  │ News        │  │             │               │
│   │ SAST/PIT    │  │ Profiles    │  │ Sentiment   │  │ Reasoning   │               │
│   └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘               │
│                                                                                      │
└──────────────────────────────────────────────────────────────────────────────────────┘
                                         │
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                                   DATA LAYER                                         │
├──────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│   ┌─────────────────────────────────┐  ┌─────────────────────────────────┐          │
│   │       PostgreSQL (Prisma)       │  │        In-Memory Cache          │          │
│   ├─────────────────────────────────┤  ├─────────────────────────────────┤          │
│   │ • Users                         │  │ • API Response Cache            │          │
│   │ • Portfolios                    │  │ • Rate Limit Tracking           │          │
│   │ • Holdings                      │  │ • Session Data                  │          │
│   │ • Transactions                  │  │ • TTL: 5-15 minutes             │          │
│   └─────────────────────────────────┘  └─────────────────────────────────┘          │
│                                                                                      │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🤖 Agent Workflows

### Agent 1: Bulk Deal Analysis

> **Goal:** Detect distress selling vs. routine institutional blocks from NSE filings

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           BULK DEAL ANALYSIS AGENT                                  │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   INPUT: Symbol (e.g., "RELIANCE")                                                 │
│                                                                                     │
│   ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐           │
│   │                 │      │                 │      │                 │           │
│   │  STEP 1         │ ───► │  STEP 2         │ ───► │  STEP 3         │           │
│   │  Filing Fetch   │      │  Context        │      │  AI Analysis    │           │
│   │                 │      │  Enrichment     │      │                 │           │
│   └─────────────────┘      └─────────────────┘      └─────────────────┘           │
│          │                        │                        │                       │
│          ▼                        ▼                        ▼                       │
│   ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐           │
│   │ • NSE bulk-deals│      │ • Related news  │      │ • Groq LLM call │           │
│   │   API call      │      │ • Client history│      │ • Distress vs   │           │
│   │ • Parse fields  │      │ • Deal pattern  │      │   Routine verdict│          │
│   │ • Store citation│      │ • Stake % calc  │      │ • Recommendation│           │
│   └─────────────────┘      └─────────────────┘      └─────────────────┘           │
│                                                                                     │
│   OUTPUT:                                                                          │
│   {                                                                                │
│     type: "DISTRESS_SELLING" | "ROUTINE_BLOCK",                                   │
│     confidence: 85%,                                                               │
│     filing_citation: "NSE/BD/2026-03-26/RELIANCE",                                │
│     recommendation: { action: "AVOID", reason: "Promoter exit signal" }           │
│   }                                                                                │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### Agent 2: Technical Breakout Detection

> **Goal:** Pattern recognition with conflicting signal resolution (RSI vs Momentum)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                        TECHNICAL BREAKOUT DETECTION AGENT                           │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   INPUT: Symbol (e.g., "INFY")                                                     │
│                                                                                     │
│   ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐           │
│   │                 │      │                 │      │                 │           │
│   │  STEP 1         │ ───► │  STEP 2         │ ───► │  STEP 3         │           │
│   │  Data Fetch     │      │  Technical Calc │      │  Signal Resolve │           │
│   │                 │      │                 │      │                 │           │
│   └─────────────────┘      └─────────────────┘      └─────────────────┘           │
│          │                        │                        │                       │
│          ▼                        ▼                        ▼                       │
│   ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐           │
│   │ • 90-day OHLCV  │      │ • RSI (14)      │      │ • Conflicting   │           │
│   │ • Live quote    │      │ • MA20/MA50     │      │   signal matrix │           │
│   │ • Volume data   │      │ • 52-week high  │      │ • LLM reasoning │           │
│   │                 │      │ • Volume surge  │      │ • Confidence %  │           │
│   └─────────────────┘      └─────────────────┘      └─────────────────┘           │
│                                                                                     │
│   CONFLICT RESOLUTION EXAMPLE:                                                     │
│   ┌─────────────────────────────────────────────────────────────────────────────┐ │
│   │  Signal          │ Status      │ Implication                                │ │
│   ├─────────────────────────────────────────────────────────────────────────────┤ │
│   │  52-Week High    │ BREAKOUT ✅ │ Bullish momentum confirmed                 │ │
│   │  RSI             │ 78 (HIGH) ⚠ │ Overbought — potential pullback            │ │
│   │  Volume          │ 2.3x AVG ✅ │ Strong conviction                          │ │
│   ├─────────────────────────────────────────────────────────────────────────────┤ │
│   │  AI VERDICT: "Valid breakout but reduce position size due to RSI > 70"     │ │
│   └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### Agent 3: Portfolio-Aware News Prioritization

> **Goal:** Dynamic P&L impact assessment of macro events on user holdings

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                      PORTFOLIO-AWARE NEWS PRIORITIZATION AGENT                      │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   INPUT: User ID (authenticated)                                                   │
│                                                                                     │
│   ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐           │
│   │                 │      │                 │      │                 │           │
│   │  STEP 1         │ ───► │  STEP 2         │ ───► │  STEP 3         │           │
│   │  Portfolio Load │      │  News Ingest    │      │  Impact Rank    │           │
│   │                 │      │                 │      │                 │           │
│   └─────────────────┘      └─────────────────┘      └─────────────────┘           │
│          │                        │                        │                       │
│          ▼                        ▼                        ▼                       │
│   ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐           │
│   │ • Query DB for  │      │ • Fetch macro   │      │ • Calculate     │           │
│   │   user holdings │      │   & sector news │      │   estimated P&L │           │
│   │ • Map to sectors│      │ • Match sectors │      │ • Rank by       │           │
│   │ • Calc exposure │      │   to holdings   │      │   materiality   │           │
│   └─────────────────┘      └─────────────────┘      └─────────────────┘           │
│                                                                                     │
│   OUTPUT EXAMPLE:                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────────────┐ │
│   │ Rank │ Event                    │ Holdings Hit    │ Impact       │ Level   │ │
│   ├─────────────────────────────────────────────────────────────────────────────┤ │
│   │  1   │ RBI cuts Repo Rate 25bps │ HDFCBANK, SBIN  │ +₹2,340      │ 🔴 HIGH │ │
│   │  2   │ IT sector guidance weak  │ INFY, TCS       │ -₹1,850      │ 🟡 MED  │ │
│   │  3   │ Crude oil prices drop    │ ONGC            │ -₹420        │ 🟢 LOW  │ │
│   └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                            REQUEST LIFECYCLE                                        │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   T+0 ──► User clicks "Analyze RELIANCE" on Opportunity Radar                      │
│           │                                                                         │
│   T+1 ──► POST /api/ai/bulk-deal?symbol=RELIANCE                                   │
│           │                                                                         │
│   T+2 ──► Auth middleware validates JWT                                            │
│           │                                                                         │
│   T+3 ──► AI Controller → Agent Orchestrator                                       │
│           │                                                                         │
│           ├──────────────────────────────────────────────────────────┐             │
│           │                    PARALLEL DATA FETCH                    │             │
│           │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │             │
│           │  │ NSE Bulk    │  │ Finnhub     │  │ NewsData.io │      │             │
│           │  │ Deals API   │  │ Quote API   │  │ News API    │      │             │
│           │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘      │             │
│           │         └────────────────┼────────────────┘              │             │
│           │                          ▼                               │             │
│           ├──────────────────────────────────────────────────────────┘             │
│           │                                                                         │
│   T+4 ──► Data aggregation & enrichment                                            │
│           │                                                                         │
│   T+5 ──► Groq LLM call with structured prompt                                     │
│           │                                                                         │
│   T+6 ──► Parse AI response, build alert JSON                                      │
│           │                                                                         │
│   T+7 ──► HTTP 200 → Frontend                                                      │
│           │                                                                         │
│   T+8 ──► Render alert card to user                                                │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## ⚠️ Error Handling

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                            ERROR HANDLING STRATEGY                                  │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   ┌────────────────────┐   ┌────────────────────┐   ┌────────────────────┐        │
│   │   EXTERNAL API     │   │   LLM SERVICE      │   │   DATABASE         │        │
│   │   FAILURE          │   │   FAILURE          │   │   FAILURE          │        │
│   ├────────────────────┤   ├────────────────────┤   ├────────────────────┤        │
│   │                    │   │                    │   │                    │        │
│   │  NSE API Timeout   │   │  Groq Rate Limit   │   │  Portfolio Empty   │        │
│   │        │           │   │        │           │   │        │           │        │
│   │        ▼           │   │        ▼           │   │        ▼           │        │
│   │  ┌────────────┐    │   │  ┌────────────┐    │   │  ┌────────────┐    │        │
│   │  │ Return []  │    │   │  │ Try next   │    │   │  │ Use demo   │    │        │
│   │  │ Log warn   │    │   │  │ model in   │    │   │  │ portfolio  │    │        │
│   │  │ Continue   │    │   │  │ 40+ chain  │    │   │  │ (8 stocks) │    │        │
│   │  └────────────┘    │   │  └────────────┘    │   │  └────────────┘    │        │
│   │                    │   │                    │   │                    │        │
│   └────────────────────┘   └────────────────────┘   └────────────────────┘        │
│                                                                                     │
│   ┌─────────────────────────────────────────────────────────────────────────────┐  │
│   │                         GROQ MODEL FALLBACK CHAIN                           │  │
│   ├─────────────────────────────────────────────────────────────────────────────┤  │
│   │                                                                             │  │
│   │   llama-3.3-70b  ──► llama-3.1-70b ──► llama-3.1-8b ──► mixtral-8x7b ──►   │  │
│   │                                                                             │  │
│   │   ──► gemma2-9b ──► ... (40+ models) ──► Raw data response (no AI)         │  │
│   │                                                                             │  │
│   └─────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                     │
│   RESILIENCE PRINCIPLES:                                                           │
│   ┌─────────────────────────────────────────────────────────────────────────────┐  │
│   │  ✅ Never crash — always return partial/degraded results                    │  │
│   │  ✅ Log all failures for debugging (console.warn)                           │  │
│   │  ✅ Fallback data enables demo mode without API keys                        │  │
│   │  ✅ No retry loops — fail fast, move to fallback                            │  │
│   │  ✅ User-facing errors are generic                                          │  │
│   └─────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔗 Tool Integrations

| Service | Purpose | Rate Limit | Fallback |
|---------|---------|------------|----------|
| **NSE India** | Bulk deals, insider trades, SAST/PIT | ~100/min | Empty array |
| **Finnhub** | Real-time quotes, OHLCV, profiles | 60/min | Cached/null |
| **NewsData.io** | Indian business news | 200/day | Mock events |
| **Groq LLM** | AI reasoning & analysis | 30/min | 40+ model chain |
| **PostgreSQL** | User data, portfolios | N/A | Demo portfolio |

---

## 🔐 Security

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              SECURITY ARCHITECTURE                                  │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                   │
│   │  🔑 API KEYS    │  │  🛡️ AUTH        │  │  ✅ VALIDATION  │                   │
│   ├─────────────────┤  ├─────────────────┤  ├─────────────────┤                   │
│   │ • Stored in     │  │ • JWT-based     │  │ • Symbol:       │                   │
│   │   .env only     │  │ • User ID from  │  │   alphanumeric  │                   │
│   │ • Never exposed │  │   token only    │  │   uppercase     │                   │
│   │   to frontend   │  │ • Per-user      │  │ • No PII sent   │                   │
│   │                 │  │   portfolio     │  │   to LLM        │                   │
│   └─────────────────┘  └─────────────────┘  └─────────────────┘                   │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `backend/src/services/aiAgentService.js` | Core orchestrator, 3-step pipeline |
| `backend/src/services/marketDataService.js` | External API integrations |
| `backend/src/services/groqService.js` | LLM wrapper with 40+ fallbacks |
| `backend/src/controllers/aiController.js` | REST endpoint handlers |
| `frontend/src/pages/OpportunityRadar.jsx` | Agent output display |

---

## ✨ Key Differentiators

| Feature | Description |
|---------|-------------|
| **3+ Autonomous Steps** | Each agent completes multi-step reasoning without human intervention |
| **Source Citation** | All recommendations cite NSE filing references |
| **Conflict Resolution** | Breakout agent resolves RSI vs momentum contradictions |
| **Portfolio-Aware** | News impact calculated on actual user holdings |
| **Graceful Degradation** | Works in demo mode without any API keys |

---

**ArthaNova** — Institutional-grade intelligence for retail Indian investors.
