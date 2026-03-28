# Backend - settings.js (Configuration) - Complete Line-by-Line Explanation (Hinglish Mein)

## File Path
`backend/src/config/settings.js`

---

## 📌 IMPORTS (Lines 1-3)

```javascript
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
```

✅ **What it does:**
- `dotenv` = load environment variables from `.env` file
- `dotenv.config()` = read `.env` and populate `process.env`
- `path` = filesystem path utilities (imported but not always used)

**Why?**
- Sensitive data (API keys, database URLs) shouldn't be in code
- Different environments (dev/production) have different settings
- `.env` file is gitignored (not committed to GitHub)

---

## 📋 SETTINGS OBJECT (Lines 5+)

```javascript
const settings = {
```

✅ **What it does:** Create single centralized configuration object
- Imported throughout backend
- All settings in one place for easy maintenance
- Can be overridden per environment

---

## 🏢 APP CONFIGURATION (Lines 6-8)

```javascript
  APP_NAME: process.env.APP_NAME || 'ArthaNova',
  APP_VERSION: process.env.APP_VERSION || '1.0.0',
  DEBUG: process.env.DEBUG === 'true',
```

✅ **What it does:** Basic app information
- `APP_NAME` = application name (default: ArthaNova)
- `APP_VERSION` = version string (default: 1.0.0)
- `DEBUG` = boolean flag (true only if env var is literally 'true')

**Pattern:** `process.env.KEY || 'default'` = use env var or fallback

---

## 🛠️ ENVIRONMENT & PORT (Lines 9-10)

```javascript
  ENVIRONMENT: process.env.ENVIRONMENT || 'production',
  PORT: process.env.PORT || 8000,
```

✅ **What it does:**
- `ENVIRONMENT` = 'development', 'staging', or 'production'
- Used to decide: error messages, logging level, caching
- `PORT` = what port to listen on (default 8000)

**Example usage in app.js:**
```javascript
if (settings.ENVIRONMENT === 'development') {
  // Show detailed errors
} else {
  // Hide sensitive error info
}
```

---

## 🔐 SECRET KEYS (Lines 11-12)

```javascript
  SECRET_KEY: process.env.SECRET_KEY || 'dummy_secret',
```

✅ **What it does:** General secret key
- Used for encryption/signing
- Should be long random string in production
- Default 'dummy_secret' only for local testing

**⚠️ WARNING:** Never use default in production!

---

## 🌐 ALLOWED ORIGINS (Line 13)

```javascript
  ALLOWED_ORIGINS: JSON.parse(process.env.ALLOWED_ORIGINS || '["http://localhost:5173", "http://localhost:3000", "http://localhost:5174", "http://127.0.0.1:5173", "https://arthanova.vercel.app", "https://arthanova.onrender.com"]'),
```

✅ **What it does:** Define which frontend domains can call API
- CORS whitelist (allow requests from these origins)
- Parsed from JSON string in env var
- Default includes: localhost (dev), Vercel (prod), Render (prod)

**Security:**
- Only listed domains can make requests
- Prevents malicious sites from abusing API
- Must configure for new deployment

**Example `.env`:**
```
ALLOWED_ORIGINS='["http://localhost:5173", "https://arthanova.com"]'
```

---

## 🗄️ DATABASE (Line 16)

```javascript
  DATABASE_URL: process.env.DATABASE_URL || 'file:./arthanova.db',
```

✅ **What it does:** Turso database connection string
- Format: `libsql://dbname-user.turso.io?authToken=secret`
- Or local: `file:./arthanova.db`

**Used in:** db.js to connect to Turso

---

## 🎟️ JWT CONFIGURATION (Lines 19-22)

```javascript
  // JWT
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || 'dummy_jwt_secret',
  JWT_ALGORITHM: process.env.JWT_ALGORITHM || 'HS256',
  JWT_ACCESS_TOKEN_EXPIRE_MINUTES: parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRE_MINUTES || '60'),
  JWT_REFRESH_TOKEN_EXPIRE_DAYS: parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRE_DAYS || '7'),
```

