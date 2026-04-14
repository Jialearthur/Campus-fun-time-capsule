import { useState, useMemo } from 'react';
import { useCapsuleStore } from '../store/useCapsuleStore';
import { BarChart3, Users, Sparkles, Heart, MessageCircle, Star, TrendingUp, Download, Calendar } from 'lucide-react';
import { formatDate } from '../utils/date';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

type TimeRange = 'day' | 'week' | 'month';

export default function DataDashboard() {
  const { capsules, comments, currentUser } = useCapsuleStore();
  const [timeRange, setTimeRange] = useState<TimeRange>('day');

  // 生成模拟数据
  const mockData = useMemo(() => {
    const totalUsers = 1280;
    const dailyNewUsers = 24;
    const activeUsers = 456;
    
    const totalCapsules = capsules.length;
    const publicCapsules = capsules.filter(c => c.isPublic).length;
    const privateCapsules = capsules.filter(c => !c.isPublic).length;
    const dailyNewCapsules = 8;
    
    const totalInteractions = capsules.reduce((sum, c) => sum + c.likes + c.comments + c.favorites, 0);
    const totalLikes = capsules.reduce((sum, c) => sum + c.likes, 0);
    const totalComments = Object.values(comments).reduce((sum, arr) => sum + arr.length, 0);
    const totalFavorites = capsules.reduce((sum, c) => sum + c.favorites, 0);
    const dailyInteractions = 156;
    
    // 主题分布
    const themeDistribution = [
      { name: '校园日常回忆', count: 45 },
      { name: '毕业期许', count: 32 },
      { name: '好友约定', count: 28 },
      { name: '社团时光', count: 21 },
    ];
    
    // 热门标签
    const tagCount: Record<string, number> = {};
    capsules.forEach(capsule => {
      capsule.tags.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });
    const popularTags = Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({ name: tag, count }));
    
    // 最受欢迎的胶囊
    const popularCapsules = [...capsules]
      .sort((a, b) => (b.likes + b.comments + b.favorites) - (a.likes + a.comments + a.favorites))
      .slice(0, 5)
      .map(capsule => ({
        id: capsule.id,
        content: capsule.content.substring(0, 30) + '...',
        likes: capsule.likes,
        comments: capsule.comments,
        favorites: capsule.favorites,
        total: capsule.likes + capsule.comments + capsule.favorites
      }));
    
    return {
      users: { total: totalUsers, dailyNew: dailyNewUsers, active: activeUsers },
      capsules: { total: totalCapsules, public: publicCapsules, private: privateCapsules, dailyNew: dailyNewCapsules },
      interactions: { total: totalInteractions, likes: totalLikes, comments: totalComments, favorites: totalFavorites, daily: dailyInteractions },
      themeDistribution,
      popularTags,
      popularCapsules
    };
  }, [capsules, comments]);

  const handleExport = () => {
    // 模拟导出功能
    alert('数据导出功能已触发，实际项目中会生成Excel文件');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f9f7f4] via-white to-[#f5f3f7] pb-24">
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-40 border-b border-[#e0d6f0]">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="font-bold text-lg text-[#5a4b7a]">数据统计看板</h1>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-[#e8dff5] to-[#d8f0e3] text-[#5a4b7a] rounded-xl font-medium"
          >
            <Download className="w-4 h-4" />
            导出数据
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-6">
        {/* 时间范围选择 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#8a7ab5]" />
            <span className="text-[#5a4b7a] font-medium">数据范围</span>
          </div>
          <div className="flex gap-2">
            <TimeRangeButton active={timeRange === 'day'} onClick={() => setTimeRange('day')} label="日" />
            <TimeRangeButton active={timeRange === 'week'} onClick={() => setTimeRange('week')} label="周" />
            <TimeRangeButton active={timeRange === 'month'} onClick={() => setTimeRange('month')} label="月" />
          </div>
        </div>

        {/* 核心数据卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <DataCard
            icon={<Users className="w-6 h-6" />}
            title="总注册用户"
            value={mockData.users.total.toLocaleString()}
            change="+12%"
            positive
          />
          <DataCard
            icon={<Sparkles className="w-6 h-6" />}
            title="胶囊总数"
            value={mockData.capsules.total.toLocaleString()}
            change="+8%"
            positive
          />
          <DataCard
            icon={<Heart className="w-6 h-6" />}
            title="总互动次数"
            value={mockData.interactions.total.toLocaleString()}
            change="+15%"
            positive
          />
          <DataCard
            icon={<Star className="w-6 h-6" />}
            title="活跃用户"
            value={mockData.users.active.toLocaleString()}
            change="+5%"
            positive
          />
        </div>

        {/* 用户数据 */}
        <Section title="用户数据">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DataItem label="总注册数" value={mockData.users.total.toLocaleString()} />
            <DataItem label="每日新增" value={mockData.users.dailyNew.toLocaleString()} />
            <DataItem label="活跃用户" value={mockData.users.active.toLocaleString()} />
          </div>
        </Section>

        {/* 胶囊数据 */}
        <Section title="胶囊数据">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid grid-cols-2 gap-4">
              <DataItem label="胶囊总数" value={mockData.capsules.total.toLocaleString()} />
              <DataItem label="公开胶囊" value={mockData.capsules.public.toLocaleString()} />
              <DataItem label="私密胶囊" value={mockData.capsules.private.toLocaleString()} />
              <DataItem label="每日新增" value={mockData.capsules.dailyNew.toLocaleString()} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-[#8a7ab5] mb-3">主题分布</h3>
              <div className="space-y-3">
                {mockData.themeDistribution.map((theme) => (
                  <div key={theme.name} className="flex items-center justify-between">
                    <span className="text-sm text-[#5a4b7a]">{theme.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-[#e0d6f0] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#c8b6e2] rounded-full transition-all"
                          style={{ width: `${(theme.count / mockData.capsules.total) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-[#5a4b7a]">{theme.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* 互动数据 */}
        <Section title="互动数据">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DataItem label="总互动次数" value={mockData.interactions.total.toLocaleString()} />
            <DataItem label="点赞数" value={mockData.interactions.likes.toLocaleString()} />
            <DataItem label="评论数" value={mockData.interactions.comments.toLocaleString()} />
            <DataItem label="收藏数" value={mockData.interactions.favorites.toLocaleString()} />
            <DataItem label="每日互动" value={mockData.interactions.daily.toLocaleString()} />
          </div>
        </Section>

        {/* 热门数据 */}
        <Section title="热门数据">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-[#8a7ab5] mb-3">热门标签</h3>
              <div className="space-y-3">
                {mockData.popularTags.map((tag, index) => (
                  <div key={tag.name} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#f5f3f7] flex items-center justify-center text-sm font-bold text-[#8a7ab5]">
                      {index + 1}
                    </span>
                    <span className="flex-1 text-sm text-[#5a4b7a]">#{tag.name}</span>
                    <span className="text-sm font-medium text-[#5a4b7a]">{tag.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-[#8a7ab5] mb-3">最受欢迎胶囊</h3>
              <div className="space-y-3">
                {mockData.popularCapsules.map((capsule, index) => (
                  <div key={capsule.id} className="bg-[#f5f3f7] rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-6 h-6 rounded-full bg-[#e8dff5] flex items-center justify-center text-sm font-bold text-[#8a7ab5]">
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium text-[#8a7ab5]">{capsule.total} 互动</span>
                    </div>
                    <p className="text-sm text-[#5a4b7a] line-clamp-2 mb-2">{capsule.content}</p>
                    <div className="flex items-center gap-3 text-xs text-[#a093c2]">
                      <span>❤️ {capsule.likes}</span>
                      <span>💬 {capsule.comments}</span>
                      <span>⭐ {capsule.favorites}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}

function TimeRangeButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full text-sm font-medium transition-all",
        active
          ? "bg-[#c8b6e2] text-white"
          : "bg-white border border-[#e0d6f0] text-[#8a7ab5] hover:border-[#c8b6e2]"
      )}
    >
      {label}
    </button>
  );
}

function DataCard({ icon, title, value, change, positive }: { icon: React.ReactNode; title: string; value: string; change: string; positive: boolean }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-[#e0d6f0] shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-full bg-[#f5f3f7] flex items-center justify-center text-[#8a7ab5]">
          {icon}
        </div>
        <span className={cn(
          "text-xs font-medium",
          positive ? "text-[#4caf50]" : "text-[#e57373]"
        )}>
          {change}
        </span>
      </div>
      <h3 className="text-sm text-[#8a7ab5] mb-1">{title}</h3>
      <p className="text-2xl font-bold text-[#5a4b7a]">{value}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-[#5a4b7a] mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-[#c8b6e2]" />
        {title}
      </h2>
      <div className="bg-white rounded-2xl p-6 border border-[#e0d6f0] shadow-sm">
        {children}
      </div>
    </div>
  );
}

function DataItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#f5f3f7] rounded-xl p-4">
      <p className="text-sm text-[#8a7ab5] mb-1">{label}</p>
      <p className="text-xl font-bold text-[#5a4b7a]">{value}</p>
    </div>
  );
}
