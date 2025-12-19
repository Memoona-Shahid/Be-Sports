// models/Product.js

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true, enum: ['Footwear', 'Apparel', 'Accessories', 'Nutrition'] },
    image: { type: String, required: true },
    description: { type: String, required: false },
    stock: { type: Number, default: 0, min: 0 }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product; 