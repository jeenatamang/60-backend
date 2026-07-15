
db.orders.insertMany([
  { customer: "Ram", product: "Laptop", category: "electronics", price: 75000, quantity: 1, status: "delivered", city: "Kathmandu", date: new Date("2026-01-15") },
  { customer: "Ankita", product: "Headphones", category: "electronics", price: 2500, quantity: 2, status: "delivered", city: "Pokhara", date: new Date("2026-01-20") },
  { customer: "Lamine", product: "Desk", category: "furniture", price: 12000, quantity: 1, status: "pending", city: "Kathmandu", date: new Date("2026-02-01") },
  { customer: "Ram", product: "Keyboard", category: "electronics", price: 3500, quantity: 1, status: "delivered", city: "Kathmandu", date: new Date("2026-02-10") },
  { customer: "Ankita", product: "Chair", category: "furniture", price: 8000, quantity: 2, status: "delivered", city: "Pokhara", date: new Date("2026-02-15") },
  { customer: "Lamine", product: "Notebook", category: "stationery", price: 150, quantity: 10, status: "delivered", city: "Lalitpur", date: new Date("2026-03-01") },
  { customer: "Ram", product: "Monitor", category: "electronics", price: 25000, quantity: 1, status: "cancelled", city: "Kathmandu", date: new Date("2026-03-05") },
  { customer: "Jungkook", product: "Laptop", category: "electronics", price: 75000, quantity: 1, status: "delivered", city: "Pokhara", date: new Date("2026-03-10") },
  { customer: "Jungkook", product: "Chair", category: "furniture", price: 8000, quantity: 1, status: "pending", city: "Pokhara", date: new Date("2026-03-15") },
  { customer: "Lamine", product: "Pen", category: "stationery", price: 50, quantity: 20, status: "delivered", city: "Lalitpur", date: new Date("2026-03-20") },
  { customer: "Ram", product: "Headphones", category: "electronics", price: 2500, quantity: 1, status: "delivered", city: "Kathmandu", date: new Date("2026-04-01") },
  { customer: "Ankita", product: "Laptop", category: "electronics", price: 75000, quantity: 1, status: "delivered", city: "Pokhara", date: new Date("2026-04-05") }
])


db.orders.aggregate([
  { $match: { status: "delivered" } }
])

db.orders.aggregate([
  { $match: { category: "electronics", price: { $gt: 10000 } } }
])


db.orders.aggregate([
  {
    $group: {
      _id: null,
      totalRevenue: { $sum: { $multiply: ["$price", "$quantity"] } },
      totalOrders: { $sum: 1 },
      avgOrderValue: { $avg: "$price" }
    }
  }
])

db.orders.aggregate([
  {
    $group: {
      _id: "$category",
      totalRevenue: { $sum: { $multiply: ["$price", "$quantity"] } },
      orderCount: { $sum: 1 },
      avgPrice: { $avg: "$price" }
    }
  }
])

db.orders.aggregate([
  {
    $group: {
      _id: "$customer",
      totalSpent: { $sum: { $multiply: ["$price", "$quantity"] } },
      orderCount: { $sum: 1 }
    }
  }
])


db.orders.aggregate([
  {
    $group: {
      _id: "$category",
      totalRevenue: { $sum: { $multiply: ["$price", "$quantity"] } }
    }
  },
  { $sort: { totalRevenue: -1 } }
])

db.orders.aggregate([
  {
    $group: {
      _id: "$customer",
      totalSpent: { $sum: { $multiply: ["$price", "$quantity"] } }
    }
  },
  { $sort: { totalSpent: -1 } }
])


db.orders.aggregate([
  {
    $project: {
      customer: 1,
      product: 1,
      totalValue: { $multiply: ["$price", "$quantity"] },
      _id: 0
    }
  }
])

db.orders.aggregate([
  {
    $project: {
      customer: 1,
      product: 1,
      price: 1,
      quantity: 1,
      totalValue: { $multiply: ["$price", "$quantity"] },
      isExpensive: { $gt: ["$price", 10000] }
    }
  }
])


db.orders.aggregate([
  { $sort: { price: -1 } },
  { $limit: 3 }
])

db.orders.aggregate([
  { $sort: { price: -1 } },
  { $skip: 3 },
  { $limit: 3 }
])


db.orders.aggregate([
  { $match: { status: "delivered" } },
  { $count: "deliveredOrders" }
])


db.orders.updateMany(
  { customer: "Ram" },
  { $set: { tags: ["loyal-customer", "tech-buyer"] } }
)

db.orders.aggregate([
  { $match: { tags: { $exists: true } } },
  { $unwind: "$tags" },
  { $group: { _id: "$tags", count: { $sum: 1 } } }
])


db.orders.aggregate([
  { $match: { status: "delivered" } },
  {
    $group: {
      _id: "$city",
      totalRevenue: { $sum: { $multiply: ["$price", "$quantity"] } },
      orderCount: { $sum: 1 },
      avgOrderValue: { $avg: { $multiply: ["$price", "$quantity"] } }
    }
  },
  { $sort: { totalRevenue: -1 } },
  {
    $project: {
      city: "$_id",
      totalRevenue: 1,
      orderCount: 1,
      avgOrderValue: { $round: ["$avgOrderValue", 0] },
      _id: 0
    }
  }
])


db.orders.aggregate([
  { $match: { status: "delivered" } },
  {
    $group: {
      _id: { category: "$category", customer: "$customer" },
      totalSpent: { $sum: { $multiply: ["$price", "$quantity"] } }
    }
  },
  { $sort: { totalSpent: -1 } },
  {
    $group: {
      _id: "$_id.category",
      topCustomer: { $first: "$_id.customer" },
      topSpend: { $first: "$totalSpent" }
    }
  },
  { $sort: { _id: 1 } }
])


db.orders.aggregate([
  { $match: { status: "delivered" } },
  {
    $group: {
      _id: {
        year: { $year: "$date" },
        month: { $month: "$date" }
      },
      monthlyRevenue: { $sum: { $multiply: ["$price", "$quantity"] } },
      orderCount: { $sum: 1 }
    }
  },
  { $sort: { "_id.year": 1, "_id.month": 1 } },
  {
    $project: {
      period: {
        $concat: [
          { $toString: "$_id.year" },
          "-",
          { $toString: "$_id.month" }
        ]
      },
      monthlyRevenue: 1,
      orderCount: 1,
      _id: 0
    }
  }
])


db.orders.aggregate([
  {
    $facet: {
      overview: [
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: { $multiply: ["$price", "$quantity"] } },
            avgOrderValue: { $avg: { $multiply: ["$price", "$quantity"] } }
          }
        }
      ],
      byStatus: [
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ],
      byCategory: [
        {
          $group: {
            _id: "$category",
            revenue: { $sum: { $multiply: ["$price", "$quantity"] } }
          }
        },
        { $sort: { revenue: -1 } }
      ]
    }
  }
])


db.orders.aggregate([
  { $match: { city: "Kathmandu", status: "delivered" } },
  {
    $group: {
      _id: null,
      totalRevenue: { $sum: { $multiply: ["$price", "$quantity"] } }
    }
  }
])

db.orders.aggregate([
  {
    $group: {
      _id: "$product",
      timesOrdered: { $sum: "$quantity" }
    }
  },
  { $sort: { timesOrdered: -1 } },
  { $limit: 1 }
])

db.orders.aggregate([
  {
    $group: {
      _id: "$customer",
      avgOrderValue: { $avg: { $multiply: ["$price", "$quantity"] } }
    }
  },
  { $sort: { avgOrderValue: -1 } }
])

db.orders.aggregate([
  { $match: { status: "cancelled" } },
  {
    $group: {
      _id: null,
      totalCancelledValue: { $sum: { $multiply: ["$price", "$quantity"] } }
    }
  }
])

db.orders.aggregate([
  { $match: { status: "delivered" } },
  {
    $group: {
      _id: { year: { $year: "$date" }, month: { $month: "$date" } },
      orderCount: { $sum: 1 }
    }
  },
  { $sort: { orderCount: -1 } },
  { $limit: 1 }
])
