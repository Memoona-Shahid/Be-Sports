// middleware/discountMiddleware.js
const applyDiscount = (req, res, next) => {
    const cart = req.session.cart || [];
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const coupon = req.query?.coupon || req.body?.coupon; 
    let discount = 0;

    if (coupon === 'SAVE10') {
        discount = subtotal * 0.10;
    }

    req.discountInfo = {
        subtotal,
        discount,
        grandTotal: subtotal - discount, // Use 'grandTotal' here
        couponCode: coupon || ""
    };
    next();
};

module.exports = applyDiscount;