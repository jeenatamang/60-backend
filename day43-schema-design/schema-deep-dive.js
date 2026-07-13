import 'dotenv/config';
import mongoose from 'mongoose';

await mongoose.connect(process.env.MONGO_URI);
console.log('Connected\n');

const typesSchema = new mongoose.Schema({
  name: String,
  email: { type: String },
  age: Number,
  price: { type: Number },
  isActive: Boolean,
  createdAt: Date,
  birthday: { type: Date },
  tags: [String],
  scores: [Number],
  addresses: [{
    street: String,
    city: String,
    country: String
  }],
  profile: {
    bio: String,
    website: String
  },
  metadata: mongoose.Schema.Types.Mixed,
  userId: mongoose.Schema.Types.ObjectId,
  avatar: Buffer,
  preferences: {
    type: Map,
    of: String
  }
});

console.log('Part 1 — Data types defined\n');

const stringValidatorsSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required']
  },
  bio: {
    type: String,
    minlength: [10, 'Bio must be at least 10 characters'],
    maxlength: [500, 'Bio must be under 500 characters']
  },
  firstName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  countryCode: {
    type: String,
    uppercase: true,
    maxlength: 2
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'admin', 'moderator'],
      message: '{VALUE} is not a valid role'
    },
    default: 'user'
  },
  phone: {
    type: String,
    match: [/^\d{10}$/, 'Phone must be exactly 10 digits']
  },
  password: {
    type: String,
    validate: {
      validator: function(val) {
        return val.length >= 8 && /[A-Z]/.test(val) && /[0-9]/.test(val);
      },
      message: 'Password must be at least 8 characters with one uppercase letter and one number'
    }
  }
});

console.log('Part 2 — String validators defined\n');

const numberValidatorsSchema = new mongoose.Schema({
  age: {
    type: Number,
    min: [0, 'Age cannot be negative'],
    max: [120, 'Age seems too high']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  discount: {
    type: Number,
    validate: {
      validator: function(val) {
        return val >= 0 && val <= 100;
      },
      message: 'Discount must be between 0 and 100'
    }
  }
});

console.log('Part 3 — Number validators defined\n');

const dateSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    validate: {
      validator: function(val) {
        return val > new Date();
      },
      message: 'Expiry date must be in the future'
    }
  },
  birthday: {
    type: Date,
    validate: {
      validator: function(val) {
        return val < new Date();
      },
      message: 'Birthday must be in the past'
    }
  }
});

console.log('Part 4 — Date validators defined\n');

const defaultsSchema = new mongoose.Schema({
  role: { type: String, default: 'user' },
  isActive: { type: Boolean, default: true },
  loginCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  token: {
    type: String,
    default: () => Math.random().toString(36).substring(2, 15)
  },
  tags: { type: [String], default: [] },
  settings: {
    type: Object,
    default: { theme: 'dark', notifications: true }
  }
});

console.log('Part 5 — Defaults defined\n');

const schemaOptionsSchema = new mongoose.Schema(
  {
    name: String,
    email: String
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    collection: 'users',
    strict: true
  }
);

console.log('Part 6 — Schema options defined\n');

const indexSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    sparse: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

console.log('Part 7 — Indexes defined\n');

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  country: { type: String, required: true, trim: true },
  zipCode: { type: String, trim: true }
}, { _id: false });

const socialSchema = new mongoose.Schema({
  platform: {
    type: String,
    enum: ['twitter', 'linkedin', 'github', 'instagram'],
    required: true
  },
  url: { type: String, required: true, trim: true }
}, { _id: false });

const userProfileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, unique: true },
    address: addressSchema,
    socialLinks: [socialSchema],
    settings: {
      theme: { type: String, enum: ['light', 'dark'], default: 'dark' },
      emailNotifications: { type: Boolean, default: true },
      language: { type: String, default: 'en' }
    }
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

userProfileSchema.virtual('firstName').get(function() {
  return this.name.split(' ')[0];
});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

console.log('Part 8 — Nested schemas defined\n');

console.log('--- Testing validators ---\n');

try {
  const user = new UserProfile({
    name: 'Sandesh Karki',
    email: 'sandesh@example.com',
    address: {
      street: '123 Main St',
      city: 'Kathmandu',
      country: 'Nepal'
    },
    socialLinks: [
      { platform: 'github', url: 'https://github.com/sandesh' },
      { platform: 'linkedin', url: 'https://linkedin.com/in/sandesh' }
    ],
    settings: { theme: 'dark', emailNotifications: true }
  });
  await user.validate();
  console.log('Test 1 passed: Valid document');
} catch (err) {
  console.log('Test 1 failed:', err.message);
}

try {
  const user = new UserProfile({ email: 'test@example.com' });
  await user.validate();
  console.log('Test 2 failed: Should have thrown');
} catch (err) {
  console.log('Test 2 passed: Missing name caught —', Object.keys(err.errors)[0]);
}

try {
  const user = new UserProfile({
    name: 'Test User',
    email: 'test2@example.com',
    socialLinks: [{ platform: 'facebook', url: 'https://facebook.com/test' }]
  });
  await user.validate();
  console.log('Test 3 failed: Should have thrown');
} catch (err) {
  console.log('Test 3 passed: Invalid platform caught —', err.errors['socialLinks.0.platform']?.message);
}

try {
  const user = new UserProfile({
    name: 'Test User',
    email: 'test3@example.com',
    settings: { theme: 'blue' }
  });
  await user.validate();
  console.log('Test 4 failed: Should have thrown');
} catch (err) {
  console.log('Test 4 passed: Invalid theme caught —', err.errors['settings.theme']?.message);
}

const userWithDefaults = new UserProfile({
  name: 'Default User',
  email: 'defaults@example.com'
});
console.log('\n--- Defaults ---');
console.log('Theme default:', userWithDefaults.settings.theme);
console.log('Notifications default:', userWithDefaults.settings.emailNotifications);
console.log('Language default:', userWithDefaults.settings.language);
console.log('Social links default:', userWithDefaults.socialLinks);

console.log('\n--- Virtuals ---');
console.log('First name virtual:', userWithDefaults.firstName);

const UserSimple = mongoose.model('UserSimple', new mongoose.Schema({
  email: { type: String, lowercase: true, trim: true },
  code: { type: String, uppercase: true }
}));

const u = new UserSimple({ email: '  HELLO@EXAMPLE.COM  ', code: 'abc' });
await u.validate();
console.log('\n--- String transformations ---');
console.log('Email lowercased + trimmed:', u.email);
console.log('Code uppercased:', u.code);

await mongoose.connection.close();
console.log('\nDone! Connection closed.');
