import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import asyncHandler from 'express-async-handler';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import settings from './config/settings.js';
import apiRouter from './routes/api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middlewares
app.use(cors({
  origin: settings.ALLOWED_ORIGINS,
  credentials: true,
}));
app.use(helmet({
  contentSecurityPolicy: false, // For easier testing with frontend
}));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/', (req, res) => {
  res.json({
    service: settings.APP_NAME,
    version: settings.APP_VERSION,
    status: 'operational',
    environment: settings.ENVIRONMENT,
    docs: '/api/docs',
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: settings.APP_NAME });
});

// Static files
app.use('/uploads', express.static(settings.UPLOAD_DIR));

// API Routes
app.use('/api/v1', apiRouter);

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: settings.DEBUG ? err : {},
  });
});

export default app;
