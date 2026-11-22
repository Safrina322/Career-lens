const pool = require('../config/database')

async function createApplication({ userId, jobId, status, appliedAt, notes }) {
  const result = await pool.query(
    `INSERT INTO applications
       (user_id, job_id, status, applied_at, notes)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (user_id, job_id)
     DO UPDATE SET
       status = EXCLUDED.status,
       applied_at = EXCLUDED.applied_at,
       notes = EXCLUDED.notes,
       updated_at = NOW()
     RETURNING id, user_id, job_id, status, applied_at, notes,
               created_at, updated_at`,
    [userId, jobId, status, appliedAt, notes],
  )

  return result.rows[0]
}

async function listApplications(userId) {
  const result = await pool.query(
    `SELECT a.id, a.job_id, a.status, a.applied_at, a.notes,
            a.created_at, a.updated_at,
            j.title, j.company, j.location
     FROM applications a
     JOIN jobs j ON j.id = a.job_id
     WHERE a.user_id = $1
     ORDER BY a.updated_at DESC`,
    [userId],
  )

  return result.rows
}

async function updateApplication({ applicationId, userId, status, appliedAt, notes }) {
  const result = await pool.query(
    `UPDATE applications
     SET status = $1,
         applied_at = $2,
         notes = $3,
         updated_at = NOW()
     WHERE id = $4 AND user_id = $5
     RETURNING id, user_id, job_id, status, applied_at, notes,
               created_at, updated_at`,
    [status, appliedAt, notes, applicationId, userId],
  )

  return result.rows[0] || null
}

async function deleteApplication(applicationId, userId) {
  const result = await pool.query(
    `DELETE FROM applications
     WHERE id = $1 AND user_id = $2
     RETURNING id`,
    [applicationId, userId],
  )

  return result.rows[0] || null
}

async function findOwnedJob(jobId, userId) {
  const result = await pool.query(
    'SELECT id FROM jobs WHERE id = $1 AND user_id = $2',
    [jobId, userId],
  )

  return result.rows[0] || null
}

module.exports = {
  createApplication,
  listApplications,
  updateApplication,
  deleteApplication,
  findOwnedJob,
}
