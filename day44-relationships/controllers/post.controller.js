import Post from '../models/Post.model.js';
import User from '../models/User.model.js';
import AppError from '../utils/AppError.js';

export const getAll = async (req, res, next) => {
  try {
    const { status, tag, author } = req.query;
    let filter = {};

    if (status) filter.status = status;
    if (tag) filter.tags = tag;
    if (author) filter.author = author;

    const posts = await Post.find(filter)
      .populate('author', 'name email avatar bio')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Posts fetched successfully',
      count: posts.length,
      data: posts
    });
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email avatar bio')
      .populate('comments.author', 'name avatar');

    if (!post) throw new AppError('Post not found', 404);

    res.status(200).json({
      success: true,
      message: 'Post fetched successfully',
      data: post
    });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const { authorId, title, content, tags, status } = req.body;

    const author = await User.findById(authorId);
    if (!author) throw new AppError('Author not found', 404);

    const post = await Post.create({
      title,
      content,
      author: authorId,
      tags: tags || [],
      status: status || 'draft'
    });

    await post.populate('author', 'name email avatar');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post
    });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'name email avatar');

    if (!post) throw new AppError('Post not found', 404);

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: post
    });
  } catch (err) {
    next(err);
  }
};

export const publish = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) throw new AppError('Post not found', 404);
    if (post.status === 'published') {
      throw new AppError('Post is already published', 400);
    }
    post.status = 'published';
    await post.save();
    await post.populate('author', 'name email avatar');

    res.status(200).json({
      success: true,
      message: 'Post published successfully',
      data: post
    });
  } catch (err) {
    next(err);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const { content, authorId } = req.body;
    if (!content || !authorId) {
      throw new AppError('Content and authorId are required', 400);
    }

    const author = await User.findById(authorId);
    if (!author) throw new AppError('Comment author not found', 404);

    const post = await Post.findById(req.params.id);
    if (!post) throw new AppError('Post not found', 404);

    post.comments.push({ content, author: authorId });
    await post.save();

    await post.populate('author', 'name email avatar');
    await post.populate('comments.author', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: post
    });
  } catch (err) {
    next(err);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) throw new AppError('Post not found', 404);

    const comment = post.comments.id(req.params.commentId);
    if (!comment) throw new AppError('Comment not found', 404);

    comment.deleteOne();
    await post.save();

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
      data: post
    });
  } catch (err) {
    next(err);
  }
};

export const likePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    ).populate('author', 'name email avatar');

    if (!post) throw new AppError('Post not found', 404);

    res.status(200).json({
      success: true,
      message: 'Post liked',
      data: { likes: post.likes }
    });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) throw new AppError('Post not found', 404);

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

export const stats = async (req, res, next) => {
  try {
    const overview = await Post.aggregate([
      {
        $group: {
          _id: null,
          totalPosts: { $sum: 1 },
          publishedPosts: {
            $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] }
          },
          draftPosts: {
            $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] }
          },
          totalLikes: { $sum: '$likes' },
          totalComments: { $sum: { $size: '$comments' } }
        }
      }
    ]);

    const topPosts = await Post.find({ status: 'published' })
      .sort({ likes: -1 })
      .limit(3)
      .select('title likes commentCount')
      .populate('author', 'name');

    res.status(200).json({
      success: true,
      message: 'Stats fetched successfully',
      data: {
        overview: overview[0],
        topPosts
      }
    });
  } catch (err) {
    next(err);
  }
};
