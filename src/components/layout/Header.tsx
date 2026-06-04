import { Moon, Sun, Archive } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = user
    ? [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Inventário', path: '/inventario' },
        { label: 'Perfil', path: '/perfil' },
      ]
    : [
        { label: 'Início', path: '/' },
        { label: 'Login', path: '/login' },
        { label: 'Cadastro', path: '/cadastro' },
      ];

  const handleSignOut = () => {
    signOut();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-glass">
            <Archive className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100">InventárioPro</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Gestão de ativos e inventário</p>
          </div>
        </div>

        <nav className="hidden items-center gap-4 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                location.pathname === item.path
                  ? 'bg-primary text-white'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {item.label}
            </Link>
          ))}
          {user ? (
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Sair
            </button>
          ) : null}
        </nav>

        <button
          type="button"
          onClick={toggleTheme}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          aria-label="Alternar tema"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>
    </header>
  );
}
