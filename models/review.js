const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
    rating: { type: String },
    desc: { type: String }
}, { versionKey: false, timestamps: true })

const reviewModel = mongoose.model("review", reviewSchema)

module.exports = reviewModel