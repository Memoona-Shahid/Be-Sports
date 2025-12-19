const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const User = require('../models/User'); 
const isAdmin = require('../middleware/auth');

//  Protect all admin routes
router.use(isAdmin); 

router.use((req, res, next) => {
    res.locals.layout = 'layouts/admin-layout';
    next();
});

// --- DASHBOARD ---
router.get('/', async (req, res) => {
    try {
        const productCount = await Product.countDocuments();
        const userCount = await User.countDocuments();
        const lowStockItems = await Product.find({ stock: { $lt: 10 } });
        const recentProducts = await Product.find().sort({ _id: -1 }).limit(5);

        res.render('admin/dashboard', { 
            title: 'Admin Dashboard',
            stats: {
                totalProducts: productCount,
                totalUsers: userCount,
                lowStockCount: lowStockItems.length
            },
            recentProducts
        });
    } catch (e) {
        res.status(500).send('Error loading dashboard.');
    }
});

// --- INVENTORY LIST ---
router.get('/inventory', async (req, res) => {
    try {
        const products = await Product.find({});
        res.render('admin/product-list', { 
            title: 'Inventory Management',
            products: products 
        });
    } catch (e) {
        res.status(500).send('Error loading inventory.');
    }
});

// --- ADD PRODUCT ---
router.get('/inventory/add', (req, res) => {
    res.render('admin/add-edit-product', { 
        title: 'Add New Product',
        product: null, 
        isEdit: false 
    });
});

// --- ADD PRODUCT ---
router.post('/inventory/add', async (req, res) => {
    try {
        console.log("Adding Product Data:", req.body); // For debugging
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.redirect('/admin/inventory'); 
    } catch (e) { 
        console.error("Database Save Error:", e);
        res.status(400).send('Error saving to DB: ' + e.message); 
    }
});

// --- EDIT PRODUCT ---
router.get('/inventory/edit/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send('Product not found');
        
        res.render('admin/add-edit-product', { 
            title: 'Edit Product',
            product: product, 
            isEdit: true 
        });
    } catch (e) {
        res.status(500).send('Error loading product.');
    }
});

// --- UPDATE PRODUCT  ---
router.post('/inventory/edit/:id', async (req, res) => {
    try {
        console.log("Updating Product ID:", req.params.id);
        await Product.findByIdAndUpdate(req.params.id, req.body, { runValidators: true });
        res.redirect('/admin/inventory');
    } catch (e) {
        console.error("Update Error:", e);
        res.status(400).send('Error updating database: ' + e.message);
    }
});

// --- DELETE ---
router.post('/inventory/delete/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/admin/inventory');
    } catch (e) { res.status(500).send('Error deleting.'); }
});

module.exports = router;