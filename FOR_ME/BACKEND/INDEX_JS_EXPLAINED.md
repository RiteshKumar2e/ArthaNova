# Backend - index.js - Complete Line-by-Line Explanation (Hinglish Mein)

## File Path
`backend/src/index.js`

---

## 📌 IMPORTS (Lines 1-5)

```javascript
import app from './app.js';
```
✅ **What it does:** Import Express app instance from app.js
- Contains all middleware and routes

```javascript
import settings from './config/settings.js';
```
✅ **What it does:** Import configuration variables
- PORT, ENVIRONMENT, API keys, database URLs, etc.

```javascript
import fs from 'fs';
```
✅ **What it does:** File system module
- Used to check if upload directory exists

```javascript
import cluster from 'cluster';
import os from 'os';
```
✅ **What it does:** Node.js clustering module
- `cluster` = create multiple worker processes
- `os` = get CPU information
- Enables load balancing across CPU cores

---

## 🔧 CLUSTER SETUP (Line 9)

```javascript
// Startup Logic - Set to 1 worker to ensure in-memory OTP/Session consistency
const numCPUs = 1;
```

✅ **What it does:** Set number of worker processes to 1
- **Why 1?** OTP codes + user sessions are stored in memory
- If 2 workers: user sends OTP to worker-1, verifies on worker-2 = fails
- With 1 worker: all requests go to same process = consistent session data
- Note: In production with Redis, you could use `os.cpus().length`

---

## 👑 PRIMARY PROCESS (Lines 11-32)

```javascript
if (cluster.isPrimary) {
  console.log(`🚀 ArthaNova API Primary Load Balancer (PID: ${process.pid}) starting...`);
  console.log(`🚦 Forking up to ${numCPUs} cluster nodes for load distribution...`);
```

✅ **What it does:** Code that runs in PRIMARY process only
- Primary = parent process that manages workers
- Logs startup message with process ID (PID)

```javascript
  // Ensure upload directory exists safely on primary only
  if (!fs.existsSync(settings.UPLOAD_DIR)) {
    fs.mkdirSync(settings.UPLOAD_DIR, { recursive: true });
    console.log('📁 Created upload directory:', settings.UPLOAD_DIR);
  }
```

✅ **What it does:** Create upload directory if doesn't exist
- `fs.existsSync()` = check if path exists
- `fs.mkdirSync()` = create directory
- `{ recursive: true }` = create parent directories if needed
- Runs on primary only to avoid race conditions

```javascript
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
```

✅ **What it does:** Fork numCPUs worker processes
- `cluster.fork()` = spawn new child process running this same file
- Creates 1 worker (since numCPUs = 1)
- Each worker runs the `else` block below

```javascript
  cluster.on('exit', (worker, code, signal) => {
    console.warn(`⚠️ Worker node cluster PID ${worker.process.pid} died. Automatically replacing payload...`);
    cluster.fork();
  });
```

✅ **What it does:** Auto-restart crashed workers
- When worker dies, primary spawns replacement
- Prevents downtime from crashes
- Logs warning with dead worker's PID

---

## 🚀 WORKER PROCESS (Lines 33-45)

```javascript
} else {
  const startup = async () => {
    console.log(`🌍 Worker PID ${process.pid} active. Running in ${settings.ENVIRONMENT} mode`);
```

✅ **What it does:** Code that runs in WORKER processes
- `else` block = worker code
- Logs worker startup with its PID + environment

```javascript
    // Explicitly bind to 0.0.0.0 for external cloud access
    app.listen(settings.PORT, '0.0.0.0', () => {
      console.log(`✅ [PID:${process.pid}] Server is receiving traffic on port ${settings.PORT}`);
    });
```

✅ **What it does:** Start Express server on worker
- `app.listen()` = start HTTP server
- `'0.0.0.0'` = listen on all network interfaces
  - Needed for cloud deployments (AWS, Heroku, etc.)
  - `localhost` only works locally
