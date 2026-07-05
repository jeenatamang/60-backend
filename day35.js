import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

const dataset = [
  {
    brand_name: "Fenty Beauty",
    founded_year: 2017,
    founder: "Rihanna",
    headquarters: { city: "San Francisco", country: "USA" },
    cruelty_free: true,
    vegan_status: "partial",
    categories: ["complexion", "lips", "eyes", "body"],
    social_metrics: { instagram_followers_millions: 12.8, tiktok_engagement: "high" },
    hero_products: [
      { product_id: "FB-01", product_name: "Gloss Bomb Universal Lip Luminizer", type: "lip gloss", price: 21.00, rating: 4.7, tags: ["cult-favorite", "hydrating"], in_stock: true },
      { product_id: "FB-02", product_name: "Pro Filt'r Soft Matte Foundation", type: "foundation", price: 40.00, rating: 4.5, tags: ["inclusive-shades", "matte"], in_stock: true },
      { product_id: "FB-03", product_name: "Killawatt Freestyle Highlighter", type: "highlighter", price: 38.00, rating: 4.8, tags: ["shimmer"], in_stock: false }
    ]
  },
  {
    brand_name: "MAC Cosmetics",
    founded_year: 1984,
    founder: "Frank Toskan & Frank Angelo",
    headquarters: { city: "New York", country: "USA" },
    cruelty_free: false,
    vegan_status: "none",
    categories: ["lips", "complexion", "eyes", "tools"],
    social_metrics: { instagram_followers_millions: 24.1, tiktok_engagement: "medium" },
    hero_products: [
      { product_id: "MAC-01", product_name: "Matte Lipstick (Ruby Woo)", type: "lipstick", price: 23.00, rating: 4.9, tags: ["cult-favorite", "matte"], in_stock: true },
      { product_id: "MAC-02", product_name: "Prep + Prime Fix+", type: "setting spray", price: 33.00, rating: 4.6, tags: ["hydrating", "prep"], in_stock: true },
      { product_id: "MAC-03", product_name: "Studio Fix Fluid SPF 15", type: "foundation", price: 39.00, rating: 4.4, tags: ["matte", "full-coverage"], in_stock: true }
    ]
  },
  {
    brand_name: "Rare Beauty",
    founded_year: 2020,
    founder: "Selena Gomez",
    headquarters: { city: "El Segundo", country: "USA" },
    cruelty_free: true,
    vegan_status: "fully_vegan",
    categories: ["complexion", "lips", "eyes", "brows"],
    social_metrics: { instagram_followers_millions: 7.2, tiktok_engagement: "very_high" },
    hero_products: [
      { product_id: "RB-01", product_name: "Soft Pinch Liquid Blush", type: "blush", price: 23.00, rating: 4.9, tags: ["viral", "highly-pigmented"], in_stock: true },
      { product_id: "RB-02", product_name: "Positive Light Tinted Moisturizer", type: "foundation", price: 30.00, rating: 4.3, tags: ["dewy", "lightweight"], in_stock: true },
      { product_id: "RB-03", product_name: "Perfect Strokes Matte Liquid Liner", type: "eyeliner", price: 21.00, rating: 4.5, tags: ["waterproof"], in_stock: false }
    ]
  },
  {
    brand_name: "Glossier",
    founded_year: 2014,
    founder: "Emily Weiss",
    headquarters: { city: "New York", country: "USA" },
    cruelty_free: true,
    vegan_status: "partial",
    categories: ["skincare", "complexion", "brows", "lips"],
    social_metrics: { instagram_followers_millions: 2.9, tiktok_engagement: "high" },
    hero_products: [
      { product_id: "G-01", product_name: "Boy Brow", type: "brow pomade", price: 18.00, rating: 4.4, tags: ["cult-favorite", "natural"], in_stock: true },
      { product_id: "G-02", product_name: "Cloud Paint", type: "gel blush", price: 20.00, rating: 4.7, tags: ["dewy", "easy-apply"], in_stock: true },
      { product_id: "G-03", product_name: "Balm Dotcom", type: "lip balm", price: 14.00, rating: 4.2, tags: ["hydrating"], in_stock: true }
    ]
  },
  {
    brand_name: "Charlotte Tilbury",
    founded_year: 2013,
    founder: "Charlotte Tilbury",
    headquarters: { city: "London", country: "UK" },
    cruelty_free: true,
    vegan_status: "partial",
    categories: ["complexion", "lips", "eyes", "skincare"],
    social_metrics: { instagram_followers_millions: 6.1, tiktok_engagement: "medium" },
    hero_products: [
      { product_id: "CT-01", product_name: "Hollywood Flawless Filter", type: "primer", price: 49.00, rating: 4.6, tags: ["viral", "glowy"], in_stock: true },
      { product_id: "CT-02", product_name: "Matte Revolution (Pillow Talk)", type: "lipstick", price: 35.00, rating: 4.8, tags: ["cult-favorite", "nude"], in_stock: true },
      { product_id: "CT-03", product_name: "Airbrush Flawless Finish Powder", type: "powder", price: 48.00, rating: 4.7, tags: ["matte", "blurring"], in_stock: false }
    ]
  },
  {
    brand_name: "e.l.f. Cosmetics",
    founded_year: 2004,
    founder: "Joey Shamah & Scott Borba",
    headquarters: { city: "Oakland", country: "USA" },
    cruelty_free: true,
    vegan_status: "fully_vegan",
    categories: ["complexion", "eyes", "lips", "tools", "skincare"],
    social_metrics: { instagram_followers_millions: 6.8, tiktok_engagement: "very_high" },
    hero_products: [
      { product_id: "ELF-01", product_name: "Poreless Putty Primer", type: "primer", price: 10.00, rating: 4.5, tags: ["dupe-alert", "matte"], in_stock: true },
      { product_id: "ELF-02", product_name: "Power Grip Primer", type: "primer", price: 10.00, rating: 4.8, tags: ["viral", "gripping"], in_stock: true },
      { product_id: "ELF-03", product_name: "Halo Glow Liquid Filter", type: "primer", price: 14.00, rating: 4.7, tags: ["dupe-alert", "glowy"], in_stock: true }
    ]
  },
  {
    brand_name: "NARS Cosmetics",
    founded_year: 1994,
    founder: "François Nars",
    headquarters: { city: "New York", country: "USA" },
    cruelty_free: false,
    vegan_status: "none",
    categories: ["complexion", "lips", "eyes"],
    social_metrics: { instagram_followers_millions: 9.4, tiktok_engagement: "low" },
    hero_products: [
      { product_id: "NARS-01", product_name: "Radiant Creamy Concealer", type: "concealer", price: 32.00, rating: 4.8, tags: ["cult-favorite", "creamy"], in_stock: true },
      { product_id: "NARS-02", product_name: "Orgasm Blush", type: "blush", price: 32.00, rating: 4.7, tags: ["cult-favorite", "shimmer"], in_stock: true }
    ]
  },
  {
    brand_name: "Milk Makeup",
    founded_year: 2016,
    founder: "Mazdack Rassi & Zanna Roberts Rassi",
    headquarters: { city: "New York", country: "USA" },
    cruelty_free: true,
    vegan_status: "fully_vegan",
    categories: ["complexion", "brows", "lips", "skincare"],
    social_metrics: { instagram_followers_millions: 2.2, tiktok_engagement: "high" },
    hero_products: [
      { product_id: "MILK-01", product_name: "Hydro Grip Primer", type: "primer", price: 38.00, rating: 4.6, tags: ["gripping", "cult-favorite"], in_stock: true },
      { product_id: "MILK-02", product_name: "Lip + Cheek Cream Blush Stick", type: "blush", price: 24.00, rating: 4.4, tags: ["cream", "multi-use"], in_stock: true }
    ]
  },
  {
    brand_name: "Anastasia Beverly Hills",
    founded_year: 1997,
    founder: "Anastasia Soare",
    headquarters: { city: "Beverly Hills", country: "USA" },
    cruelty_free: true,
    vegan_status: "partial",
    categories: ["brows", "eyes", "complexion"],
    social_metrics: { instagram_followers_millions: 19.5, tiktok_engagement: "low" },
    hero_products: [
      { product_id: "ABH-01", product_name: "Brow Wiz", type: "brow pencil", price: 25.00, rating: 4.8, tags: ["cult-favorite", "precision"], in_stock: true },
      { product_id: "ABH-02", product_name: "Modern Renaissance Eyeshadow Palette", type: "eyeshadow", price: 45.00, rating: 4.9, tags: ["cult-favorite", "pigmented"], in_stock: false }
    ]
  },
  {
    brand_name: "Huda Beauty",
    founded_year: 2013,
    founder: "Huda Kattan",
    headquarters: { city: "Dubai", country: "UAE" },
    cruelty_free: true,
    vegan_status: "partial",
    categories: ["eyes", "complexion", "lips"],
    social_metrics: { instagram_followers_millions: 54.3, tiktok_engagement: "high" },
    hero_products: [
      { product_id: "HB-01", product_name: "Easy Bake Loose Powder", type: "powder", price: 38.00, rating: 4.7, tags: ["baking", "matte"], in_stock: true },
      { product_id: "HB-02", product_name: "FauxFilter Luminous Matte Foundation", type: "foundation", price: 42.00, rating: 4.5, tags: ["full-coverage"], in_stock: true }
    ]
  },
  {
    brand_name: "Merit Beauty",
    founded_year: 2021,
    founder: "Katherine Power",
    headquarters: { city: "Los Angeles", country: "USA" },
    cruelty_free: true,
    vegan_status: "fully_vegan",
    categories: ["complexion", "lips", "brows"],
    social_metrics: { instagram_followers_millions: 0.5, tiktok_engagement: "high" },
    hero_products: [
      { product_id: "MER-01", product_name: "The Minimalist Stick Foundation", type: "foundation", price: 38.00, rating: 4.2, tags: ["minimalist", "lightweight"], in_stock: true },
      { product_id: "MER-02", product_name: "Flush Balm Cream Blush", type: "blush", price: 30.00, rating: 4.6, tags: ["dewy", "sheer"], in_stock: true }
    ]
  },
  {
    brand_name: "Tower 28 Beauty",
    founded_year: 2019,
    founder: "Amy Liu",
    headquarters: { city: "Santa Monica", country: "USA" },
    cruelty_free: true,
    vegan_status: "fully_vegan",
    categories: ["complexion", "lips", "eyes"],
    social_metrics: { instagram_followers_millions: 0.6, tiktok_engagement: "very_high" },
    hero_products: [
      { product_id: "T28-01", product_name: "ShineOn Milky Lip Jelly", type: "lip gloss", price: 16.00, rating: 4.7, tags: ["viral", "glossy", "sensitive-skin"], in_stock: true },
      { product_id: "T28-02", product_name: "SOS Daily Rescue Facial Spray", type: "setting spray", price: 28.00, rating: 4.6, tags: ["sensitive-skin", "skincare"], in_stock: true }
    ]
  },
  {
    brand_name: "Kjaer Weis",
    founded_year: 2010,
    founder: "Kirsten Kjaer Weis",
    headquarters: { city: "New York", country: "USA" },
    cruelty_free: true,
    vegan_status: "partial",
    categories: ["complexion", "lips", "eyes"],
    social_metrics: { instagram_followers_millions: 0.3, tiktok_engagement: "low" },
    hero_products: [
      { product_id: "KW-01", product_name: "Cream Blush Refillable", type: "blush", price: 56.00, rating: 4.5, tags: ["luxury", "sustainable", "organic"], in_stock: true }
    ]
  },
  {
    brand_name: "Dior Backstage",
    founded_year: 1946,
    founder: "Christian Dior",
    headquarters: { city: "Paris", country: "France" },
    cruelty_free: false,
    vegan_status: "none",
    categories: ["complexion", "lips", "eyes"],
    social_metrics: { instagram_followers_millions: 45.0, tiktok_engagement: "medium" },
    hero_products: [
      { product_id: "DIOR-01", product_name: "Dior Addict Lip Glow Oil", type: "lip oil", price: 40.00, rating: 4.8, tags: ["viral", "luxury"], in_stock: false },
      { product_id: "DIOR-02", product_name: "Backstage Face & Body Foundation", type: "foundation", price: 43.00, rating: 4.6, tags: ["natural", "waterproof"], in_stock: true }
    ]
  },
  {
    brand_name: "Saie Beauty",
    founded_year: 2019,
    founder: "Gwyneth Paltrow & Laney Crowell",
    headquarters: { city: "New York", country: "USA" },
    cruelty_free: true,
    vegan_status: "partial",
    categories: ["complexion", "skincare"],
    social_metrics: { instagram_followers_millions: 0.4, tiktok_engagement: "high" },
    hero_products: [
      { product_id: "SAIE-01", product_name: "Glowy Super Gel", type: "primer", price: 28.00, rating: 4.7, tags: ["glowy", "clean-beauty"], in_stock: true }
    ]
  }
];

