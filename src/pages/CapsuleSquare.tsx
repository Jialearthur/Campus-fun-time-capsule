import { useState, useMemo } from 'react';
import { useCapsuleStore } from '../store/useCapsuleStore';
import CapsuleCard from '../components/CapsuleCard';
import { Sparkles, Clock, TrendingUp, RefreshCw, Tag, Gift, Star } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useTheme } from '../hooks/useTheme';

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
  const { isDark } = useTheme();
  
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
      .slice(0, 8)
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
        return (b.likes + b.comments + b.favorites) - (a.likes + a.comments + a.favorites);
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
    <div className={cn(
      "min-h-screen pb-24 transition-colors duration-300",
      isDark 
        ? "bg-dark-bg-primary text-dark-text-primary"
        : "bg-gradient-to-b from-gummy-cream to-gummy-pink/30"
    )}>
      <div className="max-w-md mx-auto px-4 pt-8">
        <div className="text-center mb-10">
          <div className={cn(
            "inline-flex items-center gap-2 px-5 py-2.5 rounded-full shadow-gummy border-2 mb-5",
            isDark
              ? "bg-dark-bg-secondary border-dark-border-primary"
              : "bg-white border-gummy-pink/30"
          )}>
            <Sparkles className={cn(
              "w-5 h-5",
              isDark ? "text-dark-accent-secondary" : "text-gummy-orange"
            )} />
            <span className={cn(
              "font-bold font-title",
              isDark ? "text-dark-text-primary" : "text-gummy-dark"
            )}>胶囊广场</span>
          </div>
          <h1 className={cn(
            "text-3xl font-bold font-title mb-3",
            isDark ? "text-dark-text-primary" : "text-gummy-dark"
          )}>
            探索校园时光
          </h1>
          <p className={cn(
            "font-body",
            isDark ? "text-dark-text-secondary" : "text-gummy-dark/60"
          )}>
            发现他人的美好回忆
          </p>
        </div>

        {/* 限定胶囊板块 */}
        {(() => {
          const limitedCapsules = capsules.filter(capsule => capsule.isLimitedEdition);
          if (limitedCapsules.length > 0) {
            return (
              <div className="mb-10">
                <div className="flex items-center justify-between mb-5">
                  <h2 className={cn(
                    "font-bold flex items-center gap-2 font-title",
                    isDark ? "text-dark-text-primary" : "text-gummy-dark"
                  )}>
                    <Star className={cn(
                      "w-5 h-5",
                      isDark ? "text-dark-accent-secondary" : "text-gummy-yellow"
                    )} />
                    限定胶囊
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {limitedCapsules.slice(0, 4).map((capsule, index) => (
                    <div key={capsule.id} className={cn(
                      "rounded-2xl p-4 border-2 shadow-gummy hover:shadow-gummy-hover transition-all duration-300 hover:scale-[1.03] gummy-card animate-bounce-up",
                      isDark
                        ? "bg-dark-bg-secondary border-dark-border-primary"
                        : "bg-white border-gummy-yellow/50"
                    )} style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="relative">
                        <div className="aspect-video rounded-xl overflow-hidden mb-3">
                          <img 
                            src={capsule.images[0]} 
                            alt={capsule.content.substring(0, 20)}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          />
                        </div>
                        <div className={cn(
                          "absolute top-2 right-2 text-white text-xs px-2 py-1 rounded-full font-bold",
                          isDark ? "bg-gradient-to-r from-dark-accent-primary to-dark-accent-secondary" : "bg-gradient-to-r from-gummy-yellow to-gummy-orange"
                        )}>
                          限定
                        </div>
                      </div>
                      <div>
                        <p className={cn(
                          "text-sm font-medium mb-2 line-clamp-2",
                          isDark ? "text-dark-text-primary" : "text-gummy-dark"
                        )}>
                          {capsule.content.substring(0, 30)}...
                        </p>
                        <p className={cn(
                          "text-xs font-medium",
                          isDark ? "text-dark-accent-secondary" : "text-gummy-orange"
                        )}>
                          {Math.ceil((new Date(capsule.openAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}天后开启
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          return null;
        })()}

        {/* 时光盲盒板块 */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className={cn(
              "font-bold flex items-center gap-2 font-title",
              isDark ? "text-dark-text-primary" : "text-gummy-dark"
            )}>
              <Gift className={cn(
                "w-5 h-5",
                isDark ? "text-dark-accent-secondary" : "text-gummy-orange"
              )} />
              时光盲盒
            </h2>
            <button
              onClick={generateBlindBox}
              className={cn(
                "flex items-center gap-1.5 text-sm transition-colors p-2 rounded-full",
                isDark
                  ? "text-dark-accent-secondary hover:text-dark-accent-primary hover:bg-dark-bg-tertiary"
                  : "text-gummy-orange hover:text-gummy-pink hover:bg-gummy-pink/10"
              )}
            >
              <RefreshCw className="w-4 h-4" />
              换一批
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {blindBoxDetails.map((capsule, index) => (
              <div key={capsule.id} className={cn(
                "rounded-2xl p-4 border-2 shadow-gummy hover:shadow-gummy-hover transition-all duration-300 hover:scale-[1.03] gummy-card animate-bounce-up",
                isDark
                  ? "bg-dark-bg-secondary border-dark-border-primary"
                  : "bg-white border-gummy-pink/30"
              )} style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="aspect-square rounded-xl overflow-hidden mb-3">
                  <img 
                    src={capsule.images[0]} 
                    alt="盲盒胶囊"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="text-center">
                  <p className={cn(
                    "text-xs font-medium mb-2 line-clamp-2",
                    isDark ? "text-dark-text-primary" : "text-gummy-dark"
                  )}>
                    {capsule.blindBoxDescription || '神秘时光胶囊'}
                  </p>
                  <p className={cn(
                    "text-xs font-medium",
                    isDark ? "text-dark-accent-secondary" : "text-gummy-orange"
                  )}>
                    {Math.ceil((new Date(capsule.openAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}天后开启
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 热门标签板块 */}
        <div className="mb-8">
          <h2 className={cn(
            "font-bold flex items-center gap-2 mb-4 font-title",
            isDark ? "text-dark-text-primary" : "text-gummy-dark"
          )}>
            <Tag className={cn(
              "w-5 h-5",
              isDark ? "text-dark-accent-secondary" : "text-gummy-pink"
            )} />
            热门标签
          </h2>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm transition-all duration-300 transform hover:scale-105",
                  selectedTag === tag
                    ? (isDark ? "bg-dark-accent-secondary text-white border-2 border-dark-accent-secondary" : "bg-gummy-pink text-white border-2 border-gummy-pink shadow-md")
                    : (isDark ? "bg-dark-bg-secondary text-dark-text-primary border-2 border-dark-border-primary hover:border-dark-accent-secondary" : "bg-white text-gummy-dark border-2 border-gummy-pink/30 hover:border-gummy-pink")
                )}
              >
                #{tag}
              </button>
            ))}
            {selectedTag && (
              <button
                onClick={() => setSelectedTag(null)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm border-2 transition-all",
                  isDark
                    ? "bg-dark-bg-secondary text-dark-text-primary border-dark-border-primary hover:border-dark-accent-secondary"
                    : "bg-gummy-cream text-gummy-dark border-gummy-pink/30 hover:border-gummy-pink"
                )}
              >
                清除筛选
              </button>
            )}
          </div>
        </div>

        {/* 排序按钮 */}
        <div className="flex gap-3 mb-8">
          <SortButton 
            active={sortBy === 'latest'} 
            onClick={() => setSortBy('latest')}
            icon={<Clock className="w-4 h-4" />}
            label="最新"
            isDark={isDark}
          />
          <SortButton 
            active={sortBy === 'popular'} 
            onClick={() => setSortBy('popular')}
            icon={<TrendingUp className="w-4 h-4" />}
            label="热门"
            isDark={isDark}
          />
          <SortButton 
            active={sortBy === 'opening'} 
            onClick={() => setSortBy('opening')}
            icon={<Sparkles className="w-4 h-4" />}
            label="即将开启"
            isDark={isDark}
          />
        </div>

        {/* 胶囊列表 */}
        <div className="space-y-6">
          {paginatedCapsules.length === 0 ? (
            <div className="text-center py-16">
              <div className={cn(
                "w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center",
                isDark ? "bg-dark-bg-secondary" : "bg-gummy-pink/20 shadow-gummy"
              )}>
                <Sparkles className={cn(
                  "w-12 h-12",
                  isDark ? "text-dark-text-tertiary" : "text-gummy-pink/60"
                )} />
              </div>
              <p className={cn(
                "font-medium mb-2",
                isDark ? "text-dark-text-secondary" : "text-gummy-dark/70"
              )}>
                {selectedTag ? `没有包含「${selectedTag}」标签的胶囊` : '广场还没有胶囊'}
              </p>
              <p className={cn(
                "text-sm font-body",
                isDark ? "text-dark-text-tertiary" : "text-gummy-dark/50"
              )}>快来创建第一个吧！</p>
            </div>
          ) : (
            paginatedCapsules.map((capsule, index) => (
              <CapsuleCard
                key={capsule.id}
                capsule={capsule}
                onLike={likeCapsule}
                onFavorite={favoriteCapsule}
                isDark={isDark}
              />
            ))
          )}
        </div>

        {/* 分页 */}
        {filteredCapsules.length > pageSize && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={cn(
                "px-5 py-3 rounded-l-full border-2 transition-all duration-300",
                currentPage === 1 
                  ? (isDark ? "border-dark-border-primary bg-dark-bg-secondary text-dark-text-tertiary cursor-not-allowed" : "border-gummy-pink/30 bg-gummy-cream text-gummy-dark/40 cursor-not-allowed")
                  : (isDark ? "border-dark-border-primary bg-dark-bg-secondary text-dark-text-primary hover:border-dark-accent-secondary" : "border-gummy-pink/30 bg-white text-gummy-dark hover:border-gummy-pink hover:bg-gummy-pink/5")
              )}
            >
              上一页
            </button>
            <span className={cn(
              "px-5 py-3 border-t-2 border-b-2 font-medium",
              isDark ? "border-dark-border-primary bg-dark-bg-secondary text-dark-text-primary" : "border-gummy-pink/30 bg-white text-gummy-dark"
            )}>
              {currentPage} / {Math.ceil(filteredCapsules.length / pageSize)}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredCapsules.length / pageSize), prev + 1))}
              disabled={currentPage >= Math.ceil(filteredCapsules.length / pageSize)}
              className={cn(
                "px-5 py-3 rounded-r-full border-2 transition-all duration-300",
                currentPage >= Math.ceil(filteredCapsules.length / pageSize)
                  ? (isDark ? "border-dark-border-primary bg-dark-bg-secondary text-dark-text-tertiary cursor-not-allowed" : "border-gummy-pink/30 bg-gummy-cream text-gummy-dark/40 cursor-not-allowed")
                  : (isDark ? "border-dark-border-primary bg-dark-bg-secondary text-dark-text-primary hover:border-dark-accent-secondary" : "border-gummy-pink/30 bg-white text-gummy-dark hover:border-gummy-pink hover:bg-gummy-pink/5")
              )}
            >
              下一页
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SortButton({ active, onClick, icon, label, isDark }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; isDark: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 py-3 px-4 rounded-2xl text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2",
        active 
          ? (isDark ? "bg-gradient-to-r from-dark-accent-primary to-dark-accent-secondary text-white" : "gummy-gradient text-white shadow-gummy")
          : (isDark ? "bg-dark-bg-secondary text-dark-text-secondary hover:bg-dark-bg-tertiary border-2 border-dark-border-primary" : "bg-white text-gummy-dark/70 hover:bg-gummy-pink/10 border-2 border-gummy-pink/30")
      )}
    >
      {icon}
      {label}
    </button>
  );
}
