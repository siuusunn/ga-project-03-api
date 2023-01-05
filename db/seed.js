import { connectDb, disconnectDb } from './helpers.js';
import User from '../models/user.js';
import { PostModels } from '../models/post.js';

const adminUser = {
  username: 'admin',
  password: 'P@ssword01',
  email: 'admin@admin.com',
  isAdmin: true
};

const nonAdminUser1 = {
  username: 'nonadmin1',
  password: 'P@ssword01',
  email: 'nonadmin1@nonadmin.com'
};

const nonAdminUser2 = {
  username: 'nonadmin2',
  password: 'P@ssword01',
  email: 'nonadmin2@nonadmin.com'
};

const postsByAdmin = [
  {
    topic: 'Yall ready to party?',
    content: 'PARTAAAAAAAYYYYYYYYY',
    likes: 20,
    dislikes: 4
  },
  {
    topic: 'I partied too hard',
    content: 'Now I wanna die',
    likes: 5,
    dislikes: 20
  }
];

const postsByNonAdmin1 = [
  {
    topic: 'Yo this admin sucks',
    content: 'We need a new admin',
    likes: 80,
    dislikes: 1
  }
];

const postsByNonAdmin2 = [
  {
    topic: 'Is this forum dead?',
    content: 'Hellooooo? Anyone here?',
    likes: 6,
    dislikes: 999
  }
];

async function seedDb() {
  console.log('🤖 Connecting to mongodb...');
  await connectDb();
  console.log('🤖 Successfully connect to mongodb');

  console.log('🤖 Deleting all the users...');
  await User.deleteMany();
  console.log('🤖 Successfully deleted all users');

  console.log('🤖 Deleting all the posts...');
  await PostModels.Post.deleteMany();
  console.log('🤖 Successfully deleted all posts');

  console.log('🤖 Deleting all the comments...');
  await PostModels.Comment.deleteMany();
  console.log('🤖 Successfully deleted all comments');

  //Create admin and non-admin users

  const [admin, nonAdmin1, nonAdmin2] = await User.create([
    adminUser,
    nonAdminUser1,
    nonAdminUser2
  ]);
  console.log(
    `🤖 Successfully created admin with id: ${admin._id}, non-admin 1 with id: ${nonAdmin1._id}, and non-admin 2 with id: ${nonAdmin2._id}`
  );

  // create admin posts
  const updatedAdminPosts = postsByAdmin.map((post) => ({
    ...post,
    addedBy: admin._id
  }));
  const adminPostsFromDb = await PostModels.Post.create(updatedAdminPosts);
  console.log(`🤖 Successfully created posts by Admin: ${adminPostsFromDb}`);

  // create non-admin 1 posts
  const updatedNonAdmin1Posts = postsByNonAdmin1.map((post) => ({
    ...post,
    addedBy: nonAdmin1._id
  }));
  const nonAdmin1PostsFromDb = await PostModels.Post.create(
    updatedNonAdmin1Posts
  );
  console.log(
    `🤖 Successfully created posts by non-admin 1: ${nonAdmin1PostsFromDb}`
  );

  // create non-admin 2 posts
  const updatedNonAdmin2Posts = postsByNonAdmin2.map((post) => ({
    ...post,
    addedBy: nonAdmin2._id
  }));
  const nonAdmin2PostsFromDb = await PostModels.Post.create(
    updatedNonAdmin2Posts
  );
  console.log(
    `🤖 Successfully created posts by non-admin 2: ${nonAdmin2PostsFromDb}`
  );

  await disconnectDb();
  console.log(`🤖 Successfully disconnected from mongodb`);
}

seedDb();
