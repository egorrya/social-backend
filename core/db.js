import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

mongoose.Promise = Promise;

export const db = mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/social')
  .then(() => console.log('MongoDB Сonnected'))
  .catch((error) => console.error('MongoDB Connection Error: ' + error));
