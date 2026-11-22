const express = require('express')

const authenticateToken = require('../middleware/authMiddleware')
const jobController = require('../controllers/jobController')

const router = express.Router()

router.use(authenticateToken)
router.get('/', jobController.list)
router.post('/', jobController.create)
router.get('/:id', jobController.getById)
router.put('/:id', jobController.update)
router.delete('/:id', jobController.remove)

module.exports = router
