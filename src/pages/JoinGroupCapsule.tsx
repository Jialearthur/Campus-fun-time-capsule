import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCapsuleStore } from '../store/useCapsuleStore';
import { ArrowLeft, Users, CheckCircle2, Lock, Unlock } from 'lucide-react';
import { isCapsuleOpened } from '../utils/date';

export default function JoinGroupCapsule() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCapsuleById, currentUser, joinGroupCapsule } = useCapsuleStore();
  
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
      <div className="min-h-screen bg-gradient-to-b from-[#f9f7f4] via-white to-[#f5f3f7] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#8a7ab5] mb-4">集体胶囊不存在</p>
          <button onClick={() => navigate('/')} className="px-6 py-2 bg-gradient-to-r from-candy-pink to-candy-purple text-white rounded-full">
            返回广场
          </button>
        </div>
      </div>
    );
  }

  const isOpened = isCapsuleOpened(capsule.openAt);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f9f7f4] via-white to-[#f5f3f7] pb-32">
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-40 border-b border-[#e0d6f0]">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-[#8a7ab5]" />
          </button>
          <h1 className="font-bold text-lg text-[#5a4b7a]">加入集体胶囊</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-candy-yellow/30 mb-6">
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
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-candy-yellow to-candy-orange flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-xl text-[#5a4b7a]">{capsule.groupName || '集体胶囊'}</h2>
              <p className="text-sm text-[#a093c2]">
                {capsule.groupMembers?.length || 1} 位成员
              </p>
            </div>
          </div>

          <p className="text-[#5a4b7a] leading-relaxed mb-4">
            {capsule.content}
          </p>

          <div className="flex items-center gap-2 mb-4">
            {capsule.isPublic ? (
              <Unlock className="w-4 h-4 text-candy-green" />
            ) : (
              <Lock className="w-4 h-4 text-candy-orange" />
            )}
            <span className="text-sm text-[#a093c2]">
              {capsule.isPublic ? '公开集体胶囊' : '私密集体胶囊'}
            </span>
          </div>

          <div className="border-t border-[#e0d6f0] pt-4">
            <p className="text-sm text-[#a093c2] mb-2">
              {isOpened ? '✅ 胶囊已开启，所有成员可查看' : '⏳ 胶囊尚未开启，创建后可添加内容'}
            </p>
          </div>
        </div>

        {hasJoined ? (
          <div className="bg-gradient-to-r from-candy-green/20 to-candy-teal/20 border border-candy-green/30 rounded-2xl p-4 text-center">
            <CheckCircle2 className="w-10 h-10 text-candy-green mx-auto mb-3" />
            <p className="font-medium text-gray-800 mb-1">您已加入！</p>
            <p className="text-sm text-gray-600 mb-4">正在跳转到胶囊详情...</p>
            <button
              onClick={() => navigate(`/capsule/${capsule.id}`)}
              className="px-6 py-2 bg-gradient-to-r from-candy-green to-candy-teal text-white rounded-full font-medium"
            >
              立即查看
            </button>
          </div>
        ) : (
          <button
            onClick={handleJoin}
            disabled={isJoining}
            className="w-full py-4 bg-gradient-to-r from-candy-yellow to-candy-orange text-white rounded-2xl font-bold shadow-lg hover:opacity-90 transition-all disabled:opacity-50"
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
          className="w-full mt-4 py-3 text-gray-600 hover:text-gray-800 transition-colors"
        >
          暂时不加入
        </button>
      </div>
    </div>
  );
}
