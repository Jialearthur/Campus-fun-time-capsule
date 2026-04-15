import { Capsule } from '../types';
import { Heart, MessageCircle, Star, Lock, Unlock, User, Users } from 'lucide-react';
import CountdownTimer from './CountdownTimer';
import { isCapsuleOpened } from '../utils/date';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

interface CapsuleCardProps {
  capsule: Capsule;
  onLike?: (id: string) => void;
  onFavorite?: (id: string) => void;
  showActions?: boolean;
  isDark?: boolean;
}

export default function CapsuleCard({ capsule, onLike, onFavorite, showActions = true, isDark = false }: CapsuleCardProps) {
  const navigate = useNavigate();
  const isOpened = isCapsuleOpened(capsule.openAt);

  return (
    <div 
      className={cn(
        "rounded-apple-2xl overflow-hidden mb-6 hover:shadow-apple-lg transition-all duration-300 ease-apple hover:scale-[1.01] cursor-pointer relative group animate-fade-in",
        isDark
          ? "bg-dark-bg-secondary border border-dark-border-primary shadow-apple-dark"
          : "bg-white border border-apple-gray-200 shadow-apple"
      )}
      onClick={() => navigate(`/capsule/${capsule.id}`)}
    >
      {capsule.isGroup && (
        <div className="absolute top-4 left-4 z-10">
          <div className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-apple",
            isDark
              ? "bg-gradient-to-r from-dark-accent-tertiary to-apple-orange text-apple-gray-800"
              : "bg-gradient-to-r from-apple-orange to-apple-pink text-white"
          )}>
            <Users className="w-3.5 h-3.5" />
            <span className="text-xs font-bold">集体胶囊</span>
          </div>
        </div>
      )}

      {capsule.images.length > 0 && (
        <div className={cn(
          "relative h-56 overflow-hidden rounded-t-apple-2xl",
          !isOpened && "blur-sm"
        )}>
          <img 
            src={capsule.images[0]} 
            alt="Capsule cover" 
            className="w-full h-full object-cover transition-transform duration-700 ease-apple group-hover:scale-105"
          />
          {capsule.images.length > 1 && (
            <div className={cn(
              "absolute bottom-4 right-4 px-3 py-1.5 rounded-full shadow-apple text-xs font-medium",
              isDark
                ? "bg-dark-bg-tertiary/90 text-dark-text-primary"
                : "bg-white/90 text-apple-gray-800"
            )}>
              +{capsule.images.length - 1}
            </div>
          )}
          {(capsule.blindBoxDescription || capsule.content) && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-apple flex items-end">
              <div className="p-6 text-white">
                <p className="text-sm font-medium leading-relaxed line-clamp-2">
                  {capsule.blindBoxDescription || capsule.content}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-apple flex items-center justify-center shadow-apple-sm",
              isDark
                ? capsule.isGroup 
                  ? "bg-gradient-to-r from-dark-accent-primary to-dark-accent-secondary"
                  : "bg-gradient-to-r from-dark-accent-primary to-dark-accent-secondary"
                : capsule.isGroup 
                  ? "bg-gradient-to-r from-apple-orange to-apple-pink"
                  : "bg-gradient-to-r from-apple-purple to-apple-blue"
            )}>
              {capsule.isGroup ? (
                <Users className="w-5 h-5 text-white" />
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </div>
            <span className={cn(
              "text-sm font-medium",
              isDark ? "text-dark-text-primary" : "text-apple-gray-800"
            )}>
              {capsule.isGroup 
                ? (capsule.groupName || '集体胶囊')
                : (capsule.isAnonymous ? '匿名用户' : '校园旅人')
              }
            </span>
          </div>
          <div className="flex items-center gap-1">
            {capsule.isPublic ? (
              <Unlock className={cn(
                "w-5 h-5",
                isDark ? "text-dark-accent-secondary" : "text-apple-green"
              )} />
            ) : (
              <Lock className={cn(
                "w-5 h-5",
                isDark ? "text-dark-accent-secondary" : "text-apple-orange"
              )} />
            )}
          </div>
        </div>

        <div className="mb-5">
          {isOpened ? (
            <p className={cn(
              "leading-relaxed font-light",
              isDark ? "text-dark-text-primary" : "text-apple-gray-800"
            )}>
              {capsule.content}
            </p>
          ) : (
            <p className={cn(
              "italic font-medium",
              isDark ? "text-dark-accent-secondary" : "text-apple-orange"
            )}>🔒 胶囊尚未开启，敬请期待...</p>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {capsule.tags.map((tag, idx) => (
            <span key={idx} className={cn(
              "px-3 py-1.5 text-xs rounded-full border",
              isDark
                ? "bg-dark-bg-tertiary text-dark-text-secondary border-dark-border-primary"
                : "bg-apple-gray-100 text-apple-gray-600 border-apple-gray-200"
            )}>
              #{tag}
            </span>
          ))}
        </div>

        <div className={cn(
          "flex items-center justify-between pt-5 border-t",
          isDark ? "border-dark-border-primary" : "border-apple-gray-200"
        )}>
          <CountdownTimer openAt={capsule.openAt} showLabel={false} isDark={isDark} />
          
          {showActions && isOpened && (
            <div className="flex items-center gap-6">
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onLike?.(capsule.id);
                }}
                className={cn(
                  "flex items-center gap-2 transition-all duration-300 ease-apple transform hover:scale-110 active:scale-95",
                  isDark
                    ? "text-dark-text-tertiary hover:text-dark-accent-secondary"
                    : "text-apple-gray-400 hover:text-apple-pink"
                )}
              >
                <Heart className="w-5 h-5" />
                <span className={cn(
                  "text-sm font-medium",
                  isDark ? "text-dark-text-secondary" : "text-apple-gray-600"
                )}>{capsule.likes}</span>
              </button>
              
              <div className={cn(
                "flex items-center gap-2",
                isDark ? "text-dark-text-tertiary" : "text-apple-gray-400"
              )}>
                <MessageCircle className="w-5 h-5" />
                <span className={cn(
                  "text-sm font-medium",
                  isDark ? "text-dark-text-secondary" : "text-apple-gray-600"
                )}>{capsule.comments}</span>
              </div>
              
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onFavorite?.(capsule.id);
                }}
                className={cn(
                  "flex items-center gap-2 transition-all duration-300 ease-apple transform hover:scale-110 active:scale-95",
                  isDark
                    ? "text-dark-text-tertiary hover:text-dark-accent-secondary"
                    : "text-apple-gray-400 hover:text-apple-orange"
                )}
              >
                <Star className="w-5 h-5" />
                <span className={cn(
                  "text-sm font-medium",
                  isDark ? "text-dark-text-secondary" : "text-apple-gray-600"
                )}>{capsule.favorites}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
