import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      set({ 
        token: access_token, 
        isAuthenticated: true, 
        loading: false,
        user: { email } // In a real app, you'd fetch user details
      });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.detail || 'Login failed', loading: false });
      return false;
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      await axios.post(`${API_URL}/auth/register`, userData);
      set({ loading: false });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.detail || 'Registration failed', loading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  setPersona: (persona) => {
    set((state) => ({
      user: state.user ? { ...state.user, persona } : null
    }));
  }
}));

export default useAuthStore;
