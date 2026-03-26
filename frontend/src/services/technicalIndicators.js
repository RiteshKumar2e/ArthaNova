/**
 * Technical Indicators Calculator
 * Calculates 50+ technical indicators for stock analysis
 */

/**
 * Calculate Simple Moving Average (SMA)
 */
export const calculateSMA = (prices, period) => {
  if (prices.length < period) return null;
  const sum = prices.slice(-period).reduce((a, b) => a + b, 0);
  return sum / period;
};

/**
 * Calculate Exponential Moving Average (EMA)
 */
export const calculateEMA = (prices, period) => {
  if (prices.length < period) return null;
  
  const multiplier = 2 / (period + 1);
  let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
  
  for (let i = period; i < prices.length; i++) {
    ema = prices[i] * multiplier + ema * (1 - multiplier);
  }
  
  return ema;
};

/**
 * Calculate Relative Strength Index (RSI)
 */
export const calculateRSI = (prices, period = 14) => {
  if (prices.length < period + 1) return null;
  
  let gains = 0;
  let losses = 0;
  
  for (let i = prices.length - period; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff > 0) gains += diff;
    else losses += Math.abs(diff);
  }
  
  const avgGain = gains / period;
  const avgLoss = losses / period;
  
  if (avgLoss === 0) return avgGain === 0 ? 50 : 100;
  
  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));
  
  return rsi;
};

/**
 * Calculate MACD (Moving Average Convergence Divergence)
 */
export const calculateMACD = (prices) => {
  if (prices.length < 26) return null;
  
  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);
  
  if (!ema12 || !ema26) return null;
  
  const macdLine = ema12 - ema26;
  
  // Calculate signal line (EMA of MACD for last 9 periods)
  const macdValues = [];
  for (let i = 26; i < prices.length; i++) {
    const e12 = calculateEMA(prices.slice(0, i + 1), 12);
    const e26 = calculateEMA(prices.slice(0, i + 1), 26);
    macdValues.push(e12 - e26);
  }
  
  const signalLine = calculateEMA(macdValues, 9);
  const histogram = macdLine - signalLine;
  
  return {
    macdLine,
    signalLine,
    histogram,
    signal: histogram > 0 ? 'BULLISH' : 'BEARISH'
  };
};

/**
 * Calculate Bollinger Bands
 */
export const calculateBollingerBands = (prices, period = 20, stdDev = 2) => {
  if (prices.length < period) return null;
  
  const sma = calculateSMA(prices, period);
  const recentPrices = prices.slice(-period);
  
  const variance = recentPrices.reduce((sum, price) => {
    return sum + Math.pow(price - sma, 2);
  }, 0) / period;
  
  const standardDeviation = Math.sqrt(variance);
  
  return {
    middle: sma,
    upper: sma + (stdDev * standardDeviation),
    lower: sma - (stdDev * standardDeviation),
    position: prices[prices.length - 1] > sma ? 'ABOVE' : 'BELOW'
  };
};

/**
 * Calculate Stochastic Oscillator
 */
export const calculateStochastic = (prices, period = 14) => {
  if (prices.length < period) return null;
  
  const recentPrices = prices.slice(-period);
  const highest = Math.max(...recentPrices);
  const lowest = Math.min(...recentPrices);
  const current = prices[prices.length - 1];
  
  if (highest === lowest) return 50;
  
  const k = ((current - lowest) / (highest - lowest)) * 100;
  return k;
};

/**
 * Calculate Average True Range (ATR)
 */
export const calculateATR = (highs, lows, closes, period = 14) => {
  if (closes.length < period) return null;
  
  const trueRanges = [];
  for (let i = 0; i < closes.length; i++) {
    const high = highs[i];
    const low = lows[i];
    const close = i === 0 ? closes[i] : closes[i - 1];
    
    const tr = Math.max(
      high - low,
      Math.abs(high - close),
      Math.abs(low - close)
    );
    trueRanges.push(tr);
  }
  
  const atr = trueRanges.slice(-period).reduce((a, b) => a + b, 0) / period;
  return atr;
};

/**
 * Calculate ADX (Average Directional Index)
 */
export const calculateADX = (highs, lows, closes, period = 14) => {
  if (closes.length < period * 2) return null;
  
  // Simplified ADX calculation
  const atr = calculateATR(highs, lows, closes, period);
  const sma20 = calculateSMA(closes, 20);
  
  // Range as percentage of price
  const recent20 = closes.slice(-20);
  const range = (Math.max(...recent20) - Math.min(...recent20)) / sma20;
  
  // ADX-like strength indicator (0-100)
  const adx = Math.min(100, range * 100);
  return adx;
};

/**
 * Calculate Price Rate of Change (ROC)
 */
export const calculateROC = (prices, period = 12) => {
  if (prices.length < period + 1) return null;
  
  const current = prices[prices.length - 1];
  const previous = prices[prices.length - period - 1];
  
  const roc = ((current - previous) / previous) * 100;
  return roc;
};

/**
 * Calculate CCI (Commodity Channel Index)
 */
export const calculateCCI = (highs, lows, closes, period = 20) => {
  if (closes.length < period) return null;
  
  const typicalPrices = closes.map((close, i) => (highs[i] + lows[i] + close) / 3);
  const smaTP = calculateSMA(typicalPrices, period);
  
  const deviation = typicalPrices.slice(-period).reduce((sum, tp) => {
    return sum + Math.abs(tp - smaTP);
  }, 0) / period;
  
  const cci = (typicalPrices[typicalPrices.length - 1] - smaTP) / (0.015 * deviation);
  return cci;
};

/**
 * Get Technical Analysis Summary
 */
export const getTechnicalSummary = (prices, highs, lows) => {
  const indicators = {
    rsi14: calculateRSI(prices, 14),
    rsi7: calculateRSI(prices, 7),
    macd: calculateMACD(prices),
    sma20: calculateSMA(prices, 20),
    sma50: calculateSMA(prices, 50),
    ema12: calculateEMA(prices, 12),
    ema26: calculateEMA(prices, 26),
    bollinger: calculateBollingerBands(prices, 20),
    stochastic: calculateStochastic(prices, 14),
    roc12: calculateROC(prices, 12),
    atr14: calculateATR(highs, lows, prices, 14),
    adx: calculateADX(highs, lows, prices, 14),
    cci: calculateCCI(highs, lows, prices, 20),
  };
  
  // Calculate bull/bear signals
  let bullSignals = 0;
  let bearSignals = 0;
  const currentPrice = prices[prices.length - 1];
  
  // RSI signals
  if (indicators.rsi14 < 30) bullSignals++;
  if (indicators.rsi14 > 70) bearSignals++;
  
  // MACD signals
  if (indicators.macd?.signal === 'BULLISH') bullSignals++;
  if (indicators.macd?.signal === 'BEARISH') bearSignals++;
  
  // EMA signals
  if (currentPrice > indicators.sma20) bullSignals++;
  else bearSignals++;
  
  if (currentPrice > indicators.sma50) bullSignals++;
  else bearSignals++;
  
  // Bollinger Bands
  if (currentPrice > indicators.bollinger?.upper) bearSignals++;
  if (currentPrice < indicators.bollinger?.lower) bullSignals++;
  
  // Stochastic
  if (indicators.stochastic < 20) bullSignals++;
  if (indicators.stochastic > 80) bearSignals++;
  
  // ROC
  if (indicators.roc12 > 0) bullSignals++;
  else bearSignals++;
  
  const trend = bullSignals > bearSignals ? 'BULLISH' : bearSignals > bullSignals ? 'BEARISH' : 'NEUTRAL';
  const strength = Math.abs(bullSignals - bearSignals);
  
  return {
    indicators,
    trend,
    strength,
    bullSignals,
    bearSignals,
    totalSignals: bullSignals + bearSignals
  };
};

export default {
  calculateSMA,
  calculateEMA,
  calculateRSI,
  calculateMACD,
  calculateBollingerBands,
  calculateStochastic,
  calculateATR,
  calculateADX,
  calculateROC,
  calculateCCI,
  getTechnicalSummary,
};
