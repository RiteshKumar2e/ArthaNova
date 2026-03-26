import express from 'express';

const backtestRouter = express.Router();

let runHistory = [];

backtestRouter.post('/', (req, res) => {
  const { symbol, strategy_name, initial_capital } = req.body;
  const capital = initial_capital || 100000;

  // Generate some realistic looking results
  const isProfit = Math.random() > 0.4; // 60% chance to be profitable
  const totalReturnPct = isProfit ? (Math.random() * 40).toFixed(2) : -(Math.random() * 20).toFixed(2);
  const sharpe = isProfit ? (1 + Math.random()).toFixed(2) : (Math.random() * 0.8).toFixed(2);
  const winRate = isProfit ? Math.floor(50 + Math.random() * 30) : Math.floor(30 + Math.random() * 20);
  const totalTrades = Math.floor(10 + Math.random() * 40);
  const maxDrawdown = -(Math.random() * 20 + 5).toFixed(2);

  // Generate fake trade log
  const trade_log = [];
  let currentBalance = capital;
  
  for (let i = 1; i <= Math.min(20, totalTrades); i++) {
    const action = i % 2 !== 0 ? 'Buy' : 'Sell';
    const price = Math.floor(100 + Math.random() * 2000);
    const quantity = Math.floor(currentBalance * 0.1 / price) || 1;
    
    let pnl = 0;
    let pnl_pct = 0;
    
    if (action === 'Sell') {
      const profitTrade = Math.random() * 100 < winRate;
      pnl_pct = profitTrade ? (Math.random() * 15) : -(Math.random() * 10);
      pnl = Math.floor((trade_log[i - 2]?.price * quantity || capital * 0.1) * (pnl_pct / 100));
      currentBalance += pnl;
    }
    
    trade_log.push({
      trade: i,
      action,
      price,
      quantity,
      pnl: parseInt(pnl) || 0,
      pnl_pct: parseFloat(pnl_pct.toFixed(2)) || 0
    });
  }

  const result = {
    total_return_pct: parseFloat(totalReturnPct),
    sharpe_ratio: parseFloat(sharpe),
    max_drawdown_pct: parseFloat(maxDrawdown),
    win_rate: winRate,
    total_trades: totalTrades,
    trade_log
  };

  // Save to history
  runHistory.unshift({
    id: Date.now(),
    symbol: symbol || 'UNKNOWN',
    strategy_name: strategy_name || 'Standard Strategy',
    total_return_pct: parseFloat(totalReturnPct)
  });

  // Keep history size small
  if (runHistory.length > 10) runHistory = runHistory.slice(0, 10);

  // Return the result
  setTimeout(() => {
    res.json(result);
  }, 1000); // add 1s delay for realism
});

backtestRouter.get('/', (req, res) => {
  res.json(runHistory);
});

export default backtestRouter;
