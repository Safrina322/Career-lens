const pool = require('../config/database')

async function createJob({ userId, title, company, location, description, sourceUrl }) {
  const result = await pool.query(
    `INSERT INTO jobs
       (user_id, title, company, location, description, source_url)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, title, company, location, description, source_url,
               created_at, updated_at`,
    [userId, title, company, location, description, sourceUrl],
  )

  return result.rows[0]
}

async function listJobsByUser(userId) {
  const result = await pool.query(
    `SELECT id, title, company, location, description, source_url,
            created_at, updated_at
     FROM jobs
     WHERE user_id = $1
     ORDER BY updated_at DESC`,
    [userId],
  )

  return result.rows
}

async function findJobByUser(jobId, userId) {
  const result = await pool.query(
    `SELECT id, title, company, location, description, source_url,
            created_at, updated_at
     FROM jobs
     WHERE id = $1 AND user_id = $2`,
    [jobId, userId],
  )

  return result.rows[0] || null
}

async function updateJob({
  jobId,
  userId,
  title,
  company,
  location,
  description,
  sourceUrl,
}) {
  const result = await pool.query(
    `UPDATE jobs
     SET title = $1,
         company = $2,
         location = $3,
         description = $4,
         source_url = $5,
         updated_at = NOW()
     WHERE id = $6 AND user_id = $7
     RETURNING id, title, company, location, description, source_url,
               created_at, updated_at`,
    [title, company, location, description, sourceUrl, jobId, userId],
  )

  return result.rows[0] || null
}

async function deleteJob(jobId, userId) {
  const result = await pool.query(
    `DELETE FROM jobs
     WHERE id = $1 AND user_id = $2
     RETURNING id`,
    [jobId, userId],
  )

  return result.rows[0] || null
}

module.exports = {
  createJob,
  listJobsByUser,
  findJobByUser,
  updateJob,
  deleteJob,
}
