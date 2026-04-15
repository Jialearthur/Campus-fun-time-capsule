import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCapsuleStore } from '../store/useCapsuleStore';
import { ArrowLeft, MessageCircle, Share2, MessageSquare, RefreshCw, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
    addNotification 
  } = useCapsuleStore();
  
  const [currentBottle, setCurrentBottle] = useState<any>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [receiveCount, setReceiveCount] = useState(0);

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
    <div className="min-h-screen bg-gradient-to-b from-[#f9f7f4] via-white to-[#f5f3f7] pb-32">
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-40 border-b border-[#e0d6f0]">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-[#8a7ab5]" />
          </button>
          <h1 className="font-bold text-lg text-[#5a4b7a]">时光漂流瓶</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-6">
        <div className="mb-8 text-center">
          <MessageSquare className="w-16 h-16 text-candy-blue mx-auto mb-4" />
          <h2 className="font-bold text-xl text-[#5a4b7a] mb-2">时光漂流瓶</h2>
          <p className="text-sm text-[#a093c2] mb-4">
            每一个漂流瓶都承载着一段校园回忆，快来开启你的奇遇吧
          </p>
          <p className="text-xs text-[#a093c2]">
            每日最多可接收5个漂流瓶，抛出数量不限
          </p>
        </div>

        {!currentBottle ? (
          <div className="text-center py-12 bg-gradient-to-r from-candy-blue/10 to-candy-teal/10 rounded-2xl border border-candy-blue/20">
            <MessageSquare className="w-20 h-20 text-candy-blue/40 mx-auto mb-4" />
            <p className="text-[#a093c2] mb-6">还没有漂流瓶</p>
            <button 
              onClick={handleGetBottle}
              className="px-8 py-3 bg-gradient-to-r from-candy-blue to-candy-teal text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              捞一个漂流瓶
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-[#e0d6f0] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-candy-blue" />
                  <span className="font-medium text-[#5a4b7a]">漂流瓶</span>
                </div>
                <span className="text-xs bg-candy-yellow/20 text-candy-yellow px-2 py-1 rounded-full">
                  来自陌生人的回忆
                </span>
              </div>
              
              <div className="mb-4">
                <p className="text-[#5a4b7a] leading-relaxed whitespace-pre-wrap">
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
              
              <div className="flex items-center justify-between pt-4 border-t border-[#e0d6f0]">
                <button
                  onClick={() => setShowMessage(true)}
                  className="flex items-center gap-2 text-[#8a7ab5] hover:text-candy-pink transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">留言</span>
                </button>
                <button
                  onClick={handleThrowBottle}
                  className="flex items-center gap-2 text-[#8a7ab5] hover:text-candy-blue transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="text-sm">重新抛出</span>
                </button>
              </div>
            </div>

            {showMessage && (
              <div className="bg-white rounded-2xl p-4 border border-[#e0d6f0]">
                <h3 className="font-medium text-[#5a4b7a] mb-3">给陌生人留言</h3>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="写下你想对陌生人说的话..."
                  className="w-full p-3 border border-[#e0d6f0] rounded-xl min-h-[100px] mb-3 focus:outline-none focus:ring-2 focus:ring-candy-pink focus:border-candy-pink"
                />
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => setShowMessage(false)}
                    className="px-4 py-2 text-[#8a7ab5] hover:text-[#5a4b7a] transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="px-6 py-2 bg-gradient-to-r from-candy-pink to-candy-purple text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    发送
                  </button>
                </div>
              </div>
            )}

            <button 
              onClick={handleGetBottle}
              className="w-full py-3 bg-gradient-to-r from-candy-blue to-candy-teal text-white rounded-2xl font-medium hover:opacity-90 transition-opacity"
            >
              再捞一个漂流瓶
            </button>
          </div>
        )}

        <div className="bg-gradient-to-r from-candy-blue/10 to-candy-teal/10 rounded-2xl p-4 border border-candy-blue/20 mt-8">
          <h3 className="font-medium text-[#5a4b7a] mb-2 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-candy-blue" />
            漂流瓶规则
          </h3>
          <ul className="text-sm text-[#a093c2] space-y-1">
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
