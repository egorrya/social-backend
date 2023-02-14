import PostModel from '../models/Post.model.js';
import PostCommentModel from '../models/PostComment.model.js';

export const getAll = async (req, res) => {
	try {
		const postId = req.params.id;
		const limit = req.query.limit || 20;
		const page = req.query.page || 1;

		const sort = req.query.sort || 'desc';
		const sortOrder = sort === 'asc' ? 1 : -1;

		const comments = await PostCommentModel.find({ post: postId })
			.populate({
				path: 'user',
				match: {
					active: true,
				},
				select: '-passwordHash',
			})
			.limit(limit)
			.skip(limit * (page - 1))
			.sort({ createdAt: sortOrder })
			.exec();

		const count = await PostCommentModel.find({ post: postId }).count();
		const lastPage = Math.ceil(count / limit);

		if (lastPage === 0) {
			return res.json({
				status: 'success',
				data: [],
				count,
				sort,
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

			count: Number(count),
			page: Number(page),
			limit: Number(limit),
			sort,
			last_page: Number(lastPage),
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
			text: req.body.text,
			post: postId,
			user: req.userId,
		});

		const comment = await doc.save().then(comment =>
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