✅ **What it does:** JWT token settings
- `JWT_SECRET_KEY` = signing secret (must be same to verify)
- `JWT_ALGORITHM` = HS256 (HMAC-SHA256, symmetric)
- `JWT_ACCESS_TOKEN_EXPIRE_MINUTES` = access token lifetime (60 min = 1 hour)
- `JWT_REFRESH_TOKEN_EXPIRE_DAYS` = refresh token lifetime (7 days)

**Token Lifetime:**
- Access token: 1 hour (short, for frequent API calls)
- Refresh token: 7 days (long, to get new access token)

**Example:**
```
User logs in at 10:00 AM
├─ Gets access token (expires 11:00 AM)
└─ Gets refresh token (expires next week)

At 10:55 AM, access token about to expire
├─ Send refresh token
└─ Get new access token (good until 11:55 AM)

After 7 days, refresh token expires
└─ Must login again
```

---

## 🔴 REDIS (Line 25)

```javascript
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379/0',
```

✅ **What it does:** Redis cache server URL
- Used for: user sessions (when scaled past 1 worker), caching
- Format: `redis://host:port/db`
- Default: localhost (docker)

**Future use:**
- Currently not used (single worker, in-memory sessions)
- When scaling to multiple workers, move sessions to Redis

---

## 🤖 GROQ AI (Lines 28-30)

```javascript
  // Groq AI
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',
  GROQ_MODEL: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
  GROQ_BASE_URL: process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1',
```

✅ **What it does:** LLM integration settings
- `GROQ_API_KEY` = API key from Groq (get at groq.com)
- `GROQ_MODEL` = which LLM to use (Llama 3.3 70B)
- `GROQ_BASE_URL` = API endpoint

**Used in:** AI agent service for chat/analysis

---

## 📊 MARKET DATA APIS (Lines 33-40)

```javascript
  // Market Data APIs
  NEWS_API_KEY: process.env.NEWS_API_KEY || '',
  ALPHA_VANTAGE_API_KEY: process.env.ALPHA_VANTAGE_API_KEY || '',
  POLYGON_API_KEY: process.env.POLYGON_API_KEY || '',
  MARKETSTACK_API_KEY: process.env.MARKETSTACK_API_KEY || '',
  FINNHUB_API_KEY: process.env.FINNHUB_API_KEY || '',
  RAPIDAPI_KEY: process.env.RAPIDAPI_KEY || '',
  TWELVE_DATA_API_KEY: process.env.TWELVE_DATA_API_KEY || '',
```

✅ **What it does:** 3rd-party market data API keys
- News data: `NEWS_API_KEY`
- Stock prices: `ALPHA_VANTAGE_API_KEY`, `POLYGON_API_KEY`, `TWELVEDATA_API_KEY`
- International data: `MARKETSTACK_API_KEY`
- Stock fundamentals: `FINNHUB_API_KEY`, `RAPIDAPI_KEY`

**Pattern:** Get free tier keys from these services
- Alpha Vantage (free tier: 500/day)
- Polygon.io (free tier: 5/min)
- Finnhub (free tier: 60/min)
- etc.

---

## 🎨 MEDIA APIS (Lines 43-45)

```javascript
  // Image & Video
  STABILITY_API_KEY: process.env.STABILITY_API_KEY || '',
  PIKA_API_KEY: process.env.PIKA_API_KEY || '',
```

✅ **What it does:** AI image/video generation APIs
- `STABILITY_API_KEY` = Stability.ai (image generation)
- `PIKA_API_KEY` = Pika Labs (video generation)

**Used in:** Video insights generation

---

## 📧 EMAIL CONFIGURATION (Lines 48-52)

```javascript
  // Email
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587'),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || '',
  FROM_EMAIL: process.env.FROM_EMAIL || 'noreply@arthanova.in',
```

✅ **What it does:** Email sending configuration
- `SMTP_HOST` = email server (Gmail, SendGrid, etc.)
- `SMTP_PORT` = connection port (587 = TLS, 465 = SSL)
- `SMTP_USER` = email account username
- `SMTP_PASSWORD` = email account password (or app-specific)
- `FROM_EMAIL` = sender email address

**Used in:** OTP emails, notifications, password reset