- `settings.PORT` = port from config (usually 5000)
- Callback = confirmation that server started

```javascript
  };

  startup().catch((error) => {
    console.error(`❌ Worker [PID:${process.pid}] Failed:`, error);
    process.exit(1);
  });
}
```

✅ **What it does:** Call startup and handle errors
- Call `startup()` async function
- If error, log it and exit process
- Exit code 1 = error (0 = success)
- Primary will detect exit and fork new worker

---

## 🛑 GRACEFUL SHUTDOWN (Lines 47-53)

```javascript
// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 ArthaNova API shutting down...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('🛑 ArthaNova API shutting down...');
  process.exit(0);
});
```

✅ **What it does:** Handle shutdown signals
- `SIGINT` = user presses Ctrl+C in terminal
- `SIGTERM` = process receives terminate signal (from Docker, PM2, etc.)
- Log shutdown message
- Exit with code 0 (success)

---

## 📊 COMPLETE STARTUP FLOW

```
START NODE PROCESS
   ↓
import app, settings, cluster
   ↓
Check if PRIMARY process?
   ├─ YES (Primary):
   │   ├─ Log startup message
   │   ├─ Create upload directory if missing
   │   ├─ Fork 1 worker process
   │   └─ Listen for worker crashes → Auto restart
   │
   └─ NO (Worker):
       ├─ Log "Worker active"
       ├─ Start Express server on port 5000, 0.0.0.0
       ├─ Log "Server receiving traffic"
       └─ Listen for shutdown signals
```

---

## 🔄 CLUSTER ARCHITECTURE

```
Primary Process (PID: 1234)
  │
  ├─ Manages workers
  ├─ Restarts crashed workers
  └─ Handles signals
  
  └─ Worker Process (PID: 1235)
      ├─ Runs Express app
      ├─ Handles HTTP requests
      └─ Can crash (primary restarts it)
```

---

## 🌐 PORT BINDING

```
0.0.0.0:5000
├─ 0.0.0.0 = all network interfaces
│  ├─ localhost:5000 (from same machine)
│  ├─ 192.168.1.100:5000 (from LAN)
│  └─ public-ip:5000 (from internet)
│
└─ 5000 = port number (from settings)
```

**Why not `localhost`?**
- Localhost only accessible from same machine
- Cloud deployments need 0.0.0.0
- Docker/Kubernetes need 0.0.0.0

---

## 🛑 SHUTDOWN SIGNALS

| Signal | Triggered By | Will restart? |
|--------|-------------|-------|
| SIGINT | Ctrl+C in terminal | No (intentional shutdown) |
| SIGTERM | Docker stop, PM2 stop, systemd stop | No (intentional shutdown) |
| SIGKILL | Kill -9, force kill | No (no handler, hard crash) |
| Uncaught Error | Bug in code | Auto restart (primary restarts) |

---

## ⚙️ CONFIGURATION DEPENDENCY

This startup depends on `settings`:

```javascript
settings = {
  PORT: 5000,                    // What port to listen on?
  ENVIRONMENT: 'development',    // Dev/production?
  UPLOAD_DIR: '/uploads',        // Where to save uploads?
  ALLOWED_ORIGINS: [...]         // CORS origins
  ...
}
```

---

## 🔑 KEY CONCEPTS

**Clustering:**
- Primary manages workers
- Each worker handles requests
- Crashes isolated to one worker
- Primary auto-restarts crashed workers
- Useful on multi-core machines (but here numCPUs=1)

**Graceful Shutdown:**
- Listen for SIGINT/SIGTERM
- Log shutdown message
- Clean exit (allows Docker to wait)
- Prevents abrupt connection drops

**0.0.0.0 Binding:**
- Required for cloud deployments
- Listens on all network interfaces
- Both localhost and external access work

**Why Single Worker?**
- OTP codes stored in memory
- Sessions in memory
- Multiple workers = requests split between processes
- OTP generated on worker-1, verified on worker-2 = fails
- Solution: Use Redis for shared sessions (future refactor)

