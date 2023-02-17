import FollowersModel from '../models/Followers.model.js';
import FollowingModel from '../models/Following.model.js';
import UserModel from '../models/User.model.js';

export const toggleFollow = async (req, res) => {
	try {
		const followingUserId = req.query.id;
		const userId = req.userId;

		const follow = await FollowingModel.findOne({
			following_user_id: followingUserId,
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
				following_user_id: followingUserId,
				user_id: userId,
			}).save();

			await new FollowersModel({
				follower_user_id: userId,
				user_id: followingUserId,
			}).save();

			await UserModel.updateOne({ _id: userId }, { $inc: { following: 1 } });

			await UserModel.updateOne(
				{ _id: followingUserId },
				{ $inc: { followers: 1 } }
			);

			return res.send({
				status: 'success',
				message: 'Follow successfully added',
			});
		} else {
			await FollowersModel.findOneAndDelete({
				follower_user_id: userId,
				user_id: followingUserId,
			});

			await FollowingModel.findOneAndDelete({
				following_user_id: followingUserId,
				user_id: userId,
			});

			await UserModel.updateOne({ _id: userId }, { $inc: { following: -1 } });

			await UserModel.updateOne(
				{ _id: followingUserId },
				{ $inc: { followers: -1 } }
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

export const getFollowersList = async (req, res) => {
	try {
		const userId = req.query.id || req.userId;
		const limit = req.query.limit || 50;
		const page = req.query.page || 1;

		const followers = await FollowersModel.find({ user_id: userId })
			.populate({
				path: 'follower_user_id',
				match: {
					active: true,
				},
				select: '-passwordHash',
			})
			.limit(limit)
			.skip(limit * (page - 1))
			.exec();

		const count = await FollowingModel.find({ user_id: userId }).count();
		const lastPage = Math.ceil(count / limit);

		res.json({
			status: 'success',

			count,
			page,
			limit,
			last_page: lastPage,
			data: followers,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			status: 'error',
			message: 'Unable to get followers list',
		});
	}
};

export const getFollowingList = async (req, res) => {
	try {
		const userId = req.query.id || req.userId;
		const limit = req.query.limit || 50;
		const page = req.query.page || 1;

		const following = await FollowingModel.find({ user_id: userId })
			.populate({
				path: 'following_user_id',
				match: {
					active: true,
				},
				select: '-passwordHash',
			})
			.limit(limit)
			.skip(limit * (page - 1))
			.exec();

		const count = await FollowingModel.find({ user_id: userId }).count();
		const lastPage = Math.ceil(count / limit);

		res.json({
			status: 'success',

			count,
			page,
			limit,
			last_page: lastPage,
			data: following,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			status: 'error',
			message: 'Unable to get following list',
		});
	}
};
