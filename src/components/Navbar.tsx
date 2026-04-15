import { Link, useLocation } from 'react-router-dom';
import { Home, PlusSquare, Sparkles, Award, MessageSquare, Moon, Sun } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useTheme } from '../hooks/useTheme';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
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
      path: '/achievements',
      label: '成就',
      icon: Award,
    },
  ];

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl border-t pb-safe",
      isDark
        ? "bg-dark-bg-secondary/80 border-dark-border-primary"
        : "bg-white/80 border-apple-gray-200"
    )}>
      <div className="max-w-lg mx-auto flex items-center justify-around h-20 px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'relative flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 ease-apple',
                isActive 
                  ? (isDark ? 'text-dark-accent-secondary' : 'text-apple-purple')
                  : (isDark ? 'text-dark-text-tertiary hover:text-dark-text-secondary' : 'text-apple-gray-400 hover:text-apple-gray-600')
              )}
            >
              {item.isPrimary ? (
                <div className={cn(
                  "absolute -top-8 rounded-apple-2xl p-4 shadow-apple-lg border-4 animate-float",
                  isDark
                    ? "bg-gradient-to-r from-dark-accent-primary to-dark-accent-secondary border-dark-bg-secondary"
                    : "bg-gradient-to-r from-apple-purple to-apple-blue border-white"
                )}>
                  <Icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
              ) : (
                <div className={cn(
                  "flex flex-col items-center",
                  isActive && "scale-110"
                )}>
                  <Icon className={cn('w-6 h-6', isActive && 'fill-current')} />
                  <span className={cn(
                    "text-xs font-medium mt-1.5",
                    isActive ? "font-semibold" : ""
                  )}>{item.label}</span>
                </div>
              )}
            </Link>
          );
        })}
        
        {/* 主题切换按钮 */}
        <button
          onClick={toggleTheme}
          className={cn(
            'relative flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 ease-apple',
            isDark ? 'text-dark-text-tertiary hover:text-dark-text-secondary' : 'text-apple-gray-400 hover:text-apple-gray-600'
          )}
        >
          {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          <span className={cn(
            "text-xs font-medium mt-1.5"
          )}>主题</span>
        </button>
      </div>
    </nav>
  );
}
