const OrderService = require('../services/OrderService')

const createOrder = async (req, res) => {
    try {
        const { paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone } = req.body


        if (!paymentMethod || !itemsPrice || shippingPrice === undefined || !totalPrice || !fullName || !address || !city || !phone) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await OrderService.createOrder(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e.message
        })
    }
}
const getAllOrderDetails = async (req, res) => {
    try {
        const UserId = req.params.id
        if (!UserId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The UserId is require'
            })
        }
        const response = await OrderService.getAllOrderDetails(UserId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const getDetailsOrder = async (req, res) => {
    try {
        const OrderId = req.params.id
        if (!OrderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The OrderId is require'
            })
        }
        const response = await OrderService.getDetailsOrder(OrderId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const cancelOrder = async (req, res) => {
    try {
        const OrderId = req.params.id
        const data = req.body
        if (!OrderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The OrderId is require'
            })
        }
        const response = await OrderService.cancelOrder(OrderId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e.message
        })
    }
}
const getAllOrder = async (req, res) => {
    try {
        const response = await OrderService.getAllOrder()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
module.exports = {
    createOrder, getAllOrderDetails, getDetailsOrder, cancelOrder, getAllOrder
}