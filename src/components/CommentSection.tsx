import { useState } from 'react';
import { Comment as CommentType, User } from '../types';
import { Send, User as UserIcon, Smile } from 'lucide-react';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && currentUser) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  const addEmoji = (emoji: string) => {
    setNewComment(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const commonEmojis = ['😊', '😂', '❤️', '👍', '🎉', '✨', '🌟', '🔥'];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-[#5a4b7a] flex items-center gap-2">
        <span className="w-1 h-5 bg-gradient-to-b from-[#c8b6e2] to-[#a093c2] rounded-full" />
        评论 ({comments.length})
      </h3>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#e8dff5] to-[#d8f0e3] flex items-center justify-center shrink-0">
          <UserIcon className="w-5 h-5 text-[#8a7ab5]" />
        </div>
        <div className="flex-1">
          <div className="relative mb-2">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="写下你的评论..."
              rows={2}
              className="w-full bg-[#f5f3f7] border border-[#e0d6f0] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#c8b6e2] focus:border-[#c8b6e2] transition-all resize-none"
            />
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute top-3 right-3 p-1 text-[#a093c2] hover:text-[#8a7ab5] transition-colors"
            >
              <Smile className="w-4 h-4" />
            </button>
            
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
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!newComment.trim() || !currentUser}
              className="px-5 py-2 bg-gradient-to-br from-[#e8dff5] to-[#d8f0e3] text-[#5a4b7a] rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform"
            >
              发送
            </button>
          </div>
        </div>
      </form>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-[#a093c2]">
            <p>还没有评论，快来抢沙发吧！</p>
          </div>
        ) : (
          comments.map((comment) => (
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
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#e8dff5] to-[#d8f0e3] flex items-center justify-center shrink-0">
        <UserIcon className="w-5 h-5 text-[#8a7ab5]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium text-[#5a4b7a]">{comment.nickname}</span>
          <span className="text-xs text-[#a093c2]">{formatDate(comment.createdAt)}</span>
        </div>
        <p className="text-[#5a4b7a] text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>
      </div>
    </div>
  );
}
