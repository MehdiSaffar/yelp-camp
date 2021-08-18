const Campground = require('../models/campground')
const Review = require('../models/review')

exports.new = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'Successfully created new review')
    res.redirect(`/campgrounds/${id}`)
}

exports.delete = async (req, res) => {
    const { id, reviewId } = req.params
    await Review.findByIdAndDelete(req.params.reviewId)
    await Campground.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId }
    })

    req.flash('success', 'Successfully deleted review')
    res.redirect(`/campgrounds/${id}`)
}
