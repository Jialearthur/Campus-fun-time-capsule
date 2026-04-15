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
      "hidden md:flex items-center justify-between h-16 px-6 border-b sticky top-0 z-50 backdrop-blur-xl",
      isDark
        ? "bg-dark-bg-secondary/90 border-dark-border-primary"
        : "bg-white/90 border-apple-gray-200"
    )}>
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <div className={cn(
          "w-9 h-9 rounded-apple flex items-center justify-center",
          isDark
            ? "bg-dark-bg-tertiary/50"
            : "bg-apple-gray-100"
        )}>
          <Sparkles className={cn(
            "w-4.5 h-4.5",
            isDark ? "text-dark-accent-secondary/80" : "text-apple-purple/80"
          )} />
        </div>
        <h1 className={cn(
          "text-lg font-medium tracking-tight",
          isDark ? "text-dark-text-primary" : "text-apple-gray-800"
        )}>校园时光胶囊</h1>
      </Link>

      {/* Navigation */}
      <nav className="flex items-center gap-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-apple transition-all duration-200 font-medium',
                isActive
                  ? (isDark 
                      ? "bg-dark-bg-tertiary/70 text-dark-text-primary"
                      : "bg-apple-gray-100 text-apple-gray-700"
                    )
                  : (isDark 
                      ? "text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-bg-tertiary/30"
                      : "text-apple-gray-600 hover:text-apple-gray-700 hover:bg-apple-gray-100/70"
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
        {/* User profile */}
        <Link
          to="/my"
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-apple transition-all duration-200 font-medium",
            isDark
              ? "text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-bg-tertiary/30"
              : "text-apple-gray-600 hover:text-apple-gray-700 hover:bg-apple-gray-100/70"
          )}
        >
          <User className="w-4 h-4" />
          <span className="text-sm">我的</span>
        </Link>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={cn(
            "p-2.5 rounded-apple transition-all duration-200 flex items-center justify-center",
            isDark
              ? "text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-bg-tertiary/30"
              : "text-apple-gray-600 hover:text-apple-gray-700 hover:bg-apple-gray-100/70"
          )}
          aria-label={isDark ? "切换到浅色模式" : "切换到深色模式"}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}
