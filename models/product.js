const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    image: [{ type: String }],
    title: { type: String },
    desc: { type: String },
    brand: { type: String },
    // stock: { type: String },
    category: { type: String },
    price: { type: Number },
    sizes: { type: String, enum: ["xs", "s", "m", "l", "xl"], default: null },
    colours: { type: String, default: null },
    isDeleted: { type: Boolean, default: "false" },
    isLimited: { type: Boolean, default: "false" }
}, { versionKey: false, timestamps: true })

const productModel = mongoose.model("product", productSchema)

module.exports = productModel