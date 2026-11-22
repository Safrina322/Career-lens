function validateRegistration({ fullName, email, password }) {
  const errors = {}

  if (typeof fullName !== 'string' || fullName.trim().length < 2) {
    errors.fullName = 'Full name must contain at least 2 characters'
  }

  if (typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
    errors.email = 'Enter a valid email address'
  }

  if (typeof password !== 'string' || password.length < 8) {
    errors.password = 'Password must contain at least 8 characters'
  }

  if (typeof password === 'string' && password.trim() !== password) {
    errors.password = 'Password cannot start or end with whitespace'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

function validateLogin({ email, password }) {
  const errors = {}

  if (typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
    errors.email = 'Enter a valid email address'
  }

  if (typeof password !== 'string' || password.length === 0) {
    errors.password = 'Password is required'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

module.exports = {
  validateRegistration,
  validateLogin,
}
