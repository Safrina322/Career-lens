const express = require('express')
const { register, login } = require('../controllers/authController')
const authenticateToken = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', authenticateToken, (request, response) => {
  response.json({
    success: true,
    data: {
      user: request.user,
    },
  })
})

module.exports = router