# ArthaNova AI Agent Architecture

## Executive Summary

ArthaNova is an AI-powered financial intelligence platform for Indian retail investors. The system employs a **3-step autonomous agentic pipeline** with specialized agents for bulk deal analysis, technical breakout detection, and portfolio-aware news prioritization.

---

## System Architecture Diagram

```
                                    +------------------+
                                    |   REACT FRONTEND |
                                    |   (Port 5173)    |
                                    +--------+---------+
                                             |
                                             | REST API
                                             v
+============================================================================================+
|                              EXPRESS.JS BACKEND (Port 5000)                                |
+============================================================================================+
|                                                                                            |
|  +-----------------------------------------------------------------------------------+     |
|  |                         AI CONTROLLER (aiController.js)                           |     |
|  |  Routes: /api/ai/bulk-deal | /api/ai/breakout | /api/ai/portfolio-news | /radar   |     |
|  +-----------------------------------------------------------------------------------+     |
|                                             |                                              |
|                                             v                                              |
|  +-----------------------------------------------------------------------------------+     |
|  |                    AGENT ORCHESTRATOR (aiAgentService.js)                         |     |
|  |                                                                                   |     |
|  |   +-------------------------------------------------------------------------+     |     |
|  |   |              3-STEP AUTONOMOUS AGENTIC PIPELINE                         |     |     |
|  |   |                                                                         |     |     |
|  |   |   STEP 1              STEP 2                 STEP 3                     |     |     |
|  |   |   +----------+        +------------+         +---------------+          |     |     |
|  |   |   | SIGNAL   |  --->  | CONTEXT    |  --->   | AI ALERT      |          |     |     |
|  |   |   | DETECTION|        | ENRICHMENT |         | GENERATION    |          |     |     |
|  |   |   +----------+        +------------+         +---------------+          |     |     |
|  |   |       |                    |                       |                    |     |     |
|  |   |       v                    v                       v                    |     |     |
|  |   |   - NSE Bulk Deals    - User Portfolio        - Groq LLM Call           |     |     |
|  |   |   - Insider Trades    - News Sentiment        - Risk Assessment         |     |     |
|  |   |   - Technical Scans   - Sector Mapping        - Action Formulation      |     |     |
|  |   +-------------------------------------------------------------------------+     |     |
|  |                                                                                   |     |
|  +-----------------------------------------------------------------------------------+     |
|                                             |                                              |
|           +---------------+-----------------+-----------------+---------------+            |
|           |               |                 |                 |               |            |
|           v               v                 v                 v               v            |
|  +---------------+ +---------------+ +---------------+ +---------------+ +----------+      |
|  | BULK DEAL     | | BREAKOUT      | | PORTFOLIO     | | CHART PATTERN | | GROQ     |      |
|  | AGENT         | | AGENT         | | NEWS AGENT    | | AGENT         | | SERVICE  |      |
|  | (Scenario 1)  | | (Scenario 2)  | | (Scenario 3)  | | (Technical)   | | (LLM)    |      |
|  +---------------+ +---------------+ +---------------+ +---------------+ +----------+      |
|           |               |                 |                 |               |            |
+===========|===============|=================|=================|===============|============+
            |               |                 |                 |               |
            v               v                 v                 v               v
+============================================================================================+
|                              EXTERNAL DATA SERVICES                                        |
+============================================================================================+
|                                                                                            |
|  +------------------+  +------------------+  +------------------+  +------------------+    |
|  |   NSE INDIA      |  |   FINNHUB        |  |   NEWSDATA.IO   |  |   GROQ AI        |    |
|  |   (Official API) |  |   (Market Data)  |  |   (News API)    |  |   (LLM Inference)|    |
|  +------------------+  +------------------+  +------------------+  +------------------+    |
|  | - Bulk Deals     |  | - Real-time      |  | - Indian         |  | - llama-3.3-70b  |    |
|  | - Insider Trades |  |   Quotes         |  |   Business       |  | - 40+ fallback   |    |
|  | - SAST/PIT       |  | - OHLCV Candles  |  |   News           |  |   models         |    |
|  |   Filings        |  | - Company        |  | - Sentiment      |  | - Low temp (0.3) |    |
|  |                  |  |   Profiles       |  |   Keywords       |  |   for reasoning  |    |
|  +------------------+  +------------------+  +------------------+  +------------------+    |
|                                                                                            |
+============================================================================================+
            |
            v
+============================================================================================+
|                              PERSISTENCE LAYER                                             |
+============================================================================================+
|                                                                                            |
|     +-----------------------+           +------------------------------------------+       |
|     |   POSTGRESQL (Prisma) |           |   IN-MEMORY CACHE                       |       |
|     +-----------------------+           +------------------------------------------+       |
|     | - Users               |           | - API Response Cache (TTL: 5-15 min)    |       |
|     | - Portfolios          |           | - Rate Limit Tracking                   |       |
|     | - Holdings            |           | - Session Data                          |       |
|     | - Transactions        |           +------------------------------------------+       |
|     +-----------------------+                                                             |
|                                                                                            |
+============================================================================================+
```

