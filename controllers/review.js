const mongoose = require('mongoose')
const reviewModel = require('../models/review')
const productModel = require('../models/product')

const addReview = async (req, res) => {
    try {
        const { productId } = req.params
        const { rating, desc } = req.body
        const productData = await productModel.findById(productId)
        if (productData) {
            await reviewModel.create({
                productId,
                rating,
                desc
            })
            return res.json({
                status: 200,
                message: "review add successfully"
            })
        } else {
            return res.json({
                status: 400,
                message: "product not found"
            })
        }
    } catch (error) {
        console.log(error.message)
        return res.json({
            status: 500,
            message: "internal server error"
        })
    }
}

module.exports = {
    addReview,
}