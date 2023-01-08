import { PostModels } from '../models/post.js';

async function createComment(req, res, next, parentType, parentId) {
  try {
    const newComment = {
      ...req.body,
      addedBy: req.currentUser._id
    };

    if (parentType === PostModels.Comment) {
      newComment.parentCommentId = parentId;
    }
    if (parentType === PostModels.Post) {
      newComment.parentPostId = parentId;
    }

    const { _id } = await PostModels.Comment.create(newComment);

    const parent = await parentType.findById(parentId);
    if (!parent) {
      return res
        .status(404)
        .send({ message: `Parent with id ${parentId} not found` });
    }

    parent.comments.push(_id);

    // await User.findOneAndUpdate(
    //   { _id: req.currentUser._id },
    //   { $push: { comments: _id._id } }
    // );

    const savedParent = await parent.save();

    return res.status(201).json(savedParent);
  } catch (error) {
    next(error);
  }
}

async function getComment(req, res, next) {
  try {
    const comment = await PostModels.Post.findById(req.params.id);
    return comment
      ? res.status(200).json(comment)
      : res
          .status(404)
          .json({ message: `No comment with id ${req.params.id}` });
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
    const comment = await PostModels.Comment.findById(req.params.commentId);

    if (!comment) {
      return res
        .status(404)
        .send({ message: `No comment found with id ${req.params.commentId}` });
    }
    if (
      !comment.addedBy.equals(req.currentUser._id) ||
      !req.currentUser.isAdmin
    ) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    let parent;
    // if (comment.parentPostId) {
    //   parent = await PostModels.Post.findById(comment.parentPostId);
    // }
    if (comment.parentCommentId) {
      parent = await PostModels.Comment.findById(comment.parentCommentId);
      parent.deletedComments.push(req.params.commentId);
    }

    // if (!parent) {
    //   return res
    //     .status(404)
    //     .send({ message: `Couldn't find the parent of this post` });
    // }

    // const commentIndexToRemove = parent.comments.indexOf(
    //   (objectId) => objectId === req.params.commentId
    // );
    // console.log(commentIndexToRemove);

    // parent.comments.splice(commentIndexToRemove, 1);
    // const savedParent = await parent.save();

    const updatedComment = await comment.updateOne({
      $set: {
        text: '',
        isDeleted: true
      },
      $unset: {
        addedBy: ''
      }
    });

    return res.status(201).json(updatedComment);
  } catch (error) {
    next(error);
  }
}

export default { createComment, updateComment, deleteComment, getComment };
