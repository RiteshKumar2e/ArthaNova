import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

const useNewsStore = create((set) => ({
  feed: [],
  trending: [],
  saved: [],
  arcs: [],
  currentArc: null,
  currentArticle: null,
  loading: false,
  error: null,

  fetchFeed: async (persona = 'investor') => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/news/feed`, { params: { persona } });
      set({ feed: response.data, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch news feed', loading: false });
    }
  },

  fetchArticle: async (id) => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/news/${id}`);
      set({ currentArticle: response.data, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch article details', loading: false });
    }
  },

  fetchArcs: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/news/arcs`);
      set({ arcs: response.data, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch story arcs', loading: false });
    }
  },

  fetchArcDetails: async (id) => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/news/arcs/${id}`);
      set({ currentArc: response.data, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch arc details', loading: false });
    }
  },

  saveStory: (story) => {
    set((state) => ({
      saved: [...state.saved, story]
    }));
  },

  removeSavedStory: (id) => {
    set((state) => ({
      saved: state.saved.filter(s => s.id !== id)
    }));
  }
}));

export default useNewsStore;
