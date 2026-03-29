/**
 * BULK DEAL ANALYSIS AGENT
 * Track 6 Scenario 1: Detect distress selling vs routine block trades
 *
 * 3-Step Autonomous Pipeline:
 * 1. DETECT: Retrieve bulk deal filing from NSE/BSE
 * 2. ENRICH: Cross-reference management commentary + earnings trajectory
 * 3. ALERT: Generate risk-adjusted alert with specific retail investor action
 *
 * CRITICAL: Alert must CITE the filing - not surface vague warnings
 */

import { callClaude, callClaudeJSON } from '../services/claudeService.js';
import {
  getNSEBulkDeals,
  getMarketNews,
  getStockQuote
} from '../services/marketDataService.js';
import settings from '../config/settings.js';

// Agent state for multi-step reasoning
const AGENT_STATE = {
  IDLE: 'IDLE',
  DETECTING: 'STEP_1_SIGNAL_DETECTION',
  ENRICHING: 'STEP_2_CONTEXT_ENRICHMENT',
  ALERTING: 'STEP_3_ALERT_GENERATION',
  COMPLETE: 'COMPLETE',
};

/**
 * Bulk Deal Analysis Agent Class
 * Implements 3-step autonomous reasoning for filing analysis
 */
export class BulkDealAgent {
  constructor() {
    this.state = AGENT_STATE.IDLE;
    this.analysisLog = [];
    this.filingData = null;
    this.enrichedContext = null;
    this.finalAlert = null;
  }

  /**
   * Log agent reasoning step
   */
  log(step, message, data = null) {
    const entry = {
      timestamp: new Date().toISOString(),
      step,
      message,
      data,
    };
    this.analysisLog.push(entry);
    console.log(`[BulkDealAgent] ${step}: ${message}`);
  }

  /**
   * STEP 1: Detect and retrieve bulk deal filing
   */
  async detectSignal(symbol = null) {
    this.state = AGENT_STATE.DETECTING;
    this.log('STEP_1', 'Initiating bulk deal signal detection');

    try {
      // Fetch recent bulk deals from NSE/BSE
      const bulkDeals = await getNSEBulkDeals(symbol);

      if (!bulkDeals || bulkDeals.length === 0) {
        this.log('STEP_1', 'No bulk deals found for analysis');
        return { success: false, message: 'No recent bulk deals detected' };
      }

      // Identify high-priority deals (promoter sales, large discounts)
      const prioritizedDeals = this.prioritizeDeals(bulkDeals);

      this.filingData = prioritizedDeals[0]; // Take highest priority deal
      this.log('STEP_1', `Detected high-priority bulk deal`, this.filingData);

      return {
        success: true,
        deal: this.filingData,
        totalDealsAnalyzed: bulkDeals.length,
        priority: this.filingData.priorityScore,
      };
    } catch (error) {
      this.log('STEP_1', `Signal detection failed: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * Prioritize deals based on distress indicators
   */
  prioritizeDeals(deals) {
    return deals.map(deal => {
      let priorityScore = 0;
      const flags = [];

      // Promoter selling is highest priority
      if (deal.clientType === 'PROMOTER' || deal.clientName?.toLowerCase().includes('promoter')) {
        priorityScore += 50;
        flags.push('PROMOTER_SALE');
      }

      // Large stake sale (>2%)
      if (deal.quantityPercent && deal.quantityPercent > 2) {
        priorityScore += 30;
        flags.push('LARGE_STAKE');
      }

      // Significant discount to market
      if (deal.discountPercent && deal.discountPercent > 5) {
        priorityScore += 20;
        flags.push('STEEP_DISCOUNT');
      }

      // Sell transaction (vs buy)
      if (deal.buySell === 'S' || deal.transactionType === 'SELL') {
        priorityScore += 10;
        flags.push('SELL_SIDE');
      }

      return {
        ...deal,
        priorityScore,
        distressFlags: flags,
      };
    }).sort((a, b) => b.priorityScore - a.priorityScore);
  }

  /**
   * STEP 2: Enrich with management commentary and earnings context
   */
  async enrichContext() {
    this.state = AGENT_STATE.ENRICHING;
    this.log('STEP_2', 'Enriching with management commentary and earnings data');

    if (!this.filingData) {
      this.log('STEP_2', 'No filing data to enrich');
      return { success: false, message: 'Run signal detection first' };
    }

    const symbol = this.filingData.symbol;

    try {
      // Parallel fetch: news + stock quote
      const [newsData, quoteData] = await Promise.all([
        getMarketNews(symbol),
        getStockQuote(symbol),
      ]);

      // Extract management commentary signals from news
      const managementSignals = this.extractManagementSignals(newsData);

      // Calculate earnings trajectory
      const earningsTrajectory = this.assessEarningsTrajectory(quoteData);

      // Build enriched context
      this.enrichedContext = {
        symbol,
        filingDate: this.filingData.dealDate || new Date().toISOString().split('T')[0],
        currentPrice: quoteData?.price || quoteData?.c || 0,
        priceChange52W: quoteData?.priceChange52W || 0,
        managementSentiment: managementSignals.sentiment,
        recentCommentary: managementSignals.headlines,
        earningsTrajectory,
        sectorPerformance: quoteData?.sectorPerformance || 'N/A',
        volatility: quoteData?.volatility || 'MODERATE',
      };

      this.log('STEP_2', 'Context enrichment complete', this.enrichedContext);

      return {
        success: true,
        context: this.enrichedContext,
      };
    } catch (error) {
      this.log('STEP_2', `Enrichment failed: ${error.message}`);

      // Graceful degradation with partial context
      this.enrichedContext = {
        symbol,
        filingDate: this.filingData.dealDate || new Date().toISOString().split('T')[0],
        currentPrice: 0,
        managementSentiment: 'UNKNOWN',
        recentCommentary: [],
        earningsTrajectory: 'INSUFFICIENT_DATA',
      };

      return { success: true, context: this.enrichedContext, partial: true };
    }
  }

  /**
   * Extract management sentiment from news headlines
   */
  extractManagementSignals(newsData) {
    if (!newsData || !newsData.length) {
      return { sentiment: 'NEUTRAL', headlines: [] };
    }

    const keywords = {
      negative: ['resign', 'exit', 'concern', 'weak', 'decline', 'miss', 'cut', 'downgrade', 'fraud', 'investigation'],
      positive: ['strong', 'growth', 'beat', 'upgrade', 'expand', 'profit', 'bullish', 'record'],
    };

    let negativeScore = 0;
    let positiveScore = 0;
    const relevantHeadlines = [];

    newsData.slice(0, 10).forEach(news => {
      const headline = (news.headline || news.title || '').toLowerCase();

      keywords.negative.forEach(kw => {
        if (headline.includes(kw)) negativeScore++;
      });
      keywords.positive.forEach(kw => {
        if (headline.includes(kw)) positiveScore++;
      });

      if (negativeScore > 0 || positiveScore > 0) {
        relevantHeadlines.push(news.headline || news.title);
      }
    });

    let sentiment = 'NEUTRAL';
    if (negativeScore > positiveScore + 2) sentiment = 'NEGATIVE';
    else if (positiveScore > negativeScore + 2) sentiment = 'POSITIVE';

    return { sentiment, headlines: relevantHeadlines.slice(0, 5) };
  }

  /**
   * Assess earnings trajectory from price data
   */
  assessEarningsTrajectory(quoteData) {
    if (!quoteData) return 'INSUFFICIENT_DATA';

    const change = quoteData.priceChange52W || quoteData.changePercent52W || 0;

    if (change > 20) return 'STRONG_GROWTH';
    if (change > 5) return 'MODERATE_GROWTH';
    if (change > -5) return 'STABLE';
    if (change > -20) return 'DECLINING';
    return 'SEVERE_DECLINE';
  }

  /**
   * STEP 3: Generate risk-adjusted alert with Claude reasoning
   */
  async generateAlert() {
    this.state = AGENT_STATE.ALERTING;
    this.log('STEP_3', 'Generating Claude-powered risk alert');

    if (!this.filingData || !this.enrichedContext) {
      this.log('STEP_3', 'Missing data for alert generation');
      return { success: false, message: 'Complete steps 1 and 2 first' };
    }

    const systemPrompt = `You are a SEBI-registered research analyst providing filing-based risk analysis for Indian retail investors. Your analysis MUST:
1. Be specific and cite the actual filing details
2. Clearly distinguish between DISTRESS SELLING and ROUTINE BLOCK TRADE
3. Cross-reference management commentary and earnings trajectory
4. Provide actionable recommendations with specific price levels
5. Include risk disclaimers appropriate for retail investors

CRITICAL: Every alert MUST cite the filing reference (exchange, date, parties involved). Vague warnings are penalized.`;

    const userPrompt = `BULK DEAL FILING ANALYSIS REQUEST

**FILING DETAILS (MUST BE CITED):**
- Exchange: ${this.filingData.exchange || 'NSE/BSE'}
- Filing Date: ${this.enrichedContext.filingDate}
- Stock Symbol: ${this.filingData.symbol}
- Company: ${this.filingData.company || this.filingData.symbol}
- Seller/Buyer: ${this.filingData.clientName || 'Institutional Investor'}
- Transaction Type: ${this.filingData.buySell === 'S' ? 'SALE' : 'PURCHASE'}
- Quantity: ${this.filingData.quantity?.toLocaleString() || 'N/A'} shares
- Stake Percentage: ${this.filingData.quantityPercent || 'N/A'}%
- Deal Price: ₹${this.filingData.dealPrice || 'N/A'}
- Current Market Price: ₹${this.enrichedContext.currentPrice}
- Premium/Discount: ${this.filingData.discountPercent ? `-${this.filingData.discountPercent}%` : 'At market'}

**DISTRESS FLAGS DETECTED:**
${this.filingData.distressFlags?.length > 0 ? this.filingData.distressFlags.map(f => `- ${f}`).join('\n') : '- None detected'}

**MANAGEMENT & EARNINGS CONTEXT:**
- Management Sentiment (from news): ${this.enrichedContext.managementSentiment}
- Recent Commentary Headlines:
${this.enrichedContext.recentCommentary?.length > 0 ? this.enrichedContext.recentCommentary.map(h => `  • ${h}`).join('\n') : '  • No recent management commentary found'}
- Earnings Trajectory: ${this.enrichedContext.earningsTrajectory}
- 52-Week Price Change: ${this.enrichedContext.priceChange52W}%

**ANALYSIS REQUIRED:**
1. Is this DISTRESS SELLING or ROUTINE BLOCK? Cite specific evidence from filing
2. Cross-reference the management sentiment - does it support or contradict the trade?
3. Risk assessment: What's the downside risk for a retail holder?
4. Specific RECOMMENDED ACTION for a retail investor currently holding this stock
5. If advising to hold/sell, provide specific price levels (stop-loss, target)

Format your response with clear sections and bold headers. Begin with the VERDICT in caps.`;

    try {
      const claudeResponse = await callClaude(systemPrompt, userPrompt, 1200);

      this.finalAlert = {
        type: 'BULK_DEAL_ALERT',
        symbol: this.filingData.symbol,
        company: this.filingData.company || this.filingData.symbol,
        severity: this.calculateSeverity(),
        filingReference: {
          exchange: this.filingData.exchange || 'NSE/BSE',
          date: this.enrichedContext.filingDate,
          parties: this.filingData.clientName,
          transactionType: this.filingData.buySell === 'S' ? 'SALE' : 'PURCHASE',
        },
        analysis: claudeResponse,
        distressScore: this.filingData.priorityScore,
        managementSentiment: this.enrichedContext.managementSentiment,
        generatedAt: new Date().toISOString(),
        agentSteps: this.analysisLog.map(l => ({ step: l.step, message: l.message })),
      };

      this.state = AGENT_STATE.COMPLETE;
      this.log('STEP_3', 'Alert generation complete');

      return {
        success: true,
        alert: this.finalAlert,
      };
    } catch (error) {
      this.log('STEP_3', `Alert generation failed: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * Calculate alert severity based on signals
   */
  calculateSeverity() {
    const score = this.filingData?.priorityScore || 0;
    const sentiment = this.enrichedContext?.managementSentiment;

    if (score >= 70 || sentiment === 'NEGATIVE') return 'HIGH';
    if (score >= 40) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Run full 3-step autonomous analysis
   * This is the main entry point for the agent
   */
  async runFullAnalysis(symbol = null) {
    this.log('PIPELINE', 'Starting 3-step autonomous bulk deal analysis');

    // Step 1: Detect signal
    const step1 = await this.detectSignal(symbol);
    if (!step1.success) {
      return {
        success: false,
        step: 'SIGNAL_DETECTION',
        error: step1.message || step1.error,
        log: this.analysisLog,
      };
    }

    // Step 2: Enrich context
    const step2 = await this.enrichContext();
    if (!step2.success) {
      return {
        success: false,
        step: 'CONTEXT_ENRICHMENT',
        error: step2.message,
        log: this.analysisLog,
      };
    }

    // Step 3: Generate alert
    const step3 = await this.generateAlert();
    if (!step3.success) {
      return {
        success: false,
        step: 'ALERT_GENERATION',
        error: step3.error,
        log: this.analysisLog,
      };
    }

    return {
      success: true,
      pipelineSteps: [
        'STEP 1: Signal Detection (NSE/BSE Bulk Deal Filing)',
        'STEP 2: Context Enrichment (Management Commentary + Earnings)',
        'STEP 3: Alert Generation (Claude-Powered Risk Analysis)',
      ],
      alert: this.finalAlert,
      executionLog: this.analysisLog,
      autonomousSteps: 3,
    };
  }

  /**
   * Get current agent state
   */
  getState() {
    return {
      currentState: this.state,
      hasFilingData: !!this.filingData,
      hasEnrichedContext: !!this.enrichedContext,
      hasAlert: !!this.finalAlert,
      logEntries: this.analysisLog.length,
    };
  }
}

/**
 * Factory function for quick analysis
 */
export const analyzeBulkDeal = async (symbol = null) => {
  const agent = new BulkDealAgent();
  return await agent.runFullAnalysis(symbol);
};

export default BulkDealAgent;
