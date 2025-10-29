const form = document.getElementById('checkoutForm');

form.addEventListener('submit', function (e) {
    e.preventDefault(); // Stop default submission
    let isValid = true;
    let firstInvalid = null;

    // Helper function to show/hide validation
    function validateField(input, condition, msg) {
        const feedback = input.nextElementSibling;
        if (!condition) {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
            if (feedback) feedback.textContent = msg;
            if (!firstInvalid) firstInvalid = input;
            isValid = false;
        } else {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
        }
    }

    // Validation rules
    const name = document.getElementById('name');
    validateField(name, name.value.trim().length >= 3, 'Name must be at least 3 characters.');

    const email = document.getElementById('email');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    validateField(email, emailPattern.test(email.value.trim()), 'Enter valid email.');

    const phone = document.getElementById('phone');
    validateField(phone, /^\d{10,}$/.test(phone.value.trim()), 'Phone must be at least 10 digits.');

    const address = document.getElementById('address');
    validateField(address, address.value.trim() !== '', 'Address required.');

    const city = document.getElementById('city');
    validateField(city, city.value.trim() !== '', 'City required.');

    const postal = document.getElementById('postal');
    validateField(postal, /^\d{4,6}$/.test(postal.value.trim()), 'Postal must be 4–6 digits.');

    const country = document.getElementById('country');
    validateField(country, country.value !== '', 'Select country.');

    // Payment method
    const cardPay = document.getElementById('cardPay');
    const codPay = document.getElementById('codPay');
    const cardInfo = document.getElementById('cardInfo');

    let paymentSelected = cardPay.checked || codPay.checked;
    if (!paymentSelected) {
        isValid = false;
        alert("Please select a payment method.");
    }

    // Card fields only if card selected
    if (cardPay.checked) {
        const cardName = document.getElementById('cardName');
        const cardNumber = document.getElementById('cardNumber');
        const expiry = document.getElementById('expiry');
        const cvv = document.getElementById('cvv');

        validateField(cardName, cardName.value.trim() !== '', 'Card name required.');
        validateField(cardNumber, /^\d{16}$/.test(cardNumber.value.trim()), 'Card must be 16 digits.');
        validateField(expiry, /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry.value.trim()), 'Expiry must be MM/YY.');
        validateField(cvv, /^\d{3,4}$/.test(cvv.value.trim()), 'CVV must be 3–4 digits.');
    }

    // Terms checkbox
    const terms = document.getElementById('terms');
    if (!terms.checked) {
        terms.classList.add('is-invalid');
        if (!firstInvalid) firstInvalid = terms;
        isValid = false;
    } else {
        terms.classList.remove('is-invalid');
    }

    // Scroll to first invalid field
    if (!isValid && firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Success message
    if (isValid) {
        alert('✅ Order placed successfully!');
        form.reset();
        document.querySelectorAll('.is-valid').forEach(i => i.classList.remove('is-valid'));
    }
});

// Remove error message when user starts typing
form.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('input', () => {
        input.classList.remove('is-invalid');
    });
});

// Toggle card fields
const cardPay = document.getElementById('cardPay');
const codPay = document.getElementById('codPay');
const cardInfo = document.getElementById('cardInfo');
codPay.addEventListener('change', () => cardInfo.style.display = codPay.checked ? 'none' : 'block');
cardPay.addEventListener('change', () => cardInfo.style.display = cardPay.checked ? 'block' : 'none');

