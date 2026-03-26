import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const settings = {
  APP_NAME: process.env.APP_NAME || 'ArthaNova',
  APP_VERSION: process.env.APP_VERSION || '1.0.0',
  DEBUG: process.env.DEBUG === 'true',
  ENVIRONMENT: process.env.ENVIRONMENT || 'production',
  PORT: process.env.PORT || 8000,
  SECRET_KEY: process.env.SECRET_KEY || 'dummy_secret',
  ALLOWED_ORIGINS: JSON.parse(process.env.ALLOWED_ORIGINS || '["http://localhost:5173", "http://localhost:3000"]'),

  // Database
  DATABASE_URL: process.env.DATABASE_URL || 'file:./arthanova.db',

  // JWT
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || 'dummy_jwt_secret',
  JWT_ALGORITHM: process.env.JWT_ALGORITHM || 'HS256',
  JWT_ACCESS_TOKEN_EXPIRE_MINUTES: parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRE_MINUTES || '60'),
  JWT_REFRESH_TOKEN_EXPIRE_DAYS: parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRE_DAYS || '7'),

  // Redis
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379/0',

  // Groq AI
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',
  GROQ_MODEL: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
  GROQ_BASE_URL: process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1',

  // Market Data APIs
  NEWS_API_KEY: process.env.NEWS_API_KEY || '',
  ALPHA_VANTAGE_API_KEY: process.env.ALPHA_VANTAGE_API_KEY || '',
  POLYGON_API_KEY: process.env.POLYGON_API_KEY || '',
  MARKETSTACK_API_KEY: process.env.MARKETSTACK_API_KEY || '',
  FINNHUB_API_KEY: process.env.FINNHUB_API_KEY || '',
  RAPIDAPI_KEY: process.env.RAPIDAPI_KEY || '',

  // Image & Video
  STABILITY_API_KEY: process.env.STABILITY_API_KEY || '',
  PIKA_API_KEY: process.env.PIKA_API_KEY || '',

  // Email
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587'),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || '',
  FROM_EMAIL: process.env.FROM_EMAIL || 'noreply@arthanova.in',

  // Brevo Specific
  BREVO_API_KEY: process.env.BREVO_API_KEY || '',
  BREVO_SENDER_EMAIL: process.env.BREVO_SENDER_EMAIL || 'ritesh90359@gmail.com',
  BREVO_SENDER_NAME: process.env.BREVO_SENDER_NAME || 'ArthaNova',

  // Grow API - Market Data
  GROW_API_KEY: process.env.GROW_API_KEY || '',
  GROW_API_SECRET: process.env.GROW_API_SECRET || '',
  GROW_API_BASE_URL: process.env.GROW_API_BASE_URL || 'https://api.groww.in/v1',

  // File Storage
  UPLOAD_DIR: path.join(process.cwd(), process.env.UPLOAD_DIR || 'uploads'),
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB

  // Sentry
  SENTRY_DSN: process.env.SENTRY_DSN || '',

  // Google OAuth
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',

  // Admin Authorization
  AUTHORIZED_ADMIN_EMAILS: (process.env.AUTHORIZED_ADMIN_EMAILS || 'riteshkumar90359@gmail.com')
    .split(',')
    .map(email => email.trim().toLowerCase()),
};

export default settings;
