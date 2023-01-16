// slightly modified version of the official W3C HTML5 email regex:
// https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
const VALID_EMAIL_REGEX = new RegExp('^[a-zA-Z0-9.!#$%&\'*+\/=?^_`{|}~-]+@' +
  '[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?' +
  '(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$')

// fake "newsletter signup" interface
class NewsletterSignup {
    constructor({ name, email }) {
      this.name = name
      this.email = email
    }
    async save() {
      // here's where we would do the work of saving to a database
      // since this method is async, it will return a promise, and
      // since we're not throwing any errors, the promise will
      // resolve successfully
    }
  }

const fortune = require('./fortune')

exports.home = (req, res) => {
    res.cookie('monster', 'nom nom')
    res.cookie('signed_monster', 'nom nom', { signed: true })
    res.render('home')
}

exports.about = (req, res) => res.render('about', { fortune: fortune.getFortune() })

exports.sectionTest = (req, res) => res.render('section-test')

// **** these handlers are for fetch/JSON form handlers
// exports.newsletter = (req, res) => {
//     res.render('newsletter', { csrf: 'CSRF token goes here' })
// }
// exports.api.newsletterSignup = (req, res) => {
//     console.log('CSRF token (from hidden form field): ' + req.body._csrf)
//     console.log('Name (from visible form field): ' + req.body.name)
//     console.log('Email (from visible form field): ' + req.body.email)
//     res.send({ result: 'success' })
// }
// **** end fetch/JSON form handlers

// **** these handlers are for browser-submitted forms
exports.newsletterSignup = (req, res) => {
    res.render('newsletter-signup', { csrf: 'CSRF token goes here' })
}
exports.newsletterSignupProcess = (req, res) => {
    const name = req.body.name || '', email = req.body.email || ''
    // test input availability
    if(!VALID_EMAIL_REGEX.test(email)) {
        req.session.flash = {
            type: 'danger',
            intro: 'Validation error!',
            message: 'The email address you entered was not valid.',
        }
        return res.redirect(303, '/newsletter-signup')
    }
    new NewsletterSignup({ name, email }).save()
        .then(() => {
            req.session.flash = {
                type: 'seccess',
                intro: 'Thank you!',
                message: 'You have now been signed up for the newsletter.',
            }
            return res.redirect(303, '/newsletter-archive')
        })
        .catch(err => {
            req.session.flash = {
                type: 'danger',
                intro: 'Database error!',
                message: 'There was a database error; please try again later.',
            }
            return res.redirect(303, '/newsletter-archive')
        })
    // console.log('Form (from querystring): ' + req.query.form)
    // console.log('CSRF token (from hidden form field): ' + req.body._csrf)
    // console.log('Name (from visible form field): ' + req.body.name)
    // console.log('Email (from visible form field): ' + req.body.email)
    // res.redirect(303, '/newsletter-signup/thank-you')
}
exports.newsletterSignupThankYou = (req, res) => res.render('newsletter-signup-thank-you')
// **** end browser-submitted form handlers

exports.newsletterArchive = (req, res) => res.render('newsletter-archive')

// exports.vacationPhotoContestProcess = (req, res, fields, files) => {
//     console.log('field data: ', fields)
//     console.log('files: ', files)
//     res.redirect(303, '/contest/vacation-photo-thank-you')
// }

// exports.api.vacationPhotoContest = (req, res, fields, files) => {
//     console.log('field data: ', fields)
//     console.log('files: ', files)
//     res.send({ result: 'success' })
// }

exports.notFound = (req, res) => res.render('404')

/* eslint-disable no-unused-vars */
exports.serverError = (err, req, res, next) => {
    console.log(err)
    res.render('500')
}
/* eslint-disable no-unused-vars */

exports.checkoutEmail = (req, res) => {
    // basket simulation code
    req.session.cart = {
        items: [
            { id: '82RgrqGCAHqCf6rA2vujbT', qty: 1, guests: 2 },
            { id: 'bqBtwqxpB4ohuxCBXRE9tq', qty: 1 },
        ],
    }
    res.render('checkoutEmail')
}

exports.checkoutEmailProcess = (req, res, next) => {
    const cart = req.session.cart

    res.render('email/cart-thank-you', { layout: null, cart: cart },
    (err, html) => {
        console.log('rendered email: ', html)
        if(err) console.log('error in email template')

    }
    )
}

