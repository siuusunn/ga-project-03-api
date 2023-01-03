import mongoose from 'mongoose';
import Post from '../models/post.js';

async function createComment(req, res, next) {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res
        .status(404)
        .send({ message: `Couldn't find post with id ${req.params.id}` });
    }

    const newComment = {
      ...req.body,
      addedBy: req.currentUser._id
    };

    post.comments.push(newComment);

    const updatedPost = await post.save();

    return res.status(201).json(updatedPost);
  } catch (error) {
    next(error);
  }
}

async function updateComment(req, res, next) {}

async function deleteComment(req, res, next) {}

export default { createComment, updateComment, deleteComment };
