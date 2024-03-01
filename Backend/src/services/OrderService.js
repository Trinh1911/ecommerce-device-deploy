const Order = require("../models/OderProduct")
const Product = require('../models/ProductModel');

const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        const { orderItems, paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, user, isPaid, paidAt } = newOrder
        try {
            const promises = orderItems.map(async (order) => {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: order.product,
                        countInStock: { $gte: order.amount }
                    },
                    {
                        $inc: {
                            countInStock: -order.amount,
                            selled: +order.amount
                        }
                    },
                    { new: true }
                )
                if (productData) {
                    return {
                        status: 'OK',
                        message: 'SUCCESS',
                    }
                } else {
                    return {
                        status: 'OK',
                        message: 'ERR',
                        id: order.product
                    }
                }
            })
            const results = await Promise.all(promises)
            const newData = results && results.filter((item) => item.id)
            if (newData.length) {
                const arrId = []
                newData.forEach((item) => {
                    arrId.push(item.id)
                })
                resolve({
                    status: 'ERR',
                    message: `Sản phẩm với id${arrId.id} không còn hàng`,
                })
            } else {
                const createdOrder = await Order.create({
                    orderItems,
                    shippingAddress: {
                        fullName,
                        address,
                        city, phone
                    },
                    paymentMethod,
                    itemsPrice,
                    shippingPrice,
                    totalPrice,
                    user: user,
                    isPaid, paidAt
                })
                if (createdOrder) {
                    resolve({
                        status: 'OK',
                        message: 'success'
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}
const getAllOrderDetails = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.find({ user: id }).sort({ createdAt: -1, updatedAt: -1 })
            // kiem tra user co trung khong
            if (order === null) {
                resolve({
                    status: "OK",
                    message: "the order is not defined"
                })
            }
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: order
            })
        }
        catch (e) {
            reject(e);
        }
    })
}
const getDetailsOrder = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findById({ _id: id })
            // kiem tra user co trung khong
            if (order === null) {
                resolve({
                    status: "OK",
                    message: "the order is not defined"
                })
            }
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: order
            })
        }
        catch (e) {
            reject(e);
        }
    })
}
const cancelOrder = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let order = []
            const promises = data.map(async (order) => {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: order.product,
                        // kiểm tra selled có lớn hơn count in stock ko
                        selled: { $gte: order.amount }
                    },
                    // cập nhật lại khi cancel 
                    {
                        $inc: {
                            countInStock: +order.amount,
                            selled: -order.amount
                        }
                    },
                    { new: true }
                )
                if (productData) {
                    order = await Order.findByIdAndDelete(id)
                    if (order === null) {
                        resolve({
                            status: 'ERR',
                            message: 'The order is not defined'
                        })
                    }
                } else {
                    return {
                        status: 'OK',
                        message: 'ERR',
                        id: order.product
                    }
                }
            })
            // khi thực thi xong sẽ trả về promises chứa các product
            const results = await Promise.all(promises)
            const newData = results && results.filter((item) => item)
            if (newData.length) {
                resolve({
                    status: 'ERR',
                    message: `San pham voi id${newData.join(',')} khong ton tai`
                })
            }
            resolve({
                status: 'OK',
                message: 'success',
                data: order
            })
        }
        catch (e) {
            reject(e);
        }
    })
}
const getAllOrder = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allOrder = await Order.find()
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: allOrder
            })
        }
        catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    createOrder, getAllOrderDetails, getDetailsOrder, cancelOrder, getAllOrder
}