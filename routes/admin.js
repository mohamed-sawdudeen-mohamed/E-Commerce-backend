const express = require('express')
const adminController = require('../controllers/adminController')

const adminRouter = express.Router()

adminRouter.post('/register', adminController.register)
adminRouter.post('/login', adminController.login)

module.exports = adminRouter;