const express = require('express')
const router = express.Router({ mergeParams: true })

const catchAsync = require('../utils/catchAsync')

const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware')

const controller = require('../controllers/reviews')

router.post('/', validateReview, isLoggedIn, catchAsync(controller.new))

router.delete(
    '/:reviewId',
    isLoggedIn,
    isReviewAuthor,
    catchAsync(controller.delete)
)

module.exports = router
