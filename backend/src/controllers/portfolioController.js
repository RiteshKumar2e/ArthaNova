import prisma from '../models/db.js';

export const getPortfolio = async (req, res) => {
  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: { user_id: req.user.id },
      include: { holdings: true },
    });
    
    if (!portfolio) {
      // Create one if it doesn't exist
      const newPortfolio = await prisma.portfolio.create({
        data: {
          user_id: req.user.id,
          name: "My Portfolio",
        },
        include: { holdings: true },
      });
      return res.json(newPortfolio);
    }
    
    res.json(portfolio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: "Failed to fetch portfolio" });
  }
};

export const addHolding = async (req, res) => {
  const { symbol, company_name, quantity, avg_buy_price, exchange } = req.body;
  
  try {
    let portfolio = await prisma.portfolio.findUnique({
      where: { user_id: req.user.id },
    });
    
    if (!portfolio) {
      portfolio = await prisma.portfolio.create({
        data: { user_id: req.user.id },
      });
    }
    
    const holding = await prisma.holding.create({
      data: {
        portfolio_id: portfolio.id,
        symbol,
        company_name,
        quantity: parseFloat(quantity),
        avg_buy_price: parseFloat(avg_buy_price),
        exchange: exchange || 'NSE',
      },
    });
    
    res.status(201).json(holding);
  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: "Failed to add holding" });
  }
};

export const removeHolding = async (req, res) => {
  const { id } = req.params;
  try {
    const holding = await prisma.holding.findUnique({
      where: { id: parseInt(id) },
      include: { portfolio: true },
    });
    
    if (!holding || holding.portfolio.user_id !== req.user.id) {
      return res.status(404).json({ detail: "Holding not found" });
    }
    
    await prisma.holding.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Holding removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: "Failed to remove holding" });
  }
};

export const getPortfolioAnalytics = async (req, res) => {
  // Mock analytics
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
