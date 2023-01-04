import express from 'express';
import commentsController from '../controllers/commentsController.js';
import postsController from '../controllers/postsController.js';
import usersController from '../controllers/usersController.js';

import secureRoute from '../middleware/secureRoute.js';

const Router = express.Router();

Router.route('/posts')
  .get(postsController.getAllPosts)
  .post(secureRoute, postsController.createNewPost);

Router.route('/posts/:id')
  .get(postsController.getSinglePost)
  .put(secureRoute, postsController.updateSinglePost)
  .delete(secureRoute, postsController.deleteSinglePost);

Router.route('/posts/:id/comments').post(
  secureRoute,
  commentsController.createComment
);

Router.route('/posts/:id/comments/:commentId')
  .post(secureRoute, commentsController.createComment)
  .put(secureRoute, commentsController.updateComment)
  .delete(secureRoute, commentsController.deleteComment);

Router.route('/register').post(usersController.registerUser);

Router.route('/login').post(usersController.loginUser);

export default Router;
