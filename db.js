module.exports = {
    getVacations: async (options = {}) => {
        // make vacation data temporally
        const vacations = [
            {
                name: 'Hood River Day Trip',
                slug: 'hood-river-day-trip',
                category: 'Day Trip',
                sku: 'HR199',
                description: 'Spend a day sailing on the Columbia and enjoying craft beers in Hood River!',
                location: {
                    // after use geoCoding
                    search: 'Hood River, Oregon, USA',
                },
                price: 99.95,
                tags: ['day trip', 'hood river', 'sailing', 'windsurfing', 'breweries'],
                inSeason: true,
                maximumGuests: 16,
                available: true,
                packagesSold: 0,
            }
        ]
        // if there is a available option, this package will return
        if(options.available != undefined)
            return vacations.filter(({ available }) => available === options.available)
        return vacations
    },
    addVacationInSeasonListener: async (email, sku) => {
        // this will be written after
        // because of async func, return new Promise and this Promise interpreted with 'undefined'
    },
}
