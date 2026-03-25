import db from '../models/db.js';

export const getPortfolio = async (req, res) => {
  try {
    let portfolio = await db.queryFirst('SELECT * FROM portfolios WHERE user_id = ?', [req.user.id]);
    
    if (!portfolio) {
      const result = await db.execute(
        'INSERT INTO portfolios (user_id, name) VALUES (?, ?)',
        [req.user.id, "My Portfolio"]
      );
      portfolio = await db.queryFirst('SELECT * FROM portfolios WHERE id = ?', [Number(result.lastInsertRowid)]);
    }

    const holdings = await db.query('SELECT * FROM holdings WHERE portfolio_id = ?', [portfolio.id]);
    portfolio.holdings = holdings;
    
    res.json(portfolio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: "Failed to fetch portfolio" });
  }
};

export const addHolding = async (req, res) => {
  const { symbol, company_name, quantity, avg_buy_price, exchange } = req.body;
  
  try {
    let portfolio = await db.queryFirst('SELECT * FROM portfolios WHERE user_id = ?', [req.user.id]);
    
    if (!portfolio) {
      const result = await db.execute(
        'INSERT INTO portfolios (user_id) VALUES (?)',
        [req.user.id]
      );
      portfolio = await db.queryFirst('SELECT * FROM portfolios WHERE id = ?', [Number(result.lastInsertRowid)]);
    }
    
    const result = await db.execute(
      'INSERT INTO holdings (portfolio_id, symbol, company_name, quantity, avg_buy_price, exchange) VALUES (?, ?, ?, ?, ?, ?)',
      [portfolio.id, symbol, company_name, parseFloat(quantity), parseFloat(avg_buy_price), exchange || 'NSE']
    );

    const holding = await db.queryFirst('SELECT * FROM holdings WHERE id = ?', [Number(result.lastInsertRowid)]);
    res.status(201).json(holding);
  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: "Failed to add holding" });
  }
};

export const removeHolding = async (req, res) => {
  const { id } = req.params;
  try {
    const holding = await db.queryFirst(`
      SELECT h.*, p.user_id 
      FROM holdings h
      JOIN portfolios p ON h.portfolio_id = p.id
      WHERE h.id = ?`,
      [parseInt(id)]
    );
    
    if (!holding || Number(holding.user_id) !== req.user.id) {
      return res.status(404).json({ detail: "Holding not found" });
    }
    
    await db.execute('DELETE FROM holdings WHERE id = ?', [parseInt(id)]);
    res.json({ message: "Holding removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: "Failed to remove holding" });
  }
};

export const getPortfolioAnalytics = async (req, res) => {
  res.json({
    total_pnl: parseFloat((Math.random() * 5000 - 1000).toFixed(2)),
    total_pnl_pct: parseFloat((Math.random() * 10 - 2).toFixed(2)),
    day_change: parseFloat((Math.random() * 500 - 250).toFixed(2)),
    day_change_pct: parseFloat((Math.random() * 2 - 1).toFixed(2)),
    risk_score: 6.5,
    sector_allocation: [
      { sector: "IT", value: 45 },
      { sector: "Banking", value: 30 },
      { sector: "Energy", value: 25 },
    ],
  });
};
