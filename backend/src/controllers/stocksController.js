// Mock Data Replicated from stocks.py
import growApiService from '../services/growApiService.js';

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
  { symbol: "TATASTEEL", name: "Tata Steel Ltd.", sector: "Metals", price: 148.50, change: 3.2, change_pct: 2.2 },
  { symbol: "ADANIENT", name: "Adani Enterprises Ltd.", sector: "Conglomerate", price: 3240.00, change: -15.0, change_pct: -0.46 },
  { symbol: "JSWSTEEL", name: "JSW Steel Ltd.", sector: "Metals", price: 820.40, change: 8.5, change_pct: 1.05 },
  { symbol: "TITAN", name: "Titan Company Ltd.", sector: "Consumer Durables", price: 3750.00, change: 45.0, change_pct: 1.21 },
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
  try {
    const marketData = await growApiService.getMarketOverview();
    res.json(marketData);
  } catch (error) {
    console.error('❌ Error in getMarketOverview:', error.message);
    res.status(500).json({
      error: 'Failed to fetch market overview',
      message: error.message,
    });
  }
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
