import React, { useState } from 'react';
import { X, Download, Share2, CheckCircle2 } from 'lucide-react';
import { Capsule } from '../types';
import { useCapsuleStore } from '../store/useCapsuleStore';

interface SharePosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  capsule: Capsule;
}

type PosterStyle = 'simple' | 'warm' | 'campus';

const SharePosterModal: React.FC<SharePosterModalProps> = ({
  isOpen,
  onClose,
  capsule
}) => {
  const [selectedStyle, setSelectedStyle] = useState<PosterStyle>('simple');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const { unlockAchievement, currentUser } = useCapsuleStore();

  if (!isOpen) return null;

  const posterStyles: Record<PosterStyle, { name: string; gradient: string; accent: string }> = {
    simple: {
      name: '简约风',
      gradient: 'from-gray-50 to-gray-100',
      accent: 'text-gray-700'
    },
    warm: {
      name: '治愈风',
      gradient: 'from-pink-50 via-rose-50 to-orange-50',
      accent: 'text-rose-600'
    },
    campus: {
      name: '校园风',
      gradient: 'from-blue-50 via-purple-50 to-indigo-50',
      accent: 'text-indigo-600'
    }
  };

  const handleSave = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaved(true);
    setIsGenerating(false);
    setTimeout(() => setIsSaved(false), 3000);
    
    // 解锁"分享达人"成就
    if (currentUser) {
      unlockAchievement(currentUser.id, 'share_poster');
    }
  };

  const handleShare = (platform: string) => {
    alert(`正在分享到 ${platform}...`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">🎨 生成分享海报</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
            {(Object.keys(posterStyles) as PosterStyle[]).map((style) => (
              <button
                key={style}
                onClick={() => setSelectedStyle(style)}
                className={`flex-shrink-0 px-4 py-2 rounded-full font-medium transition-all ${
                  selectedStyle === style
                    ? 'bg-gradient-to-r from-candy-pink to-candy-purple text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {posterStyles[style].name}
              </button>
            ))}
          </div>

          <div className={`bg-gradient-to-br ${posterStyles[selectedStyle].gradient} rounded-2xl p-8 mb-6 relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-candy-pink/20 to-candy-purple/20 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-candy-yellow/20 to-candy-orange/20 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10">
              <div className="text-center mb-6">
                <h3 className={`text-2xl font-bold ${posterStyles[selectedStyle].accent} mb-2`}>
                  🌟 校园时光胶囊
                </h3>
                <div className="w-24 h-1 bg-gradient-to-r from-candy-pink to-candy-purple mx-auto rounded-full" />
              </div>

              {capsule.images.length > 0 && (
                <div className="mb-6 flex justify-center">
                  <img
                    src={capsule.images[0]}
                    alt="胶囊图片"
                    className="w-48 h-48 object-cover rounded-2xl shadow-lg"
                  />
                </div>
              )}

              <div className="text-center mb-6">
                <p className="text-gray-700 text-lg leading-relaxed max-w-md mx-auto">
                  "{capsule.content.substring(0, 80)}{capsule.content.length > 80 ? '...' : ''}"
                </p>
              </div>

              <div className="text-center text-sm text-gray-500">
                <p>📅 {new Date(capsule.createdAt).toLocaleDateString('zh-CN')}</p>
                <p className="mt-1">💖 {capsule.likes} 个喜欢</p>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <div className="inline-block bg-white px-6 py-3 rounded-full shadow-md">
                  <span className="text-gray-600 text-sm">扫码查看完整内容</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={isGenerating}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-candy-green to-candy-teal text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  生成中...
                </>
              ) : isSaved ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  已保存！
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  保存到本地
                </>
              )}
            </button>
            <button
              onClick={() => handleShare('微信')}
              className="px-6 py-4 bg-green-500 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all hover:bg-green-600"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 flex gap-2 justify-center">
            <button
              onClick={() => handleShare('QQ')}
              className="px-4 py-2 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
            >
              QQ 分享
            </button>
            <button
              onClick={() => handleShare('朋友圈')}
              className="px-4 py-2 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors"
            >
              朋友圈
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharePosterModal;
