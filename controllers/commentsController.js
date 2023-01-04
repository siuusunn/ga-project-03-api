import { PostModels } from '../models/post.js';

async function createComment(req, res, next, parentType, parentId) {
  try {
    const newComment = {
      ...req.body,
      addedBy: req.currentUser._id
    };

    const { _id } = await PostModels.Comment.create(newComment);

    const parent = await parentType.findById(parentId);
    if (!parent) {
      return res
        .status(404)
        .send({ message: `Parent with id ${parentId} not found` });
    }

    parent.comments.push(_id);

    const savedParent = await parent.save();

    return res.status(201).json(savedParent);
  } catch (error) {
    next(error);
  }
}

async function updateComment(req, res, next) {
  try {
    const post = await PostModels.Post.findById(req.params.id);

    if (!post) {
      return res
        .status(404)
        .send({ message: `No post found with id ${req.params.id}` });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).send({ message: 'No comment found' });
    }

    if (!comment.addedBy.equals(req.currentUser._id)) {
      return res.status(301).send({
        message: 'Unauthorized: can not update other users comment'
      });
    }

    comment.set(req.body);

    const savedPost = await post.save();

    return res.status(200).json(savedPost);
  } catch (error) {
    next(error);
  }
}

async function deleteComment(req, res, next) {
  try {
    const post = await PostModels.Post.findById(req.params.id);

    if (!post) {
      return res
        .status(404)
        .send({ message: `No post found with id ${req.params.id}` });
    }

    const comment = post.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).send({ message: 'Comment  not found' });
    }
    if (
      !comment.addedBy.equals(req.currentUser._id) ||
      !req.currentUser.isAdmin
    ) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    comment.remove();

    const savedPost = await post.save();

    return res.status(200).json(savedPost);
  } catch (error) {
    next(error);
  }
}

export default { createComment, updateComment, deleteComment };
