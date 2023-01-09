import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, min: 1, max: 500 },
    addedBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    timestamp: { type: String },
    likes: { type: Number, min: 0, default: 0 },
    dislikes: { type: Number, min: 0, default: 0 },
    parentPostId: { type: mongoose.Schema.ObjectId, ref: 'Post' },
    ancestorPostId: { type: mongoose.Schema.ObjectId, ref: 'Post' },
    parentCommentId: { type: mongoose.Schema.ObjectId, ref: 'Comment' },
    replyThreadDepth: { type: Number },
    comments: [{ type: mongoose.Schema.ObjectId, ref: 'Comment' }],
    deletedComments: [{ type: mongoose.Schema.ObjectId }],
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    topic: { type: String, required: true, min: 1, max: 200 },
    originalTopic: { type: String, min: 1, max: 200 },
    content: { type: String, required: true, min: 1, max: 1000 },
    originalContent: { type: String, min: 1, max: 1000 },
    addedBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    likes: { type: Number, min: 0, default: 0 },
    dislikes: { type: Number, min: 0, default: 0 },
    isEdited: { type: Boolean, default: false },
    comments: [{ type: mongoose.Schema.ObjectId, ref: 'Comment' }],
    replyThreadDepth: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);
const Comment = mongoose.model('Comment', commentSchema);

export const PostModels = { Post, Comment };
