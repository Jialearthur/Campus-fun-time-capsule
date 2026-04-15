import React, { useState } from 'react';
import { X, Download, Share2, CheckCircle2 } from 'lucide-react';
import { Capsule } from '../types';
import { useCapsuleStore } from '../store/useCapsuleStore';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

interface SharePosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  capsule: Capsule;
  isDark?: boolean;
}

type PosterStyle = 'simple' | 'warm' | 'campus';

const SharePosterModal: React.FC<SharePosterModalProps> = ({
  isOpen,
  onClose,
  capsule,
  isDark = false
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
      <div className={cn(
        "rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden",
        isDark ? "bg-dark-bg-secondary" : "bg-white"
      )}>
        <div className={cn(
          "flex items-center justify-between p-6 border-b",
          isDark ? "border-dark-border-primary" : "border-gray-100"
        )}>
          <h2 className={cn(
            "text-2xl font-bold",
            isDark ? "text-dark-text-primary" : "text-gray-800"
          )}>🎨 生成分享海报</h2>
          <button
            onClick={onClose}
            className={cn(
              "p-2 rounded-full transition-colors",
              isDark ? "hover:bg-dark-bg-tertiary" : "hover:bg-gray-100"
            )}
          >
            <X className={cn(
              "w-6 h-6",
              isDark ? "text-dark-text-secondary" : "text-gray-500"
            )} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
            {(Object.keys(posterStyles) as PosterStyle[]).map((style) => (
              <button
                key={style}
                onClick={() => setSelectedStyle(style)}
                className={cn(
                  "flex-shrink-0 px-4 py-2 rounded-full font-medium transition-all",
                  selectedStyle === style
                    ? (isDark ? "bg-gradient-to-r from-dark-accent-primary to-dark-accent-secondary text-white shadow-lg" : "bg-gradient-to-r from-candy-pink to-candy-purple text-white shadow-lg")
                    : (isDark ? "bg-dark-bg-tertiary text-dark-text-secondary hover:bg-dark-bg-tertiary" : "bg-gray-100 text-gray-600 hover:bg-gray-200")
                )}
              >
                {posterStyles[style].name}
              </button>
            ))}
          </div>

          <div className={cn(
            "rounded-2xl p-8 mb-6 relative overflow-hidden",
            isDark ? "bg-dark-bg-tertiary" : `bg-gradient-to-br ${posterStyles[selectedStyle].gradient}`
          )}>
            <div className={cn(
              "absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-1/2 translate-x-1/2",
              isDark ? "bg-gradient-to-br from-dark-accent-primary/20 to-dark-accent-secondary/20" : "bg-gradient-to-br from-candy-pink/20 to-candy-purple/20"
            )} />
            <div className={cn(
              "absolute bottom-0 left-0 w-24 h-24 rounded-full translate-y-1/2 -translate-x-1/2",
              isDark ? "bg-gradient-to-br from-dark-accent-primary/20 to-dark-accent-secondary/20" : "bg-gradient-to-br from-candy-yellow/20 to-candy-orange/20"
            )} />
            
            <div className="relative z-10">
              <div className="text-center mb-6">
                <h3 className={cn(
                  "text-2xl font-bold mb-2",
                  isDark ? "text-dark-text-primary" : posterStyles[selectedStyle].accent
                )}>
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
                <p className={cn(
                  "text-lg leading-relaxed max-w-md mx-auto",
                  isDark ? "text-dark-text-secondary" : "text-gray-700"
                )}>
                  "{capsule.content.substring(0, 80)}{capsule.content.length > 80 ? '...' : ''}"
                </p>
              </div>

              <div className={cn(
                "text-center text-sm",
                isDark ? "text-dark-text-tertiary" : "text-gray-500"
              )}>
                <p>📅 {new Date(capsule.createdAt).toLocaleDateString('zh-CN')}</p>
                <p className="mt-1">💖 {capsule.likes} 个喜欢</p>
              </div>

              <div className={cn(
                "mt-8 pt-6 border-t text-center",
                isDark ? "border-dark-border-primary" : "border-gray-200"
              )}>
                <div className={cn(
                  "inline-block px-6 py-3 rounded-full shadow-md",
                  isDark ? "bg-dark-bg-secondary" : "bg-white"
                )}>
                  <span className={cn(
                    "text-sm",
                    isDark ? "text-dark-text-secondary" : "text-gray-600"
                  )}>扫码查看完整内容</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={isGenerating}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50",
                isDark ? "bg-gradient-to-r from-dark-accent-primary to-dark-accent-secondary text-white" : "bg-gradient-to-r from-candy-green to-candy-teal text-white"
              )}
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
              className={cn(
                "px-6 py-4 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all",
                isDark ? "bg-gradient-to-r from-dark-accent-primary to-dark-accent-secondary" : "bg-green-500 hover:bg-green-600"
              )}
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 flex gap-2 justify-center">
            <button
              onClick={() => handleShare('QQ')}
              className={cn(
                "px-4 py-2 text-white rounded-xl font-medium transition-colors",
                isDark ? "bg-dark-accent-secondary hover:bg-dark-accent-primary" : "bg-blue-500 hover:bg-blue-600"
              )}
            >
              QQ 分享
            </button>
            <button
              onClick={() => handleShare('朋友圈')}
              className={cn(
                "px-4 py-2 text-white rounded-xl font-medium transition-colors",
                isDark ? "bg-dark-accent-secondary hover:bg-dark-accent-primary" : "bg-orange-500 hover:bg-orange-600"
              )}
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
