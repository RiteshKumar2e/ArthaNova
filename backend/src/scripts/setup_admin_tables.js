import db from '../models/db.js';

async function setup() {
  console.log('🚀 Initializing Admin Management Tables...');

  try {
    // 1. System Settings Table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS system_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE NOT NULL,
        value TEXT NOT NULL,
        type TEXT DEFAULT 'text',
        category TEXT DEFAULT 'general',
        description TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ System Settings table ready');

    // 2. Content Management Table (News, Insights, Forecasts)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS content_management (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        type TEXT NOT NULL, -- INSIGHT, NEWS, FORECAST
        status TEXT DEFAULT 'DRAFT', -- DRAFT, PUBLISHED, REVIEW
        author TEXT DEFAULT 'ADMIN',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Content Management table ready');

    // 3. AI Signals & Logic Table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS ai_signals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        symbol TEXT NOT NULL,
        pattern TEXT NOT NULL,
        confidence REAL,
        status TEXT DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED, OVERRIDDEN
        details TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ AI Signals table ready');

    await db.execute(`
      CREATE TABLE IF NOT EXISTS logic_switches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        status BOOLEAN DEFAULT 1,
        description TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Logic Switches table ready');

    // 4. Ingestion Pipelines Table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS ingestion_pipelines (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        sources TEXT,
        status TEXT DEFAULT 'HEALTHY', -- HEALTHY, SYNCING, ERROR
        count INTEGER DEFAULT 0,
        last_sync DATETIME,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Ingestion Pipelines table ready');

    // 5. Notifications Table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER, -- NULL for global broadcast
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT DEFAULT 'info', -- info, success, warning, danger, market, ai_alert
        is_read BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);
    console.log('✅ Notifications table ready');

    // 6. Seed some default data if empty
    const settingsCount = await db.queryFirst('SELECT COUNT(*) as count FROM system_settings');
    if (settingsCount.count === 0) {
      await db.execute(`INSERT INTO system_settings (key, value, type, category, description) VALUES 
        ('nse_api_key', '****************', 'password', 'market', 'NSE Market Data API Key'),
        ('groq_endpoint', 'https://api.groq.com/openai/v1', 'text', 'ai', 'Groq/LLM Endpoint'),
        ('market_sync_rate', '1000', 'number', 'market', 'Market Sync Rate (ms)'),
        ('enable_video_gen', '1', 'toggle', 'features', 'Real-time Video Gen'),
        ('enable_sentiment_feed', '1', 'toggle', 'features', 'AI Sentiment Feed'),
        ('maintenance_mode', '0', 'toggle', 'system', 'Maintenance Mode')
      `);
      console.log('🌱 Seeded default system settings');
    }

    const logicSwitchesCount = await db.queryFirst('SELECT COUNT(*) as count FROM logic_switches');
    if (logicSwitchesCount.count === 0) {
      await db.execute(`INSERT INTO logic_switches (name, status, description) VALUES 
        ('AGGRESSIVE BREAKOUT DETECTION', 1, 'Detects symbols near resistance levels'),
        ('SENTIMENT OVERRIDE CORE', 1, 'Applies LLM sentiment to raw news data'),
        ('MULTI-NODE CLUSTER RELAY', 1, 'Syncs AI decisions across server farm'),
        ('AUTO-LIQUIDATE SAFETY', 0, 'Automatically closes positions on risk threshold')
      `);
      console.log('🌱 Seeded default logic switches');
    }

    const pipelinesCount = await db.queryFirst('SELECT COUNT(*) as count FROM ingestion_pipelines');
    if (pipelinesCount.count === 0) {
      await db.execute(`INSERT INTO ingestion_pipelines (name, sources, count, status, last_sync) VALUES 
        ('NSE EQUITY MASTER', 'DIRECT NSE-IX', 24500, 'HEALTHY', datetime('now', '-5 minutes')),
        ('DERIVATIVES FEED', 'REFINTIV / QUANDL', 8920, 'HEALTHY', datetime('now', '-10 minutes')),
        ('GLOBAL SENTIMENT', 'TWITTER, NEWS.API', 156402, 'SYNCING', datetime('now', '-2 minutes')),
        ('INSTITUTIONAL FLOWS', 'NSE BULK/BLOCK', 420, 'ERROR', datetime('now', '-1 hour'))
      `);
      console.log('🌱 Seeded default ingestion pipelines');
    }

    console.log('🎉 Admin tables setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

setup();
