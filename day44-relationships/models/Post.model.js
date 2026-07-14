import mongoose from 'mongoose';
import commentSchema from './Comment.model.js';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [150, 'Title must be under 150 characters']
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required']
    },
    tags: {
      type: [String],
      default: []
    },
    status: {
      type: String,
      enum: {
        values: ['draft', 'published'],
        message: 'Status must be draft or published'
      },
      default: 'draft'
    },
    likes: {
      type: Number,
      default: 0
    },
    comments: [commentSchema]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

postSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

postSchema.virtual('readingTime').get(function() {
  const words = this.content.split(' ').length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
});

postSchema.statics.getPublished = function() {
  return this.find({ status: 'published' })
    .populate('author', 'name email avatar')
    .sort({ createdAt: -1 });
};

postSchema.pre('findOneAndDelete', function() {
  console.log(`Deleting post with filter: ${JSON.stringify(this.getFilter())}`);
});

const Post = mongoose.model('Post', postSchema);

export default Post;
