import express from 'express';
import commentsController from '../controllers/commentsController.js';
import postsController from '../controllers/postsController.js';

const Router= express.Router();

Router.route('/posts')
  .get(postsController.getAllPosts)
  .post(postsController.createNewPost);

Router.route('/posts/:id')
  .get(postsController.getSinglePost)
  .put(postsController.updateSinglePost)
  .delete(postsController.deleteSinglePost);



Router.route('/posts/:id/comments')
.post(commentsController.createComment)


Router.route('/posts/:id/comments/:commentId')
.put(commentsController.updateComment)
.delete(commentsController.deleteComment);


Router.route('/register').post(userController.registerUser);



Router.route('/login').post(userController.loginUser);

export default Router;