import { useState } from 'react';
import { useCapsuleStore } from '../store/useCapsuleStore';
import CapsuleCard from '../components/CapsuleCard';
import CountdownTimer from '../components/CountdownTimer';
import { User, Lock, Unlock, Calendar, Sparkles, Moon, Sun } from 'lucide-react';
import { isCapsuleOpened, formatDate } from '../utils/date';
import { useTheme } from '../hooks/useTheme';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

type TabType = 'pending' | 'opened';

export default function MyCapsules() {
  const { getUserCapsules, currentUser, likeCapsule, favoriteCapsule } = useCapsuleStore();
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const { theme, toggleTheme, isDark } = useTheme();

  if (!currentUser) return null;

  const myCapsules = getUserCapsules(currentUser.id);
  
  const pendingCapsules = myCapsules
    .filter(c => !isCapsuleOpened(c.openAt))
    .sort((a, b) => new Date(a.openAt).getTime() - new Date(b.openAt).getTime());

  const openedCapsules = myCapsules
    .filter(c => isCapsuleOpened(c.openAt))
    .sort((a, b) => new Date(b.openAt).getTime() - new Date(a.openAt).getTime());

  const displayCapsules = activeTab === 'pending' ? pendingCapsules : openedCapsules;

  return (
    <div className={cn(
      "min-h-screen pb-32 transition-colors duration-500 ease-apple",
      isDark 
        ? "bg-dark-bg-primary"
        : "bg-apple-gray-100"
    )}>
      <div className="container mx-auto px-4 py-10">
        {/* Theme toggle (only for mobile) */}
        <div className="md:hidden flex justify-end mb-8">
          <button
            onClick={toggleTheme}
            className={cn(
              "p-3 rounded-apple-xl transition-all duration-300 ease-apple hover:scale-110",
              isDark
                ? "bg-dark-bg-secondary text-dark-text-primary hover:bg-dark-bg-tertiary shadow-apple-dark"
                : "bg-white text-apple-gray-700 hover:bg-apple-gray-50 shadow-apple"
            )}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Profile Section */}
        <div className="text-center mb-12 animate-fade-up">
          <div className={cn(
            "w-28 h-28 mx-auto mb-6 rounded-apple-2xl flex items-center justify-center shadow-apple-lg animate-bounce-float",
            isDark
              ? "bg-gradient-to-r from-dark-accent-primary to-dark-accent-secondary"
              : "bg-gradient-to-r from-apple-purple to-apple-blue"
          )}>
            <User className="w-14 h-14 text-white" />
          </div>
          <h1 className={cn(
            "text-3xl md:text-4xl font-bold mb-2 tracking-tight",
            isDark ? "text-dark-text-primary" : "text-apple-gray-800"
          )}>{currentUser.nickname}</h1>
          <p className={cn(
            "text-lg font-light",
            isDark ? "text-dark-text-secondary" : "text-apple-gray-500"
          )}>我的时光胶囊</p>
          
          {/* Stats */}
          <div className="flex justify-center gap-8 md:gap-12 mt-10">
            <div className="text-center">
              <p className={cn(
                "text-2xl md:text-3xl font-bold tracking-tight",
                isDark ? "text-dark-text-primary" : "text-apple-gray-800"
              )}>
                {myCapsules.length}
              </p>
              <p className={cn(
                "text-sm mt-2 font-medium",
                isDark ? "text-dark-text-tertiary" : "text-apple-gray-500"
              )}>总胶囊</p>
            </div>
            <div className="text-center">
              <p className={cn(
                "text-2xl md:text-3xl font-bold tracking-tight",
                isDark ? "text-dark-accent-secondary" : "text-apple-orange"
              )}>{pendingCapsules.length}</p>
              <p className={cn(
                "text-sm mt-2 font-medium",
                isDark ? "text-dark-text-tertiary" : "text-apple-gray-500"
              )}>待开启</p>
            </div>
            <div className="text-center">
              <p className={cn(
                "text-2xl md:text-3xl font-bold tracking-tight",
                isDark ? "text-dark-accent-secondary" : "text-apple-pink"
              )}>{openedCapsules.length}</p>
              <p className={cn(
                "text-sm mt-2 font-medium",
                isDark ? "text-dark-text-tertiary" : "text-apple-gray-500"
              )}>已开启</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-10 bg-apple-gray-200/50 dark:bg-dark-bg-secondary rounded-apple-xl p-1.5 max-w-md mx-auto">
          <TabButton 
            active={activeTab === 'pending'}
            onClick={() => setActiveTab('pending')}
            label="待开启"
            icon={<Lock className="w-4 h-4" />}
            isDark={isDark}
          />
          <TabButton 
            active={activeTab === 'opened'}
            onClick={() => setActiveTab('opened')}
            label="已开启"
            icon={<Unlock className="w-4 h-4" />}
            isDark={isDark}
          />
        </div>

        {/* Capsules List */}
        <div className={cn(
          "space-y-6",
          "md:grid md:grid-cols-2 md:gap-6",
          "lg:grid-cols-3"
        )}>
          {displayCapsules.length === 0 ? (
            <div className={cn(
              "text-center py-20 animate-fade-in",
              "md:col-span-2",
              "lg:col-span-3"
            )}>
              <div className={cn(
                "w-28 h-28 mx-auto mb-8 rounded-apple-2xl flex items-center justify-center shadow-apple",
                isDark
                  ? "bg-dark-bg-secondary"
                  : "bg-white"
              )}>
                {activeTab === 'pending' ? (
                  <Calendar className={cn(
                    "w-14 h-14",
                    isDark ? "text-dark-text-tertiary" : "text-apple-gray-400"
                  )} />
                ) : (
                  <Sparkles className={cn(
                    "w-14 h-14",
                    isDark ? "text-dark-text-tertiary" : "text-apple-gray-400"
                  )} />
                )}
              </div>
              <p className={cn(
                "font-medium mb-2 text-lg",
                isDark ? "text-dark-text-secondary" : "text-apple-gray-700"
              )}>
                {activeTab === 'pending' ? '暂无待开启的胶囊' : '暂无已开启的胶囊'}
              </p>
              <p className={cn(
                "text-base font-light",
                isDark ? "text-dark-text-tertiary" : "text-apple-gray-500"
              )}>快来创建你的第一个时光胶囊吧！</p>
            </div>
          ) : (
            displayCapsules.map((capsule, index) => (
              <div key={capsule.id} className="animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                <CapsuleCard
                  capsule={capsule}
                  onLike={likeCapsule}
                  onFavorite={favoriteCapsule}
                  showActions={isCapsuleOpened(capsule.openAt)}
                  isDark={isDark}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, label, icon, isDark }: { active: boolean; onClick: () => void; label: string; icon: React.ReactNode; isDark: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 py-3.5 rounded-apple-lg font-medium transition-all duration-300 ease-apple flex items-center justify-center gap-2.5",
        active
          ? isDark
            ? "bg-dark-bg-tertiary text-dark-text-primary shadow-apple-dark-sm"
            : "bg-white text-apple-gray-800 shadow-apple-sm"
          : isDark
            ? "text-dark-text-tertiary hover:text-dark-text-secondary"
            : "text-apple-gray-500 hover:text-apple-gray-700"
      )}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}
