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
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description:
                'Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae numquam, ex aspernatur sint, itaque minima dolorum vel iure quae explicabo quas enim quaerat officia id odit. Ipsa hic corrupti ut.',
            price
        })
        await camp.save()
    }
}

seedDB().then(() => mongoose.connection.close())
