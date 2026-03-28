# Backend - API Routes (api.js) - Complete Explanation (Hinglish Mein)

## File Path
`backend/src/routes/api.js`

---

## 📌 IMPORTS (Lines 1-12)

```javascript
import express from 'express';
```
✅ **What it does:** Express framework for creating routers

```javascript
import authRouter from './auth.js';
import stocksRouter from './stocks.js';
import userRouter from './user.js';
import portfolioRouter from './portfolio.js';
import aiEngineRouter from './ai-engine.js';
import adminRouter from './admin.js';
import googleOtpAuthRouter from './google-otp-auth.js';
import { newsRouter, ipoRouter, insiderRouter, dealsRouter, stockRouter } from './marketData.js';
import backtestRouter from './backtest.js';
```

✅ **What it does:** Import all sub-routers
- Each router handles a specific feature area
- Example: `authRouter` = login, register, logout, etc.

```javascript
import { apiCache } from '../middlewares/cache.js';
import notificationsRouter from './notifications.js';
```

✅ **What it does:** Import caching middleware + notifications router

---

## 🔗 CREATE MAIN API ROUTER (Line 14)

```javascript
const apiRouter = express.Router();
```

✅ **What it does:** Create main router that aggregates all sub-routers
- This router will be mounted at `/api/v1` in app.js
- Acts as a hub for all API routes

---

## 🛣️ ROUTE MOUNTING (Lines 16-34)

### Auth Routes (Lines 17-18)

```javascript
apiRouter.use('/auth_debug', authRouter);
apiRouter.use('/auth/google', googleOtpAuthRouter);
```

✅ **What it does:**
- `/auth_debug` = regular auth (legacy debug endpoint)
- `/auth/google` = Google OAuth + OTP endpoints
- Full path: `/api/v1/auth/login`, `/api/v1/auth/google/otp-request`

### Stocks Routes (Line 20)

```javascript
apiRouter.use('/stocks', apiCache(300), stocksRouter);
```

✅ **What it does:**
- Mount stocks router under `/stocks`
- **apiCache(300)** = cache responses for 300 seconds (5 minutes)
- Before sending to stocksRouter, add caching middleware
- Reduces database load for repeated queries
- Example: `/api/v1/stocks/INFY` returns cached 5 min old data

**Why cache stocks?**
- Stock prices change every second
- Cache 5 min old data = 95% fewer DB queries
- User gets near-real-time data with much less load

### Users Routes (Line 21)

```javascript
apiRouter.use('/users', userRouter);
```

✅ **What it does:**
- User profile management, settings, preferences
- Not cached (user-specific data)

### Portfolio Routes (Line 22)

```javascript
apiRouter.use('/portfolio', portfolioRouter);
```

✅ **What it does:**
- User's investment portfolio
- Holdings, allocation, risk, rebalancing
- Not cached (user-specific)

### AI Engine Routes (Line 23)

```javascript
apiRouter.use('/ai', aiEngineRouter);
```

✅ **What it does:**
- AI agent endpoints for analysis
- Chat, research, insights

### Market Data Routes (Lines 25-27)

```javascript
apiRouter.use('/news', apiCache(300), newsRouter);
apiRouter.use('/ipo', ipoRouter);
apiRouter.use('/insider', insiderRouter);
```

✅ **What it does:**
- `/news` = stock news, cached 5 min
- `/ipo` = IPO information
- `/insider` = insider trading data
- `/deals` = M&A, partnerships

### Market Data API Wrapper (Line 29)

```javascript
apiRouter.use('/market-data', apiCache(300), stockRouter);
```

✅ **What it does:**
- Unified endpoint for all market data with caching
- Wraps various data sources

### Admin Routes (Line 30)

```javascript
apiRouter.use('/admin', adminRouter);
```

✅ **What it does:**
- Admin-only endpoints (user management, system settings, etc.)

### Placeholder Routes (Lines 31, 33)

```javascript
apiRouter.use('/alerts', (req, res) => res.json({ message: 'Alerts Router Placeholder' }));
apiRouter.use('/watchlist', (req, res) => res.json({ message: 'Watchlist Router Placeholder' }));
```

✅ **What it does:**
- Placeholder endpoints not yet implemented
- Return JSON message instead of error
- Useful for API documentation

### Backtest Routes (Line 32)

```javascript
apiRouter.use('/backtest', backtestRouter);
```

✅ **What it does:**
- Backtesting strategies endpoint
- Simulate trading strategies on historical data

### Notifications Routes (Line 34)

```javascript
apiRouter.use('/notifications', notificationsRouter);
```

✅ **What it does:**
- User notifications (price alerts, news alerts, etc.)

---

## 📤 EXPORT (Line 36)

```javascript
export default apiRouter;
```

✅ **What it does:** Export to be mounted in app.js at `/api/v1`

---

## 🗺️ COMPLETE API ROUTE MAP

```
/api/v1
├─ /auth_debug/
│  ├─ POST /login
│  ├─ POST /register
│  ├─ POST /logout
│  └─ ...
│
├─ /auth/google/
│  ├─ POST /otp-request
│  ├─ POST /verify-otp
│  └─ ...
│
├─ /stocks/  [CACHED 5 min]
│  ├─ GET /INFY
│  ├─ GET /TCS
│  └─ GET /{symbol}
│
├─ /users/
│  ├─ GET /me
│  ├─ PUT /profile
│  └─ ...
│
├─ /portfolio/
│  ├─ GET /holdings
│  ├─ POST /add-stock
│  ├─ PUT /rebalance
│  └─ ...
│
├─ /ai/
│  ├─ POST /chat
│  ├─ POST /analyze
│  └─ ...
│
├─ /news/  [CACHED 5 min]
│  ├─ GET /latest
│  ├─ GET /stock/INFY
│  └─ ...
│
├─ /ipo/
│  ├─ GET /list
│  └─ ...
│
├─ /insider/
│  ├─ GET /trades
│  └─ ...
│
├─ /deals/
│ ├─ GET /list
│  └─ ...
│
├─ /market-data/  [CACHED 5 min]
│  └─ GET /...
│
├─ /admin/
│  ├─ GET /users
│  ├─ PUT /users/{id}
│  └─ ...
│
├─ /alerts/
│  └─ Placeholder
│
├─ /watchlist/
│  └─ Placeholder
│
├─ /backtest/
│  ├─ POST /strategy
│  └─ ...
│
└─ /notifications/
   ├─ GET /my-notifications
   └─ ...
```

---

## ⚡ CACHING STRATEGY

| Endpoint | Cache | Why |
|----------|-------|-----|
| `/stocks/*` | 5 min | Stock data changes every second, 5 min old is fine |
| `/news/*` | 5 min | News updated periodically, not real-time critical |
| `/market-data/*` | 5 min | Aggregated data, slightly stale is acceptable |
| `/users/*` | None | User-specific, must be current |
| `/portfolio/*` | None | User-specific, financial data must be current |
| `/ai/*` | None | AI responses time-sensitive |
| `/admin/*` | None | Admin data must be current |

---

## 🔄 REQUEST FLOW

```
Browser Request: GET /api/v1/stocks/INFY
   ↓
Express routes to apiRouter
   ↓
apiRouter routes to /stocks
   ↓
apiCache(300) middleware
   ├─ Check: Is this cached & not expired?
   ├─ YES? Return cached response (skip DB)
   └─ NO? Continue to stocksRouter
   ↓
stocksRouter handles request
   ├─ Query database for INFY data
   ├─ apiCache saves response
   └─ Send response to frontend
```

---

## 💡 KEY PATTERNS

**Middleware in Chain:**
```javascript
apiRouter.use('/stocks', apiCache(300), stocksRouter);
         // path    // middleware     // router
```
- Requests to `/stocks` first go through `apiCache(300)`
- Cache middleware can respond immediately (cached) or continue to stocksRouter

**Sub-routers:**
```javascript
// This file (api.js) is a top-level router
// Each imported router (authRouter, stocksRouter, etc.)
// is itself an express.Router() with its own routes

// Example: stocksRouter has been created on stocks.js with:
//   const stocksRouter = express.Router()
//   stocksRouter.get('/:symbol', ...)
// Then imported here and mounted at /stocks
```

---

## 🎯 DESIGN BENEFITS

✅ **Modularity:** Each feature (auth, stocks, portfolio) in separate file
✅ **Scalability:** Easy to add new routers
✅ **Caching:** Reduces database load for public data
✅ **Organization:** All routes in one place for documentation
✅ **Flexibility:** Middleware can be applied per route
✅ **Placeholders:** Easy to see what's not yet implemented

