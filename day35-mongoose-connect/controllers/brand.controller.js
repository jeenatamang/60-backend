import Brand from '../models/Brand.model.js';
import AppError from '../utils/Apperror.js';

export const getAll = async (req, res, next) => {
  try {
    const {
      cruelty_free,
      vegan_status,
      country,
      sort,
      page,
      limit,
      search
    } = req.query;

    let filter = {};
    if (cruelty_free !== undefined) filter.cruelty_free = cruelty_free === 'true';
    if (vegan_status) filter.vegan_status = vegan_status;
    if (country) filter['headquarters.country'] = country;
    if (search) filter.brand_name = { $regex: search, $options: 'i' };

    let sortOption = {};
    if (sort === 'followers') sortOption = { 'social_metrics.instagram_followers_millions': -1 };
    else if (sort === 'founded') sortOption = { founded_year: 1 };
    else if (sort === 'founded_desc') sortOption = { founded_year: -1 };
    else sortOption = { brand_name: 1 };

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const [brands, total] = await Promise.all([
      Brand.find(filter).sort(sortOption).skip(skip).limit(limitNum),
      Brand.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      message: 'Brands fetched successfully',
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      },
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
export const getByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const brands = await Brand.find(
      { categories: category },
      { brand_name: 1, categories: 1, cruelty_free: 1, vegan_status: 1 }
    ).sort({ brand_name: 1 });

    if (brands.length === 0) {
      throw new AppError(`No brands found in category: ${category}`, 404);
    }

    res.status(200).json({
      success: true,
      message: `Brands in category "${category}" fetched successfully`,
      count: brands.length,
      data: brands
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

export const addHeroProduct = async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) throw new AppError('Brand not found', 404);

    const { product_id, product_name, type, price, rating, tags, in_stock } = req.body;

    if (!product_name || !type || !price) {
      throw new AppError('product_name, type, and price are required', 400);
    }

    brand.hero_products.push({
      product_id,
      product_name,
      type,
      price,
      rating,
      tags: tags || [],
      in_stock: in_stock !== undefined ? in_stock : true
    });

    await brand.save();

    res.status(201).json({
      success: true,
      message: 'Hero product added successfully',
      data: brand
    });
  } catch (err) {
    next(err);
  }
};

export const removeHeroProduct = async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) throw new AppError('Brand not found', 404);

    const productIndex = brand.hero_products.findIndex(
      p => p.product_id === req.params.product_id
    );

    if (productIndex === -1) {
      throw new AppError('Product not found in this brand', 404);
    }

    brand.hero_products.splice(productIndex, 1);
    await brand.save();

    res.status(200).json({
      success: true,
      message: 'Hero product removed successfully',
      data: brand
    });
  } catch (err) {
    next(err);
  }
};

export const toggleCrueltyFree = async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) throw new AppError('Brand not found', 404);

    brand.cruelty_free = !brand.cruelty_free;
    await brand.save();

    res.status(200).json({
      success: true,
      message: `Brand is now ${brand.cruelty_free ? 'cruelty-free' : 'not cruelty-free'}`,
      data: brand
    });
  } catch (err) {
    next(err);
  }
};