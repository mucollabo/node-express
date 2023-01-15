const nodemailer = require('nodemailer')

const credentials = require('./credentials')

const mailTransport = nodemailer.createTransport({
    auth: {
        user: credentials.sendgrid.user,
        pass: credentials.sendgrid.password,
    }
})