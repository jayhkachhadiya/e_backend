const cartModel = require('../models/cart')
const productModel = require('../models/product')

const addData = async (req, res) => {
    try {
        const { productId, quantity } = req.body
        const productData = await productModel.findById(productId)
        const userId = req.user.id;
        if (productData) {
            const cartData = await cartModel.findOne({ productId })
            if (cartData) {
                cartData.quantity += 1
                cartData.amount = productData.price * cartData.quantity
                await cartData.save()
                return res.json({
                    status: 400,
                    message: 'quantity is update'
                })
            } else {
                const doc = new cartModel({
                    userId,
                    productId,
                    quantity,
                    amount: productData.price,
                    // subTotal
                })
                console.log(doc, "docdocdoc")
                await doc.save()
                return res.json({
                    status: 400,
                    message: 'product add in cart'
                })
            }
        } else {
            return res.json({
                status: 400,
                message: 'product not found'
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

const removeData = async (req, res) => {
    try {
        const { cartId } = req.params
        const existingData = await cartModel.findById(cartId)
        if (existingData) {
            await cartModel.findByIdAndDelete(cartId, { existingData })
            return res.json({
                status: 200,
                message: 'record remove success'
            })
        } else {
            return res.json({
                status: 400,
                message: 'data not found'
            })
        }
    } catch (error) {
        return res.json({
            status: 500,
            message: 'internal server error'
        })
    }
}

const quantityPlus = async (req, res) => {
    try {
        const { cartId } = req.params
        const cartData = await cartModel.findById(cartId)

        if (cartData) {
            const productId = cartData.productId
            const productData = await productModel.findById(productId)
            cartData.quantity += 1
            cartData.amount = productData.price * cartData.quantity
            await cartData.save()
            return res.json({
                status: 400,
                message: 'quantity is increase'
            })
        } else {
            return res.json({
                status: 400,
                message: 'data not found'
            })
        }
    } catch (error) {
        console.log(error.message)
        return res.json({
            status: 500,
            message: 'internal server error'
        })
    }
}

const quantityMinus = async (req, res) => {
    try {
        const { cartId } = req.params
        const cartData = await cartModel.findById(cartId)

        if (cartData) {
            const productId = cartData.productId
            const productData = await productModel.findById(productId)
            cartData.quantity -= 1
            cartData.amount = productData.price * cartData.quantity
            await cartData.save()
            return res.json({
                status: 400,
                message: 'quantity is decrease'
            })
        } else {
            return res.json({
                status: 400,
                message: 'data not found'
            })
        }
    } catch (error) {
        console.log(error.message)
        return res.json({
            status: 500,
            message: 'internal server error'
        })
    }
}


module.exports = {
    addData,
    removeData,
    quantityPlus,
    quantityMinus
}