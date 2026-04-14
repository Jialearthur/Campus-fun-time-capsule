import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Plus, Users, BookOpen, Search } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f9f7f4] via-white to-[#f5f3f7] pb-24">
      <div className="max-w-md mx-auto px-4 pt-8">
        {/* 顶部标题和搜索框 */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#e8dff5] to-[#d8f0e3] flex items-center justify-center shadow-sm">
              <Sparkles className="w-6 h-6 text-[#8a7ab5]" />
            </div>
            <h1 className="text-3xl font-bold text-[#5a4b7a]">
              时光胶囊
            </h1>
          </div>
          <p className="text-[#8b8b8b] mb-6">
            记录校园时光，珍藏青春回忆
          </p>
          
          {/* 搜索框 */}
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索昵称、标签..."
              className="w-full px-4 py-3 pl-12 rounded-full border border-[#e0d6f0] bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#c8b6e2] focus:border-transparent"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#a093c2]">
              <Search className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* 核心功能入口 */}
        <div className="grid grid-cols-1 gap-6 mb-12">
          <FeatureButton
            icon={<Plus className="w-8 h-8" />}
            title="创建胶囊"
            description="记录此刻的心情和回忆"
            onClick={() => navigate('/create')}
            gradient="from-[#e8dff5] to-[#d8f0e3]"
            textColor="text-[#5a4b7a]"
          />
          <FeatureButton
            icon={<Users className="w-8 h-8" />}
            title="胶囊广场"
            description="发现他人的时光故事"
            onClick={() => navigate('/square')}
            gradient="from-[#e8f0f8] to-[#f0e8f8]"
            textColor="text-[#5a4b7a]"
          />
          <FeatureButton
            icon={<BookOpen className="w-8 h-8" />}
            title="我的胶囊"
            description="查看我的时光收藏"
            onClick={() => navigate('/my')}
            gradient="from-[#f8e8e8] to-[#e8f0f8]"
            textColor="text-[#5a4b7a]"
          />
        </div>

        {/* 底部装饰 */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-[#c8b6e2] text-sm">
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
      className="group w-full p-6 rounded-2xl bg-white border border-[#e0d6f0] shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
    >
      <div className="flex items-start gap-4">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className={`text-xl font-bold mb-1 ${textColor}`}>
            {title}
          </h3>
          <p className="text-[#8b8b8b] text-sm">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}