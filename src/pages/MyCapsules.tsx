import { useState } from 'react';
import { useCapsuleStore } from '../store/useCapsuleStore';
import CapsuleCard from '../components/CapsuleCard';
import CountdownTimer from '../components/CountdownTimer';
import { User, Lock, Unlock, Calendar, Sparkles } from 'lucide-react';
import { isCapsuleOpened, formatDate } from '../utils/date';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

type TabType = 'pending' | 'opened';

export default function MyCapsules() {
  const { getUserCapsules, currentUser, likeCapsule, favoriteCapsule } = useCapsuleStore();
  const [activeTab, setActiveTab] = useState<TabType>('pending');

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
    <div className="min-h-screen bg-gradient-to-b from-gummy-cream to-gummy-pink/30 pb-24">
      <div className="max-w-md mx-auto px-4 pt-8">
        <div className="text-center mb-10">
          <div className="w-24 h-24 mx-auto mb-5 gummy-gradient rounded-full flex items-center justify-center shadow-gummy animate-float">
            <User className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gummy-dark mb-2 font-title">{currentUser.nickname}</h1>
          <p className="text-gummy-dark/60 text-lg font-body">我的时光胶囊</p>
          
          <div className="flex justify-center gap-8 mt-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-gummy-dark font-title">
                {myCapsules.length}
              </p>
              <p className="text-xs text-gummy-dark/60 mt-1">总胶囊</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gummy-orange font-title">{pendingCapsules.length}</p>
              <p className="text-xs text-gummy-dark/60 mt-1">待开启</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gummy-pink font-title">{openedCapsules.length}</p>
              <p className="text-xs text-gummy-dark/60 mt-1">已开启</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mb-8">
          <TabButton 
            active={activeTab === 'pending'}
            onClick={() => setActiveTab('pending')}
            label="待开启"
            icon={<Lock className="w-4 h-4" />}
          />
          <TabButton 
            active={activeTab === 'opened'}
            onClick={() => setActiveTab('opened')}
            label="已开启"
            icon={<Unlock className="w-4 h-4" />}
          />
        </div>

        <div className="space-y-6">
          {displayCapsules.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gummy-pink/20 rounded-full flex items-center justify-center shadow-gummy">
                {activeTab === 'pending' ? (
                  <Calendar className="w-12 h-12 text-gummy-pink/60" />
                ) : (
                  <Sparkles className="w-12 h-12 text-gummy-pink/60" />
                )}
              </div>
              <p className="text-gummy-dark/70 font-medium mb-2">
                {activeTab === 'pending' ? '暂无待开启的胶囊' : '暂无已开启的胶囊'}
              </p>
              <p className="text-gummy-dark/50 text-sm font-body">快来创建你的第一个时光胶囊吧！</p>
            </div>
          ) : (
            displayCapsules.map((capsule, index) => (
              <CapsuleCard
                key={capsule.id}
                capsule={capsule}
                onLike={likeCapsule}
                onFavorite={favoriteCapsule}
                showActions={isCapsuleOpened(capsule.openAt)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, label, icon }: { active: boolean; onClick: () => void; label: string; icon: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 py-3.5 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center gap-2",
        active
          ? "bg-white text-gummy-dark shadow-gummy border-2 border-gummy-pink/30"
          : "text-gummy-dark/60 hover:bg-white/80 border-2 border-gummy-pink/30"
      )}
    >
      {icon}
      <span className="font-title">{label}</span>
    </button>
  );
}