---

## Agent Roles & Responsibilities

### 1. Bulk Deal Analysis Agent (Track 6 - Scenario 1)

**Purpose:** Detect distress selling vs. routine institutional block trades from NSE filings.

```
+------------------------------------------------------------------+
|                    BULK DEAL ANALYSIS AGENT                       |
+------------------------------------------------------------------+
|                                                                   |
|  INPUT:  Stock Symbol (e.g., "JUBLFOOD")                         |
|                                                                   |
|  AUTONOMOUS STEPS:                                               |
|  +-------------------------------------------------------------+ |
|  | Step 1: FILING RETRIEVAL                                    | |
|  |   - Fetch NSE bulk deal filings via /api/bulk-deals         | |
|  |   - Extract: clientName, buySell, quantity, price, date     | |
|  |   - Parse filing reference (NSE-BD-YYYY-MM-DD)              | |
|  +-------------------------------------------------------------+ |
|                           |                                       |
|                           v                                       |
|  +-------------------------------------------------------------+ |
|  | Step 2: CONTEXT CROSS-REFERENCE                             | |
|  |   - Fetch related news for the symbol                       | |
|  |   - Analyze promoter vs. institutional classification       | |
|  |   - Check historical deal patterns for same client          | |
|  +-------------------------------------------------------------+ |
|                           |                                       |
|                           v                                       |
|  +-------------------------------------------------------------+ |
|  | Step 3: AI DISTRESS ANALYSIS (Groq LLM)                     | |
|  |   - System: "SEBI-certified Indian market analyst"          | |
|  |   - Determine: DISTRESS SELLING vs ROUTINE BLOCK            | |
|  |   - Cross-reference with earnings seasonality               | |
|  |   - Generate risk-adjusted recommendation                   | |
|  +-------------------------------------------------------------+ |
|                                                                   |
|  OUTPUT:                                                         |
|  {                                                               |
|    type: "BULK_DEAL_SIGNAL",                                     |
|    severity: "MEDIUM" | "HIGH",                                  |
|    filing_citation: "NSE/LIST/BD/2026-03-26/JUBLFOOD",          |
|    deal_summary: { symbol, client, action, quantity, price },    |
|    ai_analysis: "Detailed filing-based risk analysis...",        |
|    recommendation: { action, confidence, stop_loss, target }     |
|  }                                                               |
+------------------------------------------------------------------+
```

### 2. Technical Breakout Detection Agent (Track 6 - Scenario 2)

**Purpose:** Pattern recognition with conflicting signal resolution (RSI vs momentum).

