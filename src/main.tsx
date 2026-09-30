import { AuthProvider } from '@/context/AuthContext.tsx';
import { CartProvider } from '@/context/CartContext.tsx';
import { I18nProvider } from '@/context/I18nContext.tsx';
import { ThemeProvider } from '@/context/ThemeContext.tsx';
import { ToastProvider } from '@/context/ToastContext.tsx';
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <I18nProvider>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </I18nProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
