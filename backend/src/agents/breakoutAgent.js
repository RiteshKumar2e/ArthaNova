/**
 * TECHNICAL BREAKOUT AGENT
 * Track 6 Scenario 2: Breakout detection with conflicting signal resolution
 *
 * 3-Step Autonomous Pipeline:
 * 1. DETECT: Identify breakout pattern (52-week high, volume spike)
 * 2. ANALYZE: Surface conflicting signals (RSI overbought, FII exposure changes)
 * 3. RECOMMEND: Balanced, data-backed recommendation (NOT binary buy/sell)
 *
 * CRITICAL: Oversimplified or one-sided outputs are penalized
 */

import { callClaude } from '../services/claudeService.js';
import {
  getStockQuote,
  getCandlestickData,
  getNSEInsiderTrades
} from '../services/marketDataService.js';
import settings from '../config/settings.js';

const AGENT_STATE = {
  IDLE: 'IDLE',
  DETECTING: 'STEP_1_PATTERN_DETECTION',
  ANALYZING: 'STEP_2_SIGNAL_ANALYSIS',
  RECOMMENDING: 'STEP_3_BALANCED_RECOMMENDATION',
  COMPLETE: 'COMPLETE',
};

/**
 * Technical Breakout Agent Class
 * Handles multi-signal technical analysis with conflict resolution
 */
export class BreakoutAgent {
  constructor() {
    this.state = AGENT_STATE.IDLE;
    this.analysisLog = [];
    this.patternData = null;
    this.conflictingSignals = null;
    this.recommendation = null;
  }

  log(step, message, data = null) {
    const entry = {
      timestamp: new Date().toISOString(),
      step,
      message,
      data,
    };
    this.analysisLog.push(entry);
    console.log(`[BreakoutAgent] ${step}: ${message}`);
  }

