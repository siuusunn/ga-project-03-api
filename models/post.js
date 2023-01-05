import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true, min: 1, max: 500 },
  addedBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  timestamp: { type: String },
  likes: { type: Number, min: 0, default: 0 },
  dislikes: { type: Number, min: 0, default: 0 },
  parentPostId: { type: mongoose.Schema.ObjectId, ref: 'Post' },
  parentCommentId: { type: mongoose.Schema.ObjectId, ref: 'Comment' },
  comments: [{ type: mongoose.Schema.ObjectId, ref: 'Comment' }],
  deletedComments: [{ type: mongoose.Schema.ObjectId }],
  isDeleted: { type: Boolean, default: false }
});

const postSchema = new mongoose.Schema(
  {
    topic: { type: String, required: true, min: 1, max: 200 },
    content: { type: String, required: true, min: 1, max: 1000 },
    addedBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    likes: { type: Number, min: 0, default: 0 },
    dislikes: { type: Number, min: 0, default: 0 },
    comments: [{ type: mongoose.Schema.ObjectId, ref: 'Comment' }]
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);
const Comment = mongoose.model('Comment', commentSchema);

export const PostModels = { Post, Comment };
