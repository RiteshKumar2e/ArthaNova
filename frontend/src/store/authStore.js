import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      login: (user, accessToken, refreshToken) => {
        set({ user, accessToken, refreshToken, isAuthenticated: true })
      },

      logout: () => {
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false })
      },

      updateUser: (updates) => {
        set({ user: { ...get().user, ...updates } })
      },

      updateTokens: (accessToken, refreshToken) => {
        set({ accessToken, refreshToken })
      },
    }),
    {
      name: 'arthanova-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
