import UserModel from '../models/User.model.js';
import FollowingModel from '../models/Following.model.js';
import FollowersModel from '../models/Followers.model.js';

export const toggleFollow = async (req, res) => {
  try {
    const followingUserId = req.body.id;
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
        follower_user_id: userId,
        user_id: followingUserId,
      });

      await FollowingModel.findOneAndDelete({
        following_user_id: followingUserId,
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

export const followersList = async (req, res) => {
  try {
    const userId = req.body.id || req.userId;
    const limit = req.body.limit || 50;
    const page = req.body.page || 1;

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

export const followingList = async (req, res) => {
  try {
    const userId = req.body.id || req.userId;
    const limit = req.body.limit || 50;
    const page = req.body.page || 1;

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
