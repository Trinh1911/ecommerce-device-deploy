const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const { genneralAccessToken, genneralRefresToken } = require("./JwtService")
const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, confirmPassword, phone } = newUser
        try {
            const checkUser = await User.findOne({ email: email })
            // kiem tra user co trung khong
            if (checkUser !== null) {
                resolve({
                    status: "ERR",
                    message: "the user is already"
                })
            }
            // ma hoa mat khau trước khi lưu
            const hash = bcrypt.hashSync(password, 10)
            const createdUser = await User.create({
                name, email, password: hash, phone
            })
            if (createdUser) {
                resolve({
                    status: "SUCCESS",
                    message: "SUCCESS",
                    data: createdUser
                })
            } else {
                return {
                    status: 'ERR',
                    message: 'ERR',
                }
            }
        }
        catch (e) {
            reject(e);
        }
    })
}
const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin
        try {
            const checkUser = await User.findOne({ email: email })
            // kiem tra user co trung khong
            if (checkUser === null) {
                resolve({
                    status: "ERR",
                    message: "Tài khoản không tồn tại"
                })
            }
            if (!checkUser) {
                resolve(
                    {
                        status: "ERR",
                        message: "Tài khoản không tồn tại"
                    }
                )
            }
            // so sánh hai chuối bằng bcrypt
            const comparePassword = bcrypt.compareSync(password, checkUser.password)
            if (!comparePassword) {
                resolve({
                    status: "ERR",
                    message: "the password or user is incorrect"
                })
            }
            const access_token = await genneralAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })
            const refresh_token = await genneralRefresToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })
            // trả về access token và refresh token 
            resolve({
                status: "SUCCESS",
                message: "SUCCESS",
                access_token,
                refresh_token
            })
        }
        catch (e) {
            reject(e);
        }
    })
}
const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({ _id: id })
            // kiểm tra xem có user đó không
            if (checkUser === null) {
                resolve({
                    status: "OK",
                    message: "the user is not defined"
                })
            }
            // trả về dữ liệu mới nhất khi thực hiện xong
            const updatedUser = await User.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: updatedUser
            })
        }
        catch (e) {
            reject(e);
        }
    })
}
const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({ _id: id })
            // kiểm tra xem có user đó không
            if (checkUser === null) {
                resolve({
                    status: "OK",
                    message: "the user is not defined"
                })
            }
            await User.findByIdAndDelete(id)
            resolve({
                status: "OK",
                message: "DELETED SUCCESS"
            })
        }
        catch (e) {
            reject(e);
        }
    })
}
const deleteUserMany = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            await User.deleteMany({ _id: ids })
            resolve({
                status: "OK",
                message: "DELETED SUCCESS"
            })
        }
        catch (e) {
            reject(e);
        }
    })
}
const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find()
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: allUser
            })
        }
        catch (e) {
            reject(e);
        }
    })
}
const getDetailsUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({ _id: id })
            // kiem tra user co trung khong
            if (user === null) {
                resolve({
                    status: "OK",
                    message: "the user is not defined"
                })
            }
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: user
            })
        }
        catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    createUser, loginUser, updateUser, deleteUser, getAllUser, getDetailsUser, deleteUserMany
}