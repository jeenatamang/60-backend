import Brand from '../models/Brand.model.js';
import AppError from '../utils/Apperror.js';

export const getAll = async (req, res, next) => {
  try {
    const { cruelty_free, vegan_status, country, sort } = req.query;
    let query = {};

    if (cruelty_free !== undefined) query.cruelty_free = cruelty_free === 'true';
    if (vegan_status) query.vegan_status = vegan_status;
    if (country) query['headquarters.country'] = country;

    let brandsQuery = Brand.find(query);

    if (sort === 'followers') {
      brandsQuery = brandsQuery.sort({ 'social_metrics.instagram_followers_millions': -1 });
    }
    if (sort === 'founded') {
      brandsQuery = brandsQuery.sort({ founded_year: 1 });
    }

    const brands = await brandsQuery;

    res.status(200).json({
      success: true,
      message: 'Brands fetched successfully',
      count: brands.length,
      data: brands
    });
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) throw new AppError('Brand not found', 404);
    res.status(200).json({
      success: true,
      message: 'Brand fetched successfully',
      data: brand
    });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const brand = await Brand.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Brand created successfully',
      data: brand
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors)[0].message;
      return next(new AppError(message, 400));
    }
    if (err.code === 11000) {
      return next(new AppError('A brand with this name already exists', 400));
    }
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!brand) throw new AppError('Brand not found', 404);
    res.status(200).json({
      success: true,
      message: 'Brand updated successfully',
      data: brand
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors)[0].message;
      return next(new AppError(message, 400));
    }
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) throw new AppError('Brand not found', 404);
    res.status(200).json({
      success: true,
      message: 'Brand deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

export const stats = async (req, res, next) => {
  try {
    const overview = await Brand.aggregate([
      {
        $group: {
          _id: null,
          totalBrands: { $sum: 1 },
          crueltyFreeCount: { $sum: { $cond: ['$cruelty_free', 1, 0] } },
          avgInstagramFollowers: { $avg: '$social_metrics.instagram_followers_millions' }
        }
      }
    ]);

    const byVeganStatus = await Brand.aggregate([
      { $group: { _id: '$vegan_status', count: { $sum: 1 } } }
    ]);

    const byCountry = await Brand.aggregate([
      { $group: { _id: '$headquarters.country', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const topByFollowers = await Brand.find(
      {},
      { brand_name: 1, 'social_metrics.instagram_followers_millions': 1, _id: 0 }
    ).sort({ 'social_metrics.instagram_followers_millions': -1 }).limit(5);

    res.status(200).json({
      success: true,
      message: 'Stats fetched successfully',
      data: {
        overview: overview[0],
        byVeganStatus,
        byCountry,
        topByFollowers
      }
    });
  } catch (err) {
    next(err);
  }
};
