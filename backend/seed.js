const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const dns = require('dns');

dns.setServers(["1.1.1.1", "8.8.8.8"]);
dotenv.config();

const sampleProducts = [
  {
    name: "Cosy 3-Seater Fabric Sofa",
    description: "Ultra-comfortable high-density foam sofa upholstered in premium breathable grey fabric. Perfect for modern apartments.",
    category: "furniture",
    subCategory: "sofa",
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800"],
    monthlyRent: 29,
    securityDeposit: 99,
    tenureOptions: [{ months: 3, discountPercentage: 0 }, { months: 6, discountPercentage: 10 }, { months: 12, discountPercentage: 20 }],
    stock: 5
  },
  {
    name: "Solid Wood King Size Bed",
    description: "Sturdy solid engineered wood bed frame with a sleek walnut finish. Includes a premium orthopaedic memory-foam mattress.",
    category: "furniture",
    subCategory: "bed",
    images: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800"],
    monthlyRent: 35,
    securityDeposit: 120,
    tenureOptions: [{ months: 3, discountPercentage: 0 }, { months: 6, discountPercentage: 15 }, { months: 12, discountPercentage: 25 }],
    stock: 4
  },
  {
    name: "Ergonomic Office Desk & Chair Combo",
    description: "Height-adjustable modular study table paired with a breathable high-back mesh ergonomic chair featuring lumbar adjustment.",
    category: "furniture",
    subCategory: "table",
    images: ["https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800"],
    monthlyRent: 19,
    securityDeposit: 60,
    tenureOptions: [{ months: 3, discountPercentage: 0 }, { months: 6, discountPercentage: 10 }, { months: 12, discountPercentage: 20 }],
    stock: 8
  },
  {
    name: "Minimalist Wooden 4-Seater Dining Set",
    description: "Compact solid pine wood dining table accompanied by four matching cushioned high-back dining chairs.",
    category: "furniture",
    subCategory: "table",
    images: ["https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?q=80&w=800"],
    monthlyRent: 25,
    securityDeposit: 85,
    tenureOptions: [{ months: 3, discountPercentage: 0 }, { months: 6, discountPercentage: 12 }, { months: 12, discountPercentage: 25 }],
    stock: 3
  },
  {
    name: "Luxury Tufted Velvet Armchair",
    description: "Deep plush tufted armchair with gold accent metal legs. Adds an elegant touch to any reading nook or living room setup.",
    category: "furniture",
    subCategory: "sofa",
    images: ["https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=800"],
    monthlyRent: 15,
    securityDeposit: 50,
    tenureOptions: [{ months: 3, discountPercentage: 0 }, { months: 6, discountPercentage: 10 }, { months: 12, discountPercentage: 20 }],
    stock: 4
  },
  {
    name: "L-Shaped Modern Sectional Sofa",
    description: "Spacious 5-seater sectional sofa featuring modular configurations and water-resistant fabric upholstery. Includes matching accent pillows.",
    category: "furniture",
    subCategory: "sofa",
    images: ["https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=800"],
    monthlyRent: 49,
    securityDeposit: 180,
    tenureOptions: [{ months: 3, discountPercentage: 0 }, { months: 6, discountPercentage: 12 }, { months: 12, discountPercentage: 25 }],
    stock: 4
  },
  {
    name: "Queen Size Hydraulic Storage Bed",
    description: "Premium engineered wood queen bed featuring an effortless hydraulic lift storage mechanism and a medium-firm orthopaedic mattress.",
    category: "furniture",
    subCategory: "bed",
    images: ["https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=800"],
    monthlyRent: 32,
    securityDeposit: 110,
    tenureOptions: [{ months: 3, discountPercentage: 0 }, { months: 6, discountPercentage: 10 }, { months: 12, discountPercentage: 20 }],
    stock: 6
  },
  {
    name: "Industrial Metal & Wood Bookshelf",
    description: "5-tier open-shelf bookcase combining matte black iron framing with rustic walnut-finished solid wood planks.",
    category: "furniture",
    subCategory: "storage",
    images: ["https://images.unsplash.com/photo-1594620302200-9a762244a156?q=80&w=800"],
    monthlyRent: 14,
    securityDeposit: 45,
    tenureOptions: [{ months: 3, discountPercentage: 0 }, { months: 6, discountPercentage: 8 }, { months: 12, discountPercentage: 15 }],
    stock: 9
  },
  {
    name: "Compact Engineered Wood Wardrobe",
    description: "3-door spacious wardrobe outfitted with an integrated dressing mirror, hanging rods, and secure lockable drawers.",
    category: "furniture",
    subCategory: "storage",
    images: ["https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=800"],
    monthlyRent: 22,
    securityDeposit: 80,
    tenureOptions: [{ months: 3, discountPercentage: 0 }, { months: 6, discountPercentage: 10 }, { months: 12, discountPercentage: 18 }],
    stock: 5
  },
  {
    name: "Dual-Motor Electric Standing Desk",
    description: "Premium sit-stand office desk with digital memory preset switches and a heavy-duty anti-scratch walnut top finish.",
    category: "furniture",
    subCategory: "table",
    images: ["https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?q=80&w=800"],
    monthlyRent: 28,
    securityDeposit: 95,
    tenureOptions: [{ months: 3, discountPercentage: 0 }, { months: 6, discountPercentage: 10 }, { months: 12, discountPercentage: 20 }],
    stock: 6
  },

  {
    name: "Smart Double-Door Refrigerator (340L)",
    description: "Energy-efficient digital inverter double-door fridge with frost-free cooling technology and convertible freezer conversion levels.",
    category: "appliances",
    subCategory: "fridge",
    images: ["https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80"],
    monthlyRent: 45,
    securityDeposit: 150,
    tenureOptions: [{ months: 3, discountPercentage: 0 }, { months: 6, discountPercentage: 5 }, { months: 12, discountPercentage: 15 }],
    stock: 3
  },
  {
    name: "Fully Automatic Front Load Washer (8kg)",
    description: "Advanced direct-drive motor washing machine with multi-tier steam hygiene wash programs and custom speed configurations.",
    category: "appliances",
    subCategory: "washing machine",
    images: ["https://images.unsplash.com/photo-1582735689369-4fe89db7114c?q=80&w=800"],
    monthlyRent: 39,
    securityDeposit: 130,
    tenureOptions: [{ months: 3, discountPercentage: 0 }, { months: 6, discountPercentage: 8 }, { months: 12, discountPercentage: 18 }],
    stock: 5
  },
  {
    name: "4K Ultra HD Smart LED TV (55\")",
    description: "Cinematic slim-bezel television featuring Dolby Vision HDR, integrated streaming configurations, and voice assistant remote setups.",
    category: "appliances",
    subCategory: "TV",
    images: ["https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=800"],
    monthlyRent: 32,
    securityDeposit: 110,
    tenureOptions: [{ months: 3, discountPercentage: 0 }, { months: 6, discountPercentage: 10 }, { months: 12, discountPercentage: 22 }],
    stock: 6
  },
  {
    name: "Single Door Inverter Refrigerator (190L)",
    description: "Sleek, direct-cool single door refrigerator optimized for single individuals or studio student apartments.",
    category: "appliances",
    subCategory: "fridge",
    images: ["https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800"],
    monthlyRent: 22,
    securityDeposit: 75,
    tenureOptions: [{ months: 3, discountPercentage: 0 }, { months: 6, discountPercentage: 5 }, { months: 12, discountPercentage: 12 }],
    stock: 7
  },
  {
    name: "Smart Inverter Microwave Oven (28L)",
    description: "Convection microwave oven bundle equipped with autocook menus, touch control interfaces, and direct baking elements.",
    category: "appliances",
    subCategory: "appliances",
    images: ["https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?q=80&w=800"],
    monthlyRent: 12,
    securityDeposit: 40,
    tenureOptions: [{ months: 3, discountPercentage: 0 }, { months: 6, discountPercentage: 5 }, { months: 12, discountPercentage: 15 }],
    stock: 10
  },
  
  {
    name: "Split Air Conditioner (1.5 Ton, 5-Star)",
    description: "High-efficiency twin-rotary inverter split AC. Features ultra-fast cooling configurations and an anti-bacterial PM2.5 filter system.",
    category: "appliances",
    subCategory: "AC",
    images: ["https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800"],
    monthlyRent: 38,
    securityDeposit: 150,
    tenureOptions: [{ months: 3, discountPercentage: 0 }, { months: 6, discountPercentage: 10 }, { months: 12, discountPercentage: 20 }],
    stock: 7
  },
  {
    name: "OLED 4K Cinema TV (65\")",
    description: "Flagship self-lit OLED television featuring perfect blacks, Dolby Atmos surround sound, and advanced high-refresh gaming configurations.",
    category: "appliances",
    subCategory: "TV",
    images: ["https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=800"],
    monthlyRent: 55,
    securityDeposit: 200,
    tenureOptions: [{ months: 3, discountPercentage: 0 }, { months: 6, discountPercentage: 12 }, { months: 12, discountPercentage: 25 }],
    stock: 3
  },
  {
    name: "Digital Air Fryer (4.5L)",
    description: "Rapid air circulation fryer with single-touch pre-sets and an easy-to-clean non-stick dishwasher-safe basket.",
    category: "appliances",
    subCategory: "appliances",
    images: ["https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?q=80&w=800"],
    monthlyRent: 11,
    securityDeposit: 35,
    tenureOptions: [{ months: 3, discountPercentage: 0 }, { months: 6, discountPercentage: 5 }, { months: 12, discountPercentage: 15 }],
    stock: 12
  },
  {
    name: "HEPA Filter Smart Air Purifier",
    description: "True HEPA filtration air purifier eliminating 99.97% of allergens, smoke particles, and odors with real-time AQI tracking.",
    category: "appliances",
    subCategory: "electronics",
    images: ["https://images.unsplash.com/photo-1585771724684-38269d6639fd?q=80&w=800"],
    monthlyRent: 16,
    securityDeposit: 50,
    tenureOptions: [{ months: 3, discountPercentage: 0 }, { months: 6, discountPercentage: 10 }, { months: 12, discountPercentage: 20 }],
    stock: 8
  }
];
const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to database for batch seeding...");
    
    await Product.deleteMany();
    await Product.insertMany(sampleProducts);
    
    console.log("Database successfully populated with 10 premium rental items!");
    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();