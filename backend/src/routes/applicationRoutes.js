const express = require('express')

const authenticateToken = require('../middleware/authMiddleware')
const applicationController = require('../controllers/applicationController')

const router = express.Router()

router.use(authenticateToken)
router.get('/', applicationController.list)
router.post('/', applicationController.create)
router.put('/:id', applicationController.update)
router.delete('/:id', applicationController.remove)

module.exports = router
