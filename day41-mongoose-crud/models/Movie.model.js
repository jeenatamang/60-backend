import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [150, 'Title must be under 150 characters']
    },
    director: {
      type: String,
      required: [true, 'Director is required'],
      trim: true
    },
    genre: {
      type: [String],
      required: [true, 'At least one genre is required']
    },
    year: {
      type: Number,
      required: [true, 'Release year is required'],
      min: [1888, 'Year must be after 1888'],
      max: [new Date().getFullYear() + 2, 'Year is too far in the future']
    },
    rating: {
      type: Number,
      min: [0, 'Rating cannot be negative'],
      max: [10, 'Rating cannot exceed 10'],
      default: 0
    },
    review: {
      type: String,
      trim: true,
      maxlength: [1000, 'Review must be under 1000 characters']
    },
    watched: {
      type: Boolean,
      default: false
    },
    watchedAt: {
      type: Date,
      default: null
    },
    language: {
      type: String,
      default: 'English',
      trim: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);


movieSchema.virtual('age').get(function () {
  return new Date().getFullYear() - this.year;
});

movieSchema.virtual('ratingLabel').get(function () {
  if (this.rating >= 9) return 'Masterpiece';
  if (this.rating >= 7) return 'Great';
  if (this.rating >= 5) return 'Average';
  if (this.rating > 0) return 'Poor';
  return 'Not rated';
});

movieSchema.methods.markWatched = async function () {
  this.watched = true;
  this.watchedAt = new Date();
  return await this.save();
};

movieSchema.methods.addReview = async function (review, rating) {
  this.review = review;
  if (rating) this.rating = rating;
  return await this.save();
};

movieSchema.statics.findByDirector = function (director) {
  return this.find({ director: new RegExp(director, 'i') }).sort({ year: -1 });
};

movieSchema.statics.getWatchQueue = function () {
  return this.find({ watched: false }).sort({ rating: -1 });
};

movieSchema.statics.getTopRated = function (limit = 5) {
  return this.find({ rating: { $gt: 0 } })
    .sort({ rating: -1 })
    .limit(limit)
    .select('title director year rating ratingLabel');
};


movieSchema.pre('save', function () {
  if (this.watched && !this.watchedAt) {
    this.watchedAt = new Date();
  }
});

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;