**Example for Gmail:**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password  (not your Gmail password)
FROM_EMAIL=noreply@arthanova.in
```

---

## 🔄 MORE SETTINGS (continued in file)

File continues with:
- Google OAuth settings
- Admin email whitelist
- OTP expiry
- Rate limiting
- And more...

---

## 📊 HOW SETTINGS ARE USED

### In app.js:
```javascript
import settings from './config/settings.js';

app.use(cors({
  origin: settings.ALLOWED_ORIGINS,  // Which domains allowed?
  credentials: true,
}));
```

### In index.js:
```javascript
import settings from './config/settings.js';

app.listen(settings.PORT, '0.0.0.0', () => {
  console.log(`Server on ${settings.PORT}`);
});
```

### In authController.js:
```javascript
import settings from './config/settings.js';

const client = new OAuth2Client(settings.GOOGLE_CLIENT_ID);
const isAdmin = settings.AUTHORIZED_ADMIN_EMAILS.includes(email);
```

### In db.js:
```javascript
const fullUrl = process.env.DATABASE_URL;
```

---

## 🛡️ ENVIRONMENT VARIABLE PATTERNS

### Pattern 1: String with default
```javascript
APP_NAME: process.env.APP_NAME || 'ArthaNova'
```
- Use .env value if exists, else default

### Pattern 2: Boolean string
```javascript
DEBUG: process.env.DEBUG === 'true'
```
- Only true if env var is exactly 'true'
- Env vars are always strings

### Pattern 3: JSON parsing
```javascript
ALLOWED_ORIGINS: JSON.parse(process.env.ALLOWED_ORIGINS || '[...]')
```
- Env vars are strings, parse as JSON
- Has fallback JSON string

### Pattern 4: Integer parsing
```javascript
JWT_ACCESS_TOKEN_EXPIRE_MINUTES: parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRE_MINUTES || '60')
```
- Env var is string, convert to number
- parseInt removes decimals

---

## 📝 .env FILE EXAMPLE

```env
# App
APP_NAME=ArthaNova
ENVIRONMENT=production
PORT=8000
DEBUG=false

# Database
DATABASE_URL=libsql://mydb-user.turso.io?authToken=secret123

# JWT
JWT_SECRET_KEY=super-secret-key-min-32-chars-long-here
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60
JWT_REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS Origins
ALLOWED_ORIGINS=["https://arthanova.com", "https://www.arthanova.com"]

# API Keys
GROQ_API_KEY=gsk_xxxxx
NEWS_API_KEY=xxxxx
GOOGLE_CLIENT_ID=xxxxx
GOOGLE_CLIENT_SECRET=xxxxx

# Email
SMTP_HOST=smtp.brevo.com
SMTP_PORT=587
SMTP_USER=email@arthanova.in
SMTP_PASSWORD=xxxxx
FROM_EMAIL=noreply@arthanova.in

# Admin Whitelist
AUTHORIZED_ADMIN_EMAILS=["admin@arthanova.com", "founder@arthanova.com"]
```

---

## 🔐 SECURITY NOTES

✅ **Defaults are safe for local development:**
- `DEBUG=true` shows errors (OK locally)
- `dummy_secret` fine for testing
- localhost origins only

⚠️ **MUST change for production:**
- `JWT_SECRET_KEY` = strong random string
- `ALLOWED_ORIGINS` = only your domain
- All API keys = real, not empty
- `DEBUG=false`
- Strong email passwords

❌ **Never in version control:**
- `.env` file (gitignored)
- API keys anywhere in code
- Passwords in comments

👍 **Best practices:**
- Use `.env.example` to show what's needed
- Validate required vars on startup
- Use different `.env` per environment
- Rotate secrets periodically

---

## 💡 KEY CONCEPTS

**Configuration Management:**
- Single source of truth (settings.js)
- Environment-dependent (dev vs prod)
- Centralized import throughout app

**Environment Variables:**
- Secure (not in Git)
- Per-deployment (easy to change)
- Standard practice (12-factor app)

**Defaults:**
- Convenience for local development
- Safety against missing vars
- Must be overridden in production

