import { PostModels } from '../models/post.js';

const getAllPosts = async (_res, res, next) => {
  try {
    const posts = await PostModels.Post.find();
    return res.status(200).json(posts);
  } catch (e) {
    next(e);
  }
};
const createNewPost = async (req, res, next) => {
  try {
    const post = await PostModels.Post.create({
      ...req.body,
      addedBy: req.currentUser._id
    });
    return res.status(201).json(post);
  } catch (e) {
    next(e);
  }
};

const getSinglePost = async (req, res, next) => {
  try {
    const post = await PostModels.Post.findById(req.params.id).populate([
      // this performs a deep populate of comments and their addedBy usernames
      // down to a certain depth
      { path: 'addedBy' },
      {
        path: 'comments',
        populate: [
          { path: 'addedBy' },
          {
            path: 'comments',
            populate: [
              { path: 'addedBy' },
              {
                path: 'comments',
                populate: [
                  { path: 'addedBy' },
                  {
                    path: 'comments',
                    populate: {
                      path: 'comments'
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ]);
    return post
      ? res.status(200).json(post)
      : res.status(404).json({ message: `No post with id ${req.params.id}` });
  } catch (e) {
    next(e);
  }
};

const updateSinglePost = async (req, res, next) => {
  try {
    const post = await PostModels.Post.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    post.set(req.body);
    const updatedPost = await post.save();
    return res.status(200).json(updatedPost);
  } catch (e) {
    next(e);
  }
};

const deleteSinglePost = async (req, res, next) => {
  try {
    const post = await PostModels.Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send({ message: 'No post found' });
    }
    if (req.currentUser._id.equals(post.addedBy) || req.currentUser.isAdmin) {
      await Post.findByIdAndDelete(req.params.id);
      return res.status(200).json({ message: 'Sucessfully deleted' });
    }

    return res.status(301).json({ message: 'Unauthorized' });
  } catch (e) {
    next(e);
  }
};

export default {
  getAllPosts,
  createNewPost,
  getSinglePost,
  updateSinglePost,
  deleteSinglePost
};
