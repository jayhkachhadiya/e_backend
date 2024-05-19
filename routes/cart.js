const express = require('express')
const { addData, removeData, quantityPlus, quantityMinus } = require('../controllers/cart')
const checkUserAuth = require('../middlewares/auth_middleware')
const { extractMACAddress } = require('../middlewares/mac_middleware')
const router = express.Router()

router.post("/add",checkUserAuth,extractMACAddress, addData)
router.delete("/remove/:cartId", removeData)
router.get("/plus/:cartId", quantityPlus)
router.get("/minus/:cartId", quantityMinus)

module.exports = router