import db from '../models/db.js';

// Mock stock prices database (in production, this would come from real API)
const STOCK_PRICES = {
  "RELIANCE": 2450.75,
  "TCS": 3820.40,
  "HDFCBANK": 1680.15,
  "INFY": 1540.60,
  "HINDUNILVR": 2650.80,
  "ICICIBANK": 1020.45,
  "BAJFINANCE": 7250.00,
  "BHARTIARTL": 1120.30,
  "SBIN": 760.80,
  "LT": 3450.00,
  "ITC": 440.25,
  "TATASTEEL": 148.50,
  "ADANIENT": 3240.00,
  "JSWSTEEL": 820.40,
  "TITAN": 3750.00,
  "WIPRO": 520.50,
  "ZOMATO": 180.45,
  "NVIDIA": 152.30,
  "APPLE": 215.75,
  "MSFT": 420.60,
  "GOOGL": 180.15,
};

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
    
    // Enrich holdings with current prices and calculations
    let total_invested = 0;
    let current_value = 0;
    const enriched_holdings = holdings.map(h => {
      const current_price = STOCK_PRICES[h.symbol] || h.avg_buy_price * (1 + (Math.random() * 0.1 - 0.05));
      const invested = h.quantity * h.avg_buy_price;
      const current_val = h.quantity * current_price;
      const pnl = current_val - invested;
      const pnl_pct = ((current_price - h.avg_buy_price) / h.avg_buy_price) * 100;
      
      total_invested += invested;
      current_value += current_val;
      
      return {
        ...h,
        current_price: parseFloat(current_price.toFixed(2)),
        pnl: parseFloat(pnl.toFixed(2)),
        pnl_pct: parseFloat(pnl_pct.toFixed(2)),
        invested: parseFloat(invested.toFixed(2)),
        current_val: parseFloat(current_val.toFixed(2)),
      };
    });

    const total_pnl = current_value - total_invested;
    const total_pnl_pct = total_invested > 0 ? (total_pnl / total_invested) * 100 : 0;
    
    // Calculate risk score (0-10) based on portfolio composition
    const risk_score = enriched_holdings.length > 0 
      ? parseFloat(((enriched_holdings.length / 10) * 7 + Math.random() * 3).toFixed(1))
      : 0;

    // Group by sector
    const sector_allocation = enriched_holdings.reduce((acc, h) => {
      const sector = h.sector || 'Other';
      const existing = acc.find(s => s.sector === sector);
      if (existing) {
        existing.value += h.current_val;
      } else {
        acc.push({ sector, value: h.current_val });
      }
      return acc;
    }, []);

    // Convert sector values to percentages
    const sector_allocation_pct = sector_allocation.map(s => ({
      sector: s.sector,
      value: parseFloat(((s.value / current_value) * 100).toFixed(1)),
    }));

    res.json({
      ...portfolio,
      holdings: enriched_holdings,
      holdings_count: enriched_holdings.length,
      total_invested: parseFloat(total_invested.toFixed(2)),
      current_value: parseFloat(current_value.toFixed(2)),
      total_pnl: parseFloat(total_pnl.toFixed(2)),
      total_pnl_pct: parseFloat(total_pnl_pct.toFixed(2)),
      risk_score: risk_score,
      sector_allocation: sector_allocation_pct,
    });
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
  try {
    let portfolio = await db.queryFirst('SELECT * FROM portfolios WHERE user_id = ?', [req.user.id]);
    
    if (!portfolio) {
      return res.json({
        total_pnl: 0,
        total_pnl_pct: 0,
        day_change: 0,
        day_change_pct: 0,
        risk_score: 0,
        sector_allocation: [],
      });
    }

    const holdings = await db.query('SELECT * FROM holdings WHERE portfolio_id = ?', [portfolio.id]);
    
    let total_invested = 0;
    let current_value = 0;
    let day_change = 0;
    
    const sector_map = {};
    
    holdings.forEach(h => {
      const current_price = STOCK_PRICES[h.symbol] || h.avg_buy_price * (1 + (Math.random() * 0.1 - 0.05));
      const invested = h.quantity * h.avg_buy_price;
      const current_val = h.quantity * current_price;
      
      total_invested += invested;
      current_value += current_val;
      
      // Random day change simulation (±0.5% to ±2%)
      const day_change_pct = (Math.random() * 2.5) - 1.25;
      day_change += current_val * (day_change_pct / 100);
      
      // Accumulate by sector
      const sector = h.sector || 'Other';
      if (!sector_map[sector]) {
        sector_map[sector] = 0;
      }
      sector_map[sector] += current_val;
    });

    const total_pnl = current_value - total_invested;
    const total_pnl_pct = total_invested > 0 ? (total_pnl / total_invested) * 100 : 0;
    const day_change_pct = current_value > 0 ? (day_change / current_value) * 100 : 0;
    
    // Calculate risk score (0-10)
    const risk_score = holdings.length > 0 
      ? parseFloat(((holdings.length / 10) * 7 + Math.random() * 3).toFixed(1))
      : 0;

    // Sector allocation
    const sector_allocation = Object.entries(sector_map).map(([sector, value]) => ({
      sector,
      value: parseFloat(((value / current_value) * 100).toFixed(1)),
    }));

    res.json({
      total_pnl: parseFloat(total_pnl.toFixed(2)),
      total_pnl_pct: parseFloat(total_pnl_pct.toFixed(2)),
      day_change: parseFloat(day_change.toFixed(2)),
      day_change_pct: parseFloat(day_change_pct.toFixed(2)),
      risk_score: risk_score,
      sector_allocation: sector_allocation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: "Failed to fetch analytics" });
  }
};
