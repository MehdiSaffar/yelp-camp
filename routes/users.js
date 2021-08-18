const express = require('express')
const router = express.Router({ mergeParams: true })
const passport = require('passport')

const catchAsync = require('../utils/catchAsync')

const controller = require('../controllers/users')

router
    .route('/register')
    .get(catchAsync(controller.renderRegister))
    .post(catchAsync(controller.register))

router
    .route('/login')
    .get(catchAsync(controller.renderLogin))
    .post(
        passport.authenticate('local', {
            failureFlash: true,
            failureRedirect: '/login'
        }),
        catchAsync(controller.login)
    )

router.get('/logout', catchAsync(controller.logout))

module.exports = router
