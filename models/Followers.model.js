import mongoose from 'mongoose';

const Followers = new mongoose.Schema(
	{
		target_user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		user_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		type: {
			type: String,
			enum: ['following'],
			default: 'following',
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model('Followers', Followers);
