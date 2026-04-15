import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Plus, Users, BookOpen, Search, BarChart3, MapPin } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gummy-cream to-gummy-pink/30 pb-24">
      <div className="max-w-md mx-auto px-4 pt-10">
        {/* 顶部标题和搜索框 */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-16 h-16 rounded-full gummy-gradient flex items-center justify-center shadow-gummy animate-float">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gummy-dark font-title">
              校园时光胶囊
            </h1>
          </div>
          <p className="text-gummy-dark/70 mb-8 text-lg font-body">
            记录校园时光，珍藏青春回忆
          </p>
          
          {/* 搜索框 */}
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索昵称、标签..."
              className="w-full px-5 py-4 pl-14 rounded-full border-2 border-gummy-pink/30 bg-white shadow-gummy focus:outline-none focus:ring-2 focus:ring-gummy-pink focus:border-transparent transition-all"
            />
            <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gummy-dark/60">
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
            gradient="gummy-gradient"
            textColor="text-gummy-dark"
          />
          <FeatureButton
            icon={<Users className="w-8 h-8 text-white" />}
            title="胶囊广场"
            description="发现他人的时光故事"
            onClick={() => navigate('/square')}
            gradient="from-gummy-purple to-gummy-blue"
            textColor="text-gummy-dark"
          />
          <FeatureButton
            icon={<BookOpen className="w-8 h-8 text-white" />}
            title="我的胶囊"
            description="查看我的时光收藏"
            onClick={() => navigate('/my')}
            gradient="from-gummy-green to-gummy-blue"
            textColor="text-gummy-dark"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate('/campus-map');
            }}
            className="group w-full p-6 rounded-3xl bg-white border-2 border-gummy-pink/30 shadow-gummy hover:shadow-gummy-hover transition-all duration-300 hover:scale-[1.02] gummy-card"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gummy-green to-gummy-teal flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1 text-gummy-dark font-title">
                  校园地图
                </h3>
                <p className="text-gummy-dark/60 text-sm font-body">
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
            gradient="from-gummy-orange to-gummy-pink"
            textColor="text-gummy-dark"
          />
        </div>

        {/* 底部装饰 */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-gummy-orange text-sm font-medium">
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
  textColor
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  gradient: string;
  textColor: string;
}) {
  return (
    <button
      onClick={onClick}
      className="group w-full p-6 rounded-3xl bg-white border-2 border-gummy-pink/30 shadow-gummy hover:shadow-gummy-hover transition-all duration-300 hover:scale-[1.02] gummy-card"
    >
      <div className="flex items-start gap-4">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className={`text-xl font-bold mb-1 ${textColor} font-title`}>
            {title}
          </h3>
          <p className="text-gummy-dark/60 text-sm font-body">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}