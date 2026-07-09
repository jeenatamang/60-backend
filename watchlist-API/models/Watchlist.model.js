import mongoose from 'mongoose';

const watchlistSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title must be under 100 characters']
    },
    type: {
      type: String,
      required: [true, 'Type is required'],
      enum: {
        values: ['movie', 'anime', 'series'],
        message: 'Type must be movie, anime, or series'
      }
    },
    status: {
      type: String,
      enum: {
        values: ['plan_to_watch', 'watching', 'completed'],
        message: 'Status must be plan_to_watch, watching, or completed'
      },
      default: 'plan_to_watch'
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [10, 'Rating cannot exceed 10'],
      default: null
    }
  },
  {
    timestamps: true
  }
);

const Watchlist = mongoose.model('Watchlist', watchlistSchema);

export default Watchlist;
