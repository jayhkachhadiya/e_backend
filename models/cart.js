const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
    size: { type: String },
    quantity: { type: Number, default: 1 },
    amount: { type: Number, default: 0 },
    subTotal: { type: Number, default: 0 },
}, { versionKey: false, timestamps: true })

const cartModel = mongoose.model("cart", cartSchema)

module.exports = cartModel