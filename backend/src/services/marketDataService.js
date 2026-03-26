/**
 * ArthaNova Market Data Service
 * Real-time data from Finnhub, Polygon, Alpha Vantage, and NewsAPI
 * For the Indian Investor — NSE/BSE focused
 */

import axios from 'axios';
import settings from '../config/settings.js';

// Finnhub client
const finnhubClient = axios.create({
  baseURL: 'https://finnhub.io/api/v1',
  params: { token: settings.FINNHUB_API_KEY },
  timeout: 10000,
});

// Polygon client
const polygonClient = axios.create({
  baseURL: 'https://api.polygon.io/v2',
  headers: { Authorization: `Bearer ${settings.POLYGON_API_KEY}` },
  timeout: 10000,
});

// Alpha Vantage client
const alphaClient = axios.create({
  baseURL: 'https://www.alphavantage.co',
  timeout: 15000,
});

// News client (NewsData.io)
const newsClient = axios.create({
  baseURL: 'https://newsdata.io/api/1',
  timeout: 10000,
});

/**
 * Get real-time stock quote from Finnhub
 * Note: Finnhub uses US ticker format; for NSE use symbol.NS via Yahoo
 * We use Finnhub for global data + NSE BSE endpoint
 */
export const getStockQuote = async (symbol) => {
  try {
    // Try Finnhub first (works for major Indian ADRs and NSE via NS suffix)
    const response = await finnhubClient.get('/quote', {
      params: { symbol: symbol }
    });
    const d = response.data;
    if (d && d.c > 0) {
      return {
        symbol,
        price: d.c,
        change: d.d,
        changePercent: d.dp,
        high: d.h,
        low: d.l,
        open: d.o,
        prevClose: d.pc,
        timestamp: new Date(d.t * 1000).toISOString(),
        source: 'Finnhub'
      };
    }
    throw new Error('No data from Finnhub');
  } catch (err) {
    console.warn(`⚠️ Finnhub quote failed for ${symbol}: ${err.message}`);
    return null;
  }
};

/**
 * Get NSE market overview via Yahoo Finance proxy / RapidAPI
 */
export const getNSEMarketOverview = async () => {
  try {
    // Use RapidAPI Yahoo Finance for NSE indices
    const response = await axios.get('https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/quotes', {
      params: { ticker: '^NSEI,^BSESN,^NSEBANK,^CNXIT' },
      headers: {
        'X-RapidAPI-Key': settings.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'yahoo-finance15.p.rapidapi.com'
      },
      timeout: 10000
    });

    const quotes = response.data?.body || [];
    return quotes.map(q => ({
      name: q.longName || q.shortName || q.symbol,
      symbol: q.symbol,
      value: q.regularMarketPrice,
      change: q.regularMarketChange,
      change_pct: q.regularMarketChangePercent,
      high: q.regularMarketDayHigh,
      low: q.regularMarketDayLow,
      volume: q.regularMarketVolume,
      source: 'Yahoo Finance'
    }));
  } catch (err) {
    console.warn('⚠️ NSE overview via RapidAPI failed:', err.message);
    return getFallbackNSEIndices();
  }
};

/**
 * Get real NSE bulk deals from NSE India (public endpoint)
 */
export const getNSEBulkDeals = async () => {
  try {
    const response = await axios.get('https://www.nseindia.com/api/bulk-deals', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.nseindia.com/market-data/bulk-block-deals',
      },
      timeout: 12000
    });
    
    const deals = Array.isArray(response.data) 
      ? response.data 
      : (response.data?.data || []);
    
    return deals.slice(0, 20).map(deal => ({
      symbol: deal.symbol || deal.Symbol,
      company: deal.name || deal.Company || deal.symbol,
      clientName: deal.clientName || deal.ClientName || 'Unknown',
      buySell: deal.buySellFlag || deal.BuyOrSell || 'B',
      quantity: deal.quantityTraded || deal.Quantity || 0,
      price: deal.tradePrice || deal.Price || 0,
      date: deal.mktType || deal.Date || new Date().toISOString().split('T')[0],
      source: 'NSE India'
    }));
  } catch (err) {
    console.warn('⚠️ NSE bulk deals fetch failed:', err.message);
    return [];
  }
};

/**
 * Get NSE insider trades
 */
export const getNSEInsiderTrades = async () => {
  try {
    const response = await axios.get('https://www.nseindia.com/api/corporates-pit?index=equities&from_date=&to_date=', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json',
        'Referer': 'https://www.nseindia.com/companies-listing/corporate-filings-insider-trading',
      },
      timeout: 12000
    });
    
    const data = response.data?.data || [];
    return data.slice(0, 20).map(trade => ({
      symbol: trade.symbol,
      personName: trade.personName || trade.acqDis,
      category: trade.personCategory || 'Promoter',
      buySell: trade.transactionType === 'Sell' ? 'S' : 'B',
      securities: trade.secAcq || trade.secSal || 0,
      beforeShares: trade.befAcqShareholdingNos || 0,
      afterShares: trade.aftAcqShareholdingNos || 0,
      remarks: trade.remarks || '',
      date: trade.date || new Date().toISOString().split('T')[0],
      source: 'NSE India Filings'
    }));
  } catch (err) {
    console.warn('⚠️ NSE insider trades fetch failed:', err.message);
    return [];
  }
};

/**
 * Get market news from NewsData.io (supports Indian financial news)
 */
export const getMarketNews = async (query = 'NSE BSE India stock market') => {
  try {
    const response = await newsClient.get('/news', {
      params: {
        apikey: settings.NEWS_API_KEY,
        q: query,
        country: 'in',
        language: 'en',
        category: 'business',
        size: 10
      }
    });
    
    const articles = response.data?.results || [];
    return articles.map(article => ({
      title: article.title,
      description: article.description,
      source: article.source_id,
      url: article.link,
      publishedAt: article.pubDate,
      sentiment: estimateNewsSentiment(article.title, article.description),
      keywords: article.keywords || []
    }));
  } catch (err) {
    console.warn('⚠️ NewsData.io fetch failed:', err.message);
    return [];
  }
};

/**
 * Get stock company profile from Finnhub
 */
export const getCompanyProfile = async (symbol) => {
  try {
    const response = await finnhubClient.get('/stock/profile2', {
      params: { symbol }
    });
    return response.data;
  } catch (err) {
    console.warn(`⚠️ Company profile fetch failed for ${symbol}:`, err.message);
    return null;
  }
};

/**
 * Get basic financials / technicals from Finnhub
 */
export const getBasicFinancials = async (symbol) => {
  try {
    const response = await finnhubClient.get('/stock/metric', {
      params: { symbol, metric: 'all' }
    });
    return response.data?.metric || null;
  } catch (err) {
    console.warn(`⚠️ Basic financials fetch failed for ${symbol}:`, err.message);
    return null;
  }
};

/**
 * Get candlestick data from Finnhub
 */
export const getCandlestickData = async (symbol, resolution = 'D', from = null, to = null) => {
  try {
    const now = Math.floor(Date.now() / 1000);
    const fromTs = from || now - 90 * 24 * 60 * 60; // 90 days back
    const toTs = to || now;
    
    const response = await finnhubClient.get('/stock/candle', {
      params: { symbol, resolution, from: fromTs, to: toTs }
    });
    
    if (response.data.s === 'ok') {
      const { c, h, l, o, v, t } = response.data;
      return t.map((timestamp, i) => ({
        time: new Date(timestamp * 1000).toISOString(),
        open: o[i],
        high: h[i],
        low: l[i],
        close: c[i],
        volume: v[i]
      }));
    }
    return [];
  } catch (err) {
    console.warn(`⚠️ Candlestick data fetch failed for ${symbol}:`, err.message);
    return [];
  }
};

/**
 * Calculate RSI from price array
 */
export const calculateRSI = (prices, period = 14) => {
  if (prices.length < period + 1) return null;
  
  let gains = 0, losses = 0;
  for (let i = 1; i <= period; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }
  
  let avgGain = gains / period;
  let avgLoss = losses / period;
  
  for (let i = period + 1; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    const gain = diff >= 0 ? diff : 0;
    const loss = diff < 0 ? -diff : 0;
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
  }
  
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return Math.round(100 - (100 / (1 + rs)));
};

/**
 * Calculate moving averages
 */
export const calculateMA = (prices, period) => {
  if (prices.length < period) return null;
  const slice = prices.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / period;
};

/**
 * Detect technical patterns from OHLCV data
 */
export const detectTechPatterns = (candles) => {
  if (!candles || candles.length < 20) return [];
  
  const patterns = [];
  const closes = candles.map(c => c.close);
  const highs = candles.map(c => c.high);
  const lows = candles.map(c => c.low);
  const volumes = candles.map(c => c.volume);
  
  const rsi = calculateRSI(closes);
  const ma20 = calculateMA(closes, 20);
  const ma50 = calculateMA(closes, Math.min(50, closes.length));
  const currentPrice = closes[closes.length - 1];
  const recentHigh = Math.max(...highs.slice(-52));
  const avgVolume = volumes.slice(-20).reduce((a, b) => a + b, 0) / 20;
  const latestVolume = volumes[volumes.length - 1];
  
  // 52-week high breakout
  if (currentPrice >= recentHigh * 0.995 && latestVolume > avgVolume * 1.5) {
    patterns.push({
      name: '52-Week High Breakout',
      type: 'breakout',
      confidence: rsi < 75 ? 82 : 65,
      bullish: true,
      rsi,
      volumeSurge: `${(latestVolume / avgVolume).toFixed(1)}x`,
      description: `Price at/near 52-week high with ${(latestVolume / avgVolume).toFixed(1)}x average volume.${rsi > 70 ? ' RSI overbought — reduce size.' : ' Clean breakout setup.'}`
    });
  }
  
  // RSI divergence
  if (rsi < 35) {
    patterns.push({
      name: 'Oversold Reversal Setup',
      type: 'reversal',
      confidence: 72,
      bullish: true,
      rsi,
      description: `RSI at ${rsi} — deeply oversold. Watch for price reversal confirmation.`
    });
  }
  
  // Death cross / Golden cross
  if (ma20 && ma50) {
    if (ma20 > ma50 * 1.002) {
      patterns.push({
        name: 'Golden Cross',
        type: 'continuation',
        confidence: 78,
        bullish: true,
        description: `MA20 (${ma20.toFixed(2)}) crossed above MA50 (${ma50.toFixed(2)}) — bullish momentum.`
      });
    } else if (ma20 < ma50 * 0.998) {
      patterns.push({
        name: 'Death Cross',
        type: 'reversal',
        confidence: 76,
        bullish: false,
        description: `MA20 (${ma20.toFixed(2)}) below MA50 (${ma50.toFixed(2)}) — bearish momentum.`
      });
    }
  }
  
  return patterns;
};

/**
 * Simple sentiment estimator
 */
const estimateNewsSentiment = (title = '', description = '') => {
  const text = (title + ' ' + description).toLowerCase();
  const bullWords = ['surge', 'rally', 'gain', 'growth', 'profit', 'beat', 'record', 'high', 'positive', 'strong'];
  const bearWords = ['fall', 'drop', 'loss', 'decline', 'miss', 'weak', 'concern', 'risk', 'negative', 'sell-off'];
  
  const bullCount = bullWords.filter(w => text.includes(w)).length;
  const bearCount = bearWords.filter(w => text.includes(w)).length;
  
  if (bullCount > bearCount) return 'bullish';
  if (bearCount > bullCount) return 'bearish';
  return 'neutral';
};

/**
 * Fallback NSE indices if live data unavailable
 */
const getFallbackNSEIndices = () => [
  { name: 'NIFTY 50', symbol: '^NSEI', value: 22419.95, change: 145.65, change_pct: 0.65, source: 'Fallback' },
  { name: 'SENSEX', symbol: '^BSESN', value: 73847.15, change: 486.50, change_pct: 0.66, source: 'Fallback' },
  { name: 'NIFTY BANK', symbol: '^NSEBANK', value: 48250.40, change: 312.10, change_pct: 0.65, source: 'Fallback' },
];

export default {
  getStockQuote,
  getNSEMarketOverview,
  getNSEBulkDeals,
  getNSEInsiderTrades,
  getMarketNews,
  getCompanyProfile,
  getBasicFinancials,
  getCandlestickData,
  calculateRSI,
  calculateMA,
  detectTechPatterns,
};
