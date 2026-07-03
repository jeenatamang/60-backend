
// Switch to database
// use quizdb


// INSERT
// Insert one document
db.results.insertOne({
playerName: "Sandesh",
score: 4,
total: 6,
percentage: 67,
playedAt: new Date()
})

// Insert multiple documents
db.results.insertMany([
{ playerName: "Aakriti", score: 6, total: 6, percentage: 100, playedAt: new Date() },
{ playerName: "Riya", score: 2, total: 6, percentage: 33, playedAt: new Date() }
])


// READ
// Get all documents
db.results.find()

// Filter (score > 3)
db.results.find({ score: { $gt: 3 } })

// Projection (only show name and score)
db.results.find({}, { playerName: 1, score: 1, _id: 0 })

// Count documents
db.results.countDocuments()


// SORT & LIMIT

// Sort by score (descending)
db.results.find().sort({ score: -1 })

// Get top scorer
db.results.find().sort({ score: -1 }).limit(1)

// UPDATE

// Update one document
db.results.updateOne(
{ playerName: "Riya" },
{ $set: { score: 5, percentage: 83 } }
)

// DELETE

// Delete one document
db.results.deleteOne({ playerName: "Riya" })

// EXTRA PRACTICE

// Find players with perfect score
db.results.find({ percentage: 100 })

// Delete all documents (be careful!)
db.results.deleteMany({})
