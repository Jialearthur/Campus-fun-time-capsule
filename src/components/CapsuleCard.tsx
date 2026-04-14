import { Capsule } from '../types';
import { Heart, MessageCircle, Star, Lock, Unlock, User } from 'lucide-react';
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
}

export default function CapsuleCard({ capsule, onLike, onFavorite, showActions = true }: CapsuleCardProps) {
  const navigate = useNavigate();
  const isOpened = isCapsuleOpened(capsule.openAt);

  return (
    <div 
      className="bg-white rounded-3xl shadow-sm border border-pink-50 overflow-hidden mb-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => navigate(`/capsule/${capsule.id}`)}
    >
      {capsule.images.length > 0 && (
        <div className={cn(
          "relative h-48 overflow-hidden",
          !isOpened && "blur-sm"
        )}>
          <img 
            src={capsule.images[0]} 
            alt="Capsule cover" 
            className="w-full h-full object-cover"
          />
          {capsule.images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
              +{capsule.images.length - 1}
            </div>
          )}
        </div>
      )}

      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
              <User className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-sm text-gray-600">
              {capsule.isAnonymous ? '匿名用户' : '校园旅人'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {capsule.isPublic ? (
              <Unlock className="w-4 h-4 text-green-500" />
            ) : (
              <Lock className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </div>

        <div className="mb-4">
          {isOpened ? (
            <p className="text-gray-700 line-clamp-3 leading-relaxed">
              {capsule.content}
            </p>
          ) : (
            <p className="text-gray-400 italic">🔒 胶囊尚未开启，敬请期待...</p>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {capsule.tags.map((tag, idx) => (
            <span key={idx} className="px-3 py-1 bg-pink-50 text-pink-600 text-xs rounded-full">
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <CountdownTimer openAt={capsule.openAt} showLabel={false} />
          
          {showActions && isOpened && (
            <div className="flex items-center gap-4">
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onLike?.(capsule.id);
                }}
                className="flex items-center gap-1 text-gray-500 hover:text-pink-500 transition-colors"
              >
                <Heart className="w-5 h-5" />
                <span className="text-sm">{capsule.likes}</span>
              </button>
              
              <div className="flex items-center gap-1 text-gray-500">
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm">{capsule.comments}</span>
              </div>
              
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onFavorite?.(capsule.id);
                }}
                className="flex items-center gap-1 text-gray-500 hover:text-yellow-500 transition-colors"
              >
                <Star className="w-5 h-5" />
                <span className="text-sm">{capsule.favorites}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
