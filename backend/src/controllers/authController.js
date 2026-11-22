const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const {
  createUser,
  findUserByEmail,
  findLoginUserByEmail,
} = require('../repositories/userRepository')
const {
  validateRegistration,
  validateLogin,
} = require('../validators/authValidator')

async function register(request, response) {
  const validation = validateRegistration(request.body)

  if (!validation.isValid) {
    return response.status(400).json({
      success: false,
      message: 'Please correct the registration fields',
      errors: validation.errors,
    })
  }

  const fullName = request.body.fullName.trim()
  const email = request.body.email.trim().toLowerCase()
  const password = request.body.password

  try {
    const existingUser = await findUserByEmail(email)

    if (existingUser) {
      return response.status(409).json({
        success: false,
        message: 'An account with this email already exists',
      })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await createUser({ fullName, email, passwordHash })

    return response.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error('Registration failed:', error.message)
    return response.status(500).json({
      success: false,
      message: 'Unable to create account',
    })
  }
}

async function login(request, response) {
  const validation = validateLogin(request.body)

  if (!validation.isValid) {
    return response.status(400).json({
      success: false,
      message: 'Please correct the login fields',
      errors: validation.errors,
    })
  }

  const email = request.body.email.trim().toLowerCase()
  const password = request.body.password

  try {
    const user = await findLoginUserByEmail(email)

    if (!user) {
      return response.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash)

    if (!passwordMatches) {
      return response.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    if (!process.env.JWT_SECRET) {
      console.error('Login failed: JWT_SECRET is not configured')
      return response.status(500).json({
        success: false,
        message: 'Unable to complete login',
      })
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    )

    return response.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
        },
      },
    })
  } catch (error) {
    console.error('Login failed:', error.message)
    return response.status(500).json({
      success: false,
      message: 'Unable to complete login',
    })
  }
}

module.exports = {
  register,
  login,
}
