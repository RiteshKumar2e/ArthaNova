import express from 'express';

// Mock Data Replicated from market_data.py
const NEWS_DATA = [
  { id: 1, headline: "RBI holds repo rate at 6.5%; signals accommodative stance for growth", source: "Economic Times", sector: "Banking", sentiment: "Positive", sentiment_score: 0.72, tags: ["RBI", "Monetary Policy", "Banking"] },
  { id: 2, headline: "Reliance Industries Q3 profit up 12% YoY, beats analyst estimates", source: "Business Standard", sector: "Energy", sentiment: "Positive", sentiment_score: 0.84, tags: ["RELIANCE", "Earnings", "Oil & Gas"] },
  { id: 3, headline: "FII outflows continue for third consecutive week amid global uncertainty", source: "Mint", sector: "Markets", sentiment: "Negative", sentiment_score: -0.55, tags: ["FII", "Markets", "Global"] },
  { id: 4, headline: "IT sector faces headwinds as US tech spending slows; TCS, Infosys under watch", source: "NDTV Profit", sector: "IT", sentiment: "Negative", sentiment_score: -0.42, tags: ["TCS", "INFY", "IT Sector"] },
  { id: 5, headline: "Adani Green Energy secures ₹12,000 Cr project from SECI for solar capacity", source: "Reuters", sector: "Renewable Energy", sentiment: "Positive", sentiment_score: 0.79, tags: ["ADANIGREEN", "Solar", "Renewable"] },
];

const IPO_DATA = [
  { id: 1, company: "Ola Electric Mobility", symbol: "OLAELEC", sector: "EV", issue_price: { min: 72, max: 76 }, gmp: 18, subscription_status: "Closed", subscription_times: { overall: 4.28, retail: 3.9, qib: 5.2, hni: 3.8 }, issue_size_cr: 6145, listing_date: "2024-08-09", listing_price: 75.99, current_price: 68.5 },
  { id: 2, company: "Bajaj Housing Finance", symbol: "BAJAJHFL", sector: "NBFC", issue_price: { min: 66, max: 70 }, gmp: 42, subscription_status: "Closed", subscription_times: { overall: 64.0, retail: 6.8, qib: 210.0, hni: 42.3 }, issue_size_cr: 6560, listing_date: "2024-09-16", listing_price: 150.0, current_price: 114.3 },
  { id: 3, company: "Hyundai India", symbol: "HYUNDAI", sector: "Auto", issue_price: { min: 1865, max: 1960 }, gmp: 25, subscription_status: "Closed", subscription_times: { overall: 2.37, retail: 0.5, qib: 6.97, hni: 0.6 }, issue_size_cr: 27870, listing_date: "2024-10-22", listing_price: 1934.0, current_price: 1545.0 },
  { id: 4, company: "Swiggy", symbol: "SWIGGY", sector: "Food Delivery", issue_price: { min: 371, max: 390 }, gmp: 8, subscription_status: "Closed", subscription_times: { overall: 3.59, retail: 1.14, qib: 6.02, hni: 2.23 }, issue_size_cr: 11327, listing_date: "2024-11-13", listing_price: 412.0, current_price: 356.0 },
  { id: 5, company: "TechNova Systems", symbol: "TECHNOVA", sector: "IT", issue_price: { min: 250, max: 265 }, gmp: 55, subscription_status: "Open", subscription_times: { overall: 12.4, retail: 8.6, qib: 18.2, hni: 10.1 }, issue_size_cr: 1250, listing_date: "2025-02-10", listing_price: null, current_price: null },
  { id: 6, company: "GreenPath Infra", symbol: "GREENPATH", sector: "Infrastructure", issue_price: { min: 180, max: 190 }, gmp: 22, subscription_status: "Upcoming", subscription_times: null, issue_size_cr: 2100, listing_date: "2025-03-15", listing_price: null, current_price: null },
];

export const getNews = async (req, res) => {
  const { sector, page = 1, per_page = 10 } = req.query;
  let items = [...NEWS_DATA];
  if (sector) {
    items = items.filter(n => n.sector.toLowerCase() === sector.toLowerCase());
  }
  const now = new Date();
  items = items.map((item, i) => ({
    ...item,
    published_at: new Date(now.getTime() - (i * 2 + Math.floor(Math.random() * 3)) * 3600000).toISOString(),
    summary: `Market update: ${item.headline}`,
  }));
  
  const start = (parseInt(page) - 1) * parseInt(per_page);
  res.json({
    items: items.slice(start, start + parseInt(per_page)),
    total: items.length,
    page: parseInt(page),
    per_page: parseInt(per_page),
    provider: "mock",
  });
};

