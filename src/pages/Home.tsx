import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Plus, Users, BookOpen, Search, BarChart3, MapPin } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useTheme } from '../hooks/useTheme';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { isDark } = useTheme();

  return (
    <div className={cn(
      "min-h-screen pb-24 transition-colors duration-300",
      isDark 
        ? "bg-dark-bg-primary text-dark-text-primary"
        : "bg-gradient-to-b from-gummy-cream to-gummy-pink/30 text-gummy-dark"
    )}>
      <div className="max-w-md mx-auto px-4 pt-10">
        {/* 顶部标题和搜索框 */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center shadow-gummy animate-float",
              isDark ? "bg-gradient-to-r from-dark-accent-primary to-dark-accent-secondary" : "gummy-gradient"
            )}>
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className={cn(
              "text-4xl font-bold font-title",
              isDark ? "text-dark-text-primary" : "text-gummy-dark"
            )}>
              校园时光胶囊
            </h1>
          </div>
          <p className={cn(
            "mb-8 text-lg font-body",
            isDark ? "text-dark-text-secondary" : "text-gummy-dark/70"
          )}>
            记录校园时光，珍藏青春回忆
          </p>
          
          {/* 搜索框 */}
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索昵称、标签..."
              className={cn(
                "w-full px-5 py-4 pl-14 rounded-full border-2 focus:outline-none focus:ring-2 focus:border-transparent transition-all",
                isDark
                  ? "bg-dark-bg-secondary border-dark-border-primary focus:ring-dark-accent-secondary"
                  : "bg-white border-gummy-pink/30 shadow-gummy focus:ring-gummy-pink"
              )}
            />
            <div className={cn(
              "absolute left-5 top-1/2 transform -translate-y-1/2",
              isDark ? "text-dark-text-tertiary" : "text-gummy-dark/60"
            )}>
              <Search className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* 核心功能入口 */}
        <div className="grid grid-cols-1 gap-6 mb-14">
          <FeatureButton
            icon={<Plus className="w-8 h-8 text-white" />}
            title="创建胶囊"
            description="记录此刻的心情和回忆"
            onClick={() => navigate('/create')}
            gradient={isDark ? "from-dark-accent-primary to-dark-accent-secondary" : "gummy-gradient"}
            textColor={isDark ? "text-dark-text-primary" : "text-gummy-dark"}
            isDark={isDark}
          />
          <FeatureButton
            icon={<Users className="w-8 h-8 text-white" />}
            title="胶囊广场"
            description="发现他人的时光故事"
            onClick={() => navigate('/square')}
            gradient={isDark ? "from-dark-accent-primary to-dark-accent-secondary" : "from-gummy-purple to-gummy-blue"}
            textColor={isDark ? "text-dark-text-primary" : "text-gummy-dark"}
            isDark={isDark}
          />
          <FeatureButton
            icon={<BookOpen className="w-8 h-8 text-white" />}
            title="我的胶囊"
            description="查看我的时光收藏"
            onClick={() => navigate('/my')}
            gradient={isDark ? "from-dark-accent-primary to-dark-accent-secondary" : "from-gummy-green to-gummy-blue"}
            textColor={isDark ? "text-dark-text-primary" : "text-gummy-dark"}
            isDark={isDark}
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate('/campus-map');
            }}
            className={cn(
              "group w-full p-6 rounded-3xl border-2 hover:shadow-gummy-hover transition-all duration-300 hover:scale-[1.02] gummy-card",
              isDark
                ? "bg-dark-bg-secondary border-dark-border-primary"
                : "bg-white border-gummy-pink/30 shadow-gummy"
            )}
          >
            <div className="flex items-start gap-4">
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow",
                isDark ? "bg-gradient-to-br from-dark-accent-primary to-dark-accent-secondary" : "bg-gradient-to-br from-gummy-green to-gummy-teal"
              )}>
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className={cn(
                  "text-xl font-bold mb-1 font-title",
                  isDark ? "text-dark-text-primary" : "text-gummy-dark"
                )}>
                  校园地图
                </h3>
                <p className={cn(
                  "text-sm font-body",
                  isDark ? "text-dark-text-secondary" : "text-gummy-dark/60"
                )}>
                  探索校园里的时光胶囊
                </p>
              </div>
            </div>
          </button>
          <FeatureButton
            icon={<BarChart3 className="w-8 h-8 text-white" />}
            title="数据统计"
            description="查看胶囊数据和互动情况"
            onClick={() => navigate('/dashboard')}
            gradient={isDark ? "from-dark-accent-primary to-dark-accent-secondary" : "from-gummy-orange to-gummy-pink"}
            textColor={isDark ? "text-dark-text-primary" : "text-gummy-dark"}
            isDark={isDark}
          />
        </div>

        {/* 底部装饰 */}
        <div className="text-center">
          <div className={cn(
            "inline-flex items-center gap-2 text-sm font-medium",
            isDark ? "text-dark-accent-secondary" : "text-gummy-orange"
          )}>
            <Sparkles className="w-4 h-4" />
            <span>珍藏每一刻美好</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureButton({
  icon,
  title,
  description,
  onClick,
  gradient,
  textColor,
  isDark
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  gradient: string;
  textColor: string;
  isDark: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group w-full p-6 rounded-3xl border-2 hover:shadow-gummy-hover transition-all duration-300 hover:scale-[1.02] gummy-card",
        isDark
          ? "bg-dark-bg-secondary border-dark-border-primary"
          : "bg-white border-gummy-pink/30 shadow-gummy"
      )}
    >
      <div className="flex items-start gap-4">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className={`text-xl font-bold mb-1 ${textColor} font-title`}>
            {title}
          </h3>
          <p className={cn(
            "text-sm font-body",
            isDark ? "text-dark-text-secondary" : "text-gummy-dark/60"
          )}>
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}