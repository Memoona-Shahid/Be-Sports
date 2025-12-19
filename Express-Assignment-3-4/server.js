const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const bcrypt = require('bcryptjs');

// Models
const User = require('./models/User');
const Product = require('./models/product');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Database Connection ---
const DB_URI = 'mongodb://localhost:27017/besport_ecom';
mongoose.connect(DB_URI)
    .then(() => {
        console.log('Connected to MongoDB!');
        insertSampleData(); 
    })
    .catch(err => console.error('Could not connect to MongoDB:', err));

// ---  Middleware Setup ---
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session Configuration
app.use(session({
    secret: 'besport_secret_key_123', 
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 } // 1 hour
}));

app.use(flash());

// Global Variables Middleware (Passes user and messages to all EJS templates)
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

// ---  View Engine Configuration ---
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/default-layout'); 

// ---  Static Files ---
app.use(express.static(path.join(__dirname, 'public'))); 

// ---  Routing ---
const indexRouter = require('./routes/index-routes');
const productRouter = require('./routes/product-routes');
const adminRouter = require('./routes/admin-routes');
const authRouter = require('./routes/auth-routes');

app.use('/', indexRouter);
app.use('/products', productRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter); 

// ---  Sample Data Insertion  ---
async function insertSampleData() {
    try {
        //  Seed Admin User 
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await User.create({
                name: 'Admin User',
                email: 'admin@besport.com',
                password: hashedPassword,
                role: 'admin'
            });
            console.log('Admin user created: admin@besport.com / admin123');
        }

        //  Seed Products
        const productCount = await Product.countDocuments();
        if (productCount === 0) {
            const sampleProducts = [
                { name: "Performance Running Shoe", price: 120.50, category: "Footwear", image: "home_sport_shoe1.jpg", description: "High-performance shoe.", stock: 50 },
                { name: "Quick-Dry Training Top", price: 45.99, category: "Apparel", image: "home_sport_category2.jpg", description: "Breathable top.", stock: 120 },
                { name: "Compression Shorts", price: 30.00, category: "Apparel", image: "home_sport_category3.jpg", description: "Muscle support.", stock: 80 },
                { name: "Hydration Bottle (1L)", price: 15.75, category: "Accessories", image: "home_sport_category4.jpg", description: "BPA-free.", stock: 200 },
                { name: "Elite Basketball Sneaker", price: 180.00, category: "Footwear", image: "home_sport_shoe3.jpg", description: "Ankle support.", stock: 40 },
            ];
            await Product.insertMany(sampleProducts);
            console.log('Sample product data inserted.');
        }
    } catch (err) {
        console.error('Error during data seeding:', err);
    }
}

// ---  Error Handler ---
app.use(function (req, res, next) {
    res.status(404).render('pages/error', { title: '404 Not Found', layout: 'layouts/default-layout' });
});

// ---  Start Server ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});