const nodemailer = require('nodemailer')
const nodemailerSG = require('nodemailer-sendgrid')
const credentials = require('./.credentials.development')
// const sgMail = require('@sendgrid/mail')
// sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const transport = nodemailer.createTransport(
    nodemailerSG({
        apiKey: credentials.SENDGRID_API_KEY,
    })
)

const msg = {
    from: '"Meadowlark Travel" <charles01dev@naver.com>',
    to: 'mucollabo@gmail.com',
    subject: 'Your Meadowlark Travel Tour',
    text: 'Thank you for booking your trip with Meadowlark Travel. ' +
        'We look forward to your visit!',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}

async function send(msg) {
    try {
        const result = await transport.sendMail(msg)
        console.log('mail sent seccessfully: ', result)
    } catch(err) {
        console.log('could not send mail: ' + err.message)
    }
}

send(msg)

// sgMail
//   .send(msg)
//   .then(() => {
//     console.log('Email sent')
//   })
//   .catch((error) => {
//     console.error(error)
//   })

//ES6
// sgMail
//   .send(msg)
//   .then(() => {}, error => {
//     console.error(error);

//     if (error.response) {
//       console.error(error.response.body)
//     }
//   });
//ES8
// (async () => {
//   try {
//     await sgMail.send(msg);
//   } catch (error) {
//     console.error(error);

//     if (error.response) {
//       console.error(error.response.body)
//     }
//   }
// })();
