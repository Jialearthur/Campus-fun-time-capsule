import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Plus, Users, BookOpen, Search, BarChart3, MapPin, MessageSquare } from 'lucide-react';
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
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className={cn(
              "w-16 h-16 rounded-apple-xl flex items-center justify-center shadow-sm",
              isDark 
                ? "bg-dark-bg-tertiary"
                : "bg-white"
            )}>
              <Sparkles className={cn(
                "w-8 h-8",
                isDark ? "text-dark-accent-secondary" : "text-apple-purple"
              )} />
            </div>
          </div>
          <h1 className={cn(
            "text-3xl md:text-4xl font-semibold mb-4 tracking-tight",
            isDark ? "text-dark-text-primary" : "text-apple-gray-800"
          )}>
            校园时光胶囊
          </h1>
          <p className={cn(
            "text-base md:text-lg font-light leading-relaxed mb-8 max-w-2xl mx-auto",
            isDark ? "text-dark-text-secondary" : "text-apple-gray-500"
          )}>
            记录校园时光，珍藏青春回忆
          </p>
          
          {/* Search Field */}
          <div className="relative max-w-md mx-auto">
            <div className={cn(
              "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none",
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
                "w-full pl-12 pr-4 py-3.5 rounded-apple-lg border transition-all duration-300 ease-apple text-base",
                isDark
                  ? "bg-dark-bg-secondary text-dark-text-primary placeholder-dark-text-tertiary border-dark-border-primary focus:border-dark-accent-primary"
                  : "bg-white text-apple-gray-800 placeholder-apple-gray-400 border-apple-gray-200 focus:border-apple-purple focus:outline-none"
              )}
            />
          </div>
        </div>

        {/* Feature Grid */}
        <div className={cn(
          "grid gap-4 mb-16",
          "sm:grid-cols-2",
          "lg:grid-cols-3"
        )}>
          <FeatureButton
            icon={<Plus className="w-6 h-6" />}
            title="创建胶囊"
            description="记录此刻的心情和回忆"
            onClick={() => navigate('/create')}
            color={isDark ? "text-dark-accent-secondary" : "text-apple-purple"}
            bgColor={isDark ? "bg-dark-bg-tertiary/50" : "bg-white"}
            isDark={isDark}
          />
          
          <FeatureButton
            icon={<Users className="w-6 h-6" />}
            title="胶囊广场"
            description="发现他人的时光故事"
            onClick={() => navigate('/square')}
            color={isDark ? "text-dark-accent-primary" : "text-apple-blue"}
            bgColor={isDark ? "bg-dark-bg-tertiary/50" : "bg-white"}
            isDark={isDark}
          />
          
          <FeatureButton
            icon={<BookOpen className="w-6 h-6" />}
            title="我的胶囊"
            description="查看我的时光收藏"
            onClick={() => navigate('/my')}
            color={isDark ? "text-apple-green" : "text-apple-green"}
            bgColor={isDark ? "bg-dark-bg-tertiary/50" : "bg-white"}
            isDark={isDark}
          />
          
          <FeatureButton
            icon={<MapPin className="w-6 h-6" />}
            title="校园地图"
            description="探索校园里的时光胶囊"
            onClick={() => navigate('/campus-map')}
            color={isDark ? "text-apple-orange" : "text-apple-orange"}
            bgColor={isDark ? "bg-dark-bg-tertiary/50" : "bg-white"}
            isDark={isDark}
          />
          
          <FeatureButton
            icon={<BarChart3 className="w-6 h-6" />}
            title="数据统计"
            description="查看胶囊数据和互动情况"
            onClick={() => navigate('/dashboard')}
            color={isDark ? "text-dark-accent-tertiary" : "text-apple-indigo"}
            bgColor={isDark ? "bg-dark-bg-tertiary/50" : "bg-white"}
            isDark={isDark}
          />
          
          <FeatureButton
            icon={<MessageSquare className="w-6 h-6" />}
            title="漂流瓶"
            description="随机收到他人的时光胶囊"
            onClick={() => navigate('/drift-bottle')}
            color={isDark ? "text-apple-teal" : "text-apple-teal"}
            bgColor={isDark ? "bg-dark-bg-tertiary/50" : "bg-white"}
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
  color,
  bgColor,
  isDark,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  color: string;
  bgColor: string;
  isDark: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group w-full p-5 rounded-apple-lg transition-all duration-200 ease-apple hover:shadow-sm",
        bgColor,
        isDark ? "border border-dark-border-primary" : "border border-apple-gray-200"
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "shrink-0 flex items-center justify-center rounded-apple",
          isDark ? "bg-dark-bg-tertiary/70" : "bg-apple-gray-100",
          "w-12 h-12",
          color
        )}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className={cn(
            "font-medium mb-1 text-base",
            isDark ? "text-dark-text-primary" : "text-apple-gray-800"
          )}>
            {title}
          </h3>
          <p className={cn(
            "font-light text-sm",
            isDark ? "text-dark-text-secondary" : "text-apple-gray-500"
          )}>
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}
