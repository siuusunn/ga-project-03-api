import { PostModels } from '../models/post.js';
import User from '../models/user.js';

const getAllPosts = async (_res, res, next) => {
  try {
    const posts = await PostModels.Post.find().populate('addedBy');
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

    await User.findOneAndUpdate(
      { _id: post.addedBy },
      { $push: { posts: post._id } }
    );

    return res.status(201).json(post);
  } catch (e) {
    next(e);
  }
};

const getSinglePost = async (req, res, next) => {
  try {
    const post = await PostModels.Post.findById(req.params.id).populate([
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
    const user = await User.findOne(req.currentUser._id);
    const post = await PostModels.Post.findById(req.params.id);

    if (req.body.likeOrDislike) {
      if (req.body.likeOrDislike === 'like') {
        // if user hasn't already liked post
        if (!user.likedPosts || !user.likedPosts.includes(post._id)) {
          await post.updateOne({ $inc: { likes: 1 } });
          await user.updateOne({ $push: { likedPosts: req.params.id } });
          // if user has disliked post previously, remove post from their dislikes
          if (user.dislikedPosts && user.dislikedPosts.includes(post._id)) {
            await post.updateOne({ $inc: { dislikes: -1 } });
            await user.updateOne({ $pull: { dislikedPosts: req.params.id } });
          }
        }
        // if user has already liked post
        if (user.likedPosts && user.likedPosts.includes(post._id)) {
          await post.updateOne({ $inc: { likes: -1 } });
          await user.updateOne({ $pull: { likedPosts: req.params.id } });
        }
      }
      if (req.body.likeOrDislike === 'dislike') {
        // if user hasn't already disliked post
        if (!user.dislikedPosts || !user.dislikedPosts.includes(post._id)) {
          await post.updateOne({ $inc: { dislikes: 1 } });
          await user.updateOne({ $push: { dislikedPosts: req.params.id } });
          // if user has liked post previously, remove post from their likes
          if (user.likedPosts && user.likedPosts.includes(post._id)) {
            await post.updateOne({ $inc: { likes: -1 } });
            await user.updateOne({ $pull: { likedPosts: req.params.id } });
          }
        }
        // if user has already disliked post
        if (user.dislikedPosts && user.dislikedPosts.includes(post._id)) {
          await post.updateOne({ $inc: { dislikes: -1 } });
          await user.updateOne({ $pull: { dislikedPosts: req.params.id } });
        }
      }
    } else {
      post.set(req.body);
    }

    const updatedPost = await post.save();
    return res.status(200).json(updatedPost);
  } catch (e) {
    next(e);
  }
};

const deleteSinglePost = async (req, res, next) => {
  try {
    const post = await PostModels.Post.findById(req.params.id).populate([
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
                ]
              }
            ]
          }
        ]
      }
    ]);

    if (!post) {
      return res.status(404).send({ message: 'No post found' });
    }

    if (
      req.currentUser._id.equals(post.addedBy._id) ||
      req.currentUser.isAdmin
    ) {
      // recursively get all comment ids, delete those comments
      const idArray = [];
      function getIds(postObject) {
        idArray.push(postObject.id);
        if (postObject.comments.length === 0) {
          return;
        }
        postObject.comments.forEach((child) => getIds(child));
      }
      getIds(post);
      // remove first id, which will be the parent post id
      idArray.shift();
      // delete each comment
      for (let id of idArray) {
        try {
          await PostModels.Comment.findByIdAndDelete(id);
        } catch (error) {
          console.error(error);
        }
      }

      // remove post from post owner's posts array
      const postOwner = await User.findByIdAndUpdate(post.addedBy._id, {
        $pull: { posts: post._id }
      });
      await postOwner.save();

      // delete post itself
      await PostModels.Post.findByIdAndDelete(req.params.id);
      return res.status(200).json({ message: 'Sucessfully deleted' });
    }
    return res.status(301).json({ message: 'Unauthorized, deletePost in API' });
  } catch (e) {
    next(e);
  }
};

async function searchPosts(req, res, next) {
  console.log(req.query);
  try {
    const { search } = req.query;
    console.log(search);
    const posts = await PostModels.Post.find({
      $or: [
        { topic: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ]
    });
    return res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
}

export default {
  getAllPosts,
  createNewPost,
  getSinglePost,
  updateSinglePost,
  deleteSinglePost,
  searchPosts
};
