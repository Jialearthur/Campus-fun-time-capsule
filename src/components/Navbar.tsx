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
    {
      path: '/theme',
      label: '主题',
      icon: isDark ? Sun : Moon,
      isThemeToggle: true,
    },
  ];

  return (
    <nav className={cn(
      "md:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl border-t pb-safe",
      isDark
        ? "bg-dark-bg-secondary/80 border-dark-border-primary"
        : "bg-white/80 border-apple-gray-200"
    )}>
      <div className="max-w-lg mx-auto flex items-center justify-between h-20 px-6">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => {
                if (item.isThemeToggle) {
                  toggleTheme();
                } else {
                  window.location.href = item.path;
                }
              }}
              className={cn(
                'flex flex-col items-center justify-center px-4 transition-all duration-200 ease-apple',
                isActive 
                  ? (isDark ? 'text-dark-accent-secondary' : 'text-apple-purple')
                  : (isDark ? 'text-dark-text-tertiary hover:text-dark-text-secondary' : 'text-apple-gray-400 hover:text-apple-gray-600')
              )}
            >
              <div className={cn(
                "flex flex-col items-center",
                isActive && "scale-105"
              )}>
                <Icon className={cn('w-5.5 h-5.5', isActive && 'fill-current')} />
                <span className={cn(
                  "text-xs font-medium mt-1.5",
                  isActive ? "font-semibold" : ""
                )}>{item.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
