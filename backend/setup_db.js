// setup_db.js — Creates Turso (libSQL) tables directly
import db from './src/models/db.js';
import bcrypt from 'bcryptjs';

async function setup() {
  console.log('🚀 Initializing Turso Database Tables...');

  try {
    // 1. Create Users Table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        username TEXT UNIQUE NOT NULL,
        full_name TEXT NOT NULL,
        hashed_password TEXT NOT NULL,
        phone TEXT,
        avatar_url TEXT,
        bio TEXT,
        role TEXT DEFAULT 'user',
        risk_profile TEXT DEFAULT 'moderate',
        is_active BOOLEAN DEFAULT 1,
        is_verified BOOLEAN DEFAULT 0,
        is_admin BOOLEAN DEFAULT 0,
        notification_email BOOLEAN DEFAULT 1,
        notification_push BOOLEAN DEFAULT 1,
        preferred_currency TEXT DEFAULT 'INR',
        theme TEXT DEFAULT 'light',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME
      )
    `);
    console.log('✅ Users table ready');

    // 2. Create Portfolios Table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS portfolios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE NOT NULL,
        name TEXT DEFAULT 'My Portfolio',
        total_invested REAL DEFAULT 0.0,
        current_value REAL DEFAULT 0.0,
        total_pnl REAL DEFAULT 0.0,
        risk_score REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);
    console.log('✅ Portfolios table ready');

    // 3. Create Holdings Table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS holdings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        portfolio_id INTEGER NOT NULL,
        symbol TEXT NOT NULL,
        company_name TEXT NOT NULL,
        quantity REAL NOT NULL,
        avg_buy_price REAL NOT NULL,
        current_price REAL,
        sector TEXT,
        exchange TEXT DEFAULT 'NSE',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (portfolio_id) REFERENCES portfolios (id)
      )
    `);
    console.log('✅ Holdings table ready');

    console.log('🎉 Database setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

setup();
