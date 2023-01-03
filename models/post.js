import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  text: { type: String, required: true, min: 1, max: 500 },
  addedBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  timestamp: { type: String },
  likes: { type: Number },
  dislikes: { type: Number },
});

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true, min: 1, max: 500 },
  addedBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  timestamp: { type: String },
  likes: { type: Number },
  dislikes: { type: Number },
  replies: [replySchema]
});

const postSchema = new mongoose.Schema({
  text: { type: String, required: true, min: 1, max: 1000 },
  addedBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  timestamp: { type: String },
  likes: { type: Number },
  dislikes: { type: Number },
  comments: [commentSchema]
});

export default mongoose.model('Post', postSchema);
