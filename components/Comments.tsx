
import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Send, User, MessageSquare } from 'lucide-react';
import { ArticleComment } from '../types';
import { cmsService } from '../services/cmsService';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

interface CommentsProps {
  postId: string;
}

const Comments: React.FC<CommentsProps> = ({ postId }) => {
  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const fetched = await cmsService.getComments(postId);
        const arr = Array.isArray(fetched) ? fetched : [];
        const sorted = arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setComments(sorted);
      } catch (err) {
        console.error('Error fetching comments', err);
      }
    };
    fetchComments();
  }, [postId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !authorName.trim()) return;

    setIsSubmitting(true);
    try {
      const added = cmsService.addComment(postId, {
        author: authorName,
        content: newComment
      });
      setComments([added, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = (commentId: string, type: 'like' | 'dislike') => {
    cmsService.voteComment(postId, commentId, type);
    setComments(comments.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          likes: type === 'like' ? c.likes + 1 : c.likes,
          dislikes: type === 'dislike' ? c.dislikes + 1 : c.dislikes
        };
      }
      return c;
    }));
  };

  return (
    <div className="space-y-12 pt-12 border-t border-gray-100">
      <div className="flex items-center gap-3">
        <div className="bg-primary p-2 rounded-lg">
          <MessageSquare className="text-white" size={20} />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tight">Discussion ({comments.length})</h2>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="bg-gray-50 p-8 rounded-[2rem] space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Your Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Enter your name"
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-gray-100 focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
                required
              />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Your Comment</label>
          <textarea 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="What are your thoughts on this story?"
            className="w-full p-6 rounded-2xl bg-white border border-gray-100 focus:ring-2 focus:ring-primary outline-none transition-all font-medium min-h-[120px] resize-none"
            required
          />
        </div>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="btn-primary flex items-center gap-2 group"
        >
          Post Comment <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-8">
        <AnimatePresence>
          {comments.map((comment) => (
            <motion.div 
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-6 p-6 bg-white rounded-3xl border border-gray-50 shadow-sm"
            >
              <div className="shrink-0">
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author)}&background=random&color=fff&bold=true&rounded=true`} 
                  alt={comment.author}
                  className="w-12 h-12 rounded-2xl shadow-sm border border-gray-100"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-grow space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-slate-900">{comment.author}</h4>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {formatDistanceToNow(new Date(comment.createdAt))} ago
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {comment.content}
                </p>
                <div className="flex items-center gap-6 pt-2">
                  <button 
                    onClick={() => handleVote(comment.id, 'like')}
                    className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors group"
                  >
                    <ThumbsUp size={16} className="group-hover:-translate-y-0.5 transition-transform" />
                    <span className="text-xs font-black">{comment.likes}</span>
                  </button>
                  <button 
                    onClick={() => handleVote(comment.id, 'dislike')}
                    className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors group"
                  >
                    <ThumbsDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
                    <span className="text-xs font-black">{comment.dislikes}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {comments.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No comments yet. Be the first to join the conversation!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;
