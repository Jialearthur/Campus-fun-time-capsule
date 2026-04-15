import { useState } from 'react';
import { Comment as CommentType, User } from '../types';
import { Send, User as UserIcon, Smile, Clock } from 'lucide-react';
import { formatDate } from '../utils/date';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

interface CommentSectionProps {
  comments: CommentType[];
  currentUser: User | null;
  onAddComment: (content: string) => void;
  isDark?: boolean;
}

export default function CommentSection({ comments, currentUser, onAddComment, isDark = false }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  const addEmoji = (emoji: string) => {
    if (newComment.length + emoji.length <= 200) {
      setNewComment(prev => prev + emoji);
    }
    setShowEmojiPicker(false);
  };

  const commonEmojis = ['😊', '😂', '❤️', '👍', '🎉', '✨', '🌟', '🔥'];

  // 按时间倒序排列留言
  const sortedComments = [...comments].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-6">
      <h3 className={cn(
        "text-lg font-bold flex items-center gap-2",
        isDark ? "text-dark-text-primary" : "text-[#5a4b7a]"
      )}>
        <Clock className={cn(
          "w-5 h-5",
          isDark ? "text-dark-accent-secondary" : "text-candy-teal"
        )} />
        时光留言 ({comments.length})
      </h3>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
          isDark ? "bg-dark-bg-secondary" : "bg-gradient-to-br from-candy-teal/20 to-candy-blue/20"
        )}>
          <UserIcon className={cn(
            "w-5 h-5",
            isDark ? "text-dark-accent-secondary" : "text-candy-teal"
          )} />
        </div>
        <div className="flex-1">
          <div className="relative mb-2">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value.slice(0, 200))}
              placeholder="写下你的时光留言..."
              rows={2}
              className={cn(
                "w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none",
                isDark
                  ? "bg-dark-bg-secondary border-dark-border-primary focus:ring-dark-accent-secondary"
                  : "bg-[#f5f3f7] border-[#e0d6f0] focus:ring-candy-teal focus:border-candy-teal"
              )}
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <span className={cn(
                "text-xs",
                isDark ? "text-dark-text-tertiary" : "text-[#a093c2]"
              )}>{newComment.length}/200</span>
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={cn(
                  "p-1 transition-colors",
                  isDark ? "text-dark-text-tertiary hover:text-dark-accent-secondary" : "text-[#a093c2] hover:text-candy-teal"
                )}
              >
                <Smile className="w-4 h-4" />
              </button>
            </div>
            
            {showEmojiPicker && (
              <div className={cn(
                "absolute top-full right-0 mt-2 border rounded-xl p-3 shadow-lg z-10",
                isDark ? "bg-dark-bg-secondary border-dark-border-primary" : "bg-white border-[#e0d6f0]"
              )}>
                <div className="flex gap-2">
                  {commonEmojis.map((emoji, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => addEmoji(emoji)}
                      className={cn(
                        "text-xl p-1 rounded-full transition-colors",
                        isDark ? "hover:bg-dark-bg-tertiary" : "hover:bg-[#f5f3f7]"
                      )}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <label className={cn(
              "flex items-center gap-2 text-sm cursor-pointer",
              isDark ? "text-dark-text-secondary" : "text-[#8a7ab5]"
            )}>
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className={cn(
                  "w-4 h-4 focus:ring-2",
                  isDark ? "text-dark-accent-secondary focus:ring-dark-accent-secondary" : "text-candy-teal focus:ring-candy-teal"
                )}
              />
              匿名留言
            </label>
            <button
              type="submit"
              disabled={!newComment.trim()}
              className={cn(
                "px-5 py-2 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform",
                isDark
                  ? "bg-dark-bg-tertiary text-dark-accent-secondary hover:bg-dark-bg-tertiary"
                  : "bg-gradient-to-br from-candy-teal/20 to-candy-blue/20 text-candy-teal"
              )}
            >
              发送
            </button>
          </div>
        </div>
      </form>

      <div className="space-y-4">
        {sortedComments.length === 0 ? (
          <div className={cn(
            "text-center py-8",
            isDark ? "text-dark-text-tertiary" : "text-[#a093c2]"
          )}>
            <p>还没有时光留言，快来留下你的痕迹吧！</p>
          </div>
        ) : (
          sortedComments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} isDark={isDark} />
          ))
        )}
      </div>
    </div>
  );
}

function CommentItem({ comment, isDark = false }: { comment: CommentType; isDark?: boolean }) {
  return (
    <div className={cn(
      "flex gap-3 p-4 rounded-2xl border animate-fade-in",
      isDark ? "bg-dark-bg-secondary border-dark-border-primary" : "bg-[#f5f3f7] border-[#e0d6f0]"
    )}>
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
        isDark ? "bg-dark-bg-tertiary" : "bg-gradient-to-br from-candy-teal/20 to-candy-blue/20"
      )}>
        <UserIcon className={cn(
          "w-5 h-5",
          isDark ? "text-dark-accent-secondary" : "text-candy-teal"
        )} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className={cn(
            "font-medium",
            isDark ? "text-dark-text-primary" : "text-[#5a4b7a]"
          )}>{comment.nickname === '匿名时光访客' ? '匿名时光访客' : comment.nickname}</span>
          <div className={cn(
            "flex items-center gap-1 text-xs",
            isDark ? "text-dark-text-tertiary" : "text-[#a093c2]"
          )}>
            <Clock className="w-3 h-3" />
            {formatDate(comment.createdAt)}
          </div>
        </div>
        <p className={cn(
          "text-sm leading-relaxed whitespace-pre-wrap",
          isDark ? "text-dark-text-secondary" : "text-[#5a4b7a]"
        )}>{comment.content}</p>
      </div>
    </div>
  );
}
