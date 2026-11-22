const pool = require('../config/database')

async function createResume({ userId, title, summary, rawText }) {
  const result = await pool.query(
    `INSERT INTO resumes (user_id, title, summary, raw_text)
     VALUES ($1, $2, $3, $4)
     RETURNING id, title, summary, raw_text, created_at, updated_at`,
    [userId, title, summary, rawText],
  )

  return result.rows[0]
}

async function listResumesByUser(userId) {
  const result = await pool.query(
    `SELECT id, title, summary, raw_text, created_at, updated_at
     FROM resumes
     WHERE user_id = $1
     ORDER BY updated_at DESC`,
    [userId],
  )

  return result.rows
}
async function findResumeByUser(resumeId, userId) {
  const result = await pool.query(
    `SELECT id, title, summary, raw_text, created_at, updated_at
     FROM resumes
     WHERE id = $1 AND user_id = $2`,
    [resumeId, userId],
  )

  return result.rows[0] || null
}

async function updateResume({ resumeId, userId, title, summary, rawText }) {
  const result = await pool.query(
    `UPDATE resumes
     SET title = $1,
         summary = $2,
         raw_text = $3,
         updated_at = NOW()
     WHERE id = $4 AND user_id = $5
     RETURNING id, title, summary, raw_text, created_at, updated_at`,
    [title, summary, rawText, resumeId, userId],
  )

  return result.rows[0] || null
}
async function deleteResume(resumeId, userId) {
  const result = await pool.query(
    `DELETE FROM resumes
     WHERE id = $1 AND user_id = $2
     RETURNING id`,
    [resumeId, userId],
  )

  return result.rows[0] || null
}

module.exports = {
  createResume,
  listResumesByUser,
  findResumeByUser,
  updateResume,
  deleteResume,
}
