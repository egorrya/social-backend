import PostModel from '../models/Post.model.js';
import PostCommentModel from '../models/PostComment.model.js';

export const getAll = async (req, res) => {
  const postId = req.params.id;

  try {
    const comments = await PostCommentModel.find({ post_id: postId })
      .populate({
        path: 'user',
        match: {
          active: true,
        },
        select: '-passwordHash',
      })
      .exec();

    res.json(comments);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'Не удалось получить комментарии',
    });
  }
};

export const create = async (req, res) => {
  try {
    const postId = req.params.id;

    const doc = new PostCommentModel({
      comment: req.body.comment,
      post: postId,
      user: req.userId,
    });

    const comment = await doc.save().then((comment) =>
      PostCommentModel.findById(comment._id).populate({
        path: 'user',
        match: {
          active: true,
        },
        select: '-passwordHash',
      })
    );

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        $push: { post_comments: comment._id },
      }
    );

    res.json(comment);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'Не удалось создать комментарий',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentId = req.body.commentId;

    await PostCommentModel.deleteOne({
      _id: commentId,
    });

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        $pull: { post_comments: commentId },
      }
    );

    return res.status(200).send({
      status: 'success',
      message: 'Comment successfully removed',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'Comment not removed',
    });
  }
};
