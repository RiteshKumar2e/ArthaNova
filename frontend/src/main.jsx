import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'
import './styles/variables.css'
import './styles/global.css'

import { GoogleOAuthProvider } from '@react-oauth/google'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ""

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
      refetchOnWindowFocus: false,
    },
  },
})

// Suppress console noise from third-party scripts
const consoleMethods = ['log', 'info', 'warn', 'error']
consoleMethods.forEach((method) => {
  const original = console[method]
  console[method] = (...args) => {
    const allArgsString = args.map(arg => arg?.toString?.() || '').join(' ')
    if (
      allArgsString.includes('[GSI_LOADER]') ||
      allArgsString.includes('Failed to load') ||
      allArgsString.includes('button?type=standard') ||
      allArgsString.includes('not allowed for the given client ID') ||
      allArgsString.includes('Download the React DevTools') ||
      allArgsString.includes('Cross-Origin-Opener-Policy')
    ) {
      return
    }
    original(...args)
  }
})

const AppWrapper = GOOGLE_CLIENT_ID ? (
  <GoogleOAuthProvider 
    clientId={GOOGLE_CLIENT_ID}
    onScriptProps={{
      async: true,
      defer: true,
      nonce: undefined,
    }}
  >
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#172B4D',
                color: '#fff',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
              },
              success: {
                iconTheme: { primary: '#00875A', secondary: '#fff' },
              },
              error: {
                iconTheme: { primary: '#DE350B', secondary: '#fff' },
              },
            }}
          />
        </BrowserRouter>
      </QueryClientProvider>
    </GoogleOAuthProvider>
) : (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <App />
      <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#172B4D',
              color: '#fff',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
            },
            success: {
              iconTheme: { primary: '#00875A', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#DE350B', secondary: '#fff' },
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
)

ReactDOM.createRoot(document.getElementById('root')).render(AppWrapper)
