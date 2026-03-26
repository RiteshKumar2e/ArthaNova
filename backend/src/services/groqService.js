import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import settings from "../config/settings.js";

class GroqService {
  constructor() {
    this.model = new ChatGroq({
      apiKey: settings.GROQ_API_KEY,
      modelName: settings.GROQ_MODEL || "llama-3.3-70b-versatile",
      temperature: 0.7,
    });
  }

  /**
   * Simple chat completion
   * @param {string} prompt - User message content
   * @param {Array} history - Previous messages in { role, content } format
   */
  async chat(prompt, history = []) {
    if (!settings.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not configured in environment variables.");
    }

    try {
      const messages = [
        new SystemMessage(
          "You are ArthaNova AI, a sophisticated financial intelligence agent designed for the Indian stock market. " +
          "Your goal is to provide actionable insights, analyze corporate filings, detect technical patterns, and assist with portfolio rebalancing. " +
          "Keep your responses professional, data-driven, and concise. Always use a friendly, helpful tone."
        )
      ];

      // Add history if any
      history.forEach(msg => {
        if (msg.role === 'user') {
          messages.push(new HumanMessage(msg.content));
        } else if (msg.role === 'assistant') {
          messages.push(new AIMessage(msg.content));
        }
      });

      // Add current prompt
      messages.push(new HumanMessage(prompt));

      const response = await this.model.invoke(messages);
      
      return {
        role: "assistant",
        content: response.content,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Groq AI Error:", error);
      throw new Error(`Groq AI request failed: ${error.message}`);
    }
  }
}

export default new GroqService();
