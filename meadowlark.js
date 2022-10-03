const handlers = require('./lib/handlers')
const express = require('express')
const expressHandlebars = require('express-handlebars')
const app = express()

// set the handlebars view engine
app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

// add static middle ware
app.use(express.static(__dirname + '/public'))

const port = process.env.PORT || 3000

app.get('/', handlers.home)

app.get('/about', handlers.about)

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
