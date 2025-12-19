const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); 
const Order = require('../models/Order');

// 1. Import the reusable middleware
const applyDiscount = require('../middleware/discountMiddleware'); 

// --- ROUTES ---

// Preview Route (Uses Task 2 Middleware)
router.get('/preview', applyDiscount, (req, res) => {
    res.render('order/preview', {
        title: 'Preview Your Order',
        cart: req.session.cart || [],
        subtotal: req.discountInfo.subtotal,
        discount: req.discountInfo.discount,
        // Make sure this matches the property name in discountMiddleware.js
        grandTotal: req.discountInfo.grandTotal, 
        couponCode: req.discountInfo.couponCode
    });
});

/// routes/order-routes.js

router.post('/confirm', applyDiscount, async (req, res) => {
    try {
        // DEBUG: Check if user data exists
        console.log("Current User in Session:", req.session.user);

        if (!req.session.user || !req.session.user.email) {
            return res.status(401).send("Error: You must be logged in with a valid email to place an order.");
        }

        const { address, phone } = req.body;

        const newOrder = new Order({
            items: req.session.cart,
            totalPrice: req.discountInfo.grandTotal,
            email: req.session.user.email, // If this is undefined, the error triggers
            address: address,
            phone: phone,
            status: 'Placed'
        });

        await newOrder.save();
        req.session.cart = []; 
        res.render('order/success', { title: 'Order Placed', order: newOrder });
    } catch (err) {
        console.error("Mongoose Save Error:", err);
        res.status(500).send("Error saving order: " + err.message);
    }
});
// routes/order-routes.js

// --- TASK 3: USER ORDER HISTORY ---
router.get('/my-orders', async (req, res) => {
    try {
        // Now that session.user.email exists, this will work!
        const orders = await Order.find({ email: req.session.user.email }).sort({ createdAt: -1 });
        res.render('order/my-orders', { title: 'My Orders', orders });
    } catch (err) {
        res.status(500).send("Error loading history.");
    }
});

// --- TASK 4: ADMIN ORDER MANAGEMENT ---

// 1. View All Orders (Admin Dashboard)
router.get('/admin/manage', authMiddleware, async (req, res) => {
    try {
        if (req.session.user.role !== 'admin') {
            return res.status(403).send("Access Denied");
        }

        const allOrders = await Order.find().sort({ createdAt: -1 });

        // TELL EJS TO USE THE ADMIN LAYOUT
        res.render('order/admin-orders', { 
            title: 'Admin: Manage All Orders', 
            orders: allOrders,
            layout: 'layouts/admin-layout' // <--- Add this line!
        });
    } catch (err) {
        res.status(500).send("Error");
    }
});

// 2. Update Order Status
router.post('/admin/update-status', authMiddleware, async (req, res) => {
    try {
        const { orderId, newStatus } = req.body;

        // Find the order by ID and update its status field
        await Order.findByIdAndUpdate(orderId, { status: newStatus });

        // Redirect back to the list so the admin sees the update
        res.redirect('/order/admin/manage');
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to update order status.");
    }
});
module.exports = router;