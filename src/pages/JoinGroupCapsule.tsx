import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCapsuleStore } from '../store/useCapsuleStore';
import { ArrowLeft, Users, CheckCircle2, Lock, Unlock } from 'lucide-react';
import { isCapsuleOpened } from '../utils/date';
import { useTheme } from '../hooks/useTheme';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export default function JoinGroupCapsule() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCapsuleById, currentUser, joinGroupCapsule } = useCapsuleStore();
  const { isDark } = useTheme();
  
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  
  const capsule = id ? getCapsuleById(id) : undefined;

  useEffect(() => {
    if (capsule && currentUser && capsule.groupMembers) {
      const alreadyJoined = capsule.groupMembers.some(m => m.userId === currentUser.id);
      setHasJoined(alreadyJoined);
    }
  }, [capsule, currentUser]);

  const handleJoin = () => {
    if (!capsule || !currentUser) return;
    
    setIsJoining(true);
    setTimeout(() => {
      joinGroupCapsule(capsule.id, currentUser.id, currentUser.nickname, currentUser.avatar);
      setHasJoined(true);
      setIsJoining(false);
      
      setTimeout(() => {
        navigate(`/capsule/${capsule.id}`);
      }, 1000);
    }, 500);
  };

  if (!capsule || !capsule.isGroup) {
    return (
      <div className={cn(
        "min-h-screen flex items-center justify-center",
        isDark 
          ? "bg-dark-bg-primary text-dark-text-primary"
          : "bg-gradient-to-b from-[#f9f7f4] via-white to-[#f5f3f7]"
      )}>
        <div className="text-center">
          <p className={cn(
            "mb-4",
            isDark ? "text-dark-text-secondary" : "text-[#8a7ab5]"
          )}>集体胶囊不存在</p>
          <button onClick={() => navigate('/')} className={cn(
            "px-6 py-2 text-white rounded-full",
            isDark ? "bg-gradient-to-r from-dark-accent-primary to-dark-accent-secondary" : "bg-gradient-to-r from-candy-pink to-candy-purple"
          )}>
            返回广场
          </button>
        </div>
      </div>
    );
  }

  const isOpened = isCapsuleOpened(capsule.openAt);

  return (
    <div className={cn(
      "min-h-screen pb-32 transition-colors duration-300",
      isDark 
        ? "bg-dark-bg-primary text-dark-text-primary"
        : "bg-gradient-to-b from-[#f9f7f4] via-white to-[#f5f3f7]"
    )}>
      <div className={cn(
        "sticky top-0 backdrop-blur-md z-40 border-b",
        isDark
          ? "bg-dark-bg-secondary/80 border-dark-border-primary"
          : "bg-white/80 border-[#e0d6f0]"
      )}>
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className={cn(
              "w-6 h-6",
              isDark ? "text-dark-text-secondary" : "text-[#8a7ab5]"
            )} />
          </button>
          <h1 className={cn(
            "font-bold text-lg",
            isDark ? "text-dark-text-primary" : "text-[#5a4b7a]"
          )}>加入集体胶囊</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-6">
        <div className={cn(
          "rounded-3xl p-6 shadow-sm border mb-6",
          isDark
            ? "bg-dark-bg-secondary border-dark-border-primary"
            : "bg-white border-candy-yellow/30"
        )}>
          {capsule.images.length > 0 && (
            <div className="mb-4 rounded-2xl overflow-hidden">
              <img 
                src={capsule.images[0]} 
                alt="Capsule cover" 
                className="w-full h-48 object-cover"
              />
            </div>
          )}

          <div className="flex items-center gap-2 mb-4">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              isDark ? "bg-gradient-to-r from-dark-accent-primary to-dark-accent-secondary" : "bg-gradient-to-r from-candy-yellow to-candy-orange"
            )}>
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className={cn(
                "font-bold text-xl",
                isDark ? "text-dark-text-primary" : "text-[#5a4b7a]"
              )}>{capsule.groupName || '集体胶囊'}</h2>
              <p className={cn(
                "text-sm",
                isDark ? "text-dark-text-secondary" : "text-[#a093c2]"
              )}>
                {capsule.groupMembers?.length || 1} 位成员
              </p>
            </div>
          </div>

          <p className={cn(
            "leading-relaxed mb-4",
            isDark ? "text-dark-text-secondary" : "text-[#5a4b7a]"
          )}>
            {capsule.content}
          </p>

          <div className="flex items-center gap-2 mb-4">
            {capsule.isPublic ? (
              <Unlock className={cn(
                "w-4 h-4",
                isDark ? "text-dark-accent-secondary" : "text-candy-green"
              )} />
            ) : (
              <Lock className={cn(
                "w-4 h-4",
                isDark ? "text-dark-text-tertiary" : "text-candy-orange"
              )} />
            )}
            <span className={cn(
              "text-sm",
              isDark ? "text-dark-text-secondary" : "text-[#a093c2]"
            )}>
              {capsule.isPublic ? '公开集体胶囊' : '私密集体胶囊'}
            </span>
          </div>

          <div className={cn(
            "border-t pt-4",
            isDark ? "border-dark-border-primary" : "border-[#e0d6f0]"
          )}>
            <p className={cn(
              "text-sm mb-2",
              isDark ? "text-dark-text-secondary" : "text-[#a093c2]"
            )}>
              {isOpened ? '✅ 胶囊已开启，所有成员可查看' : '⏳ 胶囊尚未开启，创建后可添加内容'}
            </p>
          </div>
        </div>

        {hasJoined ? (
          <div className={cn(
            "rounded-2xl p-4 text-center border",
            isDark
              ? "bg-dark-bg-secondary border-dark-border-primary"
              : "bg-gradient-to-r from-candy-green/20 to-candy-teal/20 border border-candy-green/30"
          )}>
            <CheckCircle2 className={cn(
              "w-10 h-10 mx-auto mb-3",
              isDark ? "text-dark-accent-secondary" : "text-candy-green"
            )} />
            <p className={cn(
              "font-medium mb-1",
              isDark ? "text-dark-text-primary" : "text-gray-800"
            )}>您已加入！</p>
            <p className={cn(
              "text-sm mb-4",
              isDark ? "text-dark-text-secondary" : "text-gray-600"
            )}>正在跳转到胶囊详情...</p>
            <button
              onClick={() => navigate(`/capsule/${capsule.id}`)}
              className={cn(
                "px-6 py-2 text-white rounded-full font-medium",
                isDark ? "bg-gradient-to-r from-dark-accent-primary to-dark-accent-secondary" : "bg-gradient-to-r from-candy-green to-candy-teal"
              )}
            >
              立即查看
            </button>
          </div>
        ) : (
          <button
            onClick={handleJoin}
            disabled={isJoining}
            className={cn(
              "w-full py-4 text-white rounded-2xl font-bold shadow-lg hover:opacity-90 transition-all disabled:opacity-50",
              isDark ? "bg-gradient-to-r from-dark-accent-primary to-dark-accent-secondary" : "bg-gradient-to-r from-candy-yellow to-candy-orange"
            )}
          >
            {isJoining ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                加入中...
              </div>
            ) : (
              '加入集体胶囊'
            )}
          </button>
        )}

        <button
          onClick={() => navigate('/')}
          className={cn(
            "w-full mt-4 py-3 transition-colors",
            isDark
              ? "text-dark-text-secondary hover:text-dark-text-primary"
              : "text-gray-600 hover:text-gray-800"
          )}
        >
          暂时不加入
        </button>
      </div>
    </div>
  );
}
