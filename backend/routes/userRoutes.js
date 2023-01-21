const express = require('express')
const { registerUser, authUser, allUser } = require('../controller/userControllers')
const router = express.Router()

router.route('/').post(registerUser)
router.route('/').get(allUser)
router.post('/login', authUser)

module.exports = router