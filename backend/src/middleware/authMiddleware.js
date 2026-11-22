const jwt = require('jsonwebtoken')

function authenticateToken(request, response, next) {
  const authorizationHeader = request.headers.authorization

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return response.status(401).json({
      success: false,
      message: 'Authentication required',
    })
  }

  const token = authorizationHeader.slice(7)

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    request.user = {
      id: decoded.userId,
      email: decoded.email,
    }

    next()
  } catch (error) {
    return response.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    })
  }
}

module.exports = authenticateToken