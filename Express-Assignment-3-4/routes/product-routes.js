// routes/product-routes.js

const express = require('express');
const router = express.Router();
const Product = require('../models/product');

router.get('/', async (req, res) => {
    try {
        // ---  Pagination Setup ---
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 3; // Setting a small limit for demo
        const skip = (page - 1) * limit;

        // ---  Filtering Setup ---
        let filter = {};
        const queryCategory = req.query.category;
        const priceMin = parseFloat(req.query.priceMin);
        const priceMax = parseFloat(req.query.priceMax);

        // Category Filter
        if (queryCategory && queryCategory !== 'All') {
            filter.category = queryCategory;
        }

        // Price Range Filter
        if (!isNaN(priceMin) && !isNaN(priceMax)) {
            filter.price = { $gte: priceMin, $lte: priceMax };
        } else if (!isNaN(priceMin)) {
            filter.price = { $gte: priceMin };
        } else if (!isNaN(priceMax)) {
            filter.price = { $lte: priceMax };
        }

        const products =  Product.find(filter)
            .skip(skip)
            .limit(limit);

        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limit);
        const categories = await Product.distinct('category');


        res.render('pages/products', {
            title: 'Our Products Collection',
            products: products,
            categories: categories,
            // Pagination/Filter data passed back to the view
            currentPage: page,
            totalPages: totalPages,
            currentLimit: limit,
            currentCategory: queryCategory || 'All',
            currentPriceMin: isNaN(priceMin) ? '' : priceMin,
            currentPriceMax: isNaN(priceMax) ? '' : priceMax,
        });

    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).send('Error loading products.');
    }
});

module.exports = router;