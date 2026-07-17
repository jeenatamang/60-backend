import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name must be under 60 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
        message: 'Role must be user or admin'
      },
      default: 'user'
    },
    isActive: {
      type: Boolean,
      default: true
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

userSchema.statics.getActive = function() {
  return this.find({ isActive: true }).sort({ createdAt: -1 });
};

userSchema.methods.deactivate = async function() {
  this.isActive = false;
  return await this.save();
};

const User = mongoose.model('User', userSchema);

export default User;
