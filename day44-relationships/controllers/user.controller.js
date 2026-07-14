import User from '../models/User.model.js';
import Post from '../models/Post.model.js';
import AppError from '../utils/AppError.js';

export const getAll = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      count: users.length,
      data: users
    });
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new AppError('User not found', 404);

    const posts = await Post.find({ author: req.params.id })
      .select('title status tags likes commentCount createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'User fetched successfully',
      data: {
        user,
        posts,
        postCount: posts.length
      }
    });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user
    });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) throw new AppError('User not found', 404);

    const result = await Post.deleteMany({ author: req.params.id });

    res.status(200).json({
      success: true,
      message: 'User and their posts deleted successfully',
      data: {
        deletedUser: user.name,
        deletedPosts: result.deletedCount
      }
    });
  } catch (err) {
    next(err);
  }
};
