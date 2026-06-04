import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useTheme } from './contexts/ThemeContext';
import { useAuth } from './contexts/AuthContext';
import Header from './components/layout/Header';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RecoverPasswordPage from './pages/RecoverPasswordPage';
import DashboardPage from './pages/DashboardPage';
import InventoryPage from './pages/InventoryPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  const { theme } = useTheme();
  const { user, isInitializing } = useAuth();
  const isAuthenticated = Boolean(user);

  if (isInitializing) {
    return (
      <div className={theme === 'dark' ? 'dark' : ''}>
        <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
          <Header />
          <main className="px-4 py-8 md:px-8 lg:px-12">
            <p className="text-center text-lg text-slate-700 dark:text-slate-300">Carregando sessão...</p>
          </main>
          <Toaster position="top-right" richColors />
        </div>
      </div>
    );
  }

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
        <Header />
        <main className="px-4 py-8 md:px-8 lg:px-12">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadastro" element={<RegisterPage />} />
            <Route path="/recuperar-senha" element={<RecoverPasswordPage />} />
            <Route path="/dashboard" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" replace />} />
            <Route path="/inventario" element={isAuthenticated ? <InventoryPage /> : <Navigate to="/login" replace />} />
            <Route path="/perfil" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Toaster position="top-right" richColors />
      </div>
    </div>
  );
}

export default App;
