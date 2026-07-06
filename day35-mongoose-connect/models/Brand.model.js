import mongoose from 'mongoose';

const heroProductSchema = new mongoose.Schema({
  product_id: { type: String },
  product_name: { type: String, required: true },
  type: { type: String },
  price: { type: Number, min: 0 },
  rating: { type: Number, min: 0, max: 5 },
  tags: [String],
  in_stock: { type: Boolean, default: true }
}, { _id: false });

const brandSchema = new mongoose.Schema(
  {
    brand_name: {
      type: String,
      required: [true, 'Brand name is required'],
      trim: true,
      unique: true
    },
    founded_year: {
      type: Number
    },
    founder: {
      type: String,
      trim: true
    },
    headquarters: {
      city: { type: String },
      country: { type: String }
    },
    cruelty_free: {
      type: Boolean,
      default: false
    },
    vegan_status: {
      type: String,
      enum: {
        values: ['none', 'partial', 'fully_vegan'],
        message: 'Vegan status must be none, partial, or fully_vegan'
      },
      default: 'none'
    },
    categories: [String],
    social_metrics: {
      instagram_followers_millions: { type: Number, default: 0 },
      tiktok_engagement: {
        type: String,
        enum: ['low', 'medium', 'high', 'very_high'],
        default: 'low'
      }
    },
    hero_products: [heroProductSchema]
  },
  {
    timestamps: true
  }
);

const Brand = mongoose.model('Brand', brandSchema);

export default Brand;
