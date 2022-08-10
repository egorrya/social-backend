import mongoose from 'mongoose';

mongoose.Promise = Promise;

export const db = mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blog')
  .then(() => console.log('DB connected'))
  .catch((error) => console.error('DB connection error: ' + error));
