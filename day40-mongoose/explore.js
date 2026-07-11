import 'dotenv/config';
import mongoose from 'mongoose';

await mongoose.connect(process.env.MONGO_URI);
console.log('Connected to MongoDB');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  inStock: Boolean,
  tags: [String],         
  createdAt: Date,


  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,             
    lowercase: true,       
    minlength: [2, 'Title must be at least 2 characters'],
    maxlength: [100, 'Title must be under 100 characters']
  },

  category: {
    type: String,
    enum: {
      values: ['electronics', 'clothing', 'food', 'books'],
      message: '{VALUE} is not a valid category'
    },
    default: 'books'
  },

  // Number with range
  rating: {
    type: Number,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5'],
    default: 0
  },

  // Nested object
  dimensions: {
    width: Number,
    height: Number,
    unit: { type: String, default: 'cm' }
  },

  // Custom validator
  discount: {
    type: Number,
    validate: {
      validator: function(val) {
        return val >= 0 && val <= 100;
      },
      message: 'Discount must be between 0 and 100'
    }
  }
}, {
  timestamps: true  // adds createdAt and updatedAt automatically
});


productSchema.methods.getPriceAfterDiscount = function() {
  return this.price - (this.price * (this.discount / 100));
};

productSchema.methods.getSummary = function() {
  return `${this.title} — $${this.price} (${this.category})`;
};


productSchema.statics.findByCategory = function(category) {
  return this.find({ category });
};

productSchema.statics.findCheaperThan = function(price) {
  return this.find({ price: { $lt: price } }).sort({ price: 1 });
};




productSchema.virtual('priceInRupees').get(function() {
  return `Rs. ${(this.price * 133).toFixed(0)}`;
});

productSchema.virtual('isExpensive').get(function() {
  return this.price > 100;
});

// Make virtuals show up in JSON responses
productSchema.set('toJSON', { virtuals: true });


// pre('save') - runs before every .save() call
productSchema.pre('save', function() {
  console.log(`About to save: ${this.title}`);
});

// post('save') - runs after every .save() call
productSchema.post('save', function(doc) {
  console.log(`Successfully saved: ${doc.title} with ID: ${doc._id}`);
});

// pre('findOneAndUpdate') - runs before findByIdAndUpdate
productSchema.pre('findOneAndUpdate', function() {
  this.set({ updatedAt: new Date() });
});

const Product = mongoose.model('Product', productSchema);


// Clean up first
await Product.deleteMany({});

// Create a product
const laptop = new Product({
  title: '  Gaming Laptop  ', // trim will clean this
  price: 1200,
  inStock: true,
  tags: ['gaming', 'electronics'],
  category: 'electronics',
  rating: 4.5,
  discount: 10,
  dimensions: { width: 35, height: 25 }
});

await laptop.save();

console.log('\n--- Instance Methods ---');
console.log('Summary:', laptop.getSummary());
console.log('Price after discount:', laptop.getPriceAfterDiscount());
console.log('Title after trim/lowercase:', laptop.title);

console.log('\n--- Virtual Fields ---');
console.log('Price in rupees:', laptop.priceInRupees);
console.log('Is expensive:', laptop.isExpensive);


await Product.create([
  { title: 'Python Book', price: 45, category: 'books', rating: 4.2, discount: 0 },
  { title: 'T-Shirt', price: 25, category: 'clothing', rating: 3.8, discount: 20 },
  { title: 'Coffee', price: 12, category: 'food', rating: 4.9, discount: 5 },
  { title: 'Node.js Book', price: 55, category: 'books', rating: 4.7, discount: 15 }
]);

console.log('\n--- Static Methods ---');
const books = await Product.findByCategory('books');
console.log('Books:', books.map(b => b.title));

const cheapProducts = await Product.findCheaperThan(50);
console.log('Products under $50:', cheapProducts.map(p => `${p.title} ($${p.price})`));


console.log('\n--- Query Chaining ---');


const topRated = await Product
  .find({ rating: { $gte: 4.5 } })
  .select('title price rating')  
  .sort({ rating: -1 })
  .limit(3);

console.log('Top rated products:', topRated);

const bookCount = await Product.countDocuments({ category: 'books' });
console.log('Total books:', bookCount);
const hasExpensive = await Product.exists({ price: { $gt: 1000 } });
console.log('Has expensive product:', !!hasExpensive);


console.log('\n--- Updating ---');

// findByIdAndUpdate
const updated = await Product.findByIdAndUpdate(
  laptop._id,
  { price: 999, discount: 15 },
  { new: true, runValidators: true }
);
console.log('Updated price:', updated.price);

// updateMany
const result = await Product.updateMany(
  { category: 'books' },
  { $inc: { price: 5 } } // increase all book prices by 5
);
console.log('Books updated:', result.modifiedCount);


console.log('\n--- Deleting ---');

const deleted = await Product.findByIdAndDelete(laptop._id);
console.log('Deleted:', deleted.title);

const deletedCount = await Product.deleteMany({ price: { $lt: 20 } });
console.log('Deleted cheap products:', deletedCount.deletedCount);

const remaining = await Product.countDocuments();
console.log('Remaining products:', remaining);


await mongoose.connection.close();
console.log('\nConnection closed. Done!');