const express = require('express')
const morgan = require('morgan')
const fs = require('fs')

const app = express()

switch(app.get('env')) {
    case 'development':
        app.use(morgan('dev'))
        break
    case 'production':
        const stream = fs.createWriteStream(__dirname + '/access.log', { flags: 'a' })
        app.use(morgan('combined', { stream }))
        break
}

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Express started in ${app.get('env')} mode at http://localhost:${port}; press Ctl+C to terminate.`)
})
