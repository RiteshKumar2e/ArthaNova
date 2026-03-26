import * as aiAgentService from '../services/aiAgentService.js';

export const getBulkDealAnalysis = async (req, res) => {
  try {
    const { symbol } = req.query;
    const analysis = await aiAgentService.analyzeBulkDealSignal(symbol);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTechnicalBreakoutAnalysis = async (req, res) => {
  try {
    const { symbol } = req.query;
    const analysis = await aiAgentService.analyzeTechnicalBreakout(symbol);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPortfolioNewsPrioritization = async (req, res) => {
  try {
    const userId = req.user.id;
    const analysis = await aiAgentService.prioritizePortfolioNews(userId);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getOpportunityRadar = async (req, res) => {
  try {
    const userId = req.user.id;
    const analysis = await aiAgentService.runOpportunityRadar(userId);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getChartPatterns = async (req, res) => {
  try {
    const { symbol } = req.params;
    const patterns = await aiAgentService.getChartPatterns(symbol);
    res.json(patterns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
