import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCapsuleStore } from '../store/useCapsuleStore';
import { ArrowLeft, MessageCircle, Share2, MessageSquare, RefreshCw, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useTheme } from '../hooks/useTheme';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export default function DriftBottle() {
  const navigate = useNavigate();
  const { 
    currentUser, 
    getDriftBottle, 
    throwDriftBottle, 
    addComment, 
    addNotification,
    resetDriftBottleReceives
  } = useCapsuleStore();
  const { isDark } = useTheme();
  
  const [currentBottle, setCurrentBottle] = useState<any>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [receiveCount, setReceiveCount] = useState(0);
  
  // 重置漂流瓶接收次数（用于测试）
  useEffect(() => {
    resetDriftBottleReceives();
  }, [resetDriftBottleReceives]);

  const handleGetBottle = () => {
    if (!currentUser) return;
    
    const bottle = getDriftBottle(currentUser.id);
    if (bottle) {
      setCurrentBottle(bottle);
      setShowMessage(false);
      setMessage('');
      // 解锁成就：查看10个漂流瓶
      // 这里简化处理，实际应该在store中检查并解锁
    } else {
      alert('今日漂流瓶已用完或暂无漂流瓶');
    }
  };

  const handleThrowBottle = () => {
    if (!currentBottle) return;
    throwDriftBottle(currentBottle.id);
    setCurrentBottle(null);
    addNotification({
      title: '漂流瓶已抛出',
      message: '你的漂流瓶已经重新回到大海中',
      type: 'system'
    });
  };

  const handleSendMessage = () => {
    if (!currentUser || !message.trim() || !currentBottle) return;
    
    addComment(currentBottle.id, {
      userId: currentUser.id,
      nickname: currentUser.nickname,
      content: message
    });
    
    setMessage('');
    setShowMessage(false);
    addNotification({
      title: '留言成功',
      message: '你的留言已成功发送',
      type: 'system'
    });
  };

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
          )}>时光漂流瓶</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-6">
        <div className="mb-8 text-center">
          <MessageSquare className={cn(
            "w-16 h-16 mx-auto mb-4",
            isDark ? "text-dark-accent-secondary" : "text-candy-blue"
          )} />
          <h2 className={cn(
            "font-bold text-xl mb-2",
            isDark ? "text-dark-text-primary" : "text-[#5a4b7a]"
          )}>时光漂流瓶</h2>
          <p className={cn(
            "text-sm mb-4",
            isDark ? "text-dark-text-secondary" : "text-[#a093c2]"
          )}>
            每一个漂流瓶都承载着一段校园回忆，快来开启你的奇遇吧
          </p>
          <p className={cn(
            "text-xs",
            isDark ? "text-dark-text-tertiary" : "text-[#a093c2]"
          )}>
            每日最多可接收5个漂流瓶，抛出数量不限
          </p>
        </div>

        {!currentBottle ? (
          <div className={cn(
            "text-center py-12 rounded-2xl border",
            isDark
              ? "bg-dark-bg-secondary border-dark-border-primary"
              : "bg-gradient-to-r from-candy-blue/10 to-candy-teal/10 border border-candy-blue/20"
          )}>
            <MessageSquare className={cn(
              "w-20 h-20 mx-auto mb-4",
              isDark ? "text-dark-text-tertiary" : "text-candy-blue/40"
            )} />
            <p className={cn(
              "mb-6",
              isDark ? "text-dark-text-secondary" : "text-[#a093c2]"
            )}>还没有漂流瓶</p>
            <button 
              onClick={handleGetBottle}
              className={cn(
                "px-12 py-5 text-white rounded-2xl font-bold text-xl shadow-xl shadow-indigo-500/30 hover:opacity-90 transition-all active:scale-95",
                isDark ? "bg-gradient-to-r from-dark-accent-primary to-dark-accent-secondary" : "bg-gradient-to-r from-[#4F46E5] to-[#06B6D4]"
              )}
            >
              捞一个漂流瓶 🎣
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className={cn(
              "rounded-2xl p-6 border shadow-sm",
              isDark
                ? "bg-dark-bg-secondary border-dark-border-primary"
                : "bg-white border-[#e0d6f0]"
            )}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className={cn(
                    "w-5 h-5",
                    isDark ? "text-dark-accent-secondary" : "text-candy-blue"
                  )} />
                  <span className={cn(
                    "font-medium",
                    isDark ? "text-dark-text-primary" : "text-[#5a4b7a]"
                  )}>漂流瓶</span>
                </div>
                <span className={cn(
                  "text-xs px-2 py-1 rounded-full",
                  isDark
                    ? "bg-dark-accent-secondary/20 text-dark-accent-secondary"
                    : "bg-candy-yellow/20 text-candy-yellow"
                )}>
                  来自陌生人的回忆
                </span>
              </div>
              
              <div className="mb-4">
                <p className={cn(
                  "leading-relaxed whitespace-pre-wrap",
                  isDark ? "text-dark-text-secondary" : "text-[#5a4b7a]"
                )}>
                  {currentBottle.content}
                </p>
              </div>
              
              {currentBottle.images && currentBottle.images.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {currentBottle.images.map((img: string, idx: number) => (
                    <div key={idx} className="aspect-square overflow-hidden rounded-lg">
                      <img src={img} alt={`漂流瓶图片 ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
              
              <div className={cn(
                "flex items-center justify-between pt-4 border-t",
                isDark ? "border-dark-border-primary" : "border-[#e0d6f0]"
              )}>
                <button
                  onClick={() => setShowMessage(true)}
                  className={cn(
                    "flex items-center gap-2 transition-colors",
                    isDark
                      ? "text-dark-text-secondary hover:text-dark-accent-secondary"
                      : "text-[#8a7ab5] hover:text-candy-pink"
                  )}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">留言</span>
                </button>
                <button
                  onClick={handleThrowBottle}
                  className={cn(
                    "flex items-center gap-2 transition-colors",
                    isDark
                      ? "text-dark-text-secondary hover:text-dark-accent-secondary"
                      : "text-[#8a7ab5] hover:text-candy-blue"
                  )}
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="text-sm">重新抛出</span>
                </button>
              </div>
            </div>

            {showMessage && (
              <div className={cn(
                "rounded-2xl p-4 border",
                isDark
                  ? "bg-dark-bg-secondary border-dark-border-primary"
                  : "bg-white border-[#e0d6f0]"
              )}>
                <h3 className={cn(
                  "font-medium mb-3",
                  isDark ? "text-dark-text-primary" : "text-[#5a4b7a]"
                )}>给陌生人留言</h3>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="写下你想对陌生人说的话..."
                  className={cn(
                    "w-full p-3 border rounded-xl min-h-[100px] mb-3 focus:outline-none focus:ring-2 focus:border-transparent transition-all",
                    isDark
                      ? "bg-dark-bg-tertiary border-dark-border-primary focus:ring-dark-accent-secondary"
                      : "border-[#e0d6f0] focus:ring-candy-pink focus:border-candy-pink"
                  )}
                />
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => setShowMessage(false)}
                    className={cn(
                      "px-4 py-2 transition-colors",
                      isDark
                        ? "text-dark-text-secondary hover:text-dark-text-primary"
                        : "text-[#8a7ab5] hover:text-[#5a4b7a]"
                    )}
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className={cn(
                      "px-6 py-2 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed",
                      isDark ? "bg-gradient-to-r from-dark-accent-primary to-dark-accent-secondary" : "bg-gradient-to-r from-candy-pink to-candy-purple"
                    )}
                  >
                    发送
                  </button>
                </div>
              </div>
            )}

            <button 
              onClick={handleGetBottle}
              className={cn(
                "w-full py-5 text-white rounded-2xl font-bold text-xl shadow-xl shadow-indigo-500/30 hover:opacity-90 transition-all active:scale-95",
                isDark ? "bg-gradient-to-r from-dark-accent-primary to-dark-accent-secondary" : "bg-gradient-to-r from-[#4F46E5] to-[#06B6D4]"
              )}
            >
              再捞一个漂流瓶 🎣
            </button>
          </div>
        )}

        <div className={cn(
          "rounded-2xl p-4 border mt-8",
          isDark
            ? "bg-dark-bg-secondary border-dark-border-primary"
            : "bg-gradient-to-r from-candy-blue/10 to-candy-teal/10 border border-candy-blue/20"
        )}>
          <h3 className={cn(
            "font-medium mb-2 flex items-center gap-2",
            isDark ? "text-dark-text-primary" : "text-[#5a4b7a]"
          )}>
            <MessageSquare className={cn(
              "w-4 h-4",
              isDark ? "text-dark-accent-secondary" : "text-candy-blue"
            )} />
            漂流瓶规则
          </h3>
          <ul className={cn(
            "text-sm space-y-1",
            isDark ? "text-dark-text-secondary" : "text-[#a093c2]"
          )}>
            <li>• 只有公开胶囊可以设置为漂流瓶</li>
            <li>• 每日最多可接收5个漂流瓶</li>
            <li>• 收到的漂流瓶可以留言或重新抛出</li>
            <li>• 漂流瓶内容可能来自不同时期的校园回忆</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