export const getSentimentSummary = async (req, res) => {
  res.json({
    overall_market_sentiment: "Cautiously Bullish",
    sentiment_score: 0.34,
    positive_news: Math.floor(Math.random() * 20 + 45),
    negative_news: Math.floor(Math.random() * 20 + 20),
    neutral_news: Math.floor(Math.random() * 15 + 10),
    sector_sentiments: [
      { sector: "IT", sentiment: "Neutral", score: -0.1 },
      { sector: "Banking", sentiment: "Positive", score: 0.55 },
      { sector: "Pharma", sentiment: "Bullish", score: 0.67 },
      { sector: "Energy", sentiment: "Positive", score: 0.45 },
      { sector: "FMCG", sentiment: "Neutral", score: 0.12 },
    ],
    trending_topics: ["RBI Policy", "Q3 Results", "FII Flows", "US Fed", "Budget 2025"],
  });
};

export const getIpos = async (req, res) => {
  const { status } = req.query;
  let items = [...IPO_DATA];
  if (status) {
    items = items.filter(i => i.subscription_status.toLowerCase() === status.toLowerCase());
  }
  res.json({ items, total: items.length });
};

export const getIpoDetail = async (req, res) => {
  const { ipo_id } = req.params;
  const ipo = IPO_DATA.find(i => i.id === parseInt(ipo_id));
  if (!ipo) return res.status(404).json({ detail: "IPO not found" });
  
  res.json({
    ...ipo,
    ai_analysis: {
      recommendation: ["Subscribe", "Avoid", "Subscribe for Listing Gains"][Math.floor(Math.random() * 3)],
      confidence: parseFloat((Math.random() * 30 + 60).toFixed(1)),
      strengths: ["Strong brand recognition", "Market leadership in sector", "Diversified revenue mix"],
      risks: ["High valuation vs peers", "Dependent on market conditions", "Competition intensifying"],
      fair_value: parseFloat((ipo.issue_price.max * (Math.random() * 0.5 + 0.9)).toFixed(2)),
    },
  });
};

export const getInsiderTrades = async (req, res) => {
  const { type, symbol, page = 1 } = req.query;
  const trades = [];
  const stocks = ["RELIANCE", "TCS", "INFY", "BAJFINANCE", "HDFCBANK", "LT", "WIPRO", "MARUTI"];
  const names = ["Ratan Sharma", "Mukesh Patel", "Rajesh Gupta", "Anita Singh", "Vikram Kumar"];
  const designations = ["Promoter", "Director", "Employee", "KMP"];
  
  for (let i = 0; i < 20; i++) {
    const t = Math.random() > 0.5 ? "Buy" : "Sell";
    if (type && t.toLowerCase() !== type.toLowerCase()) continue;
    const sym = stocks[Math.floor(Math.random() * stocks.length)];
    if (symbol && sym !== symbol.toUpperCase()) continue;
    
    trades.push({
      id: i + 1,
      symbol: sym,
      person: names[Math.floor(Math.random() * names.length)],
      designation: designations[Math.floor(Math.random() * designations.length)],
      transaction_type: t,
      quantity: Math.floor(Math.random() * 99000 + 1000),
      price: parseFloat((Math.random() * 4900 + 100).toFixed(2)),
      value_cr: parseFloat((Math.random() * 49.5 + 0.5).toFixed(2)),
      date: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString().split('T')[0],
      mode: ["Market", "Block Deal", "Off-Market"][Math.floor(Math.random() * 3)],
    });
  }
  res.json({ items: trades.slice(0, 10), total: trades.length, page: parseInt(page) });
};

export const getDeals = async (req, res) => {
  const { deal_type = "all" } = req.query;
  const deals = [];
  const stocks = ["RELIANCE", "TCS", "INFY", "ICICIBANK", "SBIN", "TATAMOTORS", "ADANIENT", "BAJFINANCE"];
  const clients = ["Morgan Stanley", "Goldman Sachs", "Vanguard", "BlackRock", "HDFC MF", "SBI MF"];
  
  for (let i = 0; i < 15; i++) {
    const t = Math.random() > 0.5 ? "Bulk" : "Block";
    if (deal_type !== "all" && t.toLowerCase() !== deal_type) continue;
    
    deals.push({
      id: i + 1,
      symbol: stocks[Math.floor(Math.random() * stocks.length)],
      deal_type: t,
      client_name: clients[Math.floor(Math.random() * clients.length)] + " Fund",
      transaction_type: Math.random() > 0.5 ? "Buy" : "Sell",
      quantity: Math.floor(Math.random() * 4900000 + 100000),
      price: parseFloat((Math.random() * 2900 + 100).toFixed(2)),
      value_cr: parseFloat((Math.random() * 490 + 10).toFixed(2)),
      date: new Date().toISOString().split('T')[0],
      exchange: Math.random() > 0.5 ? "NSE" : "BSE",
    });
  }
  res.json({ items: deals, total: deals.length });
};
