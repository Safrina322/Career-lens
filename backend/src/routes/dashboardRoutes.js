const express = require('express')

const authenticateToken = require('../middleware/authMiddleware')
const dashboardController = require('../controllers/dashboardController')

const router = express.Router()

router.use(authenticateToken)
router.get('/', dashboardController.get)

module.exports = router
