import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

const useAIStore = create((set) => ({
  briefing: null,
  qaResponse: null,
  translation: null,
  isProcessing: false,
  error: null,

  generateBriefing: async () => {
    set({ isProcessing: true });
    try {
      const response = await axios.post(`${API_URL}/ai/synthesize`);
      set({ briefing: response.data, isProcessing: false });
    } catch (err) {
      set({ error: 'Briefing synthesis failed', isProcessing: false });
    }
  },

  askAI: async (question, context) => {
    set({ isProcessing: true });
    try {
      const response = await axios.get(`${API_URL}/ai/qa`, { params: { question, context } });
      set({ qaResponse: response.data.answer, isProcessing: false });
      return response.data.answer;
    } catch (err) {
      set({ error: 'AI Q&A failed', isProcessing: false });
      return null;
    }
  },

  translateText: async (text, targetLang) => {
    set({ isProcessing: true });
    try {
      const response = await axios.post(`${API_URL}/ai/translate`, { text, target_lang: targetLang });
      set({ translation: response.data, isProcessing: false });
    } catch (err) {
      set({ error: 'Translation failed', isProcessing: false });
    }
  }
}));

export default useAIStore;
