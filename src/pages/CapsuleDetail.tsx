import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCapsuleStore } from '../store/useCapsuleStore';
import CommentSection from '../components/CommentSection';
import CountdownTimer from '../components/CountdownTimer';
import { ArrowLeft, Heart, Star, MessageCircle, Play, User, Lock, Unlock, Edit, Save } from 'lucide-react';
import { isCapsuleOpened, formatDate } from '../utils/date';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export default function CapsuleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCapsuleById, comments, currentUser, likeCapsule, addComment, favoriteCapsule, updateCapsule } = useCapsuleStore();

  const capsule = id ? getCapsuleById(id) : undefined;

  if (!capsule) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">胶囊不存在</p>
          <button onClick={() => navigate('/')} className="px-6 py-2 bg-pink-500 text-white rounded-full">
            返回广场
          </button>
        </div>
      </div>
    );
  }

  const isOpened = isCapsuleOpened(capsule.openAt);
  const capsuleComments = comments[capsule.id] || [];
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(capsule.content);

  const handleSaveEdit = () => {
    updateCapsule(capsule.id, { content: editedContent });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50 pb-32">
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-40 border-b border-pink-100">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="font-bold text-lg text-gray-800">胶囊详情</h1>
          {isOpened && (
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 -mr-2 text-pink-500"
            >
              {isEditing ? <Save className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-6">
        {capsule.images.length > 0 && (
          <div className={cn("mb-6 rounded-3xl overflow-hidden", !isOpened && "blur-md")}>
            <div className="grid grid-cols-2 gap-2">
              {capsule.images.slice(0, 4).map((img, idx) => (
                <div key={idx} className={cn(
                  "aspect-square overflow-hidden",
                  idx === 0 && capsule.images.length > 1 ? "col-span-2" : ""
                )}>
                  <img src={img} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {capsule.audio && isOpened && (
          <div className="mb-6 flex items-center gap-3 bg-purple-50 rounded-2xl p-4">
            <button className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-200">
              <Play className="w-5 h-5 fill-current ml-1" />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 h-2 bg-purple-200 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 w-1/3 rounded-full" />
                </div>
                <span className="text-xs text-purple-600 font-medium">00:15</span>
              </div>
              <p className="text-xs text-purple-400">语音留言</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-50 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">
                  {capsule.isAnonymous ? '匿名用户' : '校园旅人'}
                </p>
                <p className="text-xs text-gray-400">{formatDate(capsule.createdAt)}</p>
              </div>
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
              isEditing ? (
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl min-h-[120px] focus:outline-none focus:ring-2 focus:ring-pink-300"
                  placeholder="写下你的时光记忆..."
                />
              ) : (
                <>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{capsule.content}</p>
                  {capsule.updatedAt && (
                    <p className="text-xs text-gray-400 mt-2">
                      更新于 {formatDate(capsule.updatedAt)}
                    </p>
                  )}
                </>
              )
            ) : (
              <div className="text-center py-8">
                <Lock className="w-12 h-12 text-purple-300 mx-auto mb-3" />
                <p className="text-gray-400 font-medium">胶囊尚未开启</p>
                <p className="text-sm text-gray-400 mt-1">静待时光，美好终将呈现</p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {capsule.tags.map((tag, idx) => (
              <span key={idx} className="px-3 py-1 bg-pink-50 text-pink-600 text-xs rounded-full">
                #{tag}
              </span>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100">
            <CountdownTimer openAt={capsule.openAt} />
          </div>
        </div>

        {isOpened && (
          <div className="flex gap-3 mb-8">
            <ActionButton
              icon={<Heart className="w-5 h-5" />}
              count={capsule.likes}
              onClick={() => likeCapsule(capsule.id)}
              activeColor="text-pink-500"
              activeBg="bg-pink-50"
            />
            <ActionButton
              icon={<MessageCircle className="w-5 h-5" />}
              count={capsule.comments}
              onClick={() => {}}
              activeColor="text-blue-500"
              activeBg="bg-blue-50"
            />
            <ActionButton
              icon={<Star className="w-5 h-5" />}
              count={capsule.favorites}
              onClick={() => favoriteCapsule(capsule.id)}
              activeColor="text-yellow-500"
              activeBg="bg-yellow-50"
            />
          </div>
        )}

        {isOpened && (
          <CommentSection
            comments={capsuleComments}
            currentUser={currentUser}
            onAddComment={(content) => currentUser && addComment(capsule.id, {
              capsuleId: capsule.id,
              userId: currentUser.id,
              nickname: currentUser.nickname,
              content
            })}
          />
        )}
      </div>
    </div>
  );
}

function ActionButton({ 
  icon, 
  count, 
  onClick, 
  activeColor, 
  activeBg 
}: { 
  icon: React.ReactNode; 
  count: number; 
  onClick: () => void; 
  activeColor: string; 
  activeBg: string; 
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 py-3 rounded-2xl bg-white border border-gray-100 flex items-center justify-center gap-2 hover:border-gray-200 transition-all active:scale-95"
    >
      {icon}
      <span className="font-medium text-gray-600">{count}</span>
    </button>
  );
}
