import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCapsuleStore } from '../store/useCapsuleStore';
import CommentSection from '../components/CommentSection';
import CountdownTimer from '../components/CountdownTimer';
import SharePosterModal from '../components/SharePosterModal';
import {
  ArrowLeft,
  Heart,
  Star,
  MessageCircle,
  Play,
  User,
  Lock,
  Unlock,
  Edit,
  Save,
  AlertCircle,
  Share2,
  Reply,
  Image as ImageIcon,
  Users,
  Plus,
  Copy
} from 'lucide-react';
import { isCapsuleOpened, formatDate } from '../utils/date';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export default function CapsuleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getCapsuleById,
    comments,
    currentUser,
    likeCapsule,
    addComment,
    favoriteCapsule,
    updateCapsule,
    addNotification,
    addReply,
    addGroupMemberContent
  } = useCapsuleStore();

  const capsule = id ? getCapsuleById(id) : undefined;
  const [showPosterModal, setShowPosterModal] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replyImages, setReplyImages] = useState<string[]>([]);
  const [showReplySection, setShowReplySection] = useState(false);
  const [showMemberContentSection, setShowMemberContentSection] = useState(false);
  const [memberContent, setMemberContent] = useState('');
  const [memberImages, setMemberImages] = useState<string[]>([]);
  const [showShareLinkModal, setShowShareLinkModal] = useState(false);

  if (!capsule) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f9f7f4] via-white to-[#f5f3f7] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#8a7ab5] mb-4">胶囊不存在</p>
          <button onClick={() => navigate('/')} className="px-6 py-2 bg-gradient-to-r from-candy-pink to-candy-purple text-white rounded-full">
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

  useEffect(() => {
    if (capsule.isPublic) {
      setHasAccess(true);
    } else if (currentUser) {
      if (capsule.userId === currentUser.id) {
        setHasAccess(true);
      } else if (capsule.sharedWith && capsule.sharedWith.includes(currentUser.nickname)) {
        setHasAccess(true);
      } else if (capsule.isGroup && capsule.groupMembers?.some(m => m.userId === currentUser.id)) {
        setHasAccess(true);
      } else if (capsule.password) {
        setHasAccess(false);
      } else {
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
        if (currentUser) {
          addNotification({
            title: '访问成功',
            message: '您已成功访问私密胶囊',
            type: 'system'
          });
        }
      } else {
        setPasswordError('密码错误，请重新输入');
      }
      setIsVerifying(false);
    }, 500);
  };

  const handleSubmitReply = () => {
    if (!currentUser || !replyContent.trim()) return;
    
    addReply(capsule.id, {
      capsuleId: capsule.id,
      userId: currentUser.id,
      nickname: currentUser.nickname,
      content: replyContent,
      images: replyImages.length > 0 ? replyImages : undefined
    });
    
    setReplyContent('');
    setReplyImages([]);
    setShowReplySection(false);
    
    addNotification({
      title: '回信已发送',
      message: '您的跨时空回信已成功添加',
      type: 'system',
      capsuleId: capsule.id
    });
  };

  const handleSubmitMemberContent = () => {
    if (!currentUser || !memberContent.trim()) return;
    
    addGroupMemberContent(
      capsule.id,
      currentUser.id,
      memberContent,
      memberImages.length > 0 ? memberImages : undefined
    );
    
    setMemberContent('');
    setMemberImages([]);
    setShowMemberContentSection(false);
    
    addNotification({
      title: '内容已添加',
      message: '您的集体胶囊内容已成功添加',
      type: 'system',
      capsuleId: capsule.id
    });
  };

  const handleCopyInviteLink = async () => {
    if (!capsule.inviteLink) return;
    try {
      await navigator.clipboard.writeText(capsule.inviteLink);
      addNotification({
        title: '复制成功',
        message: '邀请链接已复制到剪贴板',
        type: 'system',
        capsuleId: capsule.id
      });
    } catch {
      addNotification({
        title: '复制失败',
        message: '请手动复制邀请链接',
        type: 'system',
        capsuleId: capsule.id
      });
    }
  };

  const renderNoAccess = () => (
    <div className="min-h-screen bg-gradient-to-b from-[#f9f7f4] via-white to-[#f5f3f7] flex flex-col items-center justify-center px-4">
      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-candy-pink/20 to-candy-purple/20 flex items-center justify-center mb-6">
        <Lock className="w-10 h-10 text-candy-purple" />
      </div>
      <h2 className="text-xl font-bold text-[#5a4b7a] mb-2">无访问权限</h2>
      <p className="text-[#8a7ab5] text-center mb-8">
        这是一个私密胶囊，只有被邀请的用户或输入正确密码才能访问
      </p>
      <button onClick={() => navigate('/')} className="px-6 py-3 bg-gradient-to-r from-candy-pink to-candy-purple text-white rounded-xl font-medium">
        返回广场
      </button>
    </div>
  );

  const renderPasswordForm = () => (
    <div className="min-h-screen bg-gradient-to-b from-[#f9f7f4] via-white to-[#f5f3f7] flex flex-col items-center justify-center px-4">
      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-candy-pink/20 to-candy-purple/20 flex items-center justify-center mb-6">
        <Lock className="w-10 h-10 text-candy-purple" />
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
            className="w-full px-4 py-3 bg-white border border-[#e0d6f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-candy-pink focus:border-candy-pink transition-all"
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
          className="w-full py-3 bg-gradient-to-r from-candy-pink to-candy-purple text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isVerifying ? '验证中...' : '验证密码'}
        </button>
      </form>
      
      <button onClick={() => navigate('/')} className="mt-6 text-[#8a7ab5] hover:text-[#5a4b7a] transition-colors">
        返回广场
      </button>
    </div>
  );

  const renderNotOpened = () => (
    <div className="min-h-screen bg-gradient-to-b from-[#f9f7f4] via-white to-[#f5f3f7] flex flex-col items-center justify-center px-4">
      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-candy-pink/20 to-candy-purple/20 flex items-center justify-center mb-6">
        <Lock className="w-10 h-10 text-candy-purple" />
      </div>
      <h2 className="text-xl font-bold text-[#5a4b7a] mb-2">胶囊尚未开启</h2>
      <p className="text-[#8a7ab5] text-center mb-8">
        静待时光，美好终将呈现
      </p>
      <CountdownTimer openAt={capsule.openAt} />
      <button onClick={() => navigate('/')} className="mt-8 px-6 py-3 bg-gradient-to-r from-candy-pink to-candy-purple text-white rounded-xl font-medium">
        返回广场
      </button>
    </div>
  );

  if (!hasAccess) {
    return capsule.password ? renderPasswordForm() : renderNoAccess();
  }

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
          <h1 className="font-bold text-lg text-[#5a4b7a]">
            {capsule.isGroup ? (capsule.groupName || '集体胶囊') : '胶囊详情'}
          </h1>
          <div className="flex items-center gap-2">
            {isOpened && (
              <button 
                onClick={() => setShowPosterModal(true)}
                className="p-2 text-candy-pink"
              >
                <Share2 className="w-5 h-5" />
              </button>
            )}
            {currentUser && capsule.userId === currentUser.id && (
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 -mr-2 text-candy-purple"
              >
                {isEditing ? <Save className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-6">
        {capsule.isGroup && capsule.groupMembers && (
          <div className="mb-6 bg-gradient-to-r from-candy-pink/10 to-candy-purple/10 rounded-2xl p-4 border border-candy-pink/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-candy-purple" />
                <span className="font-medium text-gray-800">集体成员 ({capsule.groupMembers.length})</span>
              </div>
              {currentUser && capsule.userId === currentUser.id && capsule.inviteLink && (
                <button
                  onClick={() => setShowShareLinkModal(true)}
                  className="px-3 py-1.5 bg-white rounded-full text-sm text-candy-purple flex items-center gap-1 hover:bg-candy-purple/10 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  分享链接
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {capsule.groupMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full shadow-sm">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-candy-pink to-candy-purple flex items-center justify-center text-white text-xs">
                    {member.nickname[0]}
                  </div>
                  <span className="text-sm text-gray-700">{member.nickname}</span>
                </div>
              ))}
            </div>
            
            <div className="space-y-4">
              {capsule.groupMembers.filter(member => member.content).map((member) => (
                <div key={member.id} className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-candy-pink to-candy-purple flex items-center justify-center text-white text-sm">
                      {member.nickname[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{member.nickname}</p>
                      <p className="text-xs text-gray-500">{formatDate(member.joinedAt)}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-3">{member.content}</p>
                  {member.images && member.images.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {member.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Member image ${idx + 1}`}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {currentUser && capsule.groupMembers.some(m => m.userId === currentUser.id) && (
              <div className="mt-4">
                {!showMemberContentSection ? (
                  <button
                    onClick={() => setShowMemberContentSection(true)}
                    className="w-full py-3 bg-gradient-to-r from-candy-pink to-candy-purple text-white rounded-2xl font-medium flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    添加我的内容
                  </button>
                ) : (
                  <div className="bg-white rounded-2xl p-4 border border-[#e0d6f0]">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-800">添加我的内容</h4>
                      <button
                        onClick={() => setShowMemberContentSection(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        取消
                      </button>
                    </div>
                    <textarea
                      value={memberContent}
                      onChange={(e) => setMemberContent(e.target.value)}
                      placeholder="写下你的时光记忆..."
                      className="w-full p-3 border border-[#e0d6f0] rounded-xl min-h-[100px] mb-3 focus:outline-none focus:ring-2 focus:ring-candy-pink focus:border-candy-pink"
                    />
                    <div className="flex items-center justify-between">
                      <button className="flex items-center gap-2 text-gray-500 hover:text-candy-purple">
                        <ImageIcon className="w-5 h-5" />
                        <span className="text-sm">添加图片</span>
                      </button>
                      <button
                        onClick={handleSubmitMemberContent}
                        disabled={!memberContent.trim()}
                        className="px-6 py-2 bg-gradient-to-r from-candy-pink to-candy-purple text-white rounded-xl font-medium disabled:opacity-50"
                      >
                        提交
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

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
          <div className="mb-6 bg-gradient-to-r from-candy-pink/10 to-candy-purple/10 rounded-2xl p-4 border border-candy-pink/20">
            <div className="flex items-center gap-3">
              <button className="w-12 h-12 rounded-full bg-gradient-to-r from-candy-pink to-candy-purple flex items-center justify-center text-white shadow-lg">
                <Play className="w-5 h-5 fill-current ml-1" />
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-candy-pink to-candy-purple w-1/3 rounded-full" />
                  </div>
                  <span className="text-xs text-gray-600 font-medium">00:15</span>
                </div>
                <p className="text-xs text-gray-500">语音留言</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e0d6f0] mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-candy-pink to-candy-purple flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
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
                <Unlock className="w-4 h-4 text-candy-green" />
              ) : (
                <Lock className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </div>

          <div className="mb-4">
            {isEditing ? (
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full p-3 border border-[#e0d6f0] rounded-xl min-h-[120px] focus:outline-none focus:ring-2 focus:ring-candy-pink focus:border-candy-pink transition-all"
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
              <span key={idx} className="px-3 py-1 bg-gradient-to-r from-candy-pink/10 to-candy-purple/10 text-candy-purple text-xs rounded-full border border-candy-pink/20">
                #{tag}
              </span>
            ))}
          </div>

          <div className="pt-4 border-t border-[#e0d6f0]">
            <CountdownTimer openAt={capsule.openAt} />
          </div>
        </div>

        {capsule.replies && capsule.replies.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-lg text-[#5a4b7a] mb-4 flex items-center gap-2">
              <Reply className="w-5 h-5 text-candy-orange" />
              跨时空回信 ({capsule.replies.length})
            </h3>
            <div className="space-y-4">
              {capsule.replies.map((reply) => (
                <div key={reply.id} className="bg-white rounded-2xl p-4 border border-[#e0d6f0]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-candy-yellow to-candy-orange flex items-center justify-center text-white text-sm">
                      {reply.nickname[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{reply.nickname}</p>
                      <p className="text-xs text-gray-500">{formatDate(reply.createdAt)}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{reply.content}</p>
                  {reply.images && reply.images.length > 0 && (
                    <div className="mt-3 flex gap-2">
                      {reply.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Reply image ${idx + 1}`}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {isOpened && (
          <div className="mb-6">
            {!showReplySection ? (
              <button
                onClick={() => setShowReplySection(true)}
                className="w-full py-3 bg-gradient-to-r from-candy-yellow to-candy-orange text-white rounded-2xl font-medium flex items-center justify-center gap-2"
              >
                <Reply className="w-5 h-5" />
                添加跨时空回信
              </button>
            ) : (
              <div className="bg-white rounded-2xl p-4 border border-[#e0d6f0]">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-800">写回信</h4>
                  <button
                    onClick={() => setShowReplySection(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    取消
                  </button>
                </div>
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="写下你想对过去/未来说的话..."
                  className="w-full p-3 border border-[#e0d6f0] rounded-xl min-h-[100px] mb-3 focus:outline-none focus:ring-2 focus:ring-candy-yellow focus:border-candy-yellow"
                />
                <div className="flex items-center justify-between">
                  <button className="flex items-center gap-2 text-gray-500 hover:text-candy-orange">
                    <ImageIcon className="w-5 h-5" />
                    <span className="text-sm">添加图片</span>
                  </button>
                  <button
                    onClick={handleSubmitReply}
                    disabled={!replyContent.trim()}
                    className="px-6 py-2 bg-gradient-to-r from-candy-yellow to-candy-orange text-white rounded-xl font-medium disabled:opacity-50"
                  >
                    发送
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3 mb-8">
          <ActionButton
            icon={<Heart className="w-5 h-5" />}
            count={capsule.likes}
            onClick={() => likeCapsule(capsule.id)}
          />
          <ActionButton
            icon={<MessageCircle className="w-5 h-5" />}
            count={capsule.comments}
            onClick={() => {}}
          />
          <ActionButton
            icon={<Star className="w-5 h-5" />}
            count={capsule.favorites}
            onClick={() => favoriteCapsule(capsule.id)}
          />
        </div>

        <CommentSection
          comments={capsuleComments}
          currentUser={currentUser}
          onAddComment={(content) => currentUser && addComment(capsule.id, {
            userId: currentUser.id,
            nickname: currentUser.nickname,
            content
          })}
        />
      </div>

      <SharePosterModal
        isOpen={showPosterModal}
        onClose={() => setShowPosterModal(false)}
        capsule={capsule}
      />

      {/* 分享邀请链接模态框 */}
      {showShareLinkModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-[#5a4b7a]">分享邀请链接</h3>
              <button
                onClick={() => setShowShareLinkModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">复制链接分享给好友，邀请他们加入集体胶囊：</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={capsule.inviteLink || ''}
                  readOnly
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600"
                />
                <button
                  onClick={handleCopyInviteLink}
                  className="px-4 py-2 bg-gradient-to-r from-candy-pink to-candy-purple text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">
                链接有效期：永久
              </p>
              <p className="text-sm text-gray-500 mt-1">
                最多可邀请：{20 - (capsule.groupMembers?.length || 1)} 人
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ActionButton({ 
  icon, 
  count, 
  onClick 
}: { 
  icon: React.ReactNode; 
  count: number; 
  onClick: () => void; 
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 py-3 rounded-2xl bg-white border border-[#e0d6f0] flex items-center justify-center gap-2 hover:border-candy-pink transition-all active:scale-95"
    >
      {icon}
      <span className="font-medium text-[#5a4b7a]">{count}</span>
    </button>
  );
}
