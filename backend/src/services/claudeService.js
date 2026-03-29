/**
 * Claude LLM Service for ArthaNova
 * Provides Claude-powered financial reasoning for AI agents
 * Uses Anthropic SDK for superior reasoning in financial analysis
 */

import Anthropic from '@anthropic-ai/sdk';
import settings from '../config/settings.js';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: settings.ANTHROPIC_API_KEY,
});

const CLAUDE_MODEL = settings.CLAUDE_MODEL || 'claude-sonnet-4-20250514';

/**
 * Call Claude for financial analysis with structured output
 * @param {string} systemPrompt - System context for Claude
 * @param {string} userPrompt - User query/analysis request
 * @param {number} maxTokens - Maximum tokens in response
 * @returns {Promise<string|null>} Claude's response or null on error
 */
export const callClaude = async (systemPrompt, userPrompt, maxTokens = 1024) => {
  if (!settings.ANTHROPIC_API_KEY) {
    console.warn('[Claude] No API key configured, falling back to mock response');
    return generateMockResponse(userPrompt);
  }

  try {
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt }
      ],
    });

    return response.content[0]?.text || null;
  } catch (error) {
    console.error('[Claude] API call failed:', error.message);
    return generateMockResponse(userPrompt);
  }
};

/**
 * Call Claude with multi-turn conversation for complex reasoning
 * @param {string} systemPrompt - System context
 * @param {Array} messages - Array of {role, content} messages
 * @param {number} maxTokens - Maximum tokens
 * @returns {Promise<string|null>}
 */
export const callClaudeMultiTurn = async (systemPrompt, messages, maxTokens = 1500) => {
  if (!settings.ANTHROPIC_API_KEY) {
    console.warn('[Claude] No API key configured');
    return generateMockResponse(messages[messages.length - 1]?.content || '');
  }

  try {
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: messages,
    });

    return response.content[0]?.text || null;
  } catch (error) {
    console.error('[Claude] Multi-turn API call failed:', error.message);
    return null;
  }
};

/**
 * Claude-powered JSON extraction for structured data
 * @param {string} prompt - Analysis prompt
 * @param {object} schema - Expected JSON schema description
 * @returns {Promise<object|null>}
 */
export const callClaudeJSON = async (prompt, schemaDescription) => {
  const systemPrompt = `You are a financial data extraction AI. Extract structured data from the input and return ONLY valid JSON matching this schema: ${schemaDescription}. No markdown, no explanation - just the JSON object.`;

  const response = await callClaude(systemPrompt, prompt, 2000);

  if (!response) return null;

  try {
    // Clean response of any markdown formatting
    const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('[Claude] JSON parse failed:', error.message);
    return null;
  }
};

/**
 * Generate mock response when API is unavailable
 * Used for development/testing without API key
 */
const generateMockResponse = (prompt) => {
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes('bulk deal') || lowerPrompt.includes('distress')) {
    return `**BULK DEAL ANALYSIS (Mock Response)**

**Filing Reference:** BSE/NSE Bulk Deal Filing dated ${new Date().toISOString().split('T')[0]}

**Assessment:** Based on the transaction details:
- Transaction Type: Likely ROUTINE BLOCK TRADE
- Reasoning: Large institutional transactions at modest discounts (5-8%) typically indicate portfolio rebalancing rather than distress
- No concurrent negative news or management commentary shifts detected

**Risk Level:** MODERATE

**Recommended Action for Retail Investor:**
1. HOLD current position if fundamental thesis remains intact
2. Set stop-loss at 8-10% below current price as precaution
3. Monitor next quarterly earnings for confirmation

**Citation:** This analysis references the bulk deal filing submitted to exchange on ${new Date().toISOString().split('T')[0]}. Verify filing details at NSE/BSE bulk deal portal.`;
  }

  if (lowerPrompt.includes('breakout') || lowerPrompt.includes('technical')) {
    return `**TECHNICAL BREAKOUT ANALYSIS (Mock Response)**

**Pattern Detected:** 52-Week High Breakout on Above-Average Volume

**Historical Success Rate:** Based on similar patterns for this stock class:
- 65% success rate when volume confirms (current: CONFIRMED)
- Average gain in successful breakouts: 12-18%
- Average holding period: 15-25 trading sessions

**Conflicting Signals Identified:**
1. ⚠️ RSI at 78 (Overbought territory >70) - suggests potential near-term pullback
2. ⚠️ FII exposure reduction in latest filing - institutional caution noted

**BALANCED RECOMMENDATION:**
This is NOT a clear buy/sell signal. Consider:
- PARTIAL ENTRY: Deploy 50% of intended capital now
- WAIT for RSI cooldown below 65 for remaining 50%
- Set strict stop-loss at previous resistance (now support)

**Risk-Reward Assessment:**
- Entry Zone: Within 2% of breakout level
- Target: 12-15% above entry (based on historical patterns)
- Stop-Loss: 5% below breakout level
- Risk-Reward Ratio: ~2.5:1`;
  }

  if (lowerPrompt.includes('portfolio') || lowerPrompt.includes('news')) {
    return `**PORTFOLIO NEWS PRIORITIZATION (Mock Response)**

**Most Material Event for YOUR Portfolio:**
🔴 SECTOR REGULATORY CHANGE ranks HIGHER than RBI rate cut

**Quantified Impact Analysis:**

| Event | Affected Holdings | Estimated P&L Impact |
|-------|------------------|---------------------|
| Sector Regulation | Direct holding exposure | -2.5% to -4.0% portfolio value |
| RBI Rate Cut | Indirect (bank stocks) | +0.8% to +1.2% portfolio value |

**Priority Action Required:**
1. IMMEDIATE: Review position in affected sector stock
2. Consider partial profit booking (25-30%) before regulatory clarity
3. RBI rate cut is NET POSITIVE but smaller magnitude

**Context:** The sector regulation directly impacts revenue recognition for one of your holdings. RBI rate cut benefits are diffuse across rate-sensitive stocks you hold.

**Recommended Sequence:**
1. Address sector exposure FIRST (higher materiality)
2. Evaluate rate-sensitive holdings for opportunity (lower urgency)`;
  }

  return `**Analysis Complete (Mock Response)**

Based on the provided data, here is a structured analysis. Note: This is a development mock response. Configure ANTHROPIC_API_KEY for real Claude-powered analysis.

Key findings would be presented here with:
- Specific citations from source documents
- Quantified risk assessment
- Actionable recommendations
- Clear reasoning chain`;
};

export default {
  callClaude,
  callClaudeMultiTurn,
  callClaudeJSON,
};
