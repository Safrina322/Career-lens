const express = require('express')

const authenticateToken = require('../middleware/authMiddleware')
const matchController = require('../controllers/matchController')

const router = express.Router()

router.use(authenticateToken)
router.get('/', matchController.list)
router.post('/', matchController.create)

module.exports = router
