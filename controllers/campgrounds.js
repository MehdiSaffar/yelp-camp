const Campground = require('../models/campground')

exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}

exports.renderNew = async (req, res) => {
    res.render('campgrounds/new')
}

exports.new = async (req, res) => {
    const campground = new Campground(req.body.campground)
    campground.author = req.user._id
    await campground.save()
    req.flash('success', 'Successfully made a new campground')
    res.redirect(`/campgrounds/${campground._id}`)
}

exports.show = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        })
        .populate('author')
    console.log(campground)
    if (!campground) {
        req.flash('error', 'Cannot find campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
}

exports.renderEdit = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'Cannot find campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
}

exports.edit = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(
        id,
        req.body.campground
    )
    req.flash('success', 'Successfully edited campground')
    res.redirect(`/campgrounds/${campground._id}`)
}

exports.delete = async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted campground')
    res.redirect(`/campgrounds`)
}
