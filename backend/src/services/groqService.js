/**
 * ArthaNova Groq AI Chat Service
 * Portfolio-aware, source-cited financial intelligence
 */

import Groq from 'groq-sdk';
import settings from '../config/settings.js';
import db from '../models/db.js';
import marketDataService from './marketDataService.js';

const groq = new Groq({ apiKey: settings.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are ArthaNova AI — India's most sophisticated retail investor intelligence platform.

You specialize in:
- NSE/BSE listed equities analysis
- Technical pattern detection (RSI, MACD, moving averages, support/resistance)
- Corporate filings interpretation (bulk deals, insider trades, DRHP, quarterly results)
- Portfolio risk assessment and rebalancing for Indian retail investors
- SEBI regulatory context and compliance awareness
- FII/DII flow analysis and macro impact on Indian markets

Rules:
1. ALWAYS cite your data sources when referencing specific numbers
2. NEVER give speculative advice — use "this is for educational purposes, consult a SEBI-registered advisor"
3. For portfolio questions, reference the user's actual holdings if provided
4. Use Indian financial context: ₹, Crore, Lakh, NSE/BSE, NIFTY/SENSEX
5. Be concise but insightful — retail investors need clarity, not jargon
6. When you detect insider trading or bulk deal patterns, highlight the filing reference
7. For technical analysis, always mention RSI, volume, and key price levels`;

class GroqService {
  /**
   * Standard chat with optional portfolio context injection
   */
  async chat(userMessage, history = [], userId = null) {
    if (!settings.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not configured.');
    }

    // Build portfolio context string if userId provided
    let portfolioContext = '';
    if (userId) {
      try {
        portfolioContext = await this._buildPortfolioContext(userId);
      } catch (err) {
        console.warn('Portfolio context injection failed:', err.message);
      }
    }

    // Build market context if query seems market-related
    let marketContext = '';
    const marketKeywords = ['nifty', 'sensex', 'market', 'index', 'today', 'current', 'price', 'rate'];
    const isMarketQuery = marketKeywords.some(kw => userMessage.toLowerCase().includes(kw));
    
    if (isMarketQuery) {
      try {
        const news = await marketDataService.getMarketNews('India stock NSE BSE market today');
        if (news.length > 0) {
          marketContext = `\n\nLATEST MARKET NEWS (for context):\n${news.slice(0, 3).map(n => `• ${n.title} [${n.source}]`).join('\n')}`;
        }
      } catch (err) {
        // Silent fail — context is optional
      }
    }

    const systemContent = SYSTEM_PROMPT + 
      (portfolioContext ? `\n\nUSER'S CURRENT PORTFOLIO:\n${portfolioContext}` : '') +
      marketContext;

    const messages = [{ role: 'system', content: systemContent }];

    // Add conversation history
    for (const msg of (history || [])) {
      if (msg.role === 'user' || msg.role === 'assistant') {
        messages.push({ role: msg.role, content: msg.content });
      }
    }

    messages.push({ role: 'user', content: userMessage });

    const completion = await groq.chat.completions.create({
      model: settings.GROQ_MODEL || 'llama-3.3-70b-versatile',
      messages,
      max_tokens: 1024,
      temperature: 0.4,
    });

    const responseContent = completion.choices[0]?.message?.content || 'I could not generate a response.';

    return {
      role: 'assistant',
      content: responseContent,
      timestamp: new Date().toISOString(),
      sources: this._extractSources(responseContent),
      model: settings.GROQ_MODEL,
      portfolio_aware: !!portfolioContext
    };
  }

  /**
   * Build portfolio context string from DB
   */
  async _buildPortfolioContext(userId) {
    try {
      const portfolio = await db.queryFirst(
        'SELECT id FROM portfolios WHERE user_id = ?', [userId]
      );
      if (!portfolio) return '';

      const holdings = await db.query(
        'SELECT symbol, quantity, avg_buy_price as avg_price, current_price, sector FROM holdings WHERE portfolio_id = ? LIMIT 15',
        [portfolio.id]
      );

      if (!holdings || holdings.length === 0) return '';

      const totalValue = holdings.reduce(
        (sum, h) => sum + (h.quantity || 0) * (h.current_price || h.avg_price || 0), 0
      );

      const lines = holdings.map(h => {
        const value = (h.quantity || 0) * (h.current_price || h.avg_price || 0);
        const pnl = h.avg_price && h.current_price 
          ? (((h.current_price - h.avg_price) / h.avg_price) * 100).toFixed(1) 
          : '0';
        return `${h.symbol} (${h.sector || 'Unknown'}): ${h.quantity} shares @ avg ₹${h.avg_price}, Current ₹${h.current_price || h.avg_price}, P&L: ${pnl}%, Value: ₹${value.toFixed(0)}`;
      });

      return `Total Portfolio: ₹${totalValue.toFixed(0)} | ${holdings.length} stocks\n${lines.join('\n')}`;
    } catch (err) {
      return '';
    }
  }

  /**
   * Extract cited sources from AI response
   */
  _extractSources(content) {
    const sources = [];
    if (content.includes('NSE')) sources.push({ name: 'NSE India', url: 'https://nseindia.com' });
    if (content.includes('RBI')) sources.push({ name: 'Reserve Bank of India', url: 'https://rbi.org.in' });
    if (content.includes('SEBI')) sources.push({ name: 'SEBI', url: 'https://sebi.gov.in' });
    if (content.includes('Finnhub') || content.includes('live data')) sources.push({ name: 'Finnhub Market Data', url: 'https://finnhub.io' });
    return sources;
  }
}

export default new GroqService();
