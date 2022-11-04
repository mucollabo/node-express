const handlers = require('./lib/handlers')
const express = require('express')
const expressHandlebars = require('express-handlebars')
const app = express()
const weatherMiddleware = require('./lib/middleware/weather')
const bodyParser = require('body-parser')
const multiparty = require('multiparty')
const credentials = require('./.credentials.development')
const cookieParser = require('cookie-parser')
const expressSession = require('express-session')
const flashMiddleware = require('./lib/middleware/flash')


// configure handlebars view engine
app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main',
    helpers: {
        section: function(name, options) {
            if(!this._sections) this._sections = {}
            this._sections[name] = options.fn(this)
            return null
        },
    },
}))
app.use(flashMiddleware)

app.set('view engine', 'handlebars')

// add static middle ware
app.use(express.static(__dirname + '/public'))
app.use(weatherMiddleware)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser(credentials.cookieSecret))
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: credentials.cookieSecret,
}))


const port = process.env.PORT || 3000

app.get('/', handlers.home)

app.get('/about', handlers.about)

app.get('/section-test', handlers.sectionTest)

app.get('/newsletter-signup', handlers.newsletterSignup)
app.post('/newsletter-signup/process', handlers.newsletterSignupProcess)
app.get('/newsletter-signup/thank-you', handlers.newsletterSignupThankYou)
app.get('/newsletter-archive', handlers.newsletterSignupThankYou)

// handlers for fetch/JSON form submission
// app.get('/newsletter', handlers.newsletter)
// app.post('/api/newsletter-signup', handlers.api.newsletterSignup)

// vacation photo contest
app.post('/contest/vacation-photo/:year/:month', (req, res) => {
    const form = new multiparty.Form()
    form.parse(req, (err, fields, files) => {
        if(err) return res.status(500).send({ error: err.message })
        handlers.vacationPhotoContestProcess(req, res, fields, files)
    })
})

// custom 404 page
app.use(handlers.notFound)

// custom 500 page
app.use(handlers.serverError)



if (require.main === module) {
    app.listen(port, () => {
        console.log(`Express started on http://localhost:${port};` + `press Ctrl-C to terminate.`)
    })
} else {
    module.exports = app
}