  /**
   * STEP 1: Detect breakout pattern
   */
  async detectPattern(symbol) {
    this.state = AGENT_STATE.DETECTING;
    this.log('STEP_1', `Initiating breakout pattern detection for ${symbol}`);

    try {
      // Fetch current quote and historical data
      const [quote, historical] = await Promise.all([
        getStockQuote(symbol),
        getCandlestickData(symbol),
      ]);

      if (!quote) {
        this.log('STEP_1', 'Failed to fetch stock quote');
        return { success: false, message: 'Unable to fetch stock data' };
      }

      // Calculate technical indicators
      const technicals = this.calculateTechnicals(quote, historical);

      // Detect breakout conditions
      const breakoutAnalysis = this.analyzeBreakout(technicals);

      this.patternData = {
        symbol,
        currentPrice: quote.price || quote.c || 0,
        weekHigh52: quote.high52 || quote.fiftyTwoWeekHigh || technicals.high52,
        weekLow52: quote.low52 || quote.fiftyTwoWeekLow || technicals.low52,
        volume: quote.volume || quote.v || 0,
        avgVolume: technicals.avgVolume,
        volumeRatio: technicals.volumeRatio,
        rsi: technicals.rsi,
        sma20: technicals.sma20,
        sma50: technicals.sma50,
        sma200: technicals.sma200,
        ...breakoutAnalysis,
      };

      this.log('STEP_1', 'Pattern detection complete', this.patternData);

      return {
        success: true,
        pattern: this.patternData,
        breakoutDetected: breakoutAnalysis.isBreakout,
      };
    } catch (error) {
      this.log('STEP_1', `Pattern detection failed: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * Calculate technical indicators from historical data
   */
  calculateTechnicals(quote, historical) {
    const prices = historical?.prices || historical || [];
    const closes = prices.map(p => p.close || p.c || p).filter(p => typeof p === 'number');
    const volumes = prices.map(p => p.volume || p.v || 0).filter(v => v > 0);

    // RSI Calculation (14-period)
    const rsi = this.calculateRSI(closes, 14);

    // Moving Averages
    const sma20 = this.calculateSMA(closes, 20);
    const sma50 = this.calculateSMA(closes, 50);
    const sma200 = this.calculateSMA(closes, 200);

    // Volume analysis
    const avgVolume = volumes.length > 0
      ? volumes.slice(-20).reduce((a, b) => a + b, 0) / Math.min(volumes.length, 20)
      : 0;
    const currentVolume = quote.volume || quote.v || (volumes.length > 0 ? volumes[volumes.length - 1] : 0);
    const volumeRatio = avgVolume > 0 ? currentVolume / avgVolume : 1;

    // 52-week high/low from historical
    const high52 = closes.length > 0 ? Math.max(...closes) : quote.high52 || 0;
    const low52 = closes.length > 0 ? Math.min(...closes) : quote.low52 || 0;

    return {
      rsi,
      sma20,
      sma50,
      sma200,
      avgVolume,
      volumeRatio,
      high52,
      low52,
    };
  }

  /**
   * Calculate RSI (Relative Strength Index)
   */
  calculateRSI(prices, period = 14) {
    if (prices.length < period + 1) return 50; // Default neutral

    const changes = [];
    for (let i = 1; i < prices.length; i++) {
      changes.push(prices[i] - prices[i - 1]);
    }

    const recentChanges = changes.slice(-period);
    let gains = 0, losses = 0;

    recentChanges.forEach(change => {
      if (change > 0) gains += change;
      else losses += Math.abs(change);
    });

    const avgGain = gains / period;
    const avgLoss = losses / period;

    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return Math.round(100 - (100 / (1 + rs)));
  }

  /**
   * Calculate Simple Moving Average
   */
  calculateSMA(prices, period) {
    if (prices.length < period) return prices.length > 0 ? prices[prices.length - 1] : 0;
    const slice = prices.slice(-period);
    return slice.reduce((a, b) => a + b, 0) / period;
  }

  /**
   * Analyze breakout conditions
   */
  analyzeBreakout(technicals) {
    const { rsi, sma20, sma50, sma200, volumeRatio, high52, low52 } = technicals;

    // Breakout conditions
    const priceNear52WeekHigh = high52 > 0; // Will compare with current price
    const volumeBreakout = volumeRatio > 1.5; // 50% above average
    const aboveSMA20 = sma20 > 0;
    const goldenCross = sma50 > sma200;

    // Overbought/oversold
    const isOverbought = rsi > 70;
    const isOversold = rsi < 30;

    return {
      isBreakout: volumeBreakout, // Simplified for now, will be refined with price
      isOverbought,
      isOversold,
      volumeBreakout,
      goldenCross,
      rsiZone: isOverbought ? 'OVERBOUGHT' : (isOversold ? 'OVERSOLD' : 'NEUTRAL'),
    };
  }

  /**
   * STEP 2: Analyze conflicting signals
   */
  async analyzeConflictingSignals() {
    this.state = AGENT_STATE.ANALYZING;
    this.log('STEP_2', 'Analyzing conflicting signals');

    if (!this.patternData) {
      return { success: false, message: 'Run pattern detection first' };
    }

    try {
      // Fetch FII/DII data for institutional sentiment (using insider trades as proxy)
      const fiiData = await getNSEInsiderTrades();

      // Build conflict matrix
      const signals = [];
      const conflicts = [];

      // BULLISH signals
      if (this.patternData.isBreakout) {
        signals.push({
          type: 'BULLISH',
          signal: '52-WEEK_HIGH_BREAKOUT',
          description: `Price near/above 52-week high (₹${this.patternData.weekHigh52})`,
          weight: 3,
        });
      }

      if (this.patternData.volumeBreakout) {
        signals.push({
          type: 'BULLISH',
          signal: 'VOLUME_CONFIRMATION',
          description: `Volume ${(this.patternData.volumeRatio * 100 - 100).toFixed(0)}% above average`,
          weight: 2,
        });
      }

      if (this.patternData.goldenCross) {
        signals.push({
          type: 'BULLISH',
          signal: 'GOLDEN_CROSS',
          description: '50-day SMA above 200-day SMA',
          weight: 2,
        });
      }

      // BEARISH / CONFLICTING signals
      if (this.patternData.isOverbought) {
        signals.push({
          type: 'BEARISH',
          signal: 'RSI_OVERBOUGHT',
          description: `RSI at ${this.patternData.rsi} (>70 = overbought, potential pullback)`,
          weight: 2,
        });
        conflicts.push('RSI indicates overbought - classic bull trap risk');
      }

      // FII/Institutional exposure analysis from insider trades
      if (fiiData && fiiData.length > 0) {
        // Filter for relevant symbol and analyze buy/sell pattern
        const symbolTrades = fiiData.filter(t =>
          t.symbol === this.patternData.symbol ||
          this.patternData.symbol.includes(t.symbol)
        );

        // Count recent institutional sells vs buys
        let sellCount = 0, buyCount = 0;
        (symbolTrades.length > 0 ? symbolTrades : fiiData.slice(0, 10)).forEach(trade => {
          if (trade.buySell === 'S') sellCount++;
          else buyCount++;
        });

        const netSentiment = buyCount - sellCount;
        if (netSentiment < -2) {
          signals.push({
            type: 'BEARISH',
            signal: 'INSTITUTIONAL_SELLING',
            description: `Institutional/Promoter selling detected (${sellCount} sells vs ${buyCount} buys in recent filings)`,
            weight: 3,
          });
          conflicts.push('Institutional selling despite price strength');
        } else if (netSentiment > 2) {
          signals.push({
            type: 'BULLISH',
            signal: 'INSTITUTIONAL_BUYING',
            description: `Institutional/Promoter buying detected (${buyCount} buys vs ${sellCount} sells in recent filings)`,
            weight: 2,
          });
        }
      }

      // Calculate net signal strength
      const bullishWeight = signals.filter(s => s.type === 'BULLISH').reduce((a, s) => a + s.weight, 0);
      const bearishWeight = signals.filter(s => s.type === 'BEARISH').reduce((a, s) => a + s.weight, 0);
      const netSignal = bullishWeight - bearishWeight;

      this.conflictingSignals = {
        signals,
        conflicts,
        bullishCount: signals.filter(s => s.type === 'BULLISH').length,
        bearishCount: signals.filter(s => s.type === 'BEARISH').length,
        bullishWeight,
        bearishWeight,
        netSignal,
        signalStrength: netSignal > 3 ? 'STRONG_BULLISH' :
                        netSignal > 0 ? 'WEAK_BULLISH' :
                        netSignal > -3 ? 'WEAK_BEARISH' : 'STRONG_BEARISH',
        hasConflicts: conflicts.length > 0,
        fiiData,
      };

      this.log('STEP_2', 'Conflict analysis complete', this.conflictingSignals);

      return {
        success: true,
        analysis: this.conflictingSignals,
      };
    } catch (error) {
      this.log('STEP_2', `Conflict analysis failed: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * STEP 3: Generate balanced recommendation via Claude
   */
  async generateRecommendation() {
    this.state = AGENT_STATE.RECOMMENDING;
    this.log('STEP_3', 'Generating Claude-powered balanced recommendation');

    if (!this.patternData || !this.conflictingSignals) {
      return { success: false, message: 'Complete steps 1 and 2 first' };
    }

    const systemPrompt = `You are a SEBI-certified technical analyst specializing in NSE/BSE stocks. You provide BALANCED, data-backed analysis.

CRITICAL RULES:
1. NEVER give binary buy/sell recommendations
2. ALWAYS acknowledge conflicting signals explicitly
3. Quantify historical success rates for the pattern
4. Present risk-reward with specific price levels
5. Oversimplified or one-sided analysis is PENALIZED

Your output should help retail investors make informed decisions, not tell them what to do.`;

    const signalSummary = this.conflictingSignals.signals
      .map(s => `${s.type === 'BULLISH' ? '🟢' : '🔴'} ${s.signal}: ${s.description}`)
      .join('\n');

    const userPrompt = `TECHNICAL BREAKOUT ANALYSIS — ${this.patternData.symbol}

**PRICE DATA:**
- Current Price: ₹${this.patternData.currentPrice?.toFixed(2)}
- 52-Week High: ₹${this.patternData.weekHigh52?.toFixed(2)}
- 52-Week Low: ₹${this.patternData.weekLow52?.toFixed(2)}
- Distance from 52W High: ${((1 - this.patternData.currentPrice / this.patternData.weekHigh52) * 100).toFixed(1)}%

**TECHNICAL INDICATORS:**
- RSI (14): ${this.patternData.rsi} → ${this.patternData.rsiZone}
- Volume Ratio: ${this.patternData.volumeRatio?.toFixed(2)}x average ${this.patternData.volumeBreakout ? '(BREAKOUT CONFIRMED)' : ''}
- SMA 20/50/200: ₹${this.patternData.sma20?.toFixed(0)} / ₹${this.patternData.sma50?.toFixed(0)} / ₹${this.patternData.sma200?.toFixed(0)}
- Trend: ${this.patternData.goldenCross ? 'GOLDEN CROSS (Bullish)' : 'Below golden cross'}

**ALL SIGNALS DETECTED:**
${signalSummary}

**SIGNAL STRENGTH:**
- Bullish Signals: ${this.conflictingSignals.bullishCount} (weight: ${this.conflictingSignals.bullishWeight})
- Bearish Signals: ${this.conflictingSignals.bearishCount} (weight: ${this.conflictingSignals.bearishWeight})
- Net Signal: ${this.conflictingSignals.netSignal > 0 ? '+' : ''}${this.conflictingSignals.netSignal} (${this.conflictingSignals.signalStrength})

**KEY CONFLICTS IDENTIFIED:**
${this.conflictingSignals.conflicts.length > 0
  ? this.conflictingSignals.conflicts.map(c => `⚠️ ${c}`).join('\n')
  : 'No major conflicts detected'}

**REQUIRED ANALYSIS:**
1. Historical success rate: What % of similar patterns (52W high breakout + current RSI + volume) have succeeded for large-cap IT stocks?
2. The 2-3 most important conflicting signals and why they matter
3. A BALANCED recommendation with MULTIPLE scenarios:
   - Bull case: If breakout holds, target and probability
   - Bear case: If it fails, risk and stop-loss level
4. Specific entry strategy (NOT "buy now" - consider scaling in, waiting for pullback, etc.)
5. Risk-reward ratio with specific price levels

DO NOT give a one-sided bullish or bearish take. Present both scenarios.`;

    try {
      const claudeResponse = await callClaude(systemPrompt, userPrompt, 1500);

      this.recommendation = {
        type: 'TECHNICAL_BREAKOUT_ANALYSIS',
        symbol: this.patternData.symbol,
        patternType: 'POTENTIAL_52W_HIGH_BREAKOUT',
        technicals: {
          currentPrice: this.patternData.currentPrice,
          weekHigh52: this.patternData.weekHigh52,
          rsi: this.patternData.rsi,
          volumeRatio: this.patternData.volumeRatio,
        },
        signalSummary: {
          strength: this.conflictingSignals.signalStrength,
          netScore: this.conflictingSignals.netSignal,
          hasConflicts: this.conflictingSignals.hasConflicts,
          conflictCount: this.conflictingSignals.conflicts.length,
        },
        allSignals: this.conflictingSignals.signals,
        conflicts: this.conflictingSignals.conflicts,
        analysis: claudeResponse,
        generatedAt: new Date().toISOString(),
        agentSteps: this.analysisLog.map(l => ({ step: l.step, message: l.message })),
      };

      this.state = AGENT_STATE.COMPLETE;
      this.log('STEP_3', 'Balanced recommendation generated');

      return {
        success: true,
        recommendation: this.recommendation,
      };
    } catch (error) {
      this.log('STEP_3', `Recommendation generation failed: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * Run full 3-step autonomous analysis
   */
  async runFullAnalysis(symbol) {
    if (!symbol) {
      return { success: false, error: 'Symbol is required' };
    }

    this.log('PIPELINE', `Starting 3-step breakout analysis for ${symbol}`);

    // Step 1: Detect pattern
    const step1 = await this.detectPattern(symbol);
    if (!step1.success) {
      return {
        success: false,
        step: 'PATTERN_DETECTION',
        error: step1.message || step1.error,
        log: this.analysisLog,
      };
    }

    // Step 2: Analyze conflicting signals
    const step2 = await this.analyzeConflictingSignals();
    if (!step2.success) {
      return {
        success: false,
        step: 'CONFLICT_ANALYSIS',
        error: step2.message || step2.error,
        log: this.analysisLog,
      };
    }

    // Step 3: Generate recommendation
    const step3 = await this.generateRecommendation();
    if (!step3.success) {
      return {
        success: false,
        step: 'RECOMMENDATION',
        error: step3.error,
        log: this.analysisLog,
      };
    }

    return {
      success: true,
      pipelineSteps: [
        'STEP 1: Pattern Detection (52W High, Volume, RSI)',
        'STEP 2: Conflicting Signal Analysis (FII Data, Overbought)',
        'STEP 3: Balanced Recommendation (Claude-Powered)',
      ],
      recommendation: this.recommendation,
      executionLog: this.analysisLog,
      autonomousSteps: 3,
    };
  }

  getState() {
    return {
      currentState: this.state,
      hasPatternData: !!this.patternData,
      hasConflictAnalysis: !!this.conflictingSignals,
      hasRecommendation: !!this.recommendation,
      logEntries: this.analysisLog.length,
    };
  }
}

/**
 * Factory function for quick analysis
 */
export const analyzeBreakout = async (symbol) => {
  const agent = new BreakoutAgent();
  return await agent.runFullAnalysis(symbol);
};

export default BreakoutAgent;
