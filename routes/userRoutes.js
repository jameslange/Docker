const express = require('express')

const { AuthController } = require('../controllers/authController')

const authController = new AuthController()

const router = express.Router()
router.post('/signup', authController.signUp)
router.post('/login', authController.login)

module.exports = router
