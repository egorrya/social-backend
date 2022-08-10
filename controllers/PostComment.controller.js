import PostModel from '../models/Post.model.js';
import PostCommentModel from '../models/PostComment.model.js';

export const getAll = async (req, res) => {
  try {
    const postId = req.params.id;
    const limit = req.body.limit || 20;
    const page = req.body.page || 1;

    const comments = await PostCommentModel.find({ post_id: postId })
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

    const count = await PostCommentModel.find({ post_id: postId }).count();
    const lastPage = Math.ceil(count / limit);

    res.json({
      status: 'success',

      count,
      page,
      limit,
      last_page: lastPage,
      data: comments,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'Unable to get comments',
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

    res.json({
      status: 'success',
      data: comment,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'Unable to create the comment',
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
      message: 'Unable to remove a comment',
    });
  }
};
