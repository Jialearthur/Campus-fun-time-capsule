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
}

export default function CommentSection({ comments, currentUser, onAddComment }: CommentSectionProps) {
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
      <h3 className="text-lg font-bold text-[#5a4b7a] flex items-center gap-2">
        <Clock className="w-5 h-5 text-candy-teal" />
        时光留言 ({comments.length})
      </h3>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-candy-teal/20 to-candy-blue/20 flex items-center justify-center shrink-0">
          <UserIcon className="w-5 h-5 text-candy-teal" />
        </div>
        <div className="flex-1">
          <div className="relative mb-2">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value.slice(0, 200))}
              placeholder="写下你的时光留言..."
              rows={2}
              className="w-full bg-[#f5f3f7] border border-[#e0d6f0] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-candy-teal focus:border-candy-teal transition-all resize-none"
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <span className="text-xs text-[#a093c2]">{newComment.length}/200</span>
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-1 text-[#a093c2] hover:text-candy-teal transition-colors"
              >
                <Smile className="w-4 h-4" />
              </button>
            </div>
            
            {showEmojiPicker && (
              <div className="absolute top-full right-0 mt-2 bg-white border border-[#e0d6f0] rounded-xl p-3 shadow-lg z-10">
                <div className="flex gap-2">
                  {commonEmojis.map((emoji, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => addEmoji(emoji)}
                      className="text-xl p-1 hover:bg-[#f5f3f7] rounded-full transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-[#8a7ab5] cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 text-candy-teal focus:ring-candy-teal"
              />
              匿名留言
            </label>
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-5 py-2 bg-gradient-to-br from-candy-teal/20 to-candy-blue/20 text-candy-teal rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform"
            >
              发送
            </button>
          </div>
        </div>
      </form>

      <div className="space-y-4">
        {sortedComments.length === 0 ? (
          <div className="text-center py-8 text-[#a093c2]">
            <p>还没有时光留言，快来留下你的痕迹吧！</p>
          </div>
        ) : (
          sortedComments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
}

function CommentItem({ comment }: { comment: CommentType }) {
  return (
    <div className="flex gap-3 p-4 bg-[#f5f3f7] rounded-2xl border border-[#e0d6f0] animate-fade-in">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-candy-teal/20 to-candy-blue/20 flex items-center justify-center shrink-0">
        <UserIcon className="w-5 h-5 text-candy-teal" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium text-[#5a4b7a]">{comment.nickname === '匿名时光访客' ? '匿名时光访客' : comment.nickname}</span>
          <div className="flex items-center gap-1 text-xs text-[#a093c2]">
            <Clock className="w-3 h-3" />
            {formatDate(comment.createdAt)}
          </div>
        </div>
        <p className="text-[#5a4b7a] text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>
      </div>
    </div>
  );
}
