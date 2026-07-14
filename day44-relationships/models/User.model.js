import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [60, 'Name must be under 60 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [300, 'Bio must be under 300 characters']
    },
    avatar: {
      type: String,
      default: 'https://api.dicebear.com/7.x/initials/svg?seed=User'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

userSchema.virtual('firstName').get(function() {
  return this.name.split(' ')[0];
});

const User = mongoose.model('User', userSchema);

export default User;
