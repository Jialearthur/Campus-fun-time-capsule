import { useState, useMemo } from 'react';
import { useCapsuleStore } from '../store/useCapsuleStore';
import { 
  BarChart3, Users, Sparkles, Heart, MessageCircle, Star, TrendingUp, 
  Download, Calendar, Map, Clock, Activity, Trophy, ArrowUp, ArrowDown
} from 'lucide-react';
import { formatDate } from '../utils/date';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useTheme } from '../hooks/useTheme';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

type TimeRange = 'day' | 'week' | 'month';

export default function DataDashboard() {
  const { isDark } = useTheme();
  const { capsules, comments, currentUser } = useCapsuleStore();
  const [timeRange, setTimeRange] = useState<TimeRange>('day');
  const [viewMode, setViewMode] = useState<'overview' | 'heatmap' | 'timeline' | 'realtime'>('overview');

  const getTimeRangeFilter = () => {
    const now = new Date();
    switch (timeRange) {
      case 'day':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case 'week':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'month':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
  };

  const filteredCapsules = useMemo(() => {
    const timeFilter = getTimeRangeFilter();
    return capsules.filter(c => new Date(c.createdAt) >= timeFilter);
  }, [capsules, timeRange]);

  const dashboardData = useMemo(() => {
    const now = new Date();
    const timeFilter = getTimeRangeFilter();

    const totalUsers = 1280;
    const dailyNewUsers = 24;
    const activeUsers = 456;

    const totalCapsules = filteredCapsules.length;
    const publicCapsules = filteredCapsules.filter(c => c.isPublic).length;
    const privateCapsules = filteredCapsules.filter(c => !c.isPublic).length;
    const dailyNewCapsules = Math.floor(filteredCapsules.length / (timeRange === 'day' ? 1 : timeRange === 'week' ? 7 : 30));

    const totalInteractions = filteredCapsules.reduce((sum, c) => sum + c.likes + c.comments + c.favorites, 0);
    const totalLikes = filteredCapsules.reduce((sum, c) => sum + c.likes, 0);
    const totalComments = Object.keys(comments).reduce((sum, id) => {
      const capsuleComments = comments[id] || [];
      const filteredComments = capsuleComments.filter(c => new Date(c.createdAt) >= timeFilter);
      return sum + filteredComments.length;
    }, 0);
    const totalFavorites = filteredCapsules.reduce((sum, c) => sum + c.favorites, 0);
    const dailyInteractions = Math.floor(totalInteractions / (timeRange === 'day' ? 1 : timeRange === 'week' ? 7 : 30));

    const themeKeywords = {
      '校园日常': ['学习', '日常', '食堂', '宿舍', '图书馆'],
      '毕业期许': ['毕业', '未来', '青春', '梦想', '离别'],
      '好友约定': ['朋友', '约定', '友谊', '聚会', '约定'],
      '社团时光': ['社团', '活动', '团队', '兴趣', '成长'],
      '浪漫回忆': ['喜欢', '暗恋', '约会', '初恋', '甜蜜'],
      '奋斗时光': ['努力', '奋斗', '考试', '熬夜', '坚持']
    };

    const themeHeatmap: Record<string, { count: number; interactions: number }> = {};
    Object.keys(themeKeywords).forEach(theme => {
      themeHeatmap[theme] = { count: 0, interactions: 0 };
    });

    filteredCapsules.forEach(capsule => {
      capsule.tags.forEach(tag => {
        for (const [theme, keywords] of Object.entries(themeKeywords)) {
          if (keywords.some(keyword => tag.includes(keyword) || capsule.content.includes(keyword))) {
            themeHeatmap[theme].count++;
            themeHeatmap[theme].interactions += capsule.likes + capsule.comments + capsule.favorites;
          }
        }
      });
    });

    const tagCount: Record<string, number> = {};
    filteredCapsules.forEach(capsule => {
      capsule.tags.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });
    const popularTags = Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({ name: tag, count }));

    const userCapsules = currentUser ? filteredCapsules.filter(c => c.userId === currentUser.id) : [];
    const timelineData = userCapsules.reduce((acc, capsule) => {
      const date = new Date(capsule.createdAt).toDateString();
      if (!acc[date]) {
        acc[date] = { count: 0, tags: [] as string[] };
      }
      acc[date].count++;
      acc[date].tags.push(...capsule.tags);
      return acc;
    }, {} as Record<string, { count: number; tags: string[] }>);

    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayCapsules = capsules.filter(c => new Date(c.createdAt) >= todayStart);
    const todayInteractions = todayCapsules.reduce((sum, c) => sum + c.likes + c.comments + c.favorites, 0);

    return {
      users: { total: totalUsers, dailyNew: dailyNewUsers, active: activeUsers },
      capsules: { total: totalCapsules, public: publicCapsules, private: privateCapsules, dailyNew: dailyNewCapsules },
      interactions: { total: totalInteractions, likes: totalLikes, comments: totalComments, favorites: totalFavorites, daily: dailyInteractions },
      themeHeatmap,
      popularTags,
      timelineData,
      realtime: {
        todayCapsules: todayCapsules.length,
        todayInteractions,
        popularTags
      }
    };
  }, [filteredCapsules, comments, currentUser, timeRange]);

  const handleExport = () => {
    const data = {
      exportDate: new Date().toISOString(),
      timeRange,
      summary: {
        totalCapsules: dashboardData.capsules.total,
        totalInteractions: dashboardData.interactions.total,
        popularTags: dashboardData.popularTags
      },
      capsules: filteredCapsules.map(c => ({
        id: c.id,
        content: c.content.substring(0, 100),
        tags: c.tags.join(', '),
        likes: c.likes,
        comments: c.comments,
        favorites: c.favorites,
        createdAt: c.createdAt
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-export-${formatDate(new Date())}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getHeatmapColor = (count: number, maxCount: number) => {
    const intensity = Math.min(count / maxCount, 1);
    const r = Math.floor(255 - intensity * 100);
    const g = Math.floor(255 - intensity * 150);
    const b = Math.floor(255 - intensity * 50);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const maxThemeCount = Math.max(...Object.values(dashboardData.themeHeatmap).map(t => t.count), 1);

  return (
    <div className={cn(
      "min-h-screen pb-24",
      isDark
        ? "bg-gradient-to-br from-dark-bg-primary via-dark-bg-secondary to-dark-bg-primary"
        : "bg-gradient-to-br from-slate-50 via-white to-blue-50"
    )}>
      <div className={cn(
        "sticky top-0 backdrop-blur-xl z-40 border-b shadow-sm",
        isDark
          ? "bg-dark-bg-secondary/90 border-dark-border-primary"
          : "bg-white/90 border-slate-200"
      )}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className={cn(
              "text-xl font-bold",
              isDark ? "text-dark-text-primary" : "text-slate-800"
            )}>数据统计看板</h1>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            <Download className="w-4 h-4" />
            导出数据
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calendar className={cn(
              "w-5 h-5",
              isDark ? "text-dark-text-secondary" : "text-slate-600"
            )} />
            <span className={cn(
              "font-medium",
              isDark ? "text-dark-text-primary" : "text-slate-700"
            )}>数据范围</span>
          </div>
          <div className="flex gap-2">
            <TimeRangeButton active={timeRange === 'day'} onClick={() => setTimeRange('day')} label="今日" isDark={isDark} />
            <TimeRangeButton active={timeRange === 'week'} onClick={() => setTimeRange('week')} label="本周" isDark={isDark} />
            <TimeRangeButton active={timeRange === 'month'} onClick={() => setTimeRange('month')} label="本月" isDark={isDark} />
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <ViewModeButton active={viewMode === 'overview'} onClick={() => setViewMode('overview')} icon={<BarChart3 className="w-4 h-4" />} label="总览" isDark={isDark} />
          <ViewModeButton active={viewMode === 'heatmap'} onClick={() => setViewMode('heatmap')} icon={<Map className="w-4 h-4" />} label="情感热力图" isDark={isDark} />
          <ViewModeButton active={viewMode === 'timeline'} onClick={() => setViewMode('timeline')} icon={<Clock className="w-4 h-4" />} label="时光轨迹" isDark={isDark} />
          <ViewModeButton active={viewMode === 'realtime'} onClick={() => setViewMode('realtime')} icon={<Activity className="w-4 h-4" />} label="实时大屏" isDark={isDark} />
        </div>

        {viewMode === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <DataCard
                icon={<Users className="w-6 h-6" />}
                title="总注册用户"
                value={dashboardData.users.total.toLocaleString()}
                change="+12%"
                positive
                isDark={isDark}
              />
              <DataCard
                icon={<Sparkles className="w-6 h-6" />}
                title="胶囊总数"
                value={dashboardData.capsules.total.toLocaleString()}
                change="+8%"
                positive
                isDark={isDark}
              />
              <DataCard
                icon={<Heart className="w-6 h-6" />}
                title="总互动次数"
                value={dashboardData.interactions.total.toLocaleString()}
                change="+15%"
                positive
                isDark={isDark}
              />
              <DataCard
                icon={<Star className="w-6 h-6" />}
                title="活跃用户"
                value={dashboardData.users.active.toLocaleString()}
                change="+5%"
                positive
                isDark={isDark}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Section title="胶囊数据" isDark={isDark}>
                <div className="grid grid-cols-2 gap-4">
                  <DataItem label="胶囊总数" value={dashboardData.capsules.total.toLocaleString()} isDark={isDark} />
                  <DataItem label="公开胶囊" value={dashboardData.capsules.public.toLocaleString()} isDark={isDark} />
                  <DataItem label="私密胶囊" value={dashboardData.capsules.private.toLocaleString()} isDark={isDark} />
                  <DataItem label="每日新增" value={dashboardData.capsules.dailyNew.toLocaleString()} isDark={isDark} />
                </div>
              </Section>

              <Section title="互动数据" isDark={isDark}>
                <div className="grid grid-cols-2 gap-4">
                  <DataItem label="总互动次数" value={dashboardData.interactions.total.toLocaleString()} isDark={isDark} />
                  <DataItem label="点赞数" value={dashboardData.interactions.likes.toLocaleString()} isDark={isDark} />
                  <DataItem label="评论数" value={dashboardData.interactions.comments.toLocaleString()} isDark={isDark} />
                  <DataItem label="收藏数" value={dashboardData.interactions.favorites.toLocaleString()} isDark={isDark} />
                </div>
              </Section>
            </div>

            <Section title="热门标签 TOP 5" isDark={isDark}>
              <div className="flex flex-wrap gap-3">
                {dashboardData.popularTags.map((tag, index) => (
                  <div key={tag.name} className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full",
                    isDark
                      ? "bg-dark-bg-tertiary border border-dark-border-secondary"
                      : "bg-gradient-to-r from-blue-100 to-cyan-100"
                  )}>
                    <span className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold",
                      isDark
                        ? "bg-dark-bg-secondary text-dark-text-primary"
                        : "bg-white text-blue-600"
                    )}>
                      {index + 1}
                    </span>
                    <span className={cn(
                      "font-medium",
                      isDark ? "text-dark-text-secondary" : "text-slate-700"
                    )}>#{tag.name}</span>
                    <span className="text-sm font-bold text-blue-600">{tag.count}</span>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        )}

        {viewMode === 'heatmap' && (
          <div className="space-y-6">
            <Section title="校园情感热力图" isDark={isDark}>
              <p className={cn(
                "text-sm mb-4",
                isDark ? "text-dark-text-tertiary" : "text-slate-600"
              )}>
                颜色深浅表示热度，越深表示该主题的胶囊发布量和互动量越高
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(dashboardData.themeHeatmap).map(([theme, data]) => (
                  <div
                    key={theme}
                    className={cn(
                      "rounded-xl p-4 border transition-all hover:scale-105 cursor-pointer",
                      isDark && data.count === 0 && "bg-dark-bg-tertiary border-dark-border-secondary"
                    )}
                    style={{
                      backgroundColor: data.count > 0 ? getHeatmapColor(data.count, maxThemeCount) : undefined,
                      borderColor: data.count > 0 ? '#3b82f6' : isDark ? '#334155' : '#e2e8f0'
                    }}
                  >
                    <h3 className={cn(
                      "font-bold mb-2",
                      isDark ? "text-dark-text-primary" : "text-slate-800"
                    )}>{theme}</h3>
                    <div className="space-y-1">
                      <p className={cn(
                        "text-sm",
                        isDark ? "text-dark-text-secondary" : "text-slate-600"
                      )}>
                        发布量: <span className="font-bold">{data.count}</span>
                      </p>
                      <p className={cn(
                        "text-sm",
                        isDark ? "text-dark-text-secondary" : "text-slate-600"
                      )}>
                        互动量: <span className="font-bold">{data.interactions}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        )}

        {viewMode === 'timeline' && (
          <div className="space-y-6">
            <Section title="个人时光轨迹" isDark={isDark}>
              {Object.keys(dashboardData.timelineData).length === 0 ? (
                <div className="text-center py-12">
                  <Clock className={cn(
                    "w-16 h-16 mx-auto mb-4",
                    isDark ? "text-dark-text-tertiary" : "text-slate-300"
                  )} />
                  <p className={cn(
                    "",
                    isDark ? "text-dark-text-tertiary" : "text-slate-500"
                  )}>还没有发布胶囊</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(dashboardData.timelineData)
                    .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
                    .map(([date, data]) => (
                      <div key={date} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
                          <div className="w-0.5 flex-1 bg-gradient-to-b from-blue-500 to-cyan-500" />
                        </div>
                        <div className="flex-1 pb-6">
                          <div className={cn(
                            "rounded-xl p-4 border shadow-sm",
                            isDark
                              ? "bg-dark-bg-secondary border-dark-border-secondary"
                              : "bg-white border-slate-200"
                          )}>
                            <h4 className={cn(
                              "font-bold mb-2",
                              isDark ? "text-dark-text-primary" : "text-slate-800"
                            )}>
                              {new Date(date).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}
                            </h4>
                            <p className={cn(
                              "text-sm mb-2",
                              isDark ? "text-dark-text-secondary" : "text-slate-600"
                            )}>
                              发布 <span className="font-bold text-blue-600">{data.count}</span> 个胶囊
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {[...new Set(data.tags)].slice(0, 5).map(tag => (
                                <span key={tag} className={cn(
                                  "text-xs px-2 py-1 rounded-full",
                                  isDark
                                    ? "bg-dark-bg-tertiary text-dark-text-secondary border border-dark-border-secondary"
                                    : "bg-blue-100 text-blue-700"
                                )}>
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </Section>
          </div>
        )}

        {viewMode === 'realtime' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-2xl p-6 text-white">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Activity className="w-7 h-7" />
                实时数据大屏
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <RealtimeCard
                  icon={<Sparkles className="w-8 h-8" />}
                  title="今日新增胶囊"
                  value={dashboardData.realtime.todayCapsules}
                  color="from-yellow-400 to-orange-500"
                />
                <RealtimeCard
                  icon={<Heart className="w-8 h-8" />}
                  title="今日互动次数"
                  value={dashboardData.realtime.todayInteractions}
                  color="from-pink-400 to-rose-500"
                />
                <RealtimeCard
                  icon={<Users className="w-8 h-8" />}
                  title="在线用户"
                  value={156}
                  color="from-blue-400 to-cyan-500"
                />
                <RealtimeCard
                  icon={<Trophy className="w-8 h-8" />}
                  title="今日新成就"
                  value={12}
                  color="from-purple-400 to-indigo-500"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4">热门标签 TOP 5</h3>
                <div className="space-y-3">
                  {dashboardData.realtime.popularTags.map((tag, index) => (
                    <div key={tag.name} className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">#{tag.name}</span>
                          <span className="font-bold">{tag.count}</span>
                        </div>
                        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                            style={{ width: `${(tag.count / Math.max(...dashboardData.realtime.popularTags.map(t => t.count))) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TimeRangeButton({ active, onClick, label, isDark }: { active: boolean; onClick: () => void; label: string; isDark: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full text-sm font-medium transition-all",
        active
          ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
          : isDark
            ? "bg-dark-bg-secondary border border-dark-border-secondary text-dark-text-secondary hover:border-blue-400"
            : "bg-white border border-slate-200 text-slate-600 hover:border-blue-300"
      )}
    >
      {label}
    </button>
  );
}

function ViewModeButton({ active, onClick, icon, label, isDark }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; isDark: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all flex-shrink-0",
        active
          ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
          : isDark
            ? "bg-dark-bg-secondary border border-dark-border-secondary text-dark-text-secondary hover:border-blue-400"
            : "bg-white border border-slate-200 text-slate-600 hover:border-blue-300"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function DataCard({ icon, title, value, change, positive, isDark }: { icon: React.ReactNode; title: string; value: string; change: string; positive: boolean; isDark: boolean }) {
  return (
    <div className={cn(
      "rounded-2xl p-5 border shadow-sm hover:shadow-md transition-all",
      isDark
        ? "bg-dark-bg-secondary border-dark-border-secondary"
        : "bg-white border-slate-200"
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center text-blue-600">
          {icon}
        </div>
        <span className={cn(
          "text-sm font-medium flex items-center gap-1",
          positive ? "text-green-600" : "text-red-600"
        )}>
          {positive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
          {change}
        </span>
      </div>
      <h3 className={cn(
        "text-sm mb-1",
        isDark ? "text-dark-text-tertiary" : "text-slate-500"
      )}>{title}</h3>
      <p className={cn(
        "text-2xl font-bold",
        isDark ? "text-dark-text-primary" : "text-slate-800"
      )}>{value}</p>
    </div>
  );
}

function Section({ title, children, isDark }: { title: string; children: React.ReactNode; isDark: boolean }) {
  return (
    <div className="mb-6">
      <h2 className={cn(
        "text-lg font-bold mb-4 flex items-center gap-2",
        isDark ? "text-dark-text-primary" : "text-slate-800"
      )}>
        <BarChart3 className="w-5 h-5 text-blue-500" />
        {title}
      </h2>
      <div className={cn(
        "rounded-2xl p-6 border shadow-sm",
        isDark
          ? "bg-dark-bg-secondary border-dark-border-secondary"
          : "bg-white border-slate-200"
      )}>
        {children}
      </div>
    </div>
  );
}

function DataItem({ label, value, isDark }: { label: string; value: string; isDark: boolean }) {
  return (
    <div className={cn(
      "rounded-xl p-4",
      isDark
        ? "bg-dark-bg-tertiary border border-dark-border-secondary"
        : "bg-gradient-to-br from-slate-50 to-blue-50"
    )}>
      <p className={cn(
        "text-sm mb-1",
        isDark ? "text-dark-text-tertiary" : "text-slate-500"
      )}>{label}</p>
      <p className={cn(
        "text-xl font-bold",
        isDark ? "text-dark-text-primary" : "text-slate-800"
      )}>{value}</p>
    </div>
  );
}

function RealtimeCard({ icon, title, value, color }: { icon: React.ReactNode; title: string; value: number; color: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-sm text-slate-200 mb-1">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
