import Watchlist from '../models/Watchlist.model.js';
import AppError from '../utils/AppError.js';

export const getAll = async (req, res, next) => {
  try {
    const { status } = req.query;
    let filter = {};
    if (status) filter.status = status;

    const items = await Watchlist.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Watchlist fetched successfully',
      count: items.length,
      data: items
    });
  } catch (err) {
    next(err);
  }
};
export const getOne = async (req, res, next) => {
  try {
    const item = await Watchlist.findById(req.params.id);
    if (!item) throw new AppError('Item not found', 404);
    res.status(200).json({
      success: true,
      message: 'Item fetched successfully',
      data: item
    });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const item = await Watchlist.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Item added to watchlist',
      data: item
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors)[0].message;
      return next(new AppError(message, 400));
    }
    next(err);
  }
};
export const update = async (req, res, next) => {
  try {
    const item = await Watchlist.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) throw new AppError('Item not found', 404);
    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      data: item
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors)[0].message;
      return next(new AppError(message, 400));
    }
    next(err);
  }
};

export const rate = async (req, res, next) => {
  try {
    const item = await Watchlist.findById(req.params.id);
    if (!item) throw new AppError('Item not found', 404);
    if (item.status !== 'completed') {
      throw new AppError('You can only rate completed items', 400);
    }
    item.rating = req.body.rating;
    await item.save();
    res.status(200).json({
      success: true,
      message: 'Rating saved',
      data: item
    });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const item = await Watchlist.findByIdAndDelete(req.params.id);
    if (!item) throw new AppError('Item not found', 404);
    res.status(200).json({
      success: true,
      message: 'Item removed from watchlist'
    });
  } catch (err) {
    next(err);
  }
};