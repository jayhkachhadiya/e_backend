const express = require('express')
const router = express.Router()
const { addProduct, softDelete, getById, getAll, getProduct } = require('../controllers/product')
const { upload } = require('../middlewares/multer_middleware')

router.get('/', getAll);
router.get('/get', getProduct);
router.post('/add', upload, addProduct);
router.put('/remove/:productId', upload, softDelete);
router.get('/get/:productId', getById);

module.exports = router