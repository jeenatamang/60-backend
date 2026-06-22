const watchlist = require('../data/watchlist.data');
const AppError = require('../utils/AppError');

// GET all items — supports ?status=watching filtering
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

// GET one item
exports.getOne = (req, res, next) => {
  try {
    const item = watchlist.find(i => i.id === parseInt(req.params.id));
    if (!item) throw new AppError("Item not found", 404);
    res.status(200).json({
      success: true,
      message: "Item fetched successfully",
      data: item
    });
  } catch (err) {
    next(err);
  }
};

// CREATE — validation already handled by middleware
exports.create = (req, res, next) => {
  try {
    const { title, type } = req.body;
    const newItem = {
      id: watchlist.length + 1,
      title,
      type,
      status: "plan_to_watch",
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

// UPDATE — validation already handled by middleware
exports.update = (req, res, next) => {
  try {
    const item = watchlist.find(i => i.id === parseInt(req.params.id));
    if (!item) throw new AppError("Item not found", 404);
    const { title, status } = req.body;
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

// RATE — validation already handled by middleware
exports.rate = (req, res, next) => {
  try {
    const item = watchlist.find(i => i.id === parseInt(req.params.id));
    if (!item) throw new AppError("Item not found", 404);
    if (item.status !== "completed") {
      throw new AppError("You can only rate completed items", 400);
    }
    item.rating = req.body.rating;
    res.status(200).json({
      success: true,
      message: "Rating saved",
      data: item
    });
  } catch (err) {
    next(err);
  }
};

// DELETE
exports.remove = (req, res, next) => {
  try {
    const index = watchlist.findIndex(i => i.id === parseInt(req.params.id));
    if (index === -1) throw new AppError("Item not found", 404);
    watchlist.splice(index, 1);
    res.status(200).json({
      success: true,
      message: "Item removed from watchlist"
    });
  } catch (err) {
    next(err);
  }
};