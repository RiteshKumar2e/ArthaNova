import app from './app.js';
import settings from './config/settings.js';
import fs from 'fs';

import cluster from 'cluster';
import os from 'os';

// Startup Logic
const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`🚀 ArthaNova API Primary Load Balancer (PID: ${process.pid}) starting...`);
  console.log(`🚦 Forking ${numCPUs} cluster nodes for load distribution...`);

  // Ensure upload directory exists safely on primary only
  if (!fs.existsSync(settings.UPLOAD_DIR)) {
    fs.mkdirSync(settings.UPLOAD_DIR, { recursive: true });
    console.log('📁 Created upload directory:', settings.UPLOAD_DIR);
  }

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.warn(`⚠️ Worker node cluster PID ${worker.process.pid} died. Automatically replacing payload...`);
    cluster.fork();
  });
} else {
  const startup = async () => {
    console.log(`🌍 Worker PID ${process.pid} active. Running in ${settings.ENVIRONMENT} mode`);
    
    app.listen(settings.PORT, () => {
      console.log(`✅ [PID:${process.pid}] Server is receiving traffic on port ${settings.PORT}`);
    });
  };

  startup().catch((error) => {
    console.error(`❌ Worker [PID:${process.pid}] Failed:`, error);
    process.exit(1);
  });
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 ArthaNova API shutting down...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('🛑 ArthaNova API shutting down...');
  process.exit(0);
});
