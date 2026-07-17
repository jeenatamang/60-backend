import User from '../models/User.model.js';
import AppError from '../utils/AppError.js';

export const getAll = async (req, res, next) => {
  try {
    const { role, isActive } = req.query;
    let filter = {};

    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const users = await User.find(filter).sort({ createdAt: -1 });

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
    res.status(200).json({
      success: true,
      message: 'User fetched successfully',
      data: user
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

export const update = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!user) throw new AppError('User not found', 404);
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (err) {
    next(err);
  }
};

export const deactivate = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new AppError('User not found', 404);
    if (!user.isActive) throw new AppError('User is already inactive', 400);
    await user.deactivate();
    res.status(200).json({
      success: true,
      message: 'User deactivated successfully',
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
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

export const stats = async (req, res, next) => {
  try {
    const overview = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          activeUsers: { $sum: { $cond: ['$isActive', 1, 0] } },
          adminCount: { $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] } }
        }
      }
    ]);

    const byRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      message: 'Stats fetched successfully',
      data: { overview: overview[0], byRole }
    });
  } catch (err) {
    next(err);
  }
};
