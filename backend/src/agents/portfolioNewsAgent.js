/**
 * PORTFOLIO-AWARE NEWS PRIORITIZATION AGENT
 * Track 6 Scenario 3: News prioritization based on user portfolio
 *
 * 3-Step Autonomous Pipeline:
 * 1. INGEST: Retrieve breaking news and user portfolio holdings
 * 2. ANALYZE: Calculate financial materiality for each holding
 * 3. PRIORITIZE: Generate prioritized alerts with quantified P&L impact
 *
 * CRITICAL: Must quantify estimated P&L impact - NOT generic news summary
 */

import { callClaude } from '../services/claudeService.js';
import { getMarketNews, getStockQuote } from '../services/marketDataService.js';
import settings from '../config/settings.js';

const AGENT_STATE = {
  IDLE: 'IDLE',
  INGESTING: 'STEP_1_NEWS_PORTFOLIO_INGEST',
  ANALYZING: 'STEP_2_MATERIALITY_ANALYSIS',
  PRIORITIZING: 'STEP_3_IMPACT_PRIORITIZATION',
  COMPLETE: 'COMPLETE',
};

// News event categories with typical impact ranges
const EVENT_IMPACT_MATRIX = {
  'RBI_RATE_CUT': { sectors: ['BANKS', 'NBFC', 'REAL_ESTATE', 'AUTO'], impactRange: [0.5, 2.0], direction: 'POSITIVE' },
  'RBI_RATE_HIKE': { sectors: ['BANKS', 'NBFC', 'REAL_ESTATE', 'AUTO'], impactRange: [-1.5, -0.3], direction: 'NEGATIVE' },
  'SECTOR_REGULATION': { sectors: ['ALL'], impactRange: [-4.0, -1.0], direction: 'NEGATIVE' },
  'BUDGET_ANNOUNCEMENT': { sectors: ['ALL'], impactRange: [-2.0, 3.0], direction: 'MIXED' },
  'EARNINGS_BEAT': { sectors: ['SPECIFIC'], impactRange: [2.0, 8.0], direction: 'POSITIVE' },
  'EARNINGS_MISS': { sectors: ['SPECIFIC'], impactRange: [-8.0, -2.0], direction: 'NEGATIVE' },
  'FDI_POLICY': { sectors: ['ALL'], impactRange: [0.5, 2.5], direction: 'POSITIVE' },
  'TRADE_WAR': { sectors: ['IT', 'PHARMA', 'EXPORT'], impactRange: [-3.0, -1.0], direction: 'NEGATIVE' },
  'CURRENCY_MOVE': { sectors: ['IT', 'PHARMA', 'IMPORT_HEAVY'], impactRange: [-2.0, 2.0], direction: 'MIXED' },
  'COMMODITY_PRICE': { sectors: ['METALS', 'OIL_GAS', 'CHEMICALS'], impactRange: [-3.0, 3.0], direction: 'MIXED' },
  'MGMT_CHANGE': { sectors: ['SPECIFIC'], impactRange: [-5.0, 5.0], direction: 'MIXED' },
  'M_AND_A': { sectors: ['SPECIFIC'], impactRange: [-2.0, 15.0], direction: 'MIXED' },
  'DEFAULT_RISK': { sectors: ['SPECIFIC'], impactRange: [-15.0, -5.0], direction: 'NEGATIVE' },
  'GENERAL_NEWS': { sectors: ['ALL'], impactRange: [-0.5, 0.5], direction: 'NEUTRAL' },
};

// Sector classification for Indian stocks
const STOCK_SECTOR_MAP = {
  'HDFCBANK': 'BANKS', 'ICICIBANK': 'BANKS', 'SBIN': 'BANKS', 'KOTAKBANK': 'BANKS', 'AXISBANK': 'BANKS',
  'BAJFINANCE': 'NBFC', 'BAJAJFINSV': 'NBFC', 'HDFC': 'NBFC',
  'TCS': 'IT', 'INFY': 'IT', 'WIPRO': 'IT', 'HCLTECH': 'IT', 'TECHM': 'IT', 'LTI': 'IT',
  'RELIANCE': 'CONGLOMERATE', 'ADANIENT': 'CONGLOMERATE', 'ADANIPORTS': 'INFRA',
  'SUNPHARMA': 'PHARMA', 'DRREDDY': 'PHARMA', 'CIPLA': 'PHARMA', 'DIVISLAB': 'PHARMA',
  'TATASTEEL': 'METALS', 'HINDALCO': 'METALS', 'JSWSTEEL': 'METALS',
  'HINDUNILVR': 'FMCG', 'ITC': 'FMCG', 'NESTLEIND': 'FMCG', 'BRITANNIA': 'FMCG',
  'MARUTI': 'AUTO', 'TATAMOTORS': 'AUTO', 'M&M': 'AUTO', 'BAJAJ-AUTO': 'AUTO',
  'LT': 'INFRA', 'ULTRACEMCO': 'CEMENT', 'GRASIM': 'CEMENT',
  'TITAN': 'CONSUMER', 'ASIANPAINT': 'CONSUMER', 'PIDILITIND': 'CHEMICALS',
  'ONGC': 'OIL_GAS', 'BPCL': 'OIL_GAS', 'IOC': 'OIL_GAS',
  'POWERGRID': 'UTILITIES', 'NTPC': 'UTILITIES', 'COALINDIA': 'UTILITIES',
  'BHARTIARTL': 'TELECOM', 'ZOMATO': 'TECH', 'PAYTM': 'TECH',
};

/**
 * Portfolio-Aware News Agent Class
 * Handles news prioritization based on user's specific holdings
 */
export class PortfolioNewsAgent {
  constructor() {
    this.state = AGENT_STATE.IDLE;
    this.analysisLog = [];
    this.newsEvents = null;
    this.portfolio = null;
    this.materialityAnalysis = null;
    this.prioritizedAlerts = null;
  }

  log(step, message, data = null) {
    const entry = {
      timestamp: new Date().toISOString(),
      step,
      message,
      data,
    };
    this.analysisLog.push(entry);
    console.log(`[PortfolioNewsAgent] ${step}: ${message}`);
  }

  /**
   * STEP 1: Ingest news events and portfolio data
   */
  async ingestNewsAndPortfolio(portfolio, customNews = null) {
    this.state = AGENT_STATE.INGESTING;
    this.log('STEP_1', 'Ingesting breaking news and portfolio data');

    if (!portfolio || !portfolio.holdings || portfolio.holdings.length === 0) {
      this.log('STEP_1', 'No portfolio holdings provided');
      return { success: false, message: 'Portfolio with holdings is required' };
    }

    this.portfolio = portfolio;

    try {
      // Fetch breaking news if not provided
      let newsData;
      if (customNews && customNews.length > 0) {
        newsData = customNews;
      } else {
        // Fetch news for portfolio symbols
        const symbolQuery = portfolio.holdings.map(h => h.symbol).slice(0, 5).join(' OR ');
        newsData = await getMarketNews(symbolQuery || 'NSE India stock market');
      }

      // Classify news events
      this.newsEvents = await this.classifyNewsEvents(newsData);

      // Enrich portfolio with current prices
      await this.enrichPortfolioPrices();

      this.log('STEP_1', 'News and portfolio ingestion complete', {
        newsEventsCount: this.newsEvents.length,
        portfolioSize: this.portfolio.holdings.length,
        portfolioValue: this.portfolio.totalValue,
      });

      return {
        success: true,
        newsEvents: this.newsEvents,
        portfolio: this.portfolio,
      };
    } catch (error) {
      this.log('STEP_1', `Ingestion failed: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * Classify news events into impact categories
   */
  async classifyNewsEvents(newsData) {
    if (!newsData || newsData.length === 0) {
      // Generate sample news events for demo
      return this.generateSampleNewsEvents();
    }

    const classified = newsData.map(news => {
      const title = (news.title || '').toLowerCase();
      const description = (news.description || '').toLowerCase();
      const combined = title + ' ' + description;

      // Classify by keywords
      let eventType = 'GENERAL_NEWS';
      let affectedSectors = [];
      let specificStock = null;

      if (combined.includes('rbi') && (combined.includes('rate') || combined.includes('repo'))) {
        eventType = combined.includes('cut') || combined.includes('lower') ? 'RBI_RATE_CUT' : 'RBI_RATE_HIKE';
        affectedSectors = ['BANKS', 'NBFC', 'REAL_ESTATE', 'AUTO'];
      } else if (combined.includes('regulation') || combined.includes('sebi') || combined.includes('compliance')) {
        eventType = 'SECTOR_REGULATION';
        affectedSectors = this.extractAffectedSectors(combined);
      } else if (combined.includes('budget') || combined.includes('fiscal')) {
        eventType = 'BUDGET_ANNOUNCEMENT';
        affectedSectors = ['ALL'];
      } else if (combined.includes('earnings') || combined.includes('quarterly') || combined.includes('results')) {
        eventType = combined.includes('beat') || combined.includes('surge') ? 'EARNINGS_BEAT' : 'EARNINGS_MISS';
        specificStock = this.extractStockMention(combined);
        affectedSectors = ['SPECIFIC'];
      } else if (combined.includes('merger') || combined.includes('acquisition') || combined.includes('takeover')) {
        eventType = 'M_AND_A';
        specificStock = this.extractStockMention(combined);
        affectedSectors = ['SPECIFIC'];
      } else if (combined.includes('ceo') || combined.includes('cfo') || combined.includes('resign')) {
        eventType = 'MGMT_CHANGE';
        specificStock = this.extractStockMention(combined);
        affectedSectors = ['SPECIFIC'];
      } else if (combined.includes('rupee') || combined.includes('dollar') || combined.includes('currency')) {
        eventType = 'CURRENCY_MOVE';
        affectedSectors = ['IT', 'PHARMA', 'IMPORT_HEAVY'];
      }

      return {
        id: Math.random().toString(36).substr(2, 9),
        originalNews: news,
        eventType,
        affectedSectors,
        specificStock,
        headline: news.title,
        source: news.source,
        publishedAt: news.publishedAt,
        impactMatrix: EVENT_IMPACT_MATRIX[eventType],
      };
    });

    return classified;
  }

  /**
   * Generate sample news events for demonstration
   */
  generateSampleNewsEvents() {
    return [
      {
        id: 'evt_1',
        eventType: 'RBI_RATE_CUT',
        affectedSectors: ['BANKS', 'NBFC', 'REAL_ESTATE', 'AUTO'],
        specificStock: null,
        headline: 'RBI cuts repo rate by 25 bps to 6.25% citing easing inflation',
        source: 'Economic Times',
        publishedAt: new Date().toISOString(),
        impactMatrix: EVENT_IMPACT_MATRIX['RBI_RATE_CUT'],
      },
      {
        id: 'evt_2',
        eventType: 'SECTOR_REGULATION',
        affectedSectors: ['PHARMA'],
        specificStock: null,
        headline: 'NPPA announces price cap on 50 essential drugs, pharma stocks under pressure',
        source: 'Moneycontrol',
        publishedAt: new Date().toISOString(),
        impactMatrix: EVENT_IMPACT_MATRIX['SECTOR_REGULATION'],
      },
    ];
  }

  /**
   * Extract affected sectors from news text
   */
  extractAffectedSectors(text) {
    const sectorKeywords = {
      'BANKS': ['bank', 'banking', 'lender', 'credit'],
      'IT': ['software', 'it ', 'technology', 'tech'],
      'PHARMA': ['pharma', 'drug', 'medicine', 'healthcare'],
      'AUTO': ['auto', 'vehicle', 'car', 'ev '],
      'METALS': ['steel', 'metal', 'copper', 'aluminum'],
      'FMCG': ['fmcg', 'consumer goods', 'retail'],
      'OIL_GAS': ['oil', 'gas', 'petroleum', 'refinery'],
    };

    const affected = [];
    for (const [sector, keywords] of Object.entries(sectorKeywords)) {
      if (keywords.some(kw => text.includes(kw))) {
        affected.push(sector);
      }
    }
    return affected.length > 0 ? affected : ['ALL'];
  }

  /**
   * Extract specific stock mention from news
   */
  extractStockMention(text) {
    const stockNames = Object.keys(STOCK_SECTOR_MAP);
    for (const stock of stockNames) {
      if (text.includes(stock.toLowerCase())) {
        return stock;
      }
    }
    return null;
  }

  /**
   * Enrich portfolio with current prices
   */
  async enrichPortfolioPrices() {
    let totalValue = 0;

    for (const holding of this.portfolio.holdings) {
      try {
        const symbol = holding.symbol.includes('.NS') ? holding.symbol : `${holding.symbol}.NS`;
        const quote = await getStockQuote(symbol);
        holding.currentPrice = quote?.price || holding.avgPrice || 100;
        holding.sector = STOCK_SECTOR_MAP[holding.symbol.replace('.NS', '')] || 'OTHER';
        holding.marketValue = holding.quantity * holding.currentPrice;
        totalValue += holding.marketValue;
      } catch (e) {
        holding.currentPrice = holding.avgPrice || 100;
        holding.sector = 'OTHER';
        holding.marketValue = holding.quantity * holding.currentPrice;
        totalValue += holding.marketValue;
      }
    }

    this.portfolio.totalValue = totalValue;

    // Calculate weight percentages
    for (const holding of this.portfolio.holdings) {
      holding.weightPercent = (holding.marketValue / totalValue) * 100;
    }
  }

  /**
   * STEP 2: Analyze financial materiality for each event on portfolio
   */
  async analyzeMateriality() {
    this.state = AGENT_STATE.ANALYZING;
    this.log('STEP_2', 'Analyzing financial materiality of news events');

    if (!this.newsEvents || !this.portfolio) {
      return { success: false, message: 'Run ingestion first' };
    }

    const analysis = [];

    for (const event of this.newsEvents) {
      const impactedHoldings = [];
      let totalImpactLow = 0;
      let totalImpactHigh = 0;

      for (const holding of this.portfolio.holdings) {
        // Check if this holding is affected
        const isDirectlyAffected =
          event.specificStock === holding.symbol.replace('.NS', '') ||
          event.affectedSectors.includes('ALL') ||
          event.affectedSectors.includes(holding.sector);

        if (isDirectlyAffected) {
          const impactMatrix = event.impactMatrix || EVENT_IMPACT_MATRIX['GENERAL_NEWS'];
          const [impactLow, impactHigh] = impactMatrix.impactRange;

          // Calculate P&L impact based on holding weight
          const holdingImpactLow = (holding.marketValue * impactLow) / 100;
          const holdingImpactHigh = (holding.marketValue * impactHigh) / 100;

          impactedHoldings.push({
            symbol: holding.symbol,
            sector: holding.sector,
            marketValue: holding.marketValue,
            weightPercent: holding.weightPercent,
            impactRangePct: [impactLow, impactHigh],
            impactRangeINR: [holdingImpactLow, holdingImpactHigh],
            exposure: event.specificStock === holding.symbol.replace('.NS', '') ? 'DIRECT' : 'SECTOR',
          });

          totalImpactLow += holdingImpactLow;
          totalImpactHigh += holdingImpactHigh;
        }
      }

      // Calculate portfolio-level impact
      const portfolioImpactLowPct = (totalImpactLow / this.portfolio.totalValue) * 100;
      const portfolioImpactHighPct = (totalImpactHigh / this.portfolio.totalValue) * 100;

      analysis.push({
        event,
        impactedHoldings,
        totalImpact: {
          lowINR: totalImpactLow,
          highINR: totalImpactHigh,
          lowPct: portfolioImpactLowPct,
          highPct: portfolioImpactHighPct,
        },
        materialityScore: Math.abs(portfolioImpactLowPct + portfolioImpactHighPct) / 2,
        holdingsAffected: impactedHoldings.length,
        urgency: this.calculateUrgency(event, impactedHoldings),
      });
    }

    // Sort by materiality score (highest impact first)
    analysis.sort((a, b) => b.materialityScore - a.materialityScore);

    this.materialityAnalysis = analysis;
    this.log('STEP_2', 'Materiality analysis complete', {
      eventsAnalyzed: analysis.length,
      topEvent: analysis[0]?.event?.headline,
    });

    return {
      success: true,
      analysis: this.materialityAnalysis,
    };
  }

  /**
   * Calculate urgency based on event type and impact
   */
  calculateUrgency(event, impactedHoldings) {
    const highUrgencyEvents = ['SECTOR_REGULATION', 'EARNINGS_MISS', 'DEFAULT_RISK', 'MGMT_CHANGE'];
    const directExposure = impactedHoldings.some(h => h.exposure === 'DIRECT');

    if (highUrgencyEvents.includes(event.eventType) || directExposure) {
      return 'HIGH';
    }
    if (impactedHoldings.length > 2) {
      return 'MEDIUM';
    }
    return 'LOW';
  }

  /**
   * STEP 3: Generate prioritized alerts with Claude reasoning
   */
  async generatePrioritizedAlerts() {
    this.state = AGENT_STATE.PRIORITIZING;
    this.log('STEP_3', 'Generating Claude-powered prioritized alerts');

    if (!this.materialityAnalysis || this.materialityAnalysis.length === 0) {
      return { success: false, message: 'Run materiality analysis first' };
    }

    const systemPrompt = `You are an AI portfolio advisor for Indian retail investors. You analyze breaking news events and prioritize them based on the user's specific portfolio holdings.

CRITICAL RULES:
1. QUANTIFY the P&L impact - never give vague estimates
2. PRIORITIZE events by financial materiality to THIS specific portfolio
3. Provide ACTIONABLE recommendations (not generic advice)
4. Cite the specific holdings affected
5. Do NOT just summarize news - explain WHY it matters to this investor

Your response should help the investor take immediate, informed action.`;

    const portfolioSummary = this.portfolio.holdings.map(h =>
      `${h.symbol} (${h.sector}): ₹${h.marketValue.toLocaleString()} (${h.weightPercent.toFixed(1)}%)`
    ).join('\n');

    const eventsAnalysis = this.materialityAnalysis.slice(0, 3).map((item, idx) => {
      const holdingsAffected = item.impactedHoldings.map(h =>
        `${h.symbol} (${h.exposure}): ₹${h.impactRangeINR[0].toFixed(0)} to ₹${h.impactRangeINR[1].toFixed(0)}`
      ).join(', ');

      return `
EVENT ${idx + 1}: ${item.event.headline}
- Type: ${item.event.eventType}
- Urgency: ${item.urgency}
- Holdings Affected (${item.holdingsAffected}): ${holdingsAffected || 'None directly'}
- Est. Portfolio Impact: ${item.totalImpact.lowPct.toFixed(2)}% to ${item.totalImpact.highPct.toFixed(2)}%
- Est. P&L Range: ₹${item.totalImpact.lowINR.toFixed(0)} to ₹${item.totalImpact.highINR.toFixed(0)}`;
    }).join('\n');

    const userPrompt = `PORTFOLIO NEWS PRIORITIZATION REQUEST

**USER'S PORTFOLIO (Total: ₹${this.portfolio.totalValue.toLocaleString()}):**
${portfolioSummary}

**BREAKING NEWS EVENTS (Ranked by Materiality):**
${eventsAnalysis}

**ANALYSIS REQUIRED:**
1. Which event is MOST MATERIAL to this specific portfolio? Why?
2. Quantified P&L impact on affected holdings (use the numbers above)
3. PRIORITY ACTION: What should this investor do FIRST?
4. Secondary considerations for other events
5. Time horizon: Immediate (today), Short-term (1 week), or Monitor

Format as a PRIORITIZED ALERT with clear sections:
- 🔴 PRIORITY 1 (Most Material)
- 🟡 PRIORITY 2
- Action Checklist for the investor`;

    try {
      const claudeResponse = await callClaude(systemPrompt, userPrompt, 1500);

      this.prioritizedAlerts = {
        type: 'PORTFOLIO_NEWS_PRIORITIZATION',
        portfolioValue: this.portfolio.totalValue,
        holdingsCount: this.portfolio.holdings.length,
        eventsAnalyzed: this.materialityAnalysis.length,
        topMaterialEvent: this.materialityAnalysis[0]?.event?.headline,
        topMaterialityScore: this.materialityAnalysis[0]?.materialityScore,
        rankedEvents: this.materialityAnalysis.map((item, idx) => ({
          rank: idx + 1,
          headline: item.event.headline,
          eventType: item.event.eventType,
          urgency: item.urgency,
          holdingsAffected: item.holdingsAffected,
          estimatedImpactPct: {
            low: item.totalImpact.lowPct,
            high: item.totalImpact.highPct,
          },
          estimatedImpactINR: {
            low: item.totalImpact.lowINR,
            high: item.totalImpact.highINR,
          },
          affectedHoldings: item.impactedHoldings.map(h => h.symbol),
        })),
        analysis: claudeResponse,
        generatedAt: new Date().toISOString(),
        agentSteps: this.analysisLog.map(l => ({ step: l.step, message: l.message })),
      };

      this.state = AGENT_STATE.COMPLETE;
      this.log('STEP_3', 'Prioritized alerts generated');

      return {
        success: true,
        alerts: this.prioritizedAlerts,
      };
    } catch (error) {
      this.log('STEP_3', `Alert generation failed: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * Run full 3-step autonomous analysis
   */
  async runFullAnalysis(portfolio, customNews = null) {
    if (!portfolio || !portfolio.holdings) {
      return {
        success: false,
        error: 'Portfolio with holdings array is required',
        example: {
          holdings: [
            { symbol: 'HDFCBANK', quantity: 100, avgPrice: 1600 },
            { symbol: 'TCS', quantity: 50, avgPrice: 3500 },
          ]
        }
      };
    }

    this.log('PIPELINE', `Starting 3-step portfolio news analysis for ${portfolio.holdings.length} holdings`);

    // Step 1: Ingest news and portfolio
    const step1 = await this.ingestNewsAndPortfolio(portfolio, customNews);
    if (!step1.success) {
      return {
        success: false,
        step: 'NEWS_PORTFOLIO_INGEST',
        error: step1.message || step1.error,
        log: this.analysisLog,
      };
    }

    // Step 2: Analyze materiality
    const step2 = await this.analyzeMateriality();
    if (!step2.success) {
      return {
        success: false,
        step: 'MATERIALITY_ANALYSIS',
        error: step2.message,
        log: this.analysisLog,
      };
    }

    // Step 3: Generate prioritized alerts
    const step3 = await this.generatePrioritizedAlerts();
    if (!step3.success) {
      return {
        success: false,
        step: 'ALERT_PRIORITIZATION',
        error: step3.error,
        log: this.analysisLog,
      };
    }

    return {
      success: true,
      pipelineSteps: [
        'STEP 1: News & Portfolio Ingestion (Event Classification)',
        'STEP 2: Materiality Analysis (P&L Impact Calculation)',
        'STEP 3: Prioritized Alert Generation (Claude-Powered)',
      ],
      alerts: this.prioritizedAlerts,
      executionLog: this.analysisLog,
      autonomousSteps: 3,
    };
  }

  getState() {
    return {
      currentState: this.state,
      hasNewsEvents: !!this.newsEvents,
      hasPortfolio: !!this.portfolio,
      hasMaterialityAnalysis: !!this.materialityAnalysis,
      hasAlerts: !!this.prioritizedAlerts,
      logEntries: this.analysisLog.length,
    };
  }
}

/**
 * Factory function for quick analysis
 */
export const analyzePortfolioNews = async (portfolio, customNews = null) => {
  const agent = new PortfolioNewsAgent();
  return await agent.runFullAnalysis(portfolio, customNews);
};

export default PortfolioNewsAgent;
