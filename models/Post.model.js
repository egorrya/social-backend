import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
	{
		text: {
			type: String,
			required: false,
			unique: false,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		imageUrl: String,
		post_likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PostLike' }],
		post_comments: [
			{ type: mongoose.Schema.Types.ObjectId, ref: 'PostComment' },
		],
	},
	{
		timestamps: true,
	}
);

export default mongoose.model('Post', PostSchema);
