const j = require('joi')

exports.campgroundSchema = j
    .object({
        campground: j
            .object({
                title: j.string().required(),
                price: j.number().min(0).required(),
                image: j.string().required(),
                description: j.string().required(),
                location: j.string().required()
            })
            .required()
    })
    .required()

exports.reviewSchema = j
    .object({
        review: j
            .object({
                rating: j.number().min(1).max(5).required(),
                body: j.string().required()
            })
            .required()
    })
    .required()
