// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Replace with your actual MongoDB connection string and target database name
const MONGODB_URI = 'mongodb+srv://stevengourgy:1234@cluster0.r8ei8lm.mongodb.net/myDatabase?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

/* --- Product Model --- */
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  description: String,
  imageUrl: String,
  // New rating field (from 0 to 5)
  rating: { type: Number, default: 0 },
  // The creator’s (producer’s) user id
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

/* --- User Model --- */
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['consumer', 'producer'], default: 'consumer' },
  // For consumers, store an array of product references as their cart
  cart:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

/* --- Receipt Model --- */
const receiptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number
  }],
  total: Number,
  paymentInfo: {
    cardHolder: String,
    // Only storing the last 4 digits for safety.
    cardLast4: String,
    expiryDate: String,
    cvv: String
  },
  date: { type: Date, default: Date.now }
});
const Receipt = mongoose.model('Receipt', receiptSchema);

/* --- API Endpoints --- */

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if(existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Signin endpoint
app.post('/api/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ message: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    };
    res.json({ message: "Sign in successful", user: userData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user profile (with cart populated for consumers)
app.get('/api/users/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('cart');
    if(!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get products listed by a specific producer
app.get('/api/users/:userId/products', async (req, res) => {
  try {
    const products = await Product.find({ createdBy: req.params.userId });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add product (for producers; expects userId and rating in request body)
app.post('/api/products', async (req, res) => {
  const { name, price, category, description, imageUrl, userId, rating } = req.body;
  const product = new Product({ 
    name, 
    price, 
    category, 
    description, 
    imageUrl, 
    rating: rating || 0, 
    createdBy: userId 
  });
  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update product (only owner should update)
// Allow updating rating field as well.
app.put('/api/products/:id', async (req, res) => {
  const { name, price, category, description, imageUrl, rating } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    product.name = name;
    product.price = price;
    product.category = category;
    product.description = description;
    product.imageUrl = imageUrl;
    if (typeof rating !== 'undefined') {
      product.rating = rating;
    }
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    await product.remove();
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Consumer: Add product to cart
app.post('/api/users/:userId/cart', async (req, res) => {
  const { productId } = req.body;
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role !== 'consumer') return res.status(400).json({ message: "Only consumers have a cart" });
    user.cart.push(productId);
    await user.save();
    res.json({ message: "Product added to cart", cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Consumer: Remove product from cart
app.delete('/api/users/:userId/cart/:productId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.cart = user.cart.filter(item => item.toString() !== req.params.productId);
    await user.save();
    res.json({ message: "Product removed from cart", cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Payment / Checkout ---
// Updated checkout endpoint to expect detailed payment fields.
app.post('/api/checkout', async (req, res) => {
  const { userId, cardHolder, cardNumber, expiryDate, cvv } = req.body;
  try {
    const user = await User.findById(userId).populate('cart');
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.cart.length === 0) return res.status(400).json({ message: "Cart is empty" });
    let total = 0;
    const items = user.cart.map(item => {
      total += item.price;
      return {
        productId: item._id,
        name: item.name,
        price: item.price
      };
    });
    const last4 = cardNumber.replace(/\s+/g, '').slice(-4);
    const receipt = new Receipt({
      user: userId,
      products: items,
      total,
      paymentInfo: { cardHolder, cardLast4: last4, expiryDate, cvv }
    });
    await receipt.save();
    // Clear user's cart
    user.cart = [];
    await user.save();
    res.json({ message: "Payment successful", receipt });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get receipts for a user
app.get('/api/users/:userId/receipts', async (req, res) => {
  try {
    const receipts = await Receipt.find({ user: req.params.userId });
    res.json(receipts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Public endpoints for products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
