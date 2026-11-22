const { Pool } = require('pg')

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is required to configure PostgreSQL')
}

const pool = new Pool({
  connectionString,
  max: 10,
})

module.exports = pool
