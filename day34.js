// Day 32 + 33- MongoDB Shell Commands & Advanced Queries
// 60 Day Backend Challenge
// use shopdb

// db.products.insertMany([
//   { name: "Laptop", price: 75000, category: "electronics", stock: 10, rating: 4.5, inStock: true },
//   { name: "Headphones", price: 2500, category: "electronics", stock: 50, rating: 4.2, inStock: true },
//   { name: "Keyboard", price: 3500, category: "electronics", stock: 0, rating: 4.8, inStock: false },
//   { name: "Desk", price: 12000, category: "furniture", stock: 5, rating: 3.9, inStock: true },
//   { name: "Chair", price: 8000, category: "furniture", stock: 8, rating: 4.1, inStock: true },
//   { name: "Notebook", price: 150, category: "stationery", stock: 200, rating: 3.5, inStock: true },
//   { name: "Pen", price: 50, category: "stationery", stock: 500, rating: 3.8, inStock: true },
//   { name: "Monitor", price: 25000, category: "electronics", stock: 0, rating: 4.7, inStock: false },
//   { name: "Backpack", price: 1500, category: "accessories", stock: 30, rating: 4.0, inStock: true },
//   { name: "Water Bottle", price: 400, category: "accessories", stock: 100, rating: 4.3, inStock: true }
// ]);


// ------------------------------------------------------------
// PART 1 - Basic Find Queries
// ------------------------------------------------------------

// Find all documents
// db.products.find()

// Find one document
// db.products.findOne({ category: "electronics" })

// Find all electronics
// db.products.find({ category: "electronics" })

// Find by exact price
// db.products.find({ price: 2500 })


// ------------------------------------------------------------
// PART 2 - Comparison Operators
// ------------------------------------------------------------

// $gt - greater than
// db.products.find({ price: { $gt: 5000 } })

// $gte — greater than or equal
// db.products.find({ price: { $gte: 8000 } })

// $lt — less than
// db.products.find({ price: { $lt: 1000 } })

// $lte — less than or equal
// db.products.find({ price: { $lte: 500 } })

// $ne — not equal
// db.products.find({ category: { $ne: "electronics" } })

// $in — matches any value in array
// db.products.find({ category: { $in: ["electronics", "furniture"] } })

// $nin — not in array
// db.products.find({ category: { $nin: ["stationery", "accessories"] } })


// ------------------------------------------------------------
// PART 3 - Logical Operators
// ------------------------------------------------------------

// $and — both conditions must be true
// db.products.find({
//   $and: [
//     { price: { $gt: 1000 } },
//     { category: "electronics" }
//   ]
// })

// Shorthand AND — same result, cleaner
// db.products.find({ price: { $gt: 1000 }, category: "electronics" })

// $or — at least one condition must be true
// db.products.find({
//   $or: [
//     { price: { $lt: 500 } },
//     { category: "furniture" }
//   ]
// })

// $not — inverts the condition
// db.products.find({ price: { $not: { $gt: 5000 } } })


// ------------------------------------------------------------
// PART 4 — Projections (select specific fields)
// ------------------------------------------------------------

// Return only name and price (exclude _id)
// db.products.find({}, { name: 1, price: 1, _id: 0 })

// Return everything except stock and rating
// db.products.find({}, { stock: 0, rating: 0 })

// Combine filter and projection
// db.products.find(
//   { category: "electronics" },
//   { name: 1, price: 1, rating: 1, _id: 0 }
// )


// ------------------------------------------------------------
// PART 5 — Sorting, Limiting, Skipping
// ------------------------------------------------------------

// Sort by price ascending (1 = asc, -1 = desc)
// db.products.find().sort({ price: 1 })

// Sort by price descending
// db.products.find().sort({ price: -1 })

// Limit to 3 results
// db.products.find().limit(3)

// Skip first 3, return next 3 (pagination)
// db.products.find().skip(3).limit(3)

// Top 3 most expensive
// db.products.find().sort({ price: -1 }).limit(3)

// Sort + projection combined
// db.products.find(
//   {},
//   { name: 1, price: 1, _id: 0 }
// ).sort({ price: -1 })


// ------------------------------------------------------------
// PART 6 — Update Operators
// ------------------------------------------------------------

// $set — update specific fields only
// db.products.updateOne(
//   { name: "Keyboard" },
//   { $set: { inStock: true, stock: 15 } }
// )

// $inc — increment or decrement a number
// db.products.updateOne(
//   { name: "Laptop" },
//   { $inc: { stock: -1 } }
// )

// $unset — remove a field entirely
// db.products.updateOne(
//   { name: "Pen" },
//   { $unset: { rating: "" } }
// )

// updateMany — update all matching documents
// db.products.updateMany(
//   { inStock: false },
//   { $set: { stock: 0 } }
// )


// ------------------------------------------------------------
// PART 7 — Counting and Existence
// ------------------------------------------------------------

// Count all documents
// db.products.countDocuments()

// Count with a filter
// db.products.countDocuments({ inStock: true })

// Find documents where a field exists
// db.products.find({ rating: { $exists: true } })

// Find documents where a field does NOT exist
// db.products.find({ rating: { $exists: false } })


// ------------------------------------------------------------
// PART 8 — Range Queries
// ------------------------------------------------------------

// Price between 1000 and 10000
// db.products.find({ price: { $gte: 1000, $lte: 10000 } })

// Rating between 4.0 and 4.5
// db.products.find({ rating: { $gte: 4.0, $lte: 4.5 } })


// ------------------------------------------------------------
// PART 9 — Text Search with Regex
// ------------------------------------------------------------

// Find products where name contains "key" (case insensitive)
// db.products.find({ name: { $regex: "key", $options: "i" } })

// Find products where name starts with "M"
// db.products.find({ name: { $regex: "^M", $options: "i" } })


// ------------------------------------------------------------
// PART 10 — Aggregation Pipeline
// ------------------------------------------------------------

// Average rating by category (sorted highest first)
// db.products.aggregate([
//   { $group: {
//     _id: "$category",
//     avgRating: { $avg: "$rating" },
//     totalProducts: { $sum: 1 }
//   }},
//   { $sort: { avgRating: -1 } }
// ])

// Total stock value per category (price x stock)
// db.products.aggregate([
//   { $match: { inStock: true } },
//   { $group: {
//     _id: "$category",
//     totalValue: { $sum: { $multiply: ["$price", "$stock"] } }
//   }}
// ])

// Most expensive product per category
// db.products.aggregate([
//   { $sort: { price: -1 } },
//   { $group: {
//     _id: "$category",
//     mostExpensive: { $first: "$name" },
//     price: { $first: "$price" }
//   }}
// ])


// ------------------------------------------------------------
// PART 11 — Delete
// ------------------------------------------------------------

// Delete one document
// db.products.deleteOne({ name: "Water Bottle" })

// Delete all out of stock products
// db.products.deleteMany({ inStock: false })

// Verify
// db.products.countDocuments()


// ------------------------------------------------------------
// PRACTICE EXERCISES — Try these without looking at notes
// ------------------------------------------------------------

// 1. Find all products where price is between 2000 and 20000 and they are in stock
// db.products.find({
//   price: { $gte: 2000, $lte: 20000 },
//   inStock: true
// })

// 2. Find the top 3 highest rated products showing only name and rating
// db.products.find(
//   {},
//   { name: 1, rating: 1, _id: 0 }
// ).sort({ rating: -1 }).limit(3)

// 3. Count how many products are in each category
// db.products.aggregate([
//   { $group: {
//     _id: "$category",
//     count: { $sum: 1 }
//   }}
// ])

// 4. Update all furniture items — increase their price by 500
// db.products.updateMany(
//   { category: "furniture" },
//   { $inc: { price: 500 } }
// )

// 5. Find all products whose name contains the letter "o"
// db.products.find({ name: { $regex: "o", $options: "i" } })

// 6. Find the cheapest product in the electronics category
// db.products.find(
//   { category: "electronics" },
//   { name: 1, price: 1, _id: 0 }
// ).sort({ price: 1 }).limit(1)