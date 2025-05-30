const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("../models/Product");

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

// Sample products data
const products = [
  {
    name: "Apple iPhone 13 Pro",
    description: "Latest flagship smartphone with advanced camera features",
    price: 999.99,
    stock: 50,
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-13-pro.jpg",
  },
  {
    name: "Samsung Galaxy S22",
    description: "Feature-rich Android smartphone with beautiful display",
    price: 899.99,
    stock: 45,
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s22-5g.jpg",
  },
  {
    name: "Sony WH-1000XM4 Headphones",
    description:
      "Wireless noise-cancelling headphones with exceptional sound quality",
    price: 349.99,
    stock: 30,
    imageUrl: "https://m.media-amazon.com/images/I/510cs9VwjUL._SL1000_.jpg",
  },
  {
    name: "Apple MacBook Pro M1",
    description: "Powerful laptop with Apple Silicon for professionals",
    price: 1299.99,
    stock: 20,
    imageUrl:
      "https://s3no.cashify.in/cashify/store/product/db0d6776744444f7bb068f06fda8b05d.png",
  },
  {
    name: "Nintendo Switch OLED",
    description: "Latest Nintendo gaming console with enhanced display",
    price: 349.99,
    stock: 25,
    imageUrl: "https://m.media-amazon.com/images/I/71Q54HnKxwS._SL1500_.jpg",
  },
];

// Import data into DB
const importData = async () => {
  try {
    await Product.deleteMany();
    await Product.insertMany(products);

    console.log("Data Imported!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete data from DB
const deleteData = async () => {
  try {
    await Product.deleteMany();

    console.log("Data Destroyed!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Check command line args
if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
} else {
  console.log("Please add proper command: -i (import) or -d (delete)");
  process.exit();
}
