const express = require('express');
const router = express.Router()
const { authMiddleware,authUerMiddleware } = require('../middleware/authMiddleware');
const ProductController = require('../controllers/ProductContoller');
router.post('/create', ProductController.createProduct)
router.put('/update/:id', authMiddleware, ProductController.updateProduct)
router.delete('/delete-product/:id',authMiddleware, ProductController.deleteProduct)
router.post('/delete-product-many',authMiddleware, ProductController.deleteMany)
router.get('/all-product', ProductController.getAllProduct)
router.get('/get-details/:id', ProductController.getDetailProduct)
router.get('/get-all-type', ProductController.getAllType)
module.exports = router