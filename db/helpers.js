import mongoose from 'mongoose';

export const connectDb = () => {
  mongoose.set('strictQuery', true);
  return mongoose.connect(DB_URI);
};

export const disconnectDb = () => {
  if (mongoose.connection.readyState !== 0) {
    return mongoose.disconnect();
  }
};