```
+------------------------------------------------------------------+
|               TECHNICAL BREAKOUT DETECTION AGENT                  |
+------------------------------------------------------------------+
|                                                                   |
|  INPUT:  Stock Symbol (e.g., "INFY")                             |
|                                                                   |
|  AUTONOMOUS STEPS:                                               |
|  +-------------------------------------------------------------+ |
|  | Step 1: REAL-TIME DATA FETCH                                | |
|  |   - Finnhub OHLCV candles (90 days)                         | |
|  |   - Live quote (price, change %)                            | |
|  |   - Volume data for conviction analysis                     | |
|  +-------------------------------------------------------------+ |
|                           |                                       |
|                           v                                       |
|  +-------------------------------------------------------------+ |
|  | Step 2: TECHNICAL CALCULATION                               | |
|  |   - RSI (14-period) calculation                             | |
|  |   - MA20 / MA50 crossover detection                         | |
|  |   - 52-week high breakout check                             | |
|  |   - Volume surge ratio (vs 20-day avg)                      | |
|  |   - Pattern detection: Golden Cross, Death Cross, Reversal  | |
|  +-------------------------------------------------------------+ |
|                           |                                       |
|                           v                                       |
|  +-------------------------------------------------------------+ |
|  | Step 3: CONFLICTING SIGNAL RESOLUTION (Groq LLM)            | |
|  |   - CRITICAL: Breakout + RSI Overbought = Bull Trap Risk    | |
|  |   - Volume confirmation vs low-conviction breakout          | |
|  |   - Historical success rate estimation                      | |
|  |   - Balanced recommendation (NOT binary buy/sell)           | |
|  +-------------------------------------------------------------+ |
|                                                                   |
|  OUTPUT:                                                         |
|  {                                                               |
|    type: "TECHNICAL_BREAKOUT_ANALYSIS",                          |
|    is_breakout: true/false,                                      |
|    live_data: { price, rsi, volume_ratio, ma20, ma50 },         |
|    conflicting_signals: [                                        |
|      { name: "RSI", status: "OVERBOUGHT", implication: "..." },  |
|      { name: "Volume", status: "HIGH", implication: "..." }      |
|    ],                                                            |
|    recommendation: { action, entry_zone, target, stop_loss }     |
|  }                                                               |
+------------------------------------------------------------------+
```

### 3. Portfolio-Aware News Prioritization Agent (Track 6 - Scenario 3)

**Purpose:** Dynamic P&L impact assessment of macro events on user holdings.

```
+------------------------------------------------------------------+
|            PORTFOLIO-AWARE NEWS PRIORITIZATION AGENT              |
+------------------------------------------------------------------+
|                                                                   |
|  INPUT:  User ID (authenticated)                                 |
|                                                                   |
|  AUTONOMOUS STEPS:                                               |
|  +-------------------------------------------------------------+ |
|  | Step 1: PORTFOLIO RETRIEVAL                                 | |
|  |   - Query PostgreSQL: portfolios + holdings tables          | |
|  |   - Calculate per-stock value and total portfolio value     | |
|  |   - Map holdings to sectors (Banking, IT, Metals, etc.)     | |
|  +-------------------------------------------------------------+ |
|                           |                                       |
|                           v                                       |
|  +-------------------------------------------------------------+ |
|  | Step 2: NEWS EVENT INGESTION                                | |
|  |   - Fetch macro/sector news from NewsData.io                | |
|  |   - Extract affected_sectors from each news event           | |
|  |   - Match sectors to user's holdings                        | |
|  +-------------------------------------------------------------+ |
|                           |                                       |
|                           v                                       |
|  +-------------------------------------------------------------+ |
|  | Step 3: P&L IMPACT QUANTIFICATION (Groq LLM)                | |
|  |   - Calculate estimated_pnl_impact per event                | |
|  |   - Compute portfolio_exposure_pct for affected holdings    | |
|  |   - Rank by materiality: CRITICAL > HIGH > MEDIUM           | |
|  |   - Generate portfolio-specific (not generic) guidance      | |
|  +-------------------------------------------------------------+ |
|                                                                   |
|  OUTPUT:                                                         |
|  {                                                               |
|    type: "PORTFOLIO_NEWS_PRIORITIZATION",                        |
|    portfolio_summary: { total_stocks, total_value, symbols },    |
|    prioritized_alerts: [                                         |
|      {                                                           |
|        rank: 1,                                                  |
|        event: "RBI cuts Repo Rate by 25 bps",                   |
|        affected_holdings: ["HDFCBANK", "SBIN"],                  |
|        estimated_pnl_impact: "+₹2,340",                         |
|        portfolio_exposure_pct: "28.5%",                          |
|        materiality: "CRITICAL"                                   |
|      }                                                           |
|    ],                                                            |
|    ai_summary: "Portfolio-specific impact analysis..."           |
|  }                                                               |
+------------------------------------------------------------------+
```

---

## Communication Flow

```
+-----------------------------------------------------------------------------+
|                        INTER-AGENT COMMUNICATION                            |
+-----------------------------------------------------------------------------+
|                                                                             |
|    USER REQUEST                                                             |
|         |                                                                   |
|         v                                                                   |
|    +--------------------+                                                   |
|    | API GATEWAY        |  (Express Router + Auth Middleware)               |
|    +--------------------+                                                   |
|         |                                                                   |
|         v                                                                   |
|    +--------------------+     +--------------------+                        |
|    | ORCHESTRATOR       |<--->| MARKET DATA SERVICE|                        |
|    | (aiAgentService)   |     | (marketDataService)|                        |
|    +--------------------+     +--------------------+                        |
|         |                            |                                      |
|         |   Parallel Dispatch        |   Data Fetching                      |
|         |                            |                                      |
|    +----+----+----+                  +----+----+----+                       |
|    |    |    |    |                  |    |    |    |                       |
|    v    v    v    v                  v    v    v    v                       |
|  +--+ +--+ +--+ +--+              +----+ +----+ +----+ +----+               |
|  |BD| |BO| |PN| |CP|              |NSE | |FH  | |NEWS| |GROQ|               |
|  +--+ +--+ +--+ +--+              +----+ +----+ +----+ +----+               |
|                                                                             |
|  Agents:                         Data Sources:                              |
|  BD = Bulk Deal Agent            NSE  = NSE India API                       |
|  BO = Breakout Agent             FH   = Finnhub                             |
|  PN = Portfolio News Agent       NEWS = NewsData.io                         |
|  CP = Chart Pattern Agent        GROQ = Groq LLM                            |
|                                                                             |
+-----------------------------------------------------------------------------+
|                                                                             |
|  COMMUNICATION PATTERN: Request-Response (Synchronous)                      |
|  SERIALIZATION: JSON                                                        |
|  PROTOCOL: HTTP/REST (internal) + HTTPS (external APIs)                     |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## Tool Integrations

| Tool/Service | Purpose | Rate Limits | Fallback Strategy |
|--------------|---------|-------------|-------------------|
| **NSE India API** | Bulk deals, insider trades, SAST/PIT filings | ~100 req/min | Empty array + log warning |
| **Finnhub** | Real-time quotes, OHLCV candles, company profiles | 60 req/min (free) | Null response + cache |
| **NewsData.io** | Indian business news, sentiment keywords | 200 req/day | Hardcoded example events |
| **Groq LLM** | AI reasoning, alert generation, conflict resolution | 30 req/min | 40+ model fallback chain |
| **PostgreSQL** | User portfolios, holdings, transaction history | N/A | Demo portfolio fallback |

### Groq Model Fallback Chain

```
PRIMARY:     llama-3.3-70b-versatile
     |
     v (on rate limit / 404)
FALLBACK 1:  llama-3.1-70b-versatile
     |
     v
FALLBACK 2:  llama-3.1-8b-instant
     |
     v
FALLBACK 3:  mixtral-8x7b-32768
     |
     v
...          (40+ models in chain)
```

---

## Error Handling Logic

```
+-----------------------------------------------------------------------------+
|                          ERROR HANDLING STRATEGY                            |
+-----------------------------------------------------------------------------+
|                                                                             |
|  +-----------------+     +------------------+     +-------------------+      |
|  | API LAYER       |     | SERVICE LAYER    |     | EXTERNAL CALLS    |      |
|  +-----------------+     +------------------+     +-------------------+      |
|  | try/catch wrap  |     | Graceful degrade |     | Timeout: 10-15s   |      |
|  | HTTP 500 + msg  |     | Fallback data    |     | Retry: None       |      |
|  | Error logging   |     | Continue flow    |     | Log + continue    |      |
|  +-----------------+     +------------------+     +-------------------+      |
|                                                                             |
+-----------------------------------------------------------------------------+

ERROR SCENARIOS & RESPONSES:

1. NSE API Timeout/Failure
   +---> Log warning: "NSE bulk deals fetch failed"
   +---> Return: [] (empty array)
   +---> Pipeline: CONTINUES with other signals

2. Finnhub Rate Limit
   +---> Log warning: "Finnhub quote failed for {symbol}"
   +---> Return: null
   +---> Fallback: Use last cached value or skip enrichment

3. Groq LLM Failure (429/404)
   +---> Iterate through 40+ model fallback chain
   +---> If ALL fail: Return raw signal data without AI analysis
   +---> Error message: "All 40+ Groq models failed"

4. Database Connection Error
   +---> Log error: "DB portfolio fetch failed"
   +---> Fallback: Demo portfolio for development/testing
   +---> User notification: None (silent)

5. User Portfolio Empty
   +---> Fallback: 8-stock demo portfolio (HDFCBANK, INFY, etc.)
   +---> Continue: Full pipeline with demo data

+-----------------------------------------------------------------------------+
|                        RESILIENCE PRINCIPLES                                |
+-----------------------------------------------------------------------------+
|                                                                             |
|  1. NEVER crash the pipeline - always return partial/degraded results       |
|  2. LOG all failures for debugging (console.warn)                           |
|  3. FALLBACK data enables demo mode without live API keys                   |
|  4. NO retry loops - fail fast, move to fallback                            |
|  5. USER-facing errors are generic (HTTP 500 + message)                     |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## Data Flow: Complete Request Lifecycle

```
EXAMPLE: User requests Bulk Deal Analysis for "RELIANCE"

TIME  STEP                          ACTION
----  ----------------------------  -----------------------------------------
T+0   Frontend Request              POST /api/ai/bulk-deal?symbol=RELIANCE
T+1   Auth Middleware               Validate JWT token
T+2   AI Controller                 Call aiAgentService.analyzeBulkDealSignal()
|
T+3   [STEP 1] Data Fetch
      |-- NSE API Call              GET nseindia.com/api/bulk-deals
      |-- Parse Response            Extract RELIANCE deals from array
      |-- News Fetch                GET newsdata.io/api/1/news?q=RELIANCE
|
T+4   [STEP 2] Enrichment
      |-- Calculate stake size      quantity * price = ₹4.2 Cr
      |-- Determine deal type       Promoter SELL = Higher scrutiny
      |-- Sentiment analysis        News titles -> bullish/bearish
|
T+5   [STEP 3] AI Reasoning
      |-- Build Groq prompt         Filing data + news context
      |-- Call Groq API             POST groq/chat/completions
      |-- Parse AI response         Extract distress vs routine verdict
|
T+6   Response Assembly
      |-- Build JSON response       type, filing_citation, ai_analysis
      |-- Add orchestration data    agents_used, execution_time
|
T+7   API Response                  HTTP 200 + JSON payload
|
T+8   Frontend Render               Display alert card to user
```

---

## Security Considerations

```
+-----------------------------------------------------------------------------+
|                           SECURITY ARCHITECTURE                             |
+-----------------------------------------------------------------------------+
|                                                                             |
|  1. API KEYS                                                                |
|     - Stored in environment variables (.env)                                |
|     - Never exposed to frontend                                             |
|     - Separate keys per service (Finnhub, Groq, News)                       |
|                                                                             |
|  2. AUTHENTICATION                                                          |
|     - JWT-based auth for all /api/ai/* endpoints                            |
|     - User ID extracted from token for portfolio queries                    |
|                                                                             |
|  3. INPUT VALIDATION                                                        |
|     - Symbol sanitization (uppercase, alphanumeric only)                    |
|     - User ID from auth token (not user input)                              |
|                                                                             |
|  4. RATE LIMITING                                                           |
|     - External API calls: Handled by fallback mechanism                     |
|     - Internal API: Express rate limiter recommended                        |
|                                                                             |
|  5. DATA PRIVACY                                                            |
|     - Portfolio data queried per-user (no cross-user access)                |
|     - No PII sent to external LLM (only symbols/numbers)                    |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## Key Files Reference

| File | LOC | Purpose |
|------|-----|---------|
| `backend/src/services/aiAgentService.js` | 728 | Core agent logic, 3-step pipeline |
| `backend/src/services/marketDataService.js` | 408 | External API integrations |
| `backend/src/services/groqService.js` | 223 | Groq LLM wrapper with fallback |
| `backend/src/controllers/aiController.js` | 50 | REST endpoint handlers |

---

## Conclusion

ArthaNova's AI agent architecture prioritizes:

1. **Autonomous Multi-Step Reasoning** - Each agent completes 3+ sequential analysis steps
2. **Real Data Integration** - Live NSE filings, Finnhub market data, news APIs
3. **Graceful Degradation** - Pipeline never crashes; falls back to demo data
4. **Portfolio-Aware Intelligence** - User holdings inform every analysis
5. **Source Citation** - All recommendations cite filing references and data sources

This architecture enables retail Indian investors to receive institutional-grade intelligence from regulatory filings, technical patterns, and macro events - all processed through a transparent, auditable AI pipeline.
