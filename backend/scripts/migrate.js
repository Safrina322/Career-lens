require('dotenv').config()

const fs = require('node:fs/promises')
const path = require('node:path')

async function runMigration() {
  const migrationPath = path.resolve(
    __dirname,
    '../../database/migrations/001_initial_schema.sql',
  )

  const sql = await fs.readFile(migrationPath, 'utf8')
  const pool = require('../src/config/database')

  try {
    await pool.query(sql)
    console.log('Database migration completed successfully')
  } finally {
    await pool.end()
  }
}

runMigration().catch((error) => {
  console.error('Database migration failed:', error.message)
  process.exitCode = 1
})
