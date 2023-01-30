const { Pool } = require('pg')
const _ = require('lodash')

const credentials = require('./.credentials.development')

// const mongoose = require('mongoose')

// const { connectionString } = credentials.mongo
// if(!connectionString) {
//     console.error('MongoDB connection string missing!')
//     process.exit(1)
// }
const { connectionString } = credentials.postgres
const pool = new Pool({ connectionString })

// mongoose.connect(connectionString)

// const db = mongoose.connection
// db.on('error', err => {
//     console.error('MongoDB error: ' + err.message)
//     process.exit(1)
// })
// db.once('open', () => console.log('MongoDB connection established'))

// const Vacation = require('./models/vacation')
// Vacation.find((err, vacations) => {
//     if(err) return console.error(err)
//     if(vacations.length) return

//     new Vacation({
//         name: 'Hood River Day Trip',
//         slug: 'hood-river-day-trip',
//         category: 'Day Trip',
//         sku: 'HR199',
//         description: 'Spend a day sailing on the Columbia and enjoying craft beers in Hood River!',
//         location: {
//             search: 'Hood River, Oregon, USA',
//         },
//         price: 99.95,
//         tags: ['day trip', 'hood river', 'sailing', 'windsurfing', 'breweries'],
//         inSeason: true,
//         maximumGuests: 16,
//         available: true,
//         packagesSold: 0,
//     }).save()

//     new Vacation({
//         name: 'Oregon Coast Getaway',
//         slug: 'oregon-coast-getaway',
//         category: 'Weekend Getaway',
//         sku: 'OC39',
//         description: 'Enjoy the ocean air and quaint coastal towns!',
//         location: {
//             search: 'Canno Beach, Oregon, USA',
//         },
//         price: 269.95,
//         tags: ['weekend getaway', 'oregon coast', 'beachcombing'],
//         inSeason: false,
//         maximumGuests: 8,
//         available: true,
//         packagesSold: 0,
//     }).save()

//     new Vacation({
//         name: 'Rock Climbing in Bend',
//         slug: 'rock-climbing-in-bend',
//         category: 'Adventure',
//         sku: 'B99',
//         description: 'Experience the thrill of climbing in the high desert.',
//         location: {
//             search: 'Bend, Oregon, USA',
//         },
//         price: 289.95,
//         tags: ['weekend getaway', 'bend', 'high desert', 'rock climbing'],
//         inSeason: true,
//         maximumGuests: 4,
//         available: false,
//         packagesSold: 0,
//         notes: 'The tour guide is currently recovering from a skiing accident.',
//     }).save()
// })

// const VacationInSeasonListener = require('./models/vacationInSeasonListener')

// module.exports = {
//     getVacations: async (options = {}) => Vacation.find(options),
//     addVacationInSeasonListener: async (emai, sku) => {
//         await VacationInSeasonListener.updateOne(
//             { email },
//             { $push: { sku: sku }},
//             { upsert: true }
//         )
//     },
//     // {
//     //     // make vacation data temporally
//     //     const vacations = [
//     //         {
//     //             name: 'Hood River Day Trip',
//     //             slug: 'hood-river-day-trip',
//     //             category: 'Day Trip',
//     //             sku: 'HR199',
//     //             description: 'Spend a day sailing on the Columbia and enjoying craft beers in Hood River!',
//     //             location: {
//     //                 // after use geoCoding
//     //                 search: 'Hood River, Oregon, USA',
//     //             },
//     //             price: 99.95,
//     //             tags: ['day trip', 'hood river', 'sailing', 'windsurfing', 'breweries'],
//     //             inSeason: true,
//     //             maximumGuests: 16,
//     //             available: true,
//     //             packagesSold: 0,
//     //         }
//     //     ]
//     //     // if there is a available option, this package will return
//     //     if(options.available != undefined)
//     //         return vacations.filter(({ available }) => available === options.available)
//     //     return vacations
//     // },
//     addVacationInSeasonListener: async (email, sku) => {
//         // this will be written after
//         // because of async func, return new Promise and this Promise interpreted with 'undefined'
//     },
// }

module.exports = {
    getVacations: async () => {
        const { rows } = await pool.query('SELECT * FROM VACATIONS')
        return rows.map(row => {
            const vacation = _.mapKeys(row, (v, k) => _.camelCase(k))
            vacation.price = parseFloat(vacation.price.replace(/^\$/, ''))
            vacation.location = {
                search: vacation.locationSearch,
                coordinates: {
                    lat: vacation.locationLat,
                    lng: vacation.locationLng,
                },
            }
            return vacation
        })
    },
    addVacationInSeasonListener: async (email, sku) => {
        await pool.query(
            'INSERT INTO vacation_in_season_listeners (email, sku) ' +
            'VALUES ($1, $2) ' +
            'ON CONFLICT DO NOTHING',
            [email, sku]
        )
    },
}
