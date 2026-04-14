import { useState, useMemo } from 'react';
import { useCapsuleStore } from '../store/useCapsuleStore';
import CapsuleCard from '../components/CapsuleCard';
import { Sparkles, Clock, TrendingUp, RefreshCw, Tag } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

type SortType = 'latest' | 'popular' | 'opening';

export default function CapsuleSquare() {
  const { getPublicCapsules, likeCapsule, favoriteCapsule } = useCapsuleStore();
  const [sortBy, setSortBy] = useState<SortType>('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [blindBoxCapsules, setBlindBoxCapsules] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  const capsules = getPublicCapsules();
  const pageSize = 10;

  // 生成时光盲盒
  const generateBlindBox = () => {
    const unopenedCapsules = capsules.filter(c => new Date(c.openAt) > new Date());
    const shuffled = unopenedCapsules.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3).map(c => c.id);
    setBlindBoxCapsules(selected);
  };

  // 初始化时光盲盒
  useState(() => {
    generateBlindBox();
  });

  // 计算热门标签
  const popularTags = useMemo(() => {
    const tagCount: Record<string, number> = {};
    capsules.forEach(capsule => {
      capsule.tags.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });
    return Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag]) => tag);
  }, [capsules]);

  // 筛选和排序胶囊
  const filteredCapsules = useMemo(() => {
    let result = capsules;
    if (selectedTag) {
      result = result.filter(capsule => capsule.tags.includes(selectedTag));
    }
    return result.sort((a, b) => {
      if (sortBy === 'latest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'popular') {
        return b.likes - a.likes;
      }
      return new Date(a.openAt).getTime() - new Date(b.openAt).getTime();
    });
  }, [capsules, sortBy, selectedTag]);

  // 分页
  const paginatedCapsules = filteredCapsules.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // 获取盲盒胶囊详情
  const blindBoxDetails = useMemo(() => {
    return capsules.filter(c => blindBoxCapsules.includes(c.id));
  }, [capsules, blindBoxCapsules]);

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

        {/* 时光盲盒板块 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              时光盲盒
            </h2>
            <button
              onClick={generateBlindBox}
              className="flex items-center gap-1 text-sm text-pink-500 hover:text-pink-600"
            >
              <RefreshCw className="w-4 h-4" />
              换一批
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {blindBoxDetails.map((capsule) => (
              <div key={capsule.id} className="bg-white rounded-xl p-3 shadow-sm border border-pink-100">
                <div className="aspect-square rounded-lg overflow-hidden mb-2">
                  <img 
                    src={capsule.images[0]} 
                    alt="盲盒胶囊"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">
                    {capsule.blindBoxDescription || '神秘时光胶囊'}
                  </p>
                  <p className="text-xs text-pink-500">
                    {Math.ceil((new Date(capsule.openAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}天后开启
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 热门标签板块 */}
        <div className="mb-6">
          <h2 className="font-bold text-gray-800 flex items-center gap-2 mb-3">
            <Tag className="w-5 h-5 text-pink-500" />
            热门标签
          </h2>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm transition-all",
                  selectedTag === tag
                    ? "bg-pink-100 text-pink-600 border border-pink-200"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-pink-200"
                )}
              >
                #{tag}
              </button>
            ))}
            {selectedTag && (
              <button
                onClick={() => setSelectedTag(null)}
                className="px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-600 border border-gray-200"
              >
                清除筛选
              </button>
            )}
          </div>
        </div>

        {/* 排序按钮 */}
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

        {/* 胶囊列表 */}
        <div className="space-y-4">
          {paginatedCapsules.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 bg-pink-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-pink-300" />
              </div>
              <p className="text-gray-500">
                {selectedTag ? `没有包含「${selectedTag}」标签的胶囊` : '广场还没有胶囊'}
              </p>
              <p className="text-gray-400 text-sm mt-1">快来创建第一个吧！</p>
            </div>
          ) : (
            paginatedCapsules.map((capsule) => (
              <CapsuleCard
                key={capsule.id}
                capsule={capsule}
                onLike={likeCapsule}
                onFavorite={favoriteCapsule}
              />
            ))
          )}
        </div>

        {/* 分页 */}
        {filteredCapsules.length > pageSize && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-l-full border border-gray-200 bg-white text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一页
            </button>
            <span className="px-4 py-2 border-t border-b border-gray-200 bg-white text-gray-600">
              {currentPage} / {Math.ceil(filteredCapsules.length / pageSize)}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredCapsules.length / pageSize), prev + 1))}
              disabled={currentPage >= Math.ceil(filteredCapsules.length / pageSize)}
              className="px-4 py-2 rounded-r-full border border-gray-200 bg-white text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
            </button>
          </div>
        )}
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
