import PostLikeModel from '../models/PostLike.model.js';
import PostModel from '../models/Post.model.js';

export const getAll = async (req, res) => {
  try {
    const limit = req.body.limit || 20;
    const page = req.body.page || 1;

    const posts = await PostModel.find()
      .populate({
        path: 'user',
        match: {
          active: true,
        },
        select: '-passwordHash',
      })
      .limit(limit)
      .skip(limit * (page - 1))
      .exec();

    res.json({
      status: 'success',
      data: posts,
      count: posts.length,
      page,
      limit,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'Unable to get posts',
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOne(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ status: 'error', message: 'Unable to get post' });
        }

        if (!doc) {
          return res
            .status(404)
            .json({ status: 'error', message: 'Unable to get post' });
        }

        res.json({
          status: 'success',
          data: doc,
        });
      }
    ).populate({
      path: 'user',
      match: {
        active: true,
      },
      select: '-passwordHash',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'Unable to get posts',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Unable to delete posts',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Unable to get post',
          });
        }

        res.json({
          status: 'success',
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'Unable to get posts',
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      user: req.userId,
    });

    const post = await doc.save().then((post) =>
      PostModel.findById(post._id).populate({
        path: 'user',
        match: {
          active: true,
        },
        select: '-passwordHash',
      })
    );

    res.json({
      status: 'success',
      data: post,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'Unable to get posts',
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
      }
    );

    const post = await PostModel.findById(postId).populate({
      path: 'user',
      match: {
        active: true,
      },
      select: '-passwordHash',
    });

    res.json({
      status: 'success',
      data: post,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'Unable to update posts',
    });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const postId = req.params.id;
    const user = req.userId;

    PostLikeModel.findOne({
      post_id: postId,
      user_id: user._id,
    })
      .then(async (postLike) => {
        if (!postLike) {
          const postLikeDoc = new PostLikeModel({
            post_id: postId,
            user_id: user._id,
          });

          const likeData = await postLikeDoc.save();

          await PostModel.updateOne(
            {
              _id: postId,
            },
            {
              $push: { post_likes: likeData._id },
            }
          );

          return res.status(200).send({
            status: 'success',
            message: 'Like successfully added',
          });
        } else {
          await PostLikeModel.deleteOne({
            _id: postLike._id,
          });

          await PostModel.updateOne(
            {
              _id: postId,
            },
            {
              $pull: { post_likes: postLike._id },
            }
          );

          return res.status(200).send({
            status: 'success',
            message: 'Like successfully removed',
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          status: 'error',
          message: 'Error. Maybe there is no such post',
        });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'error',
      error,
    });
  }
};