async function run() {
  try {
    await client.connect();
    console.log('Connected to MongoDB database successfully.');

    const db = client.db('beauty_db');
    const collection = db.collection('brands');

    await collection.deleteMany({});
    const insertResult = await collection.insertMany(dataset);
    console.log(`Successfully populated database with ${insertResult.insertedCount} brands.`);

    console.log('\n--- Query 1: US Brands with high engagement ---');
    const usBrands = await collection.find({
      'headquarters.country': 'USA',
      'social_metrics.tiktok_engagement': { $in: ['high', 'very_high'] }
    }).toArray();
    console.dir(usBrands, { depth: null });

    console.log('\n--- Query 2: Out of stock hero products under $40 ---');
    const cheapOutOfStock = await collection.find({
      hero_products: {
        $elemMatch: { in_stock: false, price: { $lt: 40.00 } }
      }
    }).toArray();
    console.dir(cheapOutOfStock, { depth: null });

    console.log('\n--- Query 3: Metrics Grouped By Vegan Status ---');
    const pipeline = [
      { $unwind: '$hero_products' },
      {
        $group: {
          _id: '$vegan_status',
          unique_brands: { $addToSet: '$brand_name' },
          avg_price: { $avg: '$hero_products.price' }
        }
      },
      {
        $project: {
          _id: 0,
          vegan_status: '$_id',
          total_brands: { $size: '$unique_brands' },
          average_product_price: { $round: ['$avg_price', 2] }
        }
      }
    ];

    const analytics = await collection.aggregate(pipeline).toArray();
    console.table(analytics);

  } catch (error) {
    console.error('An error occurred running the script:', error);
  } finally {
    await client.close();
    console.log('\nDatabase connection closed.');
  }
}

run();