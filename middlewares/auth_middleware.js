const jwt = require('jsonwebtoken')
const userModel = require('../models/user')

const checkUserAuth = async (req, res, next) => {
    let token
    const { authorization } = req.headers
    if (authorization && authorization.startsWith('Bearer')) {
        try {
            token = authorization.split(' ')[1]
            const { userID } = jwt.verify(token, process.env.JWT_SECRATE_KEY)
            req.user = await userModel.findById(userID).select('-password')
            next()
        } catch (error) {
            console.log(error.message,"error.messageerror.messageerror.message")
            return res.json({
                status: 400,
                message: "un authorised user"
            })
        }
    }
    if (!token) {
        return res.json({
            status: 400,
            message: "un authorised user"
        })
    }
}
module.exports = checkUserAuth