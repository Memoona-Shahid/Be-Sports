// models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            name: String,
            price: Number,
            quantity: Number
        }
    ],
    totalPrice: { type: Number, required: true },
    email: { type: String, required: true },
    // --- ADD THESE TWO ---
    address: { type: String, required: true },
    phone: { type: String, required: true },
    // --------------------
    status: { 
        type: String, 
        default: 'Placed', 
        enum: ['Placed', 'Processing', 'Delivered'] 
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);