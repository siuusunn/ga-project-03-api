import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true, min: 1, max: 500 },
  addedBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  timestamp: { type: String },
  likes: { type: Number, min: 0, default: 0 },
  dislikes: { type: Number, min: 0, default: 0 }
});

commentSchema.add({ comments: [commentSchema] });

const postSchema = new mongoose.Schema({
  text: { type: String, required: true, min: 1, max: 1000 },
  addedBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  timestamp: { type: String },
  likes: { type: Number, min: 0, default: 0 },
  dislikes: { type: Number, min: 0, default: 0 },
  comments: [commentSchema]
});

export default mongoose.model('Post', postSchema);
