if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const helmet = require('helmet')

const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const passport = require('passport')
const multer = require('multer')
const LocalStrategy = require('passport-local')

const User = require('./models/user')

const ExpressError = require('./utils/ExpressError')
const catchAsync = require('./utils/catchAsync')

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
const clientPromise = new Promise((a, b) => {
    db.once('open', function () {
        console.log('connected to mongodb')
        a(db.getClient())
    })
})

const app = express()

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

const secret = process.env.SECRET || 'thisisnotagoodsecret'
const MongoStore = require('connect-mongo')
const mongoStore = MongoStore.create({
    clientPromise,
    secret,
    touchAfter: 24 * 60 * 60 // in seconds
})

mongoStore.on('error', error => {
    console.error('SESSION STORE ERROR', error)
})

app.use(
    session({
        name: 'yc-sid',
        secret,
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            // secure: true,
            expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
            maxAge: 1000 * 60 * 60 * 24 * 7
        },
        store: mongoStore
    })
)
app.use(flash())
app.use(
    helmet({
        contentSecurityPolicy: false
    })
)
app.use(passport.initialize())
app.use(passport.session())
passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.currentUser = req.user
    return next()
})

const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews')
const users = require('./routes/users')

app.get('/fake-user', async (req, res) => {
    const user = new User({ email: 'colt@gmail.com', username: 'colt' })
    const newUser = await User.register(user, 'chicken')
    res.send(newUser)
})

app.use('/', users)
app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)

app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next) => {
    throw new ExpressError('Page not found', 404)
})

app.use((err, req, res, next) => {
    const { status = 500 } = err
    if (!err.message) {
        err.message = 'Something went wrong'
    }
    res.status(status).render('error', { err })
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server listening on port ${port}!`)
})
