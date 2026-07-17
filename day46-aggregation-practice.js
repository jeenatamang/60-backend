db.brands.aggregate([
  {
    $group: {
      _id: "$vegan_status",
      count: { $sum: 1 }
    }
  },
  { $sort: { count: -1 } }
])

db.brands.aggregate([
  {
    $group: {
      _id: "$headquarters.country",
      avgFollowers: { $avg: "$social_metrics.instagram_followers_millions" },
      brandCount: { $sum: 1 }
    }
  },
  { $sort: { avgFollowers: -1 } }
])

db.brands.aggregate([
  {
    $group: {
      _id: "$cruelty_free",
      count: { $sum: 1 }
    }
  }
])

db.brands.aggregate([
  { $sort: { "social_metrics.instagram_followers_millions": -1 } },
  { $limit: 5 },
  {
    $project: {
      brand_name: 1,
      followers: "$social_metrics.instagram_followers_millions",
      _id: 0
    }
  }
])

db.brands.aggregate([
  { $unwind: "$hero_products" },
  {
    $group: {
      _id: "$brand_name",
      avgProductPrice: { $avg: "$hero_products.price" },
      totalProducts: { $sum: 1 }
    }
  },
  { $sort: { avgProductPrice: -1 } }
])

db.brands.aggregate([
  { $unwind: "$hero_products" },
  { $sort: { "hero_products.price": -1 } },
  { $limit: 1 },
  {
    $project: {
      brand_name: 1,
      product: "$hero_products.product_name",
      price: "$hero_products.price",
      _id: 0
    }
  }
])

db.brands.aggregate([
  { $unwind: "$hero_products" },
  {
    $group: {
      _id: "$hero_products.in_stock",
      count: { $sum: 1 }
    }
  }
])

db.brands.aggregate([
  {
    $group: {
      _id: {
        $concat: [
          { $toString: { $multiply: [{ $floor: { $divide: ["$founded_year", 10] } }, 10] } },
          "s"
        ]
      },
      brands: { $push: "$brand_name" },
      count: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } }
])

db.brands.aggregate([
  {
    $facet: {
      overview: [
        {
          $group: {
            _id: null,
            totalBrands: { $sum: 1 },
            crueltyFree: { $sum: { $cond: ["$cruelty_free", 1, 0] } },
            avgInstagramFollowers: { $avg: "$social_metrics.instagram_followers_millions" }
          }
        }
      ],
      byVeganStatus: [
        { $group: { _id: "$vegan_status", count: { $sum: 1 } } }
      ],
      byCountry: [
        { $group: { _id: "$headquarters.country", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ],
      topByFollowers: [
        { $sort: { "social_metrics.instagram_followers_millions": -1 } },
        { $limit: 3 },
        { $project: { brand_name: 1, followers: "$social_metrics.instagram_followers_millions", _id: 0 } }
      ]
    }
  }
])

db.jobs.aggregate([
  {
    $group: {
      _id: "$status",
      count: { $sum: 1 }
    }
  },
  { $sort: { count: -1 } }
])

db.jobs.aggregate([
  {
    $group: {
      _id: "$jobType",
      count: { $sum: 1 }
    }
  },
  { $sort: { count: -1 } }
])

db.jobs.aggregate([
  {
    $group: {
      _id: "$priority",
      count: { $sum: 1 }
    }
  }
])

db.jobs.aggregate([
  { $match: { "salary.min": { $ne: null }, "salary.max": { $ne: null } } },
  {
    $group: {
      _id: null,
      avgMinSalary: { $avg: "$salary.min" },
      avgMaxSalary: { $avg: "$salary.max" },
      highestOffer: { $max: "$salary.max" }
    }
  }
])

db.jobs.aggregate([
  {
    $group: {
      _id: {
        year: { $year: "$appliedAt" },
        month: { $month: "$appliedAt" }
      },
      count: { $sum: 1 }
    }
  },
  { $sort: { "_id.year": 1, "_id.month": 1 } }
])

db.jobs.aggregate([
  {
    $group: {
      _id: {
        $cond: [
          { $in: ["$status", ["rejected", "withdrawn"]] },
          "inactive",
          "active"
        ]
      },
      count: { $sum: 1 }
    }
  }
])

db.jobs.aggregate([
  {
    $facet: {
      overview: [
        {
          $group: {
            _id: null,
            totalApplications: { $sum: 1 },
            offers: { $sum: { $cond: [{ $eq: ["$status", "offer"] }, 1, 0] } },
            rejections: { $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] } },
            interviews: { $sum: { $cond: [{ $eq: ["$status", "interview"] }, 1, 0] } }
          }
        }
      ],
      byStatus: [
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ],
      byPriority: [
        { $group: { _id: "$priority", count: { $sum: 1 } } }
      ],
      recentApplications: [
        { $sort: { appliedAt: -1 } },
        { $limit: 5 },
        { $project: { company: 1, role: 1, status: 1, appliedAt: 1, _id: 0 } }
      ]
    }
  }
])
