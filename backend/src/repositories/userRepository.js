const pool = require('../config/database')

async function findUserByEmail(email) {
  const result = await pool.query(
    'SELECT id, email, full_name FROM users WHERE lower(email) = lower($1)',
    [email],
  )

  return result.rows[0] || null
}

async function findLoginUserByEmail(email) {
  const result = await pool.query(
    `SELECT id, full_name, email, password_hash
     FROM users
     WHERE lower(email) = lower($1)`,
    [email],
  )

  return result.rows[0] || null
}

async function createUser({ fullName, email, passwordHash }) {
  const result = await pool.query(
    `INSERT INTO users (full_name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, full_name, email, created_at`,
    [fullName.trim(), email.trim().toLowerCase(), passwordHash],
  )

  return result.rows[0]
}

module.exports = {
  createUser,
  findUserByEmail,
  findLoginUserByEmail,
}
