const User = require('../models/user')

exports.renderRegister = async (req, res) => {
    res.render('users/register')
}

exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body
        const user = await User.register(
            new User({ email, username }),
            password
        )
        req.login(user, err => {
            if (err) return next(err)
            req.flash('success', 'Welcome to Yelp Camp!')
            res.redirect('/campgrounds')
        })
    } catch (error) {
        req.flash('error', error.message)
        res.redirect('/register')
    }
}

exports.renderLogin = async (req, res) => {
    res.render('users/login')
}

exports.login = async (req, res) => {
    const redirectUrl = req.session.returnTo ?? '/campgrounds'
    delete req.session.returnTo
    req.flash('success', 'Welcome back!')
    res.redirect(redirectUrl)
}

exports.logout = async (req, res) => {
    req.logout()
    req.flash('success', 'Goodbye!')
    res.redirect('/campgrounds')
}
