$(document).ready(function () {

    // When form is submitted
    $('#checkoutForm').submit(function (e) {
        e.preventDefault(); // stop page refresh
        let isValid = true;
        let firstInvalid = null;

        // Simple helper function for validation
        function validateField($input, condition, message) {
            const $feedback = $input.next('.invalid-feedback');

            if (!condition) {
                $input.addClass('is-invalid').removeClass('is-valid');
                if ($feedback.length) $feedback.text(message);
                if (!firstInvalid) firstInvalid = $input;
                isValid = false;
            } else {
                $input.removeClass('is-invalid').addClass('is-valid');
            }
        }

        // Validate each field
        const $name = $('#name');
        validateField($name, $.trim($name.val()).length >= 3, 'Name must be at least 3 characters.');

        const $email = $('#email');
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        validateField($email, emailPattern.test($.trim($email.val())), 'Enter valid email.');

        const $phone = $('#phone');
        validateField($phone, /^\d{10,}$/.test($.trim($phone.val())), 'Phone must be at least 10 digits.');

        const $address = $('#address');
        validateField($address, $.trim($address.val()) !== '', 'Address required.');

        const $city = $('#city');
        validateField($city, $.trim($city.val()) !== '', 'City required.');

        const $postal = $('#postal');
        validateField($postal, /^\d{4,6}$/.test($.trim($postal.val())), 'Postal must be 4–6 digits.');

        const $country = $('#country');
        validateField($country, $country.val() !== '', 'Select country.');

        // Payment method
        const $cardPay = $('#cardPay');
        const $codPay = $('#codPay');
        const $cardInfo = $('#cardInfo');

        const paymentSelected = $cardPay.is(':checked') || $codPay.is(':checked');
        if (!paymentSelected) {
            alert("Please select a payment method.");
            isValid = false;
        }

        // If Card is selected → validate card fields
        if ($cardPay.is(':checked')) {
            const $cardName = $('#cardName');
            const $cardNumber = $('#cardNumber');
            const $expiry = $('#expiry');
            const $cvv = $('#cvv');

            validateField($cardName, $.trim($cardName.val()) !== '', 'Card name required.');
            validateField($cardNumber, /^\d{16}$/.test($.trim($cardNumber.val())), 'Card must be 16 digits.');
            validateField($expiry, /^(0[1-9]|1[0-2])\/\d{2}$/.test($.trim($expiry.val())), 'Expiry must be MM/YY.');
            validateField($cvv, /^\d{3,4}$/.test($.trim($cvv.val())), 'CVV must be 3–4 digits.');
        }

        // Terms checkbox
        const $terms = $('#terms');
        if (!$terms.is(':checked')) {
            $terms.addClass('is-invalid');
            if (!firstInvalid) firstInvalid = $terms;
            isValid = false;
        } else {
            $terms.removeClass('is-invalid');
        }

        // Scroll to first invalid field
        if (!isValid && firstInvalid) {
            $('html, body').animate({
                scrollTop: firstInvalid.offset().top - 100
            }, 500);
        }

        // Success message
        if (isValid) {
            alert('✅ Order placed successfully!');
            $('#checkoutForm')[0].reset();
            $('.is-valid').removeClass('is-valid');
        }
    });

    // Remove red border while typing
    $('#checkoutForm input, #checkoutForm select').on('input change', function () {
        $(this).removeClass('is-invalid');
    });

    // Toggle card fields visibility
    $('#codPay').change(function () {
        $('#cardInfo').toggle(!$(this).is(':checked'));
    });
    $('#cardPay').change(function () {
        $('#cardInfo').toggle($(this).is(':checked'));
    });

});