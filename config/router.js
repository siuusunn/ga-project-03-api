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

// edit & delete a comment
// will probably simplify this route to be more like the below
// (don't need to have post id when deleting a comment)
Router.route('/posts/:id/comments/:commentId')
  .put(secureRoute, commentsController.updateComment)
  .delete(secureRoute, commentsController.deleteComment);

// Adding comment to a comment, pass the Comment model and comment id as arguments
Router.route('/comments/:commentId').post(secureRoute, (req, res, next) => {
  const id = req.params.commentId;
  return commentsController.createComment(req, res, next, PostModels.Comment, id);
});

// Adding comment to a post, pass the Post model & post id as arguments
Router.route('/posts/:id/comments').post(secureRoute, (req, res, next) => {
  const id = req.params.id;
  commentsController.createComment(req, res, next, PostModels.Post, id);
});

Router.route('/users').get(usersController.getAllUsers);

Router.route('/users/:id').get(usersController.getSingleUser);

Router.route('/register').post(usersController.registerUser);

Router.route('/login').post(usersController.loginUser);

export default Router;
