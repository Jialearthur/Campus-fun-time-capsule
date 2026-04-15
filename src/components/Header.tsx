import { Link, useLocation } from 'react-router-dom';
import { Home, PlusSquare, Sparkles, Award, MessageSquare, MapPin, BarChart3, Moon, Sun, User, Menu, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useTheme } from '../hooks/useTheme';
import { useState } from 'react';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export default function Header() {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      "sticky top-0 z-50 backdrop-blur-xl border-b",
      isDark
        ? "bg-dark-bg-secondary/95 border-dark-border-primary"
        : "bg-white/95 border-apple-gray-200"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              isDark
                ? "bg-gradient-to-br from-dark-accent-primary/20 to-dark-accent-secondary/20"
                : "bg-gradient-to-br from-apple-purple/10 to-apple-blue/10"
            )}>
              <Sparkles className={cn(
                "w-5 h-5",
                isDark ? "text-dark-accent-secondary" : "text-apple-purple"
              )} />
            </div>
            <h1 className={cn(
              "text-xl font-bold tracking-tight whitespace-nowrap",
              isDark ? "text-dark-text-primary" : "text-apple-gray-800"
            )}>校园时光胶囊</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium',
                    isActive
                      ? (isDark 
                          ? "bg-dark-bg-tertiary/80 text-dark-text-primary" 
                          : "bg-apple-gray-100 text-apple-gray-800"
                        )
                      : (isDark 
                          ? "text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-bg-tertiary/40"
                          : "text-apple-gray-600 hover:text-apple-gray-800 hover:bg-apple-gray-100/80"
                        )
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className={cn("w-6 h-6", isDark ? "text-dark-text-primary" : "text-apple-gray-800")} />
            ) : (
              <Menu className={cn("w-6 h-6", isDark ? "text-dark-text-primary" : "text-apple-gray-800")} />
            )}
          </button>

          {/* User & Theme - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            {/* User profile */}
            <Link
              to="/my"
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium",
                isDark
                  ? "text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-bg-tertiary/40"
                  : "text-apple-gray-600 hover:text-apple-gray-800 hover:bg-apple-gray-100/80"
              )}
            >
              <User className="w-4 h-4" />
              <span className="text-sm">我的</span>
            </Link>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className={cn(
                "p-2 rounded-lg transition-all duration-200 flex items-center justify-center",
                isDark
                  ? "text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-bg-tertiary/40"
                  : "text-apple-gray-600 hover:text-apple-gray-800 hover:bg-apple-gray-100/80"
              )}
              aria-label={isDark ? "切换到浅色模式" : "切换到深色模式"}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={cn(
            "md:hidden py-4 border-t",
            isDark ? "border-dark-border-primary" : "border-apple-gray-200"
          )}>
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium',
                      isActive
                        ? (isDark 
                            ? "bg-dark-bg-tertiary/80 text-dark-text-primary" 
                            : "bg-apple-gray-100 text-apple-gray-800"
                          )
                        : (isDark 
                            ? "text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-bg-tertiary/40"
                            : "text-apple-gray-600 hover:text-apple-gray-800 hover:bg-apple-gray-100/80"
                          )
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-base">{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Mobile User & Theme */}
              <div className="flex items-center gap-2 px-4 pt-4 border-t" style={{ borderColor: isDark ? '#3A3A3C' : '#E8E8ED' }}>
                <Link
                  to="/my"
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium flex-1",
                    isDark
                      ? "text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-bg-tertiary/40"
                      : "text-apple-gray-600 hover:text-apple-gray-800 hover:bg-apple-gray-100/80"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="w-4 h-4" />
                  <span>我的</span>
                </Link>

                <button
                  onClick={toggleTheme}
                  className={cn(
                    "p-2 rounded-lg transition-all duration-200 flex items-center justify-center",
                    isDark
                      ? "text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-bg-tertiary/40"
                      : "text-apple-gray-600 hover:text-apple-gray-800 hover:bg-apple-gray-100/80"
                  )}
                  aria-label={isDark ? "切换到浅色模式" : "切换到深色模式"}
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
