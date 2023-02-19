import FollowersModel from '../models/Followers.model.js';
import FollowingModel from '../models/Following.model.js';
import UserModel from '../models/User.model.js';

export const toggleFollow = async (req, res) => {
	try {
		const followingUserId = req.query.id;
		const userId = req.userId;

		const follow = await FollowingModel.findOne({
			target_user: followingUserId,
			user_id: userId,
		});

		if (followingUserId === userId) {
			return res.status(400).json({
				status: 'error',
				message: "You can't follow yourself",
			});
		}

		if (!follow) {
			await new FollowingModel({
				target_user: followingUserId,
				user_id: userId,
			}).save();

			await new FollowersModel({
				target_user: userId,
				user_id: followingUserId,
			}).save();

			await UserModel.updateOne(
				{ _id: userId },
				{ $push: { following: followingUserId } }
			);

			await UserModel.updateOne(
				{ _id: followingUserId },
				{ $push: { followers: userId } }
			);

			return res.send({
				status: 'success',
				message: 'Follow successfully added',
			});
		} else {
			await FollowersModel.findOneAndDelete({
				target_user: userId,
				user_id: followingUserId,
			});

			await FollowingModel.findOneAndDelete({
				target_user: followingUserId,
				user_id: userId,
			});

			await UserModel.updateOne(
				{ _id: userId },
				{ $pull: { following: followingUserId } }
			);

			await UserModel.updateOne(
				{ _id: followingUserId },
				{ $pull: { followers: userId } }
			);

			return res.send({
				status: 'success',
				message: 'Follow successfully removed',
			});
		}
	} catch (error) {
		res.status(500).json({
			status: 'error',
			error,
		});
	}
};

export const getFollowList = async (req, res) => {
	try {
		const type = req.query.type; // "followers" or "following"
		const username = req.query.username;
		const limit = req.query.limit || 50;
		const page = req.query.page || 1;
		const user = req.userId;

		const userData = await UserModel.findOne({ username });

		if (!userData) {
			return res.status(404).json({
				status: 'error',
				message: 'User not found',
			});
		} else if (!['followers', 'following'].includes(type)) {
			return res.status(400).json({
				status: 'error',
				message: 'Invalid type',
			});
		}

		let data, count;

		if (type === 'following') {
			data = await FollowingModel.find({ user_id: userData._id })
				.populate({
					path: 'target_user',
					match: {
						active: true,
					},
					select: '-passwordHash',
				})
				.limit(limit)
				.skip(limit * (page - 1))
				.exec();

			count = await FollowingModel.find({ user_id: userData._id }).count();
		} else if (type === 'followers') {
			data = await FollowersModel.find({ user_id: userData._id })
				.populate({
					path: 'target_user',
					match: {
						active: true,
					},
					select: '-passwordHash',
				})
				.limit(limit)
				.skip(limit * (page - 1))
				.exec();

			count = await FollowersModel.find({ user_id: userData._id }).count();
		}

		const lastPage = Math.ceil(count / limit);

		if (lastPage === 0) {
			return res.json({
				status: 'success',
				data: [],
				count,
				page: 1,
				last_page: 1,
			});
		} else if (page > lastPage) {
			return res.status(404).json({
				status: 'error',
				message: 'Page not found',
			});
		}

		res.json({
			status: 'success',

			count,
			page: Number(page),
			limit: Number(limit),
			last_page: Number(lastPage),
			data,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			status: 'error',
			message: 'Unable to get list',
		});
	}
};
