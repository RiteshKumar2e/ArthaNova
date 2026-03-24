import app from './app.js';
import settings from './config/settings.js';
import fs from 'fs';

// Startup Logic
const startup = async () => {
  console.log('🚀 ArthaNova API starting up...');

  // Ensure upload directory exists
  if (!fs.existsSync(settings.UPLOAD_DIR)) {
    fs.mkdirSync(settings.UPLOAD_DIR, { recursive: true });
    console.log('📁 Created upload directory:', settings.UPLOAD_DIR);
  }

  // Database initialization (Prisma will handle it via migrations/deploy)
  // For now we just check if it's operational (Prisma logic would go here)

  console.log(`🌍 Running in ${settings.ENVIRONMENT} mode`);
  
  app.listen(settings.PORT, () => {
    console.log(`Server is running on port ${settings.PORT}`);
    console.log(`Health check: http://localhost:${settings.PORT}/health`);
  });
};

startup().catch((error) => {
  console.error('❌ Failed to start application:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 ArthaNova API shutting down...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('🛑 ArthaNova API shutting down...');
  process.exit(0);
});
