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
      "min-h-screen pb-24 transition-colors duration-300",
      isDark 
        ? "bg-dark-bg-primary text-dark-text-primary"
        : "bg-gradient-to-b from-gummy-cream to-gummy-pink/30 text-gummy-dark"
    )}>
      <div className="max-w-md mx-auto px-4 pt-8">
        {/* 主题切换按钮 */}
        <div className="flex justify-end mb-6">
          <button
            onClick={toggleTheme}
            className={cn(
              "p-3 rounded-full transition-colors duration-300",
              isDark
                ? "bg-dark-bg-secondary text-dark-text-primary hover:bg-dark-bg-tertiary"
                : "bg-white/80 text-gummy-dark hover:bg-white"
            )}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <div className="text-center mb-10">
          <div className={cn(
            "w-24 h-24 mx-auto mb-5 rounded-full flex items-center justify-center shadow-lg animate-float",
            isDark
              ? "bg-gradient-to-r from-dark-accent-primary to-dark-accent-secondary"
              : "gummy-gradient shadow-gummy"
          )}>
            <User className="w-12 h-12 text-white" />
          </div>
          <h1 className={cn(
            "text-3xl font-bold mb-2 font-title",
            isDark ? "text-dark-text-primary" : "text-gummy-dark"
          )}>{currentUser.nickname}</h1>
          <p className={cn(
            "text-lg font-body",
            isDark ? "text-dark-text-secondary" : "text-gummy-dark/60"
          )}>我的时光胶囊</p>
          
          <div className="flex justify-center gap-8 mt-8">
            <div className="text-center">
              <p className={cn(
                "text-2xl font-bold font-title",
                isDark ? "text-dark-text-primary" : "text-gummy-dark"
              )}>
                {myCapsules.length}
              </p>
              <p className={cn(
                "text-xs mt-1",
                isDark ? "text-dark-text-tertiary" : "text-gummy-dark/60"
              )}>总胶囊</p>
            </div>
            <div className="text-center">
              <p className={cn(
                "text-2xl font-bold font-title",
                isDark ? "text-dark-accent-secondary" : "text-gummy-orange"
              )}>{pendingCapsules.length}</p>
              <p className={cn(
                "text-xs mt-1",
                isDark ? "text-dark-text-tertiary" : "text-gummy-dark/60"
              )}>待开启</p>
            </div>
            <div className="text-center">
              <p className={cn(
                "text-2xl font-bold font-title",
                isDark ? "text-dark-accent-secondary" : "text-gummy-pink"
              )}>{openedCapsules.length}</p>
              <p className={cn(
                "text-xs mt-1",
                isDark ? "text-dark-text-tertiary" : "text-gummy-dark/60"
              )}>已开启</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mb-8">
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

        <div className="space-y-6">
          {displayCapsules.length === 0 ? (
            <div className="text-center py-16">
              <div className={cn(
                "w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center shadow-lg",
                isDark
                  ? "bg-dark-bg-secondary"
                  : "bg-gummy-pink/20 shadow-gummy"
              )}>
                {activeTab === 'pending' ? (
                  <Calendar className={cn(
                    "w-12 h-12",
                    isDark ? "text-dark-text-tertiary" : "text-gummy-pink/60"
                  )} />
                ) : (
                  <Sparkles className={cn(
                    "w-12 h-12",
                    isDark ? "text-dark-text-tertiary" : "text-gummy-pink/60"
                  )} />
                )}
              </div>
              <p className={cn(
                "font-medium mb-2",
                isDark ? "text-dark-text-secondary" : "text-gummy-dark/70"
              )}>
                {activeTab === 'pending' ? '暂无待开启的胶囊' : '暂无已开启的胶囊'}
              </p>
              <p className={cn(
                "text-sm font-body",
                isDark ? "text-dark-text-tertiary" : "text-gummy-dark/50"
              )}>快来创建你的第一个时光胶囊吧！</p>
            </div>
          ) : (
            displayCapsules.map((capsule, index) => (
              <CapsuleCard
                key={capsule.id}
                capsule={capsule}
                onLike={likeCapsule}
                onFavorite={favoriteCapsule}
                showActions={isCapsuleOpened(capsule.openAt)}
                isDark={isDark}
              />
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
        "flex-1 py-3.5 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center gap-2",
        isDark
          ? active
            ? "bg-dark-bg-secondary text-dark-text-primary border-2 border-dark-border-primary"
            : "text-dark-text-tertiary hover:bg-dark-bg-secondary border-2 border-dark-border-primary"
          : active
            ? "bg-white text-gummy-dark shadow-gummy border-2 border-gummy-pink/30"
            : "text-gummy-dark/60 hover:bg-white/80 border-2 border-gummy-pink/30"
      )}
    >
      {icon}
      <span className="font-title">{label}</span>
    </button>
  );
}
