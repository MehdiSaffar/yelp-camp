const express = require('express')
const router = express.Router({ mergeParams: true })

const ExpressError = require('../utils/ExpressError')
const catchAsync = require('../utils/catchAsync')

const Campground = require('../models/campground')
const Review = require('../models/review')
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')

const controller = require('../controllers/campgrounds')

router
    .route('/')
    .get(catchAsync(controller.index))
    .post(isLoggedIn, validateCampground, catchAsync(controller.new))

router.get('/new', isLoggedIn, catchAsync(controller.renderNew))
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(controller.renderEdit))

router
    .route('/:id')
    .get(catchAsync(controller.show))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(controller.edit))
    .delete(isLoggedIn, isAuthor, catchAsync(controller.delete))

module.exports = router
