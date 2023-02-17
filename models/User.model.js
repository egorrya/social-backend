import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
	{
		fullName: {
			type: String,
			required: false,
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
		backgroundUrl: String,
		following: Number,
		followers: Number,
	},
	{
		timestamps: true,
	}
);

export default mongoose.model('User', UserSchema);
