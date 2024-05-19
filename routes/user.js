const express = require('express')
const router = express.Router()
const { register, getMac, login, addProduct, getCart, addProductInCart, removeCart } = require('../controllers/user')
const { extractMACAddress } = require('../middlewares/mac_middleware')
const sessionData = require('../middlewares/session_middleware')
const checkUserAuth = require('../middlewares/auth_middleware')


router.post('/register', extractMACAddress, register)
router.post('/login', login)
router.get('/get', getMac)

router.get('/save', extractMACAddress, checkUserAuth, addProductInCart)

router.post('/add', extractMACAddress, sessionData, addProduct)
router.get('/getCart', extractMACAddress, sessionData, getCart)
router.delete('/removeCart/:productId', extractMACAddress, sessionData,removeCart)


module.exports = router
// const   finditem = carts[macAddress].findOne({productId})
// 