import PostModel from '../models/Post.model.js';
import PostLikeModel from '../models/PostLike.model.js';
import UserModel from '../models/User.model.js';

export const getPosts = async (req, res) => {
	try {
		const userId = req.userId;

		const filter = req.query.filter; // all, user_posts, feed, popular
		const username = req.query.username; // user_posts
		const limit = req.query.limit || 20;
		const page = req.query.page || 1;
		const likes = req.query.likes || 5; // popular
		const before = req.query.before ? new Date(req.query.before) : new Date();

		const sort = req.query.sort || 'desc';
		const sortOrder = sort === 'asc' ? 1 : -1;

		let posts, count;

		const baseConditions = { createdAt: { $lt: before } };

		// all posts
		if (filter === 'all') {
			posts = await PostModel.find(baseConditions)
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

			count = await PostModel.find(baseConditions).count();

			// specific user posts
		} else if (filter === 'user_posts') {
			// if no user id is provided, return error
			if (!username) {
				return res.status(400).json({
					status: 'error',
					message: 'Username is required',
				});
			} else {
				const user = await UserModel.findOne({ username });

				posts = await PostModel.find({ ...baseConditions, user: user._id })
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

				count = await PostModel.find({
					...baseConditions,
					user: user._id,
				}).count();
			}

			// feed
		} else if (filter === 'feed') {
			// if user is not logged in, return error
			if (!userId) {
				return res.status(400).json({
					status: 'error',
					message: 'You must be logged in to view feed',
				});
			} else {
				const user = await UserModel.findById(userId).select('following');
				posts = await PostModel.find({
					...baseConditions,
					user: { $in: [...user.following, userId] },
				})
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

				count = await PostModel.find({
					...baseConditions,
					user: { $in: user.following },
				}).count();
			}

			// popular
		} else if (filter === 'popular') {
			posts = await PostModel.find({
				...baseConditions,
				$expr: { $gte: [{ $size: '$post_likes' }, likes] },
			})
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
			count = await PostModel.find({
				...baseConditions,
				$expr: { $gte: [{ $size: '$post_likes' }, likes] },
			}).count();
		}

		const modifiedPosts = posts.map((post) => {
			const isLiked = post.post_likes.includes(userId);

			return {
				...post._doc,
				isLiked,
				likesCount: post.post_likes.length,
				commentsCount: post.post_comments.length,
				isOwnPost: post.user._id.toString() === userId,
			};
		});

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
			count: Number(count),
			page: Number(page),
			limit: Number(limit),
			sort,
			last_page: Number(lastPage),
			data: modifiedPosts,
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
		const userId = req.userId;

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

				const isLiked = userId ? doc.post_likes.includes(userId) : false;

				res.json({
					status: 'success',
					data: {
						...doc._doc,
						likesCount: doc.post_likes.length,
						commentsCount: doc.post_comments.length,
						isOwnPost: userId ? doc.user.equals(userId) : false,
						isLiked,
					},
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
						status: 'error',
						message: 'Unable to delete post',
					});
				}

				if (!doc) {
					return res.status(404).json({
						status: 'error',
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
		const post = await new PostModel({
			text: req.body.text,
			imageUrl: req.body.imageUrl,
			user: req.userId,
		}).save();

		const populatedPost = await PostModel.findById(post._id).populate({
			path: 'user',
			match: {
				active: true,
			},
			select: '-passwordHash',
		});

		res.json({
			status: 'success',
			data: {
				...populatedPost.toObject(),
				likesCount: 0,
				commentsCount: 0,
			},
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			status: 'error',
			message: 'Unable to create post',
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
			message: 'Unable to update post',
		});
	}
};

export const toggleLike = async (req, res) => {
	try {
		const postId = req.params.id;
		const user = req.userId;

		PostLikeModel.findOne({
			post_id: postId,
			user_id: user,
		})
			.then(async (postLike) => {
				if (!postLike) {
					const postLikeDoc = new PostLikeModel({
						post_id: postId,
						user_id: user,
					});

					await postLikeDoc.save();

					await PostModel.updateOne(
						{
							_id: postId,
						},
						{
							$push: { post_likes: user },
						}
					);

					const post = await PostModel.findOne({
						_id: postId,
					});

					return res.status(200).send({
						status: 'success',
						message: 'Like successfully added',
						data: post.post_likes,
						likesCount: post.post_likes.length,
						isLiked: true,
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
							$pull: { post_likes: user },
						}
					);

					const post = await PostModel.findOne({
						_id: postId,
					});
					return res.status(200).send({
						status: 'success',
						message: 'Like successfully removed',
						data: post.post_likes,
						likesCount: post.post_likes.length,
						isLiked: false,
					});
				}
			})
			.catch((err) => {
				res.status(404).json({
					status: 'error',
					message: 'Error. There is no such post',
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
