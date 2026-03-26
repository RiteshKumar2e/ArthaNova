import axios from 'axios';
import settings from '../config/settings.js';

// Initialize Grow API client
const growClient = axios.create({
  baseURL: settings.GROW_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${settings.GROW_API_KEY}`,
    'X-API-Secret': settings.GROW_API_SECRET,
  },
  timeout: 10000,
});

/**
 * Fetch market indices data from Grow API
 * Includes NIFTY 50, SENSEX, NIFTY BANK, etc.
 */
export const getMarketIndices = async () => {
  try {
    console.log('📊 Fetching market indices from Grow API...');
    
    // Grow API endpoint for indices
    const response = await growClient.get('/market/indices', {
      params: {
        include: 'NIFTY_50,SENSEX,NIFTY_BANK',
      },
    });

    const { data } = response;

    // Transform API response to match our format
    const indices = data.map(index => ({
      name: index.name,
      value: index.ltp || index.last_traded_price,
      change: index.change,
      change_pct: index.change_percent,
      high: index.high_price,
      low: index.low_price,
      volume: index.volume,
    }));

    return indices;
  } catch (error) {
    console.error('❌ Error fetching market indices:', error.message);
    // Return fallback data if API fails
    return getFallbackIndices();
  }
};

/**
 * Fetch market breadth (advances, declines, unchanged)
 */
export const getMarketBreadth = async () => {
  try {
    console.log('📈 Fetching market breadth from Grow API...');

    const response = await growClient.get('/market/breadth');
    const { data } = response;

    return {
      advances: data.advances || 0,
      declines: data.declines || 0,
      unchanged: data.unchanged || 0,
      market_trend: data.trend || 'NEUTRAL',
    };
  } catch (error) {
    console.error('❌ Error fetching market breadth:', error.message);
    return getFallbackBreadth();
  }
};

/**
 * Fetch FII/DII flows
 */
export const getFiiDiiFlows = async () => {
  try {
    console.log('💰 Fetching FII/DII flows from Grow API...');

    const response = await growClient.get('/market/fii-dii');
    const { data } = response;

    return {
      fii_buy: data.fii_buy_value || 0,
      fii_sell: data.fii_sell_value || 0,
      fii_net: (data.fii_buy_value || 0) - (data.fii_sell_value || 0),
      dii_buy: data.dii_buy_value || 0,
      dii_sell: data.dii_sell_value || 0,
      dii_net: (data.dii_buy_value || 0) - (data.dii_sell_value || 0),
      timestamp: data.timestamp,
    };
  } catch (error) {
    console.error('❌ Error fetching FII/DII flows:', error.message);
    return getFallbackFiiDii();
  }
};

/**
 * Fetch VIX (volatility index)
 */
export const getVixData = async () => {
  try {
    console.log('📊 Fetching VIX data from Grow API...');

    const response = await growClient.get('/market/vix');
    const { data } = response;

    return {
      value: data.ltp || data.last_traded_price,
      change: data.change,
      change_pct: data.change_percent,
      high: data.high_price,
      low: data.low_price,
    };
  } catch (error) {
    console.error('❌ Error fetching VIX:', error.message);
    return getFallbackVix();
  }
};

/**
 * Get comprehensive market overview combining all data
 */
export const getMarketOverview = async () => {
  try {
    console.log('🌍 Building comprehensive market overview...');

    const [indices, breadth, fiiDii, vix] = await Promise.all([
      getMarketIndices(),
      getMarketBreadth(),
      getFiiDiiFlows(),
      getVixData(),
    ]);

    return {
      indices,
      market_breadth: breadth.market_trend,
      advance_decline: {
        advances: breadth.advances,
        declines: breadth.declines,
        unchanged: breadth.unchanged,
      },
      vix: vix.value,
      fii_dii: fiiDii,
      last_updated: new Date().toISOString(),
      source: 'Grow API',
    };
  } catch (error) {
    console.error('❌ Error building market overview:', error.message);
    return getFallbackMarketOverview();
  }
};

/**
 * Fallback data in case API fails
 */
const getFallbackIndices = () => [
  { name: 'NIFTY 50', value: 22450.15, change: 112.4, change_pct: 0.5, high: 22500, low: 22300, volume: 1500000 },
  { name: 'SENSEX', value: 73850.30, change: 345.2, change_pct: 0.47, high: 73900, low: 73600, volume: 2000000 },
  { name: 'NIFTY BANK', value: 48120.45, change: 450.1, change_pct: 0.94, high: 48200, low: 47900, volume: 500000 },
];

const getFallbackBreadth = () => ({
  advances: 32,
  declines: 15,
  unchanged: 3,
  market_trend: 'BULLISH',
});

const getFallbackFiiDii = () => ({
  fii_buy: 12450.5,
  fii_sell: 11200.2,
  fii_net: 1250.3,
  dii_buy: 8900.8,
  dii_sell: 8200.4,
  dii_net: 700.4,
  timestamp: new Date().toISOString(),
});

const getFallbackVix = () => ({
  value: 14.2,
  change: -0.5,
  change_pct: -3.4,
  high: 15.0,
  low: 13.8,
});

const getFallbackMarketOverview = () => ({
  indices: getFallbackIndices(),
  market_breadth: 'Bullish',
  advance_decline: {
    advances: 32,
    declines: 15,
    unchanged: 3,
  },
  vix: 14.2,
  fii_dii: getFallbackFiiDii(),
  last_updated: new Date().toISOString(),
  source: 'Mock Data (Grow API Unavailable)',
});

export default {
  getMarketIndices,
  getMarketBreadth,
  getFiiDiiFlows,
  getVixData,
  getMarketOverview,
};
