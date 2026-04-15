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
  Copy,
  MessageSquare
} from 'lucide-react';
import { isCapsuleOpened, formatDate } from '../utils/date';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useTheme } from '../hooks/useTheme';

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
    addGroupMemberContent,
    setCapsuleAsDriftBottle
  } = useCapsuleStore();
  const { isDark } = useTheme();

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
          )}>胶囊不存在</p>
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
    
    // 检查用户是否已经添加了3条回信
    const userReplies = capsule.replies?.filter(reply => reply.userId === currentUser.id) || [];
    if (userReplies.length >= 3) {
      alert('每个人最多只能添加3条回信哦！');
      return;
    }
    
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
      alert('邀请链接已复制到剪贴板！');
    } catch {
      alert('复制失败，请手动复制邀请链接！');
    }
  };

  // 直接测试分享链接功能
  useEffect(() => {
    console.log('Capsule invite link:', capsule.inviteLink);
    console.log('Is group capsule:', capsule.isGroup);
  }, [capsule.inviteLink, capsule.isGroup]);

  const renderNoAccess = () => (
    <div className={cn(
      "min-h-screen flex flex-col items-center justify-center px-4",
      isDark 
        ? "bg-dark-bg-primary text-dark-text-primary"
        : "bg-gradient-to-b from-[#f9f7f4] via-white to-[#f5f3f7]"
    )}>
      <div className={cn(
        "w-20 h-20 rounded-full flex items-center justify-center mb-6",
        isDark ? "bg-dark-bg-secondary" : "bg-gradient-to-r from-candy-pink/20 to-candy-purple/20"
      )}>
        <Lock className={cn(
          "w-10 h-10",
          isDark ? "text-dark-accent-secondary" : "text-candy-purple"
        )} />
      </div>
      <h2 className={cn(
        "text-xl font-bold mb-2",
        isDark ? "text-dark-text-primary" : "text-[#5a4b7a]"
      )}>无访问权限</h2>
      <p className={cn(
        "text-center mb-8",
        isDark ? "text-dark-text-secondary" : "text-[#8a7ab5]"
      )}>
        这是一个私密胶囊，只有被邀请的用户或输入正确密码才能访问
      </p>
      <button onClick={() => navigate('/')} className={cn(
        "px-6 py-3 text-white rounded-xl font-medium",
        isDark ? "bg-gradient-to-r from-dark-accent-primary to-dark-accent-secondary" : "bg-gradient-to-r from-candy-pink to-candy-purple"
      )}>
        返回广场
      </button>
    </div>
  );

  const renderPasswordForm = () => (
    <div className={cn(
      "min-h-screen flex flex-col items-center justify-center px-4",
      isDark 
        ? "bg-dark-bg-primary text-dark-text-primary"
        : "bg-gradient-to-b from-[#f9f7f4] via-white to-[#f5f3f7]"
    )}>
      <div className={cn(
        "w-20 h-20 rounded-full flex items-center justify-center mb-6",
        isDark ? "bg-dark-bg-secondary" : "bg-gradient-to-r from-candy-pink/20 to-candy-purple/20"
      )}>
        <Lock className={cn(
          "w-10 h-10",
          isDark ? "text-dark-accent-secondary" : "text-candy-purple"
        )} />
      </div>
      <h2 className={cn(
        "text-xl font-bold mb-6",
        isDark ? "text-dark-text-primary" : "text-[#5a4b7a]"
      )}>输入密码访问胶囊</h2>
      
      <form onSubmit={handlePasswordSubmit} className="w-full max-w-md space-y-4">
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="请输入4-6位数字密码"
            maxLength={6}
            className={cn(
              "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all",
              isDark
                ? "bg-dark-bg-secondary border-dark-border-primary focus:ring-dark-accent-secondary"
                : "bg-white border-[#e0d6f0] focus:ring-candy-pink focus:border-candy-pink"
            )}
          />
          {passwordError && (
            <div className={cn(
              "flex items-center gap-2 mt-2 text-sm",
              isDark ? "text-red-400" : "text-[#e57373]"
            )}>
              <AlertCircle className="w-4 h-4" />
              <span>{passwordError}</span>
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={isVerifying || !password}
          className={cn(
            "w-full py-3 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all",
            isDark ? "bg-gradient-to-r from-dark-accent-primary to-dark-accent-secondary" : "bg-gradient-to-r from-candy-pink to-candy-purple"
          )}
        >
          {isVerifying ? '验证中...' : '验证密码'}
        </button>
      </form>
      
      <button onClick={() => navigate('/')} className={cn(
        "mt-6 transition-colors",
        isDark ? "text-dark-text-secondary hover:text-dark-text-primary" : "text-[#8a7ab5] hover:text-[#5a4b7a]"
      )}>
        返回广场
      </button>
    </div>
  );

  const renderNotOpened = () => (
    <div className={cn(
      "min-h-screen",
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
          )}>
            {capsule.isGroup ? (capsule.groupName || '集体胶囊') : '胶囊详情'}
          </h1>
          <div className="flex items-center gap-2">
            {capsule.inviteLink && capsule.isGroup && (
              <button 
                onClick={() => setShowShareLinkModal(true)}
                className={cn(
                  "p-2",
                  isDark ? "text-dark-accent-secondary" : "text-candy-pink"
                )}
              >
                <Share2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="max-w-md mx-auto px-4 py-12 flex flex-col items-center justify-center">
        <div className={cn(
          "w-20 h-20 rounded-full flex items-center justify-center mb-6",
          isDark ? "bg-dark-bg-secondary" : "bg-gradient-to-r from-candy-pink/20 to-candy-purple/20"
        )}>
          <Lock className={cn(
            "w-10 h-10",
            isDark ? "text-dark-accent-secondary" : "text-candy-purple"
          )} />
        </div>
        <h2 className={cn(
          "text-xl font-bold mb-2",
          isDark ? "text-dark-text-primary" : "text-[#5a4b7a]"
        )}>胶囊尚未开启</h2>
        <p className={cn(
          "text-center mb-8",
          isDark ? "text-dark-text-secondary" : "text-[#8a7ab5]"
        )}>
          静待时光，美好终将呈现
        </p>
        <CountdownTimer openAt={capsule.openAt} isDark={isDark} />
        <button onClick={() => navigate('/')} className={cn(
          "mt-8 px-6 py-3 text-white rounded-xl font-medium",
          isDark ? "bg-gradient-to-r from-dark-accent-primary to-dark-accent-secondary" : "bg-gradient-to-r from-candy-pink to-candy-purple"
        )}>
          返回广场
        </button>
      </div>
      
      {capsule.isGroup && capsule.groupMembers && (
        <div className="max-w-md mx-auto px-4 pb-12">
          <div className={cn(
            "rounded-2xl p-4 border",
            isDark
              ? "bg-dark-bg-secondary border-dark-border-primary"
              : "bg-gradient-to-r from-candy-pink/10 to-candy-purple/10 border border-candy-pink/20"
          )}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className={cn(
                  "w-5 h-5",
                  isDark ? "text-dark-accent-secondary" : "text-candy-purple"
                )} />
                <span className={cn(
                  "font-medium",
                  isDark ? "text-dark-text-primary" : "text-gray-800"
                )}>集体成员 ({capsule.groupMembers.length})</span>
              </div>
              {capsule.inviteLink && (
                <button
                  onClick={() => setShowShareLinkModal(true)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm flex items-center gap-1 transition-colors",
                    isDark
                      ? "bg-dark-bg-tertiary text-dark-accent-secondary hover:bg-dark-bg-tertiary"
                      : "bg-white text-candy-purple hover:bg-candy-purple/10"
                  )}
                >
                  <Share2 className="w-4 h-4" />
                  分享链接
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {capsule.groupMembers.map((member) => (
                <div key={member.id} className={cn(
                  "flex items-center gap-1 px-3 py-1.5 rounded-full shadow-sm",
                  isDark
                    ? "bg-dark-bg-tertiary"
                    : "bg-white"
                )}>
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-white text-xs",
                    isDark ? "bg-gradient-to-r from-dark-accent-primary to-dark-accent-secondary" : "bg-gradient-to-r from-candy-pink to-candy-purple"
                  )}>
                    {member.nickname[0]}
                  </div>
                  <span className={cn(
                    "text-sm",
                    isDark ? "text-dark-text-secondary" : "text-gray-700"
                  )}>{member.nickname}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 分享邀请链接模态框 */}
      {showShareLinkModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className={cn(
            "rounded-3xl p-6 max-w-md w-full",
            isDark ? "bg-dark-bg-secondary" : "bg-white"
          )}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={cn(
                "font-bold text-lg",
                isDark ? "text-dark-text-primary" : "text-[#5a4b7a]"
              )}>分享邀请链接</h3>
              <button
                onClick={() => setShowShareLinkModal(false)}
                className={cn(
                  "p-2 rounded-full",
                  isDark ? "hover:bg-dark-bg-tertiary" : "hover:bg-gray-100"
                )}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={cn(
                  "h-5 w-5",
                  isDark ? "text-dark-text-secondary" : "text-gray-500"
                )} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mb-4">
              <p className={cn(
                "text-sm mb-2",
                isDark ? "text-dark-text-secondary" : "text-gray-600"
              )}>复制链接分享给好友，邀请他们加入集体胶囊：</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={capsule.inviteLink || ''}
                  readOnly
                  className={cn(
                    "flex-1 px-3 py-2 text-sm rounded-lg",
                    isDark
                      ? "bg-dark-bg-tertiary border border-dark-border-primary text-dark-text-secondary"
                      : "bg-gray-50 border border-gray-200 text-gray-600"
                  )}
                />
                <button
                  onClick={handleCopyInviteLink}
                  className={cn(
                    "px-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-opacity",
                    isDark ? "bg-gradient-to-r from-dark-accent-primary to-dark-accent-secondary" : "bg-gradient-to-r from-candy-pink to-candy-purple"
                  )}
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className={cn(
              "rounded-xl p-4",
              isDark ? "bg-dark-bg-tertiary" : "bg-gray-50"
            )}>
              <p className={cn(
                "text-sm",
                isDark ? "text-dark-text-secondary" : "text-gray-500"
              )}>
                链接有效期：永久
              </p>
              <p className={cn(
                "text-sm mt-1",
                isDark ? "text-dark-text-secondary" : "text-gray-500"
              )}>
                最多可邀请：{20 - (capsule.groupMembers?.length || 1)} 人
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (!hasAccess) {
    return capsule.password ? renderPasswordForm() : renderNoAccess();
  }

  if (!isOpened) {
    return renderNotOpened();
  }

  return (
    <div className={cn(
      "min-h-screen pb-32",
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
          )}>
            {capsule.isGroup ? (capsule.groupName || '集体胶囊') : '胶囊详情'}
          </h1>
          <div className="flex items-center gap-2">
            {isOpened && (
              <button 
                onClick={() => setShowPosterModal(true)}
                className={cn(
                  "p-2",
                  isDark ? "text-dark-accent-secondary" : "text-candy-pink"
                )}
                title="分享海报"
              >
                <Share2 className="w-5 h-5" />
              </button>
            )}
            {capsule.inviteLink && capsule.isGroup && (
              <button 
                onClick={() => setShowShareLinkModal(true)}
                className={cn(
                  "p-2",
                  isDark ? "text-dark-accent-secondary" : "text-candy-purple"
                )}
                title="分享邀请链接"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            )}
            {currentUser && capsule.userId === currentUser.id && (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className={cn(
                    "p-2",
                    isDark ? "text-dark-accent-secondary" : "text-candy-purple"
                  )}
                >
                  {isEditing ? <Save className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
                </button>
                {capsule.isPublic && !capsule.isDriftBottle && (
                  <button 
                    onClick={() => {
                      setCapsuleAsDriftBottle(capsule.id);
                      addNotification({
                        title: '设置成功',
                        message: '你的胶囊已成功设置为漂流瓶',
                        type: 'system'
                      });
                    }}
                    className={cn(
                      "p-2",
                      isDark ? "text-dark-accent-secondary" : "text-candy-blue"
                    )}
                    title="设置为漂流瓶"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-6">
        {capsule.isGroup && capsule.groupMembers && (
          <div className={cn(
            "mb-6 rounded-2xl p-4 border",
            isDark
              ? "bg-dark-bg-secondary border-dark-border-primary"
              : "bg-gradient-to-r from-candy-pink/10 to-candy-purple/10 border border-candy-pink/20"
          )}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className={cn(
                  "w-5 h-5",
                  isDark ? "text-dark-accent-secondary" : "text-candy-purple"
                )} />
                <span className={cn(
                  "font-medium",
                  isDark ? "text-dark-text-primary" : "text-gray-800"
                )}>集体成员 ({capsule.groupMembers.length})</span>
              </div>
              {capsule.inviteLink && (
                <button
                  onClick={() => setShowShareLinkModal(true)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm flex items-center gap-1 transition-colors",
                    isDark
                      ? "bg-dark-bg-tertiary text-dark-accent-secondary hover:bg-dark-bg-tertiary"
                      : "bg-white text-candy-purple hover:bg-candy-purple/10"
                  )}
                >
                  <Share2 className="w-4 h-4" />
                  分享链接
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {capsule.groupMembers.map((member) => (
                <div key={member.id} className={cn(
                  "flex items-center gap-1 px-3 py-1.5 rounded-full shadow-sm",
                  isDark
                    ? "bg-dark-bg-tertiary"
                    : "bg-white"
                )}>
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-white text-xs",
                    isDark ? "bg-gradient-to-r from-dark-accent-primary to-dark-accent-secondary" : "bg-gradient-to-r from-candy-pink to-candy-purple"
                  )}>
                    {member.nickname[0]}
                  </div>
                  <span className={cn(
                    "text-sm",
                    isDark ? "text-dark-text-secondary" : "text-gray-700"
                  )}>{member.nickname}</span>
                </div>
              ))}
            </div>
            
            <div className="space-y-4">
              {capsule.groupMembers.filter(member => member.content).map((member) => (
                <div key={member.id} className={cn(
                  "rounded-2xl p-4 shadow-sm",
                  isDark ? "bg-dark-bg-tertiary" : "bg-white"
                )}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm",
                      isDark ? "bg-gradient-to-r from-dark-accent-primary to-dark-accent-secondary" : "bg-gradient-to-r from-candy-pink to-candy-purple"
                    )}>
                      {member.nickname[0]}
                    </div>
                    <div>
                      <p className={cn(
                        "font-medium",
                        isDark ? "text-dark-text-primary" : "text-gray-800"
                      )}>{member.nickname}</p>
                      <p className={cn(
                        "text-xs",
                        isDark ? "text-dark-text-tertiary" : "text-gray-500"
                      )}>{formatDate(member.joinedAt)}</p>
                    </div>
                  </div>
                  <p className={cn(
                    "leading-relaxed mb-3",
                    isDark ? "text-dark-text-secondary" : "text-gray-700"
                  )}>{member.content}</p>
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
                    className={cn(
                      "w-full py-3 text-white rounded-2xl font-medium flex items-center justify-center gap-2",
                      isDark ? "bg-gradient-to-r from-dark-accent-primary to-dark-accent-secondary" : "bg-gradient-to-r from-candy-pink to-candy-purple"
                    )}
                  >
                    <Plus className="w-5 h-5" />
                    添加我的内容
                  </button>
                ) : (
                  <div className={cn(
                    "rounded-2xl p-4 border",
                    isDark ? "bg-dark-bg-tertiary border-dark-border-primary" : "bg-white border-[#e0d6f0]"
                  )}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className={cn(
                        "font-medium",
                        isDark ? "text-dark-text-primary" : "text-gray-800"
                      )}>添加我的内容</h4>
                      <button
                        onClick={() => setShowMemberContentSection(false)}
                        className={cn(
                          "transition-colors",
                          isDark ? "text-dark-text-secondary hover:text-dark-text-primary" : "text-gray-500 hover:text-gray-700"
                        )}
                      >
                        取消
                      </button>
                    </div>
                    <textarea
                      value={memberContent}
                      onChange={(e) => setMemberContent(e.target.value)}
                      placeholder="写下你的时光记忆..."
                      className={cn(
                        "w-full p-3 border rounded-xl min-h-[100px] mb-3 focus:outline-none focus:ring-2 focus:border-transparent transition-all",
                        isDark
                          ? "bg-dark-bg-secondary border-dark-border-primary focus:ring-dark-accent-secondary"
                          : "border-[#e0d6f0] focus:ring-candy-pink focus:border-candy-pink"
                      )}
                    />
                    <div className="flex items-center justify-between">
                      <button className={cn(
                        "flex items-center gap-2 transition-colors",
                        isDark ? "text-dark-text-secondary hover:text-dark-accent-secondary" : "text-gray-500 hover:text-candy-purple"
                      )}>
                        <ImageIcon className="w-5 h-5" />
                        <span className="text-sm">添加图片</span>
                      </button>
                      <button
                        onClick={handleSubmitMemberContent}
                        disabled={!memberContent.trim()}
                        className={cn(
                          "px-6 py-2 text-white rounded-xl font-medium disabled:opacity-50",
                          isDark ? "bg-gradient-to-r from-dark-accent-primary to-dark-accent-secondary" : "bg-gradient-to-r from-candy-pink to-candy-purple"
                        )}
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
          <div className={cn(
            "mb-6 rounded-2xl p-4 border",
            isDark
              ? "bg-dark-bg-secondary border-dark-border-primary"
              : "bg-gradient-to-r from-candy-pink/10 to-candy-purple/10 border border-candy-pink/20"
          )}>
            <div className="flex items-center gap-3">
              <button className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg",
                isDark ? "bg-gradient-to-r from-dark-accent-primary to-dark-accent-secondary" : "bg-gradient-to-r from-candy-pink to-candy-purple"
              )}>
                <Play className="w-5 h-5 fill-current ml-1" />
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className={cn(
                    "flex-1 h-2 rounded-full overflow-hidden",
                    isDark ? "bg-dark-bg-tertiary" : "bg-white"
                  )}>
                    <div className={cn(
                      "h-full w-1/3 rounded-full",
                      isDark ? "bg-gradient-to-r from-dark-accent-primary to-dark-accent-secondary" : "bg-gradient-to-r from-candy-pink to-candy-purple"
                    )} />
                  </div>
                  <span className={cn(
                    "text-xs font-medium",
                    isDark ? "text-dark-text-secondary" : "text-gray-600"
                  )}>00:15</span>
                </div>
                <p className={cn(
                  "text-xs",
                  isDark ? "text-dark-text-tertiary" : "text-gray-500"
                )}>语音留言</p>
              </div>
            </div>
          </div>
        )}

        <div className={cn(
          "rounded-3xl p-6 shadow-sm border mb-6",
          isDark ? "bg-dark-bg-secondary border-dark-border-primary" : "bg-white border-[#e0d6f0]"
        )}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                isDark ? "bg-gradient-to-r from-dark-accent-primary to-dark-accent-secondary" : "bg-gradient-to-r from-candy-pink to-candy-purple"
              )}>
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className={cn(
                  "font-medium",
                  isDark ? "text-dark-text-primary" : "text-[#5a4b7a]"
                )}>
                  {capsule.isAnonymous ? '匿名用户' : '校园旅人'}
                </p>
                <p className={cn(
                  "text-xs",
                  isDark ? "text-dark-text-tertiary" : "text-[#a093c2]"
                )}>{formatDate(capsule.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {capsule.isPublic ? (
                <Unlock className={cn(
                  "w-4 h-4",
                  isDark ? "text-dark-accent-secondary" : "text-candy-green"
                )} />
              ) : (
                <Lock className={cn(
                  "w-4 h-4",
                  isDark ? "text-dark-text-tertiary" : "text-gray-400"
                )} />
              )}
            </div>
          </div>

          <div className="mb-4">
            {isEditing ? (
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className={cn(
                  "w-full p-3 border rounded-xl min-h-[120px] focus:outline-none focus:ring-2 focus:border-transparent transition-all",
                  isDark
                    ? "bg-dark-bg-tertiary border-dark-border-primary focus:ring-dark-accent-secondary"
                    : "border-[#e0d6f0] focus:ring-candy-pink focus:border-candy-pink"
                )}
                placeholder="写下你的时光记忆..."
              />
            ) : (
              <>
                <p className={cn(
                  "leading-relaxed whitespace-pre-wrap",
                  isDark ? "text-dark-text-secondary" : "text-[#5a4b7a]"
                )}>{capsule.content}</p>
                {capsule.updatedAt && (
                  <p className={cn(
                    "text-xs mt-2",
                    isDark ? "text-dark-text-tertiary" : "text-[#a093c2]"
                  )}>
                    更新于 {formatDate(capsule.updatedAt)}
                  </p>
                )}
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {capsule.tags.map((tag, idx) => (
              <span key={idx} className={cn(
                "px-3 py-1 text-xs rounded-full border",
                isDark
                  ? "bg-dark-bg-tertiary text-dark-accent-secondary border-dark-border-primary"
                  : "bg-gradient-to-r from-candy-pink/10 to-candy-purple/10 text-candy-purple border border-candy-pink/20"
              )}>
                #{tag}
              </span>
            ))}
          </div>

          <div className={cn(
            "pt-4 border-t",
            isDark ? "border-dark-border-primary" : "border-[#e0d6f0]"
          )}>
            <CountdownTimer openAt={capsule.openAt} isDark={isDark} />
          </div>
        </div>

        {capsule.replies && capsule.replies.length > 0 && (
          <div className="mb-6">
            <h3 className={cn(
              "font-bold text-lg mb-4 flex items-center gap-2",
              isDark ? "text-dark-text-primary" : "text-[#5a4b7a]"
            )}>
              <Reply className={cn(
                "w-5 h-5",
                isDark ? "text-dark-accent-secondary" : "text-candy-orange"
              )} />
              跨时空回信 ({capsule.replies.length})
            </h3>
            <div className="space-y-4">
              {capsule.replies.map((reply) => (
                <div key={reply.id} className={cn(
                  "rounded-2xl p-4 border",
                  isDark ? "bg-dark-bg-secondary border-dark-border-primary" : "bg-white border-[#e0d6f0]"
                )}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm",
                      isDark ? "bg-gradient-to-r from-dark-accent-primary to-dark-accent-secondary" : "bg-gradient-to-r from-candy-yellow to-candy-orange"
                    )}>
                      {reply.nickname[0]}
                    </div>
                    <div>
                      <p className={cn(
                        "font-medium",
                        isDark ? "text-dark-text-primary" : "text-gray-800"
                      )}>{reply.nickname}</p>
                      <p className={cn(
                        "text-xs",
                        isDark ? "text-dark-text-tertiary" : "text-gray-500"
                      )}>{formatDate(reply.createdAt)}</p>
                    </div>
                  </div>
                  <p className={cn(
                    "leading-relaxed",
                    isDark ? "text-dark-text-secondary" : "text-gray-700"
                  )}>{reply.content}</p>
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
                disabled={currentUser && capsule.replies?.filter(reply => reply.userId === currentUser.id).length >= 3}
                className={cn(
                  "w-full py-3 text-white rounded-2xl font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
                  isDark ? "bg-gradient-to-r from-dark-accent-primary to-dark-accent-secondary" : "bg-gradient-to-r from-candy-yellow to-candy-orange"
                )}
              >
                <Reply className="w-5 h-5" />
                {currentUser && capsule.replies?.filter(reply => reply.userId === currentUser.id).length >= 3 ? '已达到回信上限' : '添加跨时空回信'}
              </button>
            ) : (
              <div className={cn(
                "rounded-2xl p-4 border",
                isDark ? "bg-dark-bg-secondary border-dark-border-primary" : "bg-white border-[#e0d6f0]"
              )}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className={cn(
                    "font-medium",
                    isDark ? "text-dark-text-primary" : "text-gray-800"
                  )}>写回信</h4>
                  <button
                    onClick={() => setShowReplySection(false)}
                    className={cn(
                      "transition-colors",
                      isDark ? "text-dark-text-secondary hover:text-dark-text-primary" : "text-gray-500 hover:text-gray-700"
                    )}
                  >
                    取消
                  </button>
                </div>
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="写下你想对过去/未来说的话..."
                  className={cn(
                    "w-full p-3 border rounded-xl min-h-[100px] mb-3 focus:outline-none focus:ring-2 focus:border-transparent transition-all",
                    isDark
                      ? "bg-dark-bg-tertiary border-dark-border-primary focus:ring-dark-accent-secondary"
                      : "border-[#e0d6f0] focus:ring-candy-yellow focus:border-candy-yellow"
                  )}
                />
                <div className="flex items-center justify-between">
                  <button className={cn(
                    "flex items-center gap-2 transition-colors",
                    isDark ? "text-dark-text-secondary hover:text-dark-accent-secondary" : "text-gray-500 hover:text-candy-orange"
                  )}>
                    <ImageIcon className="w-5 h-5" />
                    <span className="text-sm">添加图片</span>
                  </button>
                  <button
                    onClick={handleSubmitReply}
                    disabled={!replyContent.trim()}
                    className={cn(
                      "px-6 py-2 text-white rounded-xl font-medium disabled:opacity-50",
                      isDark ? "bg-gradient-to-r from-dark-accent-primary to-dark-accent-secondary" : "bg-gradient-to-r from-candy-yellow to-candy-orange"
                    )}
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
            isDark={isDark}
          />
          <ActionButton
            icon={<MessageCircle className="w-5 h-5" />}
            count={capsule.comments}
            onClick={() => {}}
            isDark={isDark}
          />
          <ActionButton
            icon={<Star className="w-5 h-5" />}
            count={capsule.favorites}
            onClick={() => favoriteCapsule(capsule.id)}
            isDark={isDark}
          />
        </div>

        <CommentSection
          comments={capsuleComments}
          currentUser={currentUser}
          onAddComment={(content) => addComment(capsule.id, {
            userId: currentUser?.id || 'anonymous',
            nickname: currentUser?.nickname || '匿名时光访客',
            content
          })}
          isDark={isDark}
        />
      </div>

      {/* 分享邀请链接模态框 */}
      {showShareLinkModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className={cn(
            "rounded-3xl p-6 max-w-md w-full",
            isDark ? "bg-dark-bg-secondary" : "bg-white"
          )}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={cn(
                "font-bold text-lg",
                isDark ? "text-dark-text-primary" : "text-[#5a4b7a]"
              )}>分享邀请链接</h3>
              <button
                onClick={() => setShowShareLinkModal(false)}
                className={cn(
                  "p-2 rounded-full",
                  isDark ? "hover:bg-dark-bg-tertiary" : "hover:bg-gray-100"
                )}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={cn(
                  "h-5 w-5",
                  isDark ? "text-dark-text-secondary" : "text-gray-500"
                )} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mb-4">
              <p className={cn(
                "text-sm mb-2",
                isDark ? "text-dark-text-secondary" : "text-gray-600"
              )}>复制链接分享给好友，邀请他们加入集体胶囊：</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={capsule.inviteLink || ''}
                  readOnly
                  className={cn(
                    "flex-1 px-3 py-2 text-sm rounded-lg",
                    isDark
                      ? "bg-dark-bg-tertiary border border-dark-border-primary text-dark-text-secondary"
                      : "bg-gray-50 border border-gray-200 text-gray-600"
                  )}
                />
                <button
                  onClick={handleCopyInviteLink}
                  className={cn(
                    "px-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-opacity",
                    isDark ? "bg-gradient-to-r from-dark-accent-primary to-dark-accent-secondary" : "bg-gradient-to-r from-candy-pink to-candy-purple"
                  )}
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className={cn(
              "rounded-xl p-4",
              isDark ? "bg-dark-bg-tertiary" : "bg-gray-50"
            )}>
              <p className={cn(
                "text-sm",
                isDark ? "text-dark-text-secondary" : "text-gray-500"
              )}>
                链接有效期：永久
              </p>
              <p className={cn(
                "text-sm mt-1",
                isDark ? "text-dark-text-secondary" : "text-gray-500"
              )}>
                最多可邀请：{20 - (capsule.groupMembers?.length || 1)} 人
              </p>
            </div>
          </div>
        </div>
      )}

      <SharePosterModal
        isOpen={showPosterModal}
        onClose={() => setShowPosterModal(false)}
        capsule={capsule}
        isDark={isDark}
      />
    </div>
  );
}

function ActionButton({ 
  icon, 
  count, 
  onClick, 
  isDark 
}: { 
  icon: React.ReactNode; 
  count: number; 
  onClick: () => void; 
  isDark: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95",
        isDark
          ? "bg-dark-bg-secondary border border-dark-border-primary hover:border-dark-accent-secondary"
          : "bg-white border border-[#e0d6f0] hover:border-candy-pink"
      )}
    >
      {icon}
      <span className={cn(
        "font-medium",
        isDark ? "text-dark-text-primary" : "text-[#5a4b7a]"
      )}>{count}</span>
    </button>
  );
}
