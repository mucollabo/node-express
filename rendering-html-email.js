app.post('/cart/checkout', (req, res, next) => {
    const cart = req.session.cart
    if(!cart) next(new Error('Cart does not exist.'))

    const name = req.body.name || '', email = req.body.email || ''

    // 입력 유효성 검사
    if(!email.match(VALID_EMAIL_REGEX))
        return res.next(new Error('Invalid email address.'))

    cart.number = Math.random().toString().replace(/^0\.0*/, '')
    cart.billing = {
        name: name,
        email: email,
    }

    res.render('email/cart-thank-you', { layout: null, cart: cart }, (err, html) => {
        console.log('rendered email: ', html)
        if(err) console.log('error in email template')

        mailTransport.sendMail({
            
        })
    })
})