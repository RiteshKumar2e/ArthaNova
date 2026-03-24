// Mock Data Replicated from stocks.py
const STOCKS_DB = [
  { symbol: "RELIANCE", name: "Reliance Industries Ltd.", sector: "Energy", price: 2450.75, change: 12.5, change_pct: 0.51 },
  { symbol: "TCS", name: "Tata Consultancy Services", sector: "IT", price: 3820.40, change: -45.2, change_pct: -1.17 },
  { symbol: "HDFCBANK", name: "HDFC Bank Ltd.", sector: "Banking", price: 1680.15, change: 18.3, change_pct: 1.1 },
  { symbol: "INFY", name: "Infosys Ltd.", sector: "IT", price: 1540.60, change: -12.4, change_pct: -0.8 },
  { symbol: "ICICIBANK", name: "ICICI Bank Ltd.", sector: "Banking", price: 1020.45, change: 5.2, change_pct: 0.51 },
  { symbol: "BAJFINANCE", name: "Bajaj Finance Ltd.", sector: "NBFC", price: 7250.00, change: 105.0, change_pct: 1.47 },
  { symbol: "BHARTIARTL", name: "Bharti Airtel Ltd.", sector: "Telecom", price: 1120.30, change: -2.1, change_pct: -0.19 },
  { symbol: "SBIN", name: "State Bank of India", sector: "Banking", price: 760.80, change: 14.2, change_pct: 1.9 },
  { symbol: "LT", name: "Larsen & Toubro Ltd.", sector: "Infrastructure", price: 3450.00, change: 25.0, change_pct: 0.73 },
  { symbol: "ITC", name: "ITC Ltd.", sector: "FMCG", price: 440.25, change: -1.5, change_pct: -0.34 },
];

const SECTORS_DATA = [
  { name: "IT", change_pct: -0.8 },
  { name: "Banking", change_pct: 1.2 },
  { name: "Energy", change_pct: 0.5 },
  { name: "Auto", change_pct: 1.5 },
  { name: "FMCG", change_pct: -0.2 },
  { name: "Pharma", change_pct: 0.7 },
];

export const listStocks = async (req, res) => {
  const { query, sector, limit = 10, offset = 0 } = req.query;
  let filtered = STOCKS_DB;

  if (query) {
    const q = query.toUpperCase();
    filtered = filtered.filter(s => s.symbol.includes(q) || s.name.toLowerCase().includes(query.toLowerCase()));
  }

  if (sector) {
    filtered = filtered.filter(s => s.sector.toLowerCase() === sector.toLowerCase());
  }

  res.json({
    stocks: filtered.slice(parseInt(offset), parseInt(offset) + parseInt(limit)),
    total: filtered.length,
    limit: parseInt(limit),
    offset: parseInt(offset),
  });
};

export const getMarketOverview = async (req, res) => {
  res.json({
    indices: [
      { name: "NIFTY 50", value: 22450.15, change: 112.4, change_pct: 0.5 },
      { name: "SENSEX", value: 73850.30, change: 345.2, change_pct: 0.47 },
      { name: "NIFTY BANK", value: 48120.45, change: 450.1, change_pct: 0.94 },
    ],
    market_breadth: "Bullish",
    advance_decline: { advances: 32, declines: 15, unchanged: 3 },
    vix: 14.2,
    fii_dii: {
      fii_buy: 12450.5,
      fii_sell: 11200.2,
      fii_net: 1250.3,
      dii_buy: 8900.8,
      dii_sell: 8200.4,
      dii_net: 700.4,
    },
  });
};

export const getSectors = async (req, res) => {
  res.json({ sectors: SECTORS_DATA });
};

export const getStockDetail = async (req, res) => {
  const { symbol } = req.params;
  const stock = STOCKS_DB.find(s => s.symbol === symbol.toUpperCase());
  if (!stock) {
    return res.status(404).json({ detail: "Stock not found" });
  }

  // Enrichment (randomize like python version)
  const enriched = {
    ...stock,
    mkt_cap_cr: parseFloat((Math.random() * (2000000 - 50000) + 50000).toFixed(2)),
    pe_ratio: parseFloat((Math.random() * (60 - 15) + 15).toFixed(2)),
    pb_ratio: parseFloat((Math.random() * (12 - 2) + 2).toFixed(2)),
    div_yield: parseFloat((Math.random() * (2.5 - 0.1) + 0.1).toFixed(2)),
    week_52_high: parseFloat((stock.price * 1.2).toFixed(2)),
    week_52_low: parseFloat((stock.price * 0.8).toFixed(2)),
  };

  res.json(enriched);
};

export const getStockOHLCV = async (req, res) => {
  const { symbol } = req.params;
  const { period = "1D" } = req.query;

  const data = [];
  let currPrice = 2500.0;
  const now = new Date();

  for (let i = 0; i < 100; i++) {
    currPrice += (Math.random() * 40 - 20);
    const date = new Date();
    date.setDate(now.getDate() - (100 - i));
    data.push({
      time: date.toISOString().split('T')[0],
      open: parseFloat((currPrice + (Math.random() * 10 - 5)).toFixed(2)),
      high: parseFloat((currPrice + (Math.random() * 10 + 5)).toFixed(2)),
      low: parseFloat((currPrice - (Math.random() * 10 + 5)).toFixed(2)),
      close: parseFloat(currPrice.toFixed(2)),
      volume: Math.floor(Math.random() * (1000000 - 100000) + 100000),
    });
  }

  res.json({ symbol: symbol.toUpperCase(), period, data });
};
