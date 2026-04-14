import { useState } from 'react';
import { Comment as CommentType, User } from '../types';
import { Send, User as UserIcon } from 'lucide-react';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && currentUser) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
        <span className="w-1 h-5 bg-gradient-to-b from-pink-400 to-purple-500 rounded-full" />
        评论 ({comments.length})
      </h3>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center shrink-0">
          <UserIcon className="w-5 h-5 text-purple-600" />
        </div>
        <div className="flex-1 flex gap-2">
          <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="写下你的评论..."
          className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all"
        />
          <button
          type="submit"
          disabled={!newComment.trim() || !currentUser}
          className="px-4 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform"
        >
          <Send className="w-4 h-4" />
        </button>
        </div>
      </form>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
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
    <div className="flex gap-3 p-4 bg-gray-50 rounded-2xl">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center shrink-0">
        <UserIcon className="w-5 h-5 text-pink-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium text-gray-800">{comment.nickname}</span>
          <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">{comment.content}</p>
      </div>
    </div>
  );
}
