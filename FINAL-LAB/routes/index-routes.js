// routes/index-routes.js

const express = require('express');
const router = express.Router();

// Home Page
router.get('/', (req, res) => {
    res.render('pages/index', { 
        title: 'BeSport - Boost Your Power Now' 
    });
});

router.get('/company', (req, res) => {
    res.render('pages/company', { 
        title: 'Company - BeSport' 
    });
});

// routes/index-routes.js

router.get('/sport-stars', (req, res) => {
    const stars = [
        { name: 'ALEX JOHNSON', sport: 'RUNNING', image: 'sport-star1.jpg' },
        { name: 'MARIA GARCIA', sport: 'FITNESS', image: 'sport-star2.jpg' },
        { name: 'JAMES SMITH', sport: 'BASKETBALL', image: 'sport-star3.jpg' },
        { name: 'LUCY REED', sport: 'CROSSFIT', image: 'sport-star4.jpg' },
        { name: 'KEVIN LEE', sport: 'CYCLING', image: 'sport-star5.jpg' },
        { name: 'SARA CONNOR', sport: 'YOGA', image: 'sport-star6.jpg' }
    ];
    
    res.render('pages/sport-stars', { 
        title: 'Sport Stars - BeSport',
        stars: stars
    });
});

// Add other static routes here (e.g., COMPANY, SPORT STARS)

module.exports = router;