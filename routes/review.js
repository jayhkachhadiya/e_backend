const express = require('express')
const { addReview } = require('../controllers/review')
const router = express.Router()

router.post('/add/:productId', addReview)

module.exports = router