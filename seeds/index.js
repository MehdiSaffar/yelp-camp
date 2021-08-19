const mongoose = require('mongoose')
const Campground = require('../models/campground')
const Review = require('../models/review')

const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
    console.log('connected to mongodb')
})

const sample = arr => {
    return arr[Math.floor(Math.random() * arr.length)]
}

const seedDB = async () => {
    await Review.deleteMany({})
    await Campground.deleteMany({})

    for (let i = 0; i < 50; i++) {
        const city = sample(cities)
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            author: '611cca64e016e5510996a61c',
            location: `${city.city}, ${city.state}`,
            geometry: { coordinates: [10.63333, 35.83333], type: 'Point' },
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dyfqyifrh/image/upload/v1629378322/yelp-camp/leptoebdzweon5zo30ow.jpg',
                    filename: 'yelp-camp/leptoebdzweon5zo30ow'
                },
                {
                    url: 'https://res.cloudinary.com/dyfqyifrh/image/upload/v1629378323/yelp-camp/captl1gkyq4ggfxn9saf.jpg',
                    filename: 'yelp-camp/captl1gkyq4ggfxn9saf'
                },
                {
                    url: 'https://res.cloudinary.com/dyfqyifrh/image/upload/v1629378324/yelp-camp/yevpc2gde6loqdfa5iqe.jpg',
                    filename: 'yelp-camp/yevpc2gde6loqdfa5iqe'
                }
            ],
            description:
                'Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae numquam, ex aspernatur sint, itaque minima dolorum vel iure quae explicabo quas enim quaerat officia id odit. Ipsa hic corrupti ut.',
            price
        })
        await camp.save()
    }
}

seedDB().then(() => mongoose.connection.close())
