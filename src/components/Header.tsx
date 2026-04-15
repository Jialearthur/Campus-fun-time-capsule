import { Link, useLocation } from 'react-router-dom';
import { Home, PlusSquare, Sparkles, Award, MessageSquare, MapPin, BarChart3, Moon, Sun, User } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useTheme } from '../hooks/useTheme';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export default function Header() {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  const navItems = [
    {
      path: '/',
      label: '首页',
      icon: Home,
    },
    {
      path: '/square',
      label: '广场',
      icon: Sparkles,
    },
    {
      path: '/create',
      label: '创建',
      icon: PlusSquare,
      isPrimary: true,
    },
    {
      path: '/drift-bottle',
      label: '漂流瓶',
      icon: MessageSquare,
    },
    {
      path: '/campus-map',
      label: '校园地图',
      icon: MapPin,
    },
    {
      path: '/achievements',
      label: '成就',
      icon: Award,
    },
    {
      path: '/dashboard',
      label: '数据统计',
      icon: BarChart3,
    },
  ];

  return (
    <header className={cn(
      "hidden md:flex items-center justify-between h-16 px-8 border-b sticky top-0 z-50 backdrop-blur-xl",
      isDark
        ? "bg-dark-bg-secondary/90 border-dark-border-primary"
        : "bg-white/90 border-apple-gray-200"
    )}>
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3">
        <div className={cn(
          "w-10 h-10 rounded-apple-lg flex items-center justify-center",
          isDark
            ? "bg-gradient-to-r from-dark-accent-primary to-dark-accent-secondary"
            : "bg-gradient-to-r from-apple-purple to-apple-blue"
        )}>
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h1 className={cn(
          "text-xl font-semibold tracking-tight",
          isDark ? "text-dark-text-primary" : "text-apple-gray-800"
        )}>校园时光胶囊</h1>
      </Link>

      {/* Navigation */}
      <nav className="flex items-center gap-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-apple-lg transition-all duration-300 font-medium',
                item.isPrimary
                  ? cn(
                      "bg-gradient-to-r from-apple-purple to-apple-blue text-white shadow-apple-sm",
                      "hover:shadow-apple hover:opacity-90 transform hover:scale-105"
                    )
                  : cn(
                      isActive
                        ? (isDark ? "text-dark-accent-secondary bg-dark-bg-tertiary" : "text-apple-purple bg-apple-gray-100")
                        : (isDark ? "text-dark-text-tertiary hover:text-dark-text-secondary hover:bg-dark-bg-tertiary/50" : "text-apple-gray-600 hover:text-apple-gray-800 hover:bg-apple-gray-100"),
                      "hover:shadow-sm"
                    )
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User & Theme */}
      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={cn(
            "p-2.5 rounded-apple-lg transition-all duration-300 flex items-center justify-center",
            isDark
              ? "bg-dark-bg-tertiary text-dark-text-primary hover:bg-dark-bg-elevated hover:scale-110"
              : "bg-apple-gray-100 text-apple-gray-700 hover:bg-apple-gray-200 hover:scale-110"
          )}
          aria-label={isDark ? "切换到浅色模式" : "切换到深色模式"}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* User profile */}
        <Link
          to="/my"
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-apple-lg transition-all duration-300 font-medium",
            isDark
              ? "bg-dark-bg-tertiary text-dark-text-secondary hover:bg-dark-bg-elevated hover:text-dark-text-primary hover:scale-105"
              : "bg-apple-gray-100 text-apple-gray-700 hover:bg-apple-gray-200 hover:text-apple-gray-800 hover:scale-105"
          )}
        >
          <User className="w-4 h-4" />
          <span className="text-sm">我的</span>
        </Link>
      </div>
    </header>
  );
}
