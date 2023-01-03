import { connectDb, disconnectDb } from './helpers.js';
import User from '../models/user.js';

const adminUser = {
  username: 'admin',
  password: 'P@ssword01',
  email: 'admin@admin.com',
  isAdmin: true
};

const nonAdminUser = {
  username: 'nonadmin',
  password: 'P@ssword01',
  email: 'nonadmin@nonadmin.com'
};

async function seedDb() {
  console.log('🤖 Connecting to mongodb...');
  await connectDb();
  console.log('🤖 Successfully connect to mongodb');

  console.log('🤖 Deleting all the users...');
  await User.deleteMany();
  console.log('🤖 Successfully deleted all users');

  const user = await User.create(adminUser, nonAdminUser);
  console.log(`🤖 Successfully created the admin user with id: ${user._id}`);

  await disconnectDb();
  console.log(`🤖 Successfully disconnected from mongodb`);
}

seedDb();
