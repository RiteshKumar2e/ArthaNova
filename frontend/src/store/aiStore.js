import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

const useAIStore = create((set) => ({
  briefing: null,
  qaResponse: null,
  translation: null,
  videoContent: null,
  storyPrediction: null,
  isProcessing: false,
  error: null,

  generateBriefing: async (articleIds = [1, 2, 3]) => {
    set({ isProcessing: true });
    try {
      const response = await axios.post(`${API_URL}/ai/synthesize`, { article_ids: articleIds });
      set({ briefing: response.data, isProcessing: false });
    } catch (err) {
      set({ error: 'Briefing synthesis failed', isProcessing: false });
    }
  },

  vernacularEngine: async (text, targetLang) => {
    set({ isProcessing: true });
    try {
      const response = await axios.post(`${API_URL}/ai/vernacular`, null, { 
        params: { text, target_lang: targetLang } 
      });
      set({ translation: response.data, isProcessing: false });
    } catch (err) {
      set({ error: 'Vernacular translation failed', isProcessing: false });
    }
  },

  generateVideoContent: async (title) => {
    set({ isProcessing: true });
    try {
      const response = await axios.post(`${API_URL}/ai/video-studio`, null, { 
        params: { article_title: title } 
      });
      set({ videoContent: response.data, isProcessing: false });
    } catch (err) {
      set({ error: 'Video synthesis failed', isProcessing: false });
    }
  },

  fetchStoryPrediction: async (title) => {
    try {
      const response = await axios.get(`${API_URL}/ai/story-prediction`, { params: { title } });
      set({ storyPrediction: response.data.prediction });
    } catch (err) {
      console.error('Story prediction failed');
    }
  }
}));

export default useAIStore;
