import { useState } from 'react';
import { useCapsuleStore } from '../store/useCapsuleStore';
import CapsuleCard from '../components/CapsuleCard';
import { Sparkles, Clock, TrendingUp } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

type SortType = 'latest' | 'popular' | 'opening';

export default function CapsuleSquare() {
  const { getPublicCapsules, likeCapsule, favoriteCapsule } = useCapsuleStore();
  const [sortBy, setSortBy] = useState<SortType>('latest');
  
  const capsules = getPublicCapsules();

  const sortedCapsules = [...capsules].sort((a, b) => {
    if (sortBy === 'latest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === 'popular') {
      return b.likes - a.likes;
    }
    return new Date(a.openAt).getTime() - new Date(b.openAt).getTime();
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50 pb-24">
      <div className="max-w-md mx-auto px-4 pt-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-pink-100 mb-4">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span className="font-semibold text-gray-800">胶囊广场</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            探索校园时光
          </h1>
        </div>

        <div className="flex gap-2 mb-6">
          <SortButton 
            active={sortBy === 'latest'} 
            onClick={() => setSortBy('latest')}
            icon={<Clock className="w-4 h-4" />}
            label="最新"
          />
          <SortButton 
            active={sortBy === 'popular'} 
            onClick={() => setSortBy('popular')}
            icon={<TrendingUp className="w-4 h-4" />}
            label="热门"
          />
          <SortButton 
            active={sortBy === 'opening'} 
            onClick={() => setSortBy('opening')}
            icon={<Sparkles className="w-4 h-4" />}
            label="即将开启"
          />
        </div>

        <div className="space-y-4">
          {sortedCapsules.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 bg-pink-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-pink-300" />
              </div>
              <p className="text-gray-500">广场还没有胶囊</p>
              <p className="text-gray-400 text-sm mt-1">快来创建第一个吧！</p>
            </div>
          ) : (
            sortedCapsules.map((capsule) => (
              <CapsuleCard
                key={capsule.id}
                capsule={capsule}
                onLike={likeCapsule}
                onFavorite={favoriteCapsule}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function SortButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 py-2.5 px-4 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-1.5",
        active 
          ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md shadow-pink-200"
          : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"
      )}
    >
      {icon}
      {label}
    </button>
  );
}
