import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCapsuleStore } from '../store/useCapsuleStore';
import CommentSection from '../components/CommentSection';
import CountdownTimer from '../components/CountdownTimer';
import { ArrowLeft, Heart, Star, MessageCircle, Play, User, Lock, Unlock, Edit, Save, AlertCircle } from 'lucide-react';
import { isCapsuleOpened, formatDate } from '../utils/date';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export default function CapsuleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCapsuleById, comments, currentUser, likeCapsule, addComment, favoriteCapsule, updateCapsule, addNotification } = useCapsuleStore();

  const capsule = id ? getCapsuleById(id) : undefined;

  if (!capsule) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f9f7f4] via-white to-[#f5f3f7] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#8a7ab5] mb-4">胶囊不存在</p>
          <button onClick={() => navigate('/')} className="px-6 py-2 bg-gradient-to-br from-[#e8dff5] to-[#d8f0e3] text-[#5a4b7a] rounded-full">
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
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [hasAccess, setHasAccess] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // 检查用户是否有权限访问
  useEffect(() => {
    if (capsule.isPublic) {
      setHasAccess(true);
    } else if (currentUser) {
      // 检查是否是胶囊创建者
      if (capsule.userId === currentUser.id) {
        setHasAccess(true);
      }
      // 检查是否被邀请
      else if (capsule.sharedWith && capsule.sharedWith.includes(currentUser.nickname)) {
        setHasAccess(true);
      }
      // 需要密码验证
      else if (capsule.password) {
        setHasAccess(false);
      }
      // 无权限访问
      else {
        setHasAccess(false);
      }
    }
  }, [capsule, currentUser]);

  const handleSaveEdit = () => {
    updateCapsule(capsule.id, { content: editedContent });
    setIsEditing(false);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setPasswordError('');
    
    setTimeout(() => {
      if (password === capsule.password) {
        setHasAccess(true);
        // 添加访问成功通知
        if (currentUser) {
          addNotification({
            id: Date.now().toString(),
            title: '访问成功',
            message: '您已成功访问私密胶囊',
            read: false,
            createdAt: new Date().toISOString()
          });
        }
      } else {
        setPasswordError('密码错误，请重新输入');
      }
      setIsVerifying(false);
    }, 500);
  };

  // 无访问权限的提示
  const renderNoAccess = () => (
    <div className="min-h-screen bg-gradient-to-b from-[#f9f7f4] via-white to-[#f5f3f7] flex flex-col items-center justify-center px-4">
      <div className="w-20 h-20 rounded-full bg-[#f5f3f7] flex items-center justify-center mb-6">
        <Lock className="w-10 h-10 text-[#c8b6e2]" />
      </div>
      <h2 className="text-xl font-bold text-[#5a4b7a] mb-2">无访问权限</h2>
      <p className="text-[#8a7ab5] text-center mb-8">
        这是一个私密胶囊，只有被邀请的用户或输入正确密码才能访问
      </p>
      <button onClick={() => navigate('/')} className="px-6 py-3 bg-gradient-to-br from-[#e8dff5] to-[#d8f0e3] text-[#5a4b7a] rounded-xl font-medium">
        返回广场
      </button>
    </div>
  );

  // 密码验证表单
  const renderPasswordForm = () => (
    <div className="min-h-screen bg-gradient-to-b from-[#f9f7f4] via-white to-[#f5f3f7] flex flex-col items-center justify-center px-4">
      <div className="w-20 h-20 rounded-full bg-[#f5f3f7] flex items-center justify-center mb-6">
        <Lock className="w-10 h-10 text-[#c8b6e2]" />
      </div>
      <h2 className="text-xl font-bold text-[#5a4b7a] mb-6">输入密码访问胶囊</h2>
      
      <form onSubmit={handlePasswordSubmit} className="w-full max-w-md space-y-4">
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="请输入4-6位数字密码"
            maxLength={6}
            className="w-full px-4 py-3 bg-white border border-[#e0d6f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c8b6e2] focus:border-[#c8b6e2] transition-all"
          />
          {passwordError && (
            <div className="flex items-center gap-2 mt-2 text-[#e57373] text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{passwordError}</span>
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={isVerifying || !password}
          className="w-full py-3 bg-gradient-to-br from-[#e8dff5] to-[#d8f0e3] text-[#5a4b7a] rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isVerifying ? '验证中...' : '验证密码'}
        </button>
      </form>
      
      <button onClick={() => navigate('/')} className="mt-6 text-[#8a7ab5] hover:text-[#5a4b7a] transition-colors">
        返回广场
      </button>
    </div>
  );

  // 胶囊尚未开启的提示
  const renderNotOpened = () => (
    <div className="min-h-screen bg-gradient-to-b from-[#f9f7f4] via-white to-[#f5f3f7] flex flex-col items-center justify-center px-4">
      <div className="w-20 h-20 rounded-full bg-[#f5f3f7] flex items-center justify-center mb-6">
        <Lock className="w-10 h-10 text-[#c8b6e2]" />
      </div>
      <h2 className="text-xl font-bold text-[#5a4b7a] mb-2">胶囊尚未开启</h2>
      <p className="text-[#8a7ab5] text-center mb-8">
        静待时光，美好终将呈现
      </p>
      <CountdownTimer openAt={capsule.openAt} />
      <button onClick={() => navigate('/')} className="mt-8 px-6 py-3 bg-gradient-to-br from-[#e8dff5] to-[#d8f0e3] text-[#5a4b7a] rounded-xl font-medium">
        返回广场
      </button>
    </div>
  );

  // 检查访问权限
  if (!hasAccess) {
    return capsule.password ? renderPasswordForm() : renderNoAccess();
  }

  // 检查胶囊是否开启
  if (!isOpened) {
    return renderNotOpened();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f9f7f4] via-white to-[#f5f3f7] pb-32">
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-40 border-b border-[#e0d6f0]">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-[#8a7ab5]" />
          </button>
          <h1 className="font-bold text-lg text-[#5a4b7a]">胶囊详情</h1>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 -mr-2 text-[#c8b6e2]"
          >
            {isEditing ? <Save className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-6">
        {capsule.images.length > 0 && (
          <div className="mb-6 rounded-3xl overflow-hidden">
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

        {capsule.audio && (
          <div className="mb-6 bg-[#f5f3f7] rounded-2xl p-4 border border-[#e0d6f0]">
            <div className="flex items-center gap-3">
              <button className="w-12 h-12 rounded-full bg-gradient-to-br from-[#e8dff5] to-[#d8f0e3] flex items-center justify-center text-[#5a4b7a] shadow-lg shadow-[#e8dff5]/50">
                <Play className="w-5 h-5 fill-current ml-1" />
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-2 bg-[#e0d6f0] rounded-full overflow-hidden">
                    <div className="h-full bg-[#c8b6e2] w-1/3 rounded-full" />
                  </div>
                  <span className="text-xs text-[#8a7ab5] font-medium">00:15</span>
                </div>
                <p className="text-xs text-[#a093c2]">语音留言</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e0d6f0] mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#e8dff5] to-[#d8f0e3] flex items-center justify-center">
                <User className="w-5 h-5 text-[#8a7ab5]" />
              </div>
              <div>
                <p className="font-medium text-[#5a4b7a]">
                  {capsule.isAnonymous ? '匿名用户' : '校园旅人'}
                </p>
                <p className="text-xs text-[#a093c2]">{formatDate(capsule.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {capsule.isPublic ? (
                <Unlock className="w-4 h-4 text-[#81c784]" />
              ) : (
                <Lock className="w-4 h-4 text-[#a093c2]" />
              )}
            </div>
          </div>

          <div className="mb-4">
            {isEditing ? (
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full p-3 border border-[#e0d6f0] rounded-xl min-h-[120px] focus:outline-none focus:ring-2 focus:ring-[#c8b6e2] focus:border-[#c8b6e2] transition-all"
                placeholder="写下你的时光记忆..."
              />
            ) : (
              <>
                <p className="text-[#5a4b7a] leading-relaxed whitespace-pre-wrap">{capsule.content}</p>
                {capsule.updatedAt && (
                  <p className="text-xs text-[#a093c2] mt-2">
                    更新于 {formatDate(capsule.updatedAt)}
                  </p>
                )}
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {capsule.tags.map((tag, idx) => (
              <span key={idx} className="px-3 py-1 bg-[#f5f3f7] text-[#8a7ab5] text-xs rounded-full border border-[#e0d6f0]">
                #{tag}
              </span>
            ))}
          </div>

          <div className="pt-4 border-t border-[#e0d6f0]">
            <CountdownTimer openAt={capsule.openAt} />
          </div>
        </div>

        <div className="flex gap-3 mb-8">
          <ActionButton
            icon={<Heart className="w-5 h-5" />}
            count={capsule.likes}
            onClick={() => likeCapsule(capsule.id)}
            activeColor="text-[#c8b6e2]"
            activeBg="bg-[#f5f3f7]"
          />
          <ActionButton
            icon={<MessageCircle className="w-5 h-5" />}
            count={capsule.comments}
            onClick={() => {}}
            activeColor="text-[#c8b6e2]"
            activeBg="bg-[#f5f3f7]"
          />
          <ActionButton
            icon={<Star className="w-5 h-5" />}
            count={capsule.favorites}
            onClick={() => favoriteCapsule(capsule.id)}
            activeColor="text-[#c8b6e2]"
            activeBg="bg-[#f5f3f7]"
          />
        </div>

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
      className="flex-1 py-3 rounded-2xl bg-white border border-[#e0d6f0] flex items-center justify-center gap-2 hover:border-[#c8b6e2] transition-all active:scale-95"
    >
      {icon}
      <span className="font-medium text-[#5a4b7a]">{count}</span>
    </button>
  );
}
