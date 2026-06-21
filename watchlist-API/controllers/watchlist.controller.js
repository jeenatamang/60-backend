const watchlist = require('../data/watchlist.data');
const AppError = require('../utils/AppError');

const VALID_STATUSES = ["plan_to_watch", "watching", "completed"];
const VALID_TYPES = ["movie", "anime", "series"];

exports.getAll = (req, res, next) => {
  try {
    const { status } = req.query;
    let result = watchlist;

    if (status) {
      result = watchlist.filter(item => item.status === status);
    }

    res.status(200).json({
      success: true,
      message: "Watchlist fetched successfully",
      data: result
    });
  } catch (err) {
    next(err);
  }
};
exports.getOne = (req, res, next) => {
  try {
    const item = watchlist.find(i => i.id === parseInt(req.params.id));
    if (!item) {
      throw new AppError("Item not found", 404);
    }
    res.status(200).json({
      success: true,
      message: "Item fetched successfully",
      data: item
    });
  } catch (err) {
    next(err);
  }
};

exports.create = (req, res, next) => {
  try {
    const { title, type, status } = req.body;

    if (!title || !type) {
      throw new AppError("Title and type are required", 400);
    }
    if (!VALID_TYPES.includes(type)) {
      throw new AppError(`Type must be one of: ${VALID_TYPES.join(", ")}`, 400);
    }
    if (status && !VALID_STATUSES.includes(status)) {
      throw new AppError(`Status must be one of: ${VALID_STATUSES.join(", ")}`, 400);
    }

    const newItem = {
      id: watchlist.length + 1,
      title,
      type,
      status: status || "plan_to_watch",
      rating: null
    };
    watchlist.push(newItem);
    res.status(201).json({
      success: true,
      message: "Item added to watchlist",
      data: newItem
    });
  } catch (err) {
    next(err);
  }
};
exports.update = (req, res, next) => {
  try {
    const item = watchlist.find(i => i.id === parseInt(req.params.id));
    if (!item) {
      throw new AppError("Item not found", 404);
    }

    const { title, status } = req.body;

    if (status && !VALID_STATUSES.includes(status)) {
      throw new AppError(`Status must be one of: ${VALID_STATUSES.join(", ")}`, 400);
    }

    if (title) item.title = title;
    if (status) item.status = status;

    res.status(200).json({
      success: true,
      message: "Item updated successfully",
      data: item
    });
  } catch (err) {
    next(err);
  }
};
exports.rate = (req, res, next) => {
  try {
    const item = watchlist.find(i => i.id === parseInt(req.params.id));
    if (!item) {
      throw new AppError("Item not found", 404);
    }
    if (item.status !== "completed") {
      throw new AppError("You can only rate completed items", 400);
    }

    const { rating } = req.body;
    if (rating === undefined || rating < 1 || rating > 10) {
      throw new AppError("Rating must be a number between 1 and 10", 400);
    }

    item.rating = rating;
    res.status(200).json({
      success: true,
      message: "Rating saved",
      data: item
    });
  } catch (err) {
    next(err);
  }
};
exports.remove = (req, res, next) => {
  try {
    const index = watchlist.findIndex(i => i.id === parseInt(req.params.id));
    if (index === -1) {
      throw new AppError("Item not found", 404);
    }
    watchlist.splice(index, 1);
    res.status(200).json({
      success: true,
      message: "Item removed from watchlist"
    });
  } catch (err) {
    next(err);
  }
};