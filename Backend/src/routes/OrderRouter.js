const express = require('express');
const router = express.Router()
const OrderController = require('../controllers/OrderController');
const { authUerMiddleware, authMiddleware, auth } = require('../middleware/authMiddleware');
router.post('/create', auth, OrderController.createOrder)
router.get('/get-all-order/:id', auth, OrderController.getAllOrderDetails)
router.get('/get-details-order/:id', auth, OrderController.getDetailsOrder)
router.delete('/cancel-order/:id', auth, OrderController.cancelOrder)
router.get('/get-all-order', authMiddleware, OrderController.getAllOrder)
module.exports = router