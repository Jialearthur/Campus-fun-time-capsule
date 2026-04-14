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
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50 pb-24">
      <div className="max-w-md mx-auto px-4 pt-6">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-pink-200">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">{currentUser.nickname}</h1>
          <p className="text-gray-500 text-sm">我的时光胶囊</p>
          
          <div className="flex justify-center gap-6 mt-6">
            <div className="text-center">
              <p className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                {myCapsules.length}
              </p>
              <p className="text-xs text-gray-500">总胶囊</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-pink-500">{pendingCapsules.length}</p>
              <p className="text-xs text-gray-500">待开启</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-500">{openedCapsules.length}</p>
              <p className="text-xs text-gray-500">已开启</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
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

        <div className="space-y-4">
          {displayCapsules.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                {activeTab === 'pending' ? (
                  <Calendar className="w-10 h-10 text-gray-300" />
                ) : (
                  <Sparkles className="w-10 h-10 text-gray-300" />
                )}
              </div>
              <p className="text-gray-500">
                {activeTab === 'pending' ? '暂无待开启的胶囊' : '暂无已开启的胶囊'}
              </p>
            </div>
          ) : (
            displayCapsules.map((capsule) => (
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
        "flex-1 py-3 rounded-2xl font-medium transition-all flex items-center justify-center gap-2",
        active
          ? "bg-white text-gray-800 shadow-sm border border-pink-100"
          : "text-gray-500 hover:bg-white/50"
      )}
    >
      {icon}
      {label}
    </button>
  );
}
