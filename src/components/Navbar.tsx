import { Link, useLocation } from 'react-router-dom';
import { Home, PlusSquare, User, Sparkles, BarChart3, MapPin, Calendar, Award, MessageCircle, MessageSquare } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import NotificationCenter from './NotificationCenter';
import { useTheme } from '../hooks/useTheme';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const location = useLocation();
  const { isDark } = useTheme();

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
      "fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md border-t-2 pb-safe shadow-lg",
      isDark
        ? "bg-dark-bg-secondary/90 border-dark-border-primary shadow-dark"
        : "bg-white/90 border-gummy-pink/30 shadow-gummy-pink/20"
    )}>
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'relative flex flex-col items-center justify-center flex-1 h-full transition-all duration-300',
                isActive 
                  ? (isDark ? 'text-dark-accent-secondary font-medium' : 'text-gummy-orange font-medium')
                  : (isDark ? 'text-dark-text-tertiary hover:text-dark-accent-secondary' : 'text-gummy-dark/60 hover:text-gummy-orange')
              )}
            >
              {item.isPrimary ? (
                <div className={cn(
                  "absolute -top-5 rounded-full p-3 shadow-gummy border-4 animate-bounce-slow",
                  isDark
                    ? "bg-gradient-to-r from-dark-accent-primary to-dark-accent-secondary border-dark-bg-secondary"
                    : "gummy-gradient border-white"
                )}>
                  <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
              ) : (
                <>
                  <Icon className={cn('w-5 h-5', isActive && 'fill-current')} />
                  {item.path === '/my' && (
                    <div className="absolute -top-1 -right-1">
                      <NotificationCenter isDark={isDark} />
                    </div>
                  )}
                </>
              )}
              
              {!item.isPrimary && (
                <span className={cn(
                  "text-xs font-medium mt-1",
                  isActive
                    ? (isDark ? 'text-dark-accent-secondary' : 'text-gummy-orange')
                    : (isDark ? 'text-dark-text-tertiary' : 'text-gummy-dark/60')
                )}>{item.label}</span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
