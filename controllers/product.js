const productModel = require('../models/product')
const mongoose = require('mongoose')

const addProduct = async (req, res) => {
    try {
        const { title, desc, brand, category, price, sizes } = req.body
        // const image = req.file.path
        const image = await req.files.map((file) => file.path);
        if (title && desc && brand && category && price) {
            const doc = new productModel({
                title,
                desc,
                brand,
                category,
                price,
                image,
                sizes
            })
            await doc.save()
            return res.json({
                status: 200,
                message: "product inserted success"
            })
        } else {
            return res.json({
                status: 400,
                message: "bad request"
            })
        }

    } catch (error) {
        console.log(error.message, "errorerrorerror")
        return res.json({
            status: 500,
            message: 'internal server error'
        })
    }
}

const softDelete = async (req, res) => {
    try {
        const { productId } = req.params
        const existingProduct = await productModel.findById(productId)
        if (existingProduct.isDeleted == false) {
            await productModel.findByIdAndUpdate(productId, { isDeleted: true })
            return res.json({
                status: 200,
                message: "product remove success"
            })
        } else {
            return res.json({
                status: 400,
                message: "record not found"
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

const getById = async (req, res) => {
    try {
        const { productId } = req.params
        const productData = await productModel.findById(productId)
        if (productData) {
            const reviewData = await productModel.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(productId)
                    },
                },
                {
                    $lookup: {
                        from: "reviews",
                        localField: "_id",
                        foreignField: "productId",
                        as: "data"
                    }
                }
            ])
            console.log(reviewData)
            return res.json({
                status: 200,
                reviewData
            })
        } else {
            return res.json({
                status: 500,
                message: "product not found"
            })
        }
    } catch (error) {
        console.log(error)
        return res.json({
            status: 500,
            message: "internal server error"
        })
    }
}

const getProduct = async (req, res) => {
    try {
        const productData = await productModel.find()
        return res.json({
            status: 200,
            productData
        })
    } catch (error) {
        return res.json({
            status: 500,

        })
    }
}

const getAll = async (req, res) => {
    try {
        const productData = await productModel.aggregate([
            {
                $match: {
                    isDeleted: false
                },
            },
            {
                $lookup: {
                    from: 'reviews',
                    localField: '_id',
                    foreignField: 'productId',
                    as: 'reviews'
                }
            }
        ])
        return res.json({
            status: 200,
            productData
        })
    } catch (error) {
        console.log(error.message)
        return res.json({
            status: 500,
            message: "internal server error"
        })
    }
}

module.exports = {
    addProduct,
    softDelete,
    getById,
    getAll,
    getProduct
}