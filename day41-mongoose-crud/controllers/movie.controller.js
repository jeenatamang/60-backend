import Movie from '../models/Movie.model.js';
import AppError from '../utils/AppError.js';

export const getAll = async (req, res, next) => {
  try {
    const { genre, watched, sort, search, year } = req.query;
    let filter = {};

    if (genre) filter.genre = genre;
    if (watched !== undefined) filter.watched = watched === 'true';
    if (year) filter.year = parseInt(year);
    if (search) filter.title = { $regex: search, $options: 'i' };

    let sortOption = { createdAt: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'year') sortOption = { year: -1 };
    if (sort === 'title') sortOption = { title: 1 };

    const movies = await Movie.find(filter).sort(sortOption);

    res.status(200).json({
      success: true,
      message: 'Movies fetched successfully',
      count: movies.length,
      data: movies
    });
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) throw new AppError('Movie not found', 404);
    res.status(200).json({
      success: true,
      message: 'Movie fetched successfully',
      data: movie
    });
  } catch (err) {
    next(err);
  }
};

export const getTopRated = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const movies = await Movie.getTopRated(limit);
    res.status(200).json({
      success: true,
      message: 'Top rated movies fetched',
      data: movies
    });
  } catch (err) {
    next(err);
  }
};

export const getWatchQueue = async (req, res, next) => {
  try {
    const movies = await Movie.getWatchQueue();
    res.status(200).json({
      success: true,
      message: 'Watch queue fetched',
      count: movies.length,
      data: movies
    });
  } catch (err) {
    next(err);
  }
};

export const getByDirector = async (req, res, next) => {
  try {
    const movies = await Movie.findByDirector(req.params.director);
    if (movies.length === 0) {
      throw new AppError(`No movies found by director: ${req.params.director}`, 404);
    }
    res.status(200).json({
      success: true,
      message: 'Movies fetched by director',
      count: movies.length,
      data: movies
    });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Movie created successfully',
      data: movie
    });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!movie) throw new AppError('Movie not found', 404);
    res.status(200).json({
      success: true,
      message: 'Movie updated successfully',
      data: movie
    });
  } catch (err) {
    next(err);
  }
};

export const markWatched = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) throw new AppError('Movie not found', 404);
    if (movie.watched) {
      throw new AppError('Movie is already marked as watched', 400);
    }
    await movie.markWatched();
    res.status(200).json({
      success: true,
      message: 'Movie marked as watched',
      data: movie
    });
  } catch (err) {
    next(err);
  }
};

export const addReview = async (req, res, next) => {
  try {
    const { review, rating } = req.body;
    if (!review) throw new AppError('Review text is required', 400);

    const movie = await Movie.findById(req.params.id);
    if (!movie) throw new AppError('Movie not found', 404);
    if (!movie.watched) {
      throw new AppError('You can only review movies you have watched', 400);
    }

    await movie.addReview(review, rating);
    res.status(200).json({
      success: true,
      message: 'Review added successfully',
      data: movie
    });
  } catch (err) {
    next(err);
  }
};

export const stats = async (req, res, next) => {
  try {
    const overview = await Movie.aggregate([
      {
        $group: {
          _id: null,
          totalMovies: { $sum: 1 },
          watchedCount: { $sum: { $cond: ['$watched', 1, 0] } },
          unwatchedCount: { $sum: { $cond: ['$watched', 0, 1] } },
          avgRating: { $avg: '$rating' },
          highestRating: { $max: '$rating' },
          lowestRating: { $min: '$rating' }
        }
      }
    ]);

    const byGenre = await Movie.aggregate([
      { $unwind: '$genre' },
      { $group: { _id: '$genre', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const byLanguage = await Movie.aggregate([
      { $group: { _id: '$language', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      message: 'Stats fetched successfully',
      data: {
        overview: overview[0],
        byGenre,
        byLanguage
      }
    });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) throw new AppError('Movie not found', 404);
    res.status(200).json({
      success: true,
      message: 'Movie deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};
