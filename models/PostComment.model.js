import mongoose from 'mongoose';

const PostCommentSchema = new mongoose.Schema(
  {
    comment: String,
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('PostComment', PostCommentSchema);
