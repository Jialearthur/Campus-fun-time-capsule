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
      "min-h-screen pb-32 transition-colors duration-500 ease-apple",
      isDark 
        ? "bg-dark-bg-primary"
        : "bg-apple-gray-100"
    )}>
      <div className="max-w-lg mx-auto px-6 pt-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-up">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className={cn(
              "w-20 h-20 rounded-apple-2xl flex items-center justify-center shadow-apple-lg animate-float",
              isDark 
                ? "bg-gradient-to-br from-dark-accent-primary to-dark-accent-secondary"
                : "bg-gradient-to-br from-apple-purple to-apple-blue"
            )}>
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className={cn(
            "text-5xl font-bold mb-4 tracking-tight",
            isDark ? "text-dark-text-primary" : "text-apple-gray-800"
          )}>
            校园时光胶囊
          </h1>
          <p className={cn(
            "text-xl font-light leading-relaxed mb-10",
            isDark ? "text-dark-text-secondary" : "text-apple-gray-500"
          )}>
            记录校园时光，珍藏青春回忆
          </p>
          
          {/* Search Field */}
          <div className="relative max-w-md mx-auto">
            <div className={cn(
              "absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none",
              isDark ? "text-dark-text-tertiary" : "text-apple-gray-400"
            )}>
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索昵称、标签..."
              className={cn(
                "w-full pl-14 pr-6 py-5 rounded-apple-xl border-0 focus:ring-4 transition-all duration-300 ease-apple shadow-apple text-lg",
                isDark
                  ? "bg-dark-bg-secondary text-dark-text-primary placeholder-dark-text-tertiary focus:ring-dark-accent-primary/30"
                  : "bg-white text-apple-gray-800 placeholder-apple-gray-400 focus:ring-apple-purple/20 focus:outline-none"
              )}
            />
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 gap-6 mb-16">
          <FeatureButton
            icon={<Plus className="w-8 h-8 text-white" />}
            title="创建胶囊"
            description="记录此刻的心情和回忆"
            onClick={() => navigate('/create')}
            gradient={isDark ? "from-dark-accent-primary to-dark-accent-secondary" : "from-apple-purple to-apple-blue"}
            isDark={isDark}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FeatureButton
              icon={<Users className="w-6 h-6 text-white" />}
              title="胶囊广场"
              description="发现他人的时光故事"
              onClick={() => navigate('/square')}
              gradient={isDark ? "from-apple-teal to-dark-accent-primary" : "from-apple-teal to-apple-indigo"}
              isDark={isDark}
              compact
            />
            <FeatureButton
              icon={<BookOpen className="w-6 h-6 text-white" />}
              title="我的胶囊"
              description="查看我的时光收藏"
              onClick={() => navigate('/my')}
              gradient={isDark ? "from-apple-green to-apple-teal" : "from-apple-green to-apple-teal"}
              isDark={isDark}
              compact
            />
          </div>
          
          <FeatureButton
            icon={<MapPin className="w-7 h-7 text-white" />}
            title="校园地图"
            description="探索校园里的时光胶囊"
            onClick={() => navigate('/campus-map')}
            gradient={isDark ? "from-apple-orange to-apple-pink" : "from-apple-orange to-apple-pink"}
            isDark={isDark}
          />
          
          <FeatureButton
            icon={<BarChart3 className="w-7 h-7 text-white" />}
            title="数据统计"
            description="查看胶囊数据和互动情况"
            onClick={() => navigate('/dashboard')}
            gradient={isDark ? "from-dark-accent-tertiary to-apple-orange" : "from-apple-indigo to-apple-purple"}
            isDark={isDark}
          />
        </div>

        {/* Footer Branding */}
        <div className="text-center pb-8">
          <div className={cn(
            "inline-flex items-center gap-2 text-sm font-medium",
            isDark ? "text-dark-text-tertiary" : "text-apple-gray-400"
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
  isDark,
  compact = false
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  gradient: string;
  isDark: boolean;
  compact?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group w-full p-6 rounded-apple-2xl transition-all duration-300 ease-apple hover:scale-[1.02] active:scale-[0.98]",
        isDark
          ? "bg-dark-bg-secondary border border-dark-border-primary shadow-apple-dark"
          : "bg-white border border-apple-gray-200 shadow-apple hover:shadow-apple-lg"
      )}
    >
      <div className={cn("flex items-start gap-4", compact && "flex-col items-center text-center")}>
        <div className={cn(
          "shrink-0 flex items-center justify-center shadow-apple rounded-apple-xl bg-gradient-to-br",
          gradient,
          compact ? "w-14 h-14" : "w-16 h-16"
        )}>
          {icon}
        </div>
        <div className={cn("flex-1", compact && "mt-3")}>
          <h3 className={cn(
            "font-semibold mb-1",
            compact ? "text-base" : "text-xl",
            isDark ? "text-dark-text-primary" : "text-apple-gray-800"
          )}>
            {title}
          </h3>
          <p className={cn(
            "font-light",
            compact ? "text-sm" : "text-base",
            isDark ? "text-dark-text-secondary" : "text-apple-gray-500"
          )}>
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}
