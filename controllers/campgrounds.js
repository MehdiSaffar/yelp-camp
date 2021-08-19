const Campground = require('../models/campground')
const { cloudinary } = require('../cloudinary')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')

const mbxToken = process.env.MAPBOX_TOKEN

const geocoder = mbxGeocoding({ accessToken: mbxToken })

exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}

exports.renderNew = async (req, res) => {
    res.render('campgrounds/new')
}

exports.new = async (req, res) => {
    const response = await geocoder
        .forwardGeocode({
            query: req.body.campground.location,
            limit: 1
        })
        .send()

    const campground = new Campground(req.body.campground)
    campground.author = req.user._id
    campground.images = req.files.map(file => ({
        url: file.path,
        filename: file.filename
    }))
    campground.geometry = response.body.features[0].geometry
    console.log('campground', campground)
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
    console.log(req.body)
    const campground = await Campground.findByIdAndUpdate(
        id,
        req.body.campground
    )
    const imgs = req.files.map(file => {
        return { url: file.path, filename: file.filename }
    })
    campground.images.push(...imgs)
    await campground.save()
    if (req.body.deleteImages?.length) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({
            $pull: {
                images: {
                    filename: {
                        $in: req.body.deleteImages
                    }
                }
            }
        })
    }
    req.flash('success', 'Successfully edited campground')
    res.redirect(`/campgrounds/${campground._id}`)
}

exports.delete = async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted campground')
    res.redirect(`/campgrounds`)
}
