const express = require('express');
const router = express.Router()
const userController = require('../controllers/UserController');
const { authMiddleware, authUerMiddleware } = require('../middleware/authMiddleware');
router.post('/sign-up', userController.createUser)
router.post('/sign-in', userController.loginUser)
router.post('/log-out', userController.logoutUser)
router.put('/update-user/:id',authUerMiddleware, userController.updateUser)
router.delete('/delete-user/:id', authMiddleware, userController.deleteUser)
router.get('/getAll',authMiddleware, userController.getAllUser)
router.get('/get-details/:id',authUerMiddleware, userController.getDetailsUser)
router.post('/refresh-token', userController.refreshToken)
router.post('/delete-user-many',authMiddleware, userController.deleteUserMany)
module.exports = router