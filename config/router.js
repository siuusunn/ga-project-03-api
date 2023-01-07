import express from 'express';
import commentsController from '../controllers/commentsController.js';
import postsController from '../controllers/postsController.js';
import usersController from '../controllers/usersController.js';
import { PostModels } from '../models/post.js';

import secureRoute from '../middleware/secureRoute.js';

const Router = express.Router();

Router.route('/posts')
  .get(postsController.getAllPosts)
  .post(secureRoute, postsController.createNewPost);

Router.route('/posts/:id')
  .get(postsController.getSinglePost)
  .put(secureRoute, postsController.updateSinglePost)
  .delete(secureRoute, postsController.deleteSinglePost);

// Adding comment to a comment, pass the Comment model and comment id as arguments
Router.route('/comments/:commentId')
  .get(commentsController.getComment)
  .post(secureRoute, (req, res, next) => {
    return commentsController.createComment(
      req,
      res,
      next,
      PostModels.Comment,
      req.params.commentId
    );
  })
  .put(secureRoute, commentsController.updateComment)
  .delete(secureRoute, commentsController.deleteComment);

// Adding comment to a post, pass the Post model & post id as arguments
Router.route('/posts/:id/comments').post(secureRoute, (req, res, next) => {
  commentsController.createComment(
    req,
    res,
    next,
    PostModels.Post,
    req.params.id
  );
});

Router.route('/users').get(usersController.getAllUsers);

Router.route('/users/:id')
  .get(usersController.getSingleUser)
  .put(secureRoute, usersController.editSingleUser);

Router.route('/register').post(usersController.registerUser);

Router.route('/login').post(usersController.loginUser);

export default Router;
