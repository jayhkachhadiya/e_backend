const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: { type: String },
    macAddress: { type: String },
    // cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'product' }]
}, { versionKey: false });

const userModel = mongoose.model("user", userSchema)

module.exports = userModel