import mongoose from 'mongoose';

const PostCommentSchema = new mongoose.Schema(
  {
    comment: { type: String, required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('PostComment', PostCommentSchema);
