import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { InventoryProvider } from './contexts/InventoryContext';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <InventoryProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </InventoryProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
