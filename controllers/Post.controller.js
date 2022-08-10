import PostLikeModel from '../models/PostLike.model.js';
import PostModel from '../models/Post.model.js';

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate({
        path: 'user',
        match: {
          active: true,
        },
        select: '-passwordHash',
      })
      .exec();

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'Не удалось получить статьи',
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
            .json({ status: 'error', message: 'Не удалось вернуть статью' });
        }

        if (!doc) {
          return res
            .status(404)
            .json({ status: 'error', message: 'Статья не найдена' });
        }

        res.json(doc);
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
      message: 'Не удалось получить статьи',
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
            message: 'Не удалось удалить статью',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Статья не найдена',
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
      message: 'Не удалось получить статьи',
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

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'Не удалось создать статью',
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

    res.json({
      status: 'success',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'Не удалось обновить статью',
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
          message: 'Error. Maybe you there is no such post',
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
