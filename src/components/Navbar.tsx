import { Link, useLocation } from 'react-router-dom';
import { Home, PlusSquare, User, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import NotificationCenter from './NotificationCenter';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    {
      path: '/',
      label: '广场',
      icon: Home,
    },
    {
      path: '/create',
      label: '创建',
      icon: PlusSquare,
      isPrimary: true,
    },
    {
      path: '/my',
      label: '我的',
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-t border-pink-100 pb-safe">
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'relative flex flex-col items-center justify-center w-16 h-full transition-all duration-300',
                isActive ? 'text-pink-500' : 'text-gray-400 hover:text-gray-600'
              )}
            >
              {item.isPrimary ? (
                <div className="absolute -top-4 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full p-3 shadow-lg shadow-pink-200 border-4 border-white">
                  <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
              ) : (
                <>
                  <Icon className={cn('w-6 h-6', isActive && 'fill-current')} />
                  {item.path === '/my' && (
                    <div className="absolute -top-1 -right-1">
                      <NotificationCenter />
                    </div>
                  )}
                </>
              )}
              
              {!item.isPrimary && (
                <span className="text-xs font-medium mt-1">{item.label}</span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
