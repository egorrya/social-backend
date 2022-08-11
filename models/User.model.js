import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    avatarUrl: String,
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Following' }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Followers' }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('User', UserSchema);
