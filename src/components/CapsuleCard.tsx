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
        "rounded-3xl overflow-hidden mb-6 hover:shadow-gummy-hover transition-all duration-300 hover:scale-[1.02] cursor-pointer relative group gummy-card animate-fade-in",
        isDark
          ? "bg-dark-bg-secondary border-2 border-dark-border-primary"
          : "bg-white shadow-gummy border-2 border-gummy-pink/30",
        capsule.isGroup && !isDark && "border-candy-yellow/50"
      )}
      onClick={() => navigate(`/capsule/${capsule.id}`)}
    >
      {capsule.isGroup && (
        <div className="absolute top-4 left-4 z-10">
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-candy-yellow to-candy-orange text-white px-3 py-1.5 rounded-full shadow-lg">
            <Users className="w-3.5 h-3.5" />
            <span className="text-xs font-bold">集体胶囊</span>
          </div>
        </div>
      )}

      {capsule.images.length > 0 && (
        <div className={cn(
          "relative h-52 overflow-hidden rounded-t-3xl",
          !isOpened && "blur-sm"
        )}>
          <img 
            src={capsule.images[0]} 
            alt="Capsule cover" 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {capsule.images.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-white/90 text-gummy-dark text-xs px-3 py-1.5 rounded-full shadow-md">
              +{capsule.images.length - 1}
            </div>
          )}
          {(capsule.blindBoxDescription || capsule.content) && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
              <div className="p-5 text-white">
                <p className="text-sm font-medium line-clamp-2">
                  {capsule.blindBoxDescription || capsule.content}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center shadow-sm",
              isDark
                ? capsule.isGroup 
                  ? "bg-gradient-to-r from-dark-accent-primary to-dark-accent-secondary"
                  : "bg-gradient-to-r from-dark-accent-primary to-dark-accent-secondary"
                : capsule.isGroup 
                  ? "bg-gradient-to-r from-candy-yellow to-candy-orange"
                  : "gummy-gradient"
            )}>
              {capsule.isGroup ? (
                <Users className="w-4.5 h-4.5 text-white" />
              ) : (
                <User className="w-4.5 h-4.5 text-white" />
              )}
            </div>
            <span className={cn(
              "text-sm font-medium",
              isDark ? "text-dark-text-primary" : "text-gummy-dark"
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
                "w-4.5 h-4.5",
                isDark ? "text-dark-accent-secondary" : "text-gummy-green"
              )} />
            ) : (
              <Lock className={cn(
                "w-4.5 h-4.5",
                isDark ? "text-dark-accent-secondary" : "text-gummy-orange"
              )} />
            )}
          </div>
        </div>

        <div className="mb-4">
          {isOpened ? (
            <p className={cn(
              "line-clamp-3 leading-relaxed font-body",
              isDark ? "text-dark-text-primary" : "text-gummy-dark"
            )}>
              {capsule.content}
            </p>
          ) : (
            <p className={cn(
              "italic font-medium",
              isDark ? "text-dark-accent-secondary" : "text-gummy-orange/80"
            )}>🔒 胶囊尚未开启，敬请期待...</p>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {capsule.tags.map((tag, idx) => (
            <span key={idx} className={cn(
              "px-3 py-1.5 text-xs rounded-full border",
              isDark
                ? "bg-dark-bg-tertiary text-dark-text-secondary border-dark-border-primary"
                : "bg-gummy-cream text-gummy-dark border border-gummy-pink/30"
            )}>
              #{tag}
            </span>
          ))}
        </div>

        <div className={cn(
          "flex items-center justify-between pt-4 border-t",
          isDark ? "border-dark-border-primary" : "border-gummy-pink/20"
        )}>
          <CountdownTimer openAt={capsule.openAt} showLabel={false} isDark={isDark} />
          
          {showActions && isOpened && (
            <div className="flex items-center gap-4">
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onLike?.(capsule.id);
                }}
                className={cn(
                  "flex items-center gap-1.5 transition-colors duration-300 transform hover:scale-110",
                  isDark
                    ? "text-dark-text-tertiary hover:text-dark-accent-secondary"
                    : "text-gummy-dark/60 hover:text-gummy-pink"
                )}
              >
                <Heart className="w-5 h-5" />
                <span className={cn(
                  "text-sm font-medium",
                  isDark ? "text-dark-text-secondary" : "text-gummy-dark/60"
                )}>{capsule.likes}</span>
              </button>
              
              <div className={cn(
                "flex items-center gap-1.5",
                isDark ? "text-dark-text-tertiary" : "text-gummy-dark/60"
              )}>
                <MessageCircle className="w-5 h-5" />
                <span className={cn(
                  "text-sm font-medium",
                  isDark ? "text-dark-text-secondary" : "text-gummy-dark/60"
                )}>{capsule.comments}</span>
              </div>
              
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onFavorite?.(capsule.id);
                }}
                className={cn(
                  "flex items-center gap-1.5 transition-colors duration-300 transform hover:scale-110",
                  isDark
                    ? "text-dark-text-tertiary hover:text-dark-accent-secondary"
                    : "text-gummy-dark/60 hover:text-gummy-orange"
                )}
              >
                <Star className="w-5 h-5" />
                <span className={cn(
                  "text-sm font-medium",
                  isDark ? "text-dark-text-secondary" : "text-gummy-dark/60"
                )}>{capsule.favorites}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
