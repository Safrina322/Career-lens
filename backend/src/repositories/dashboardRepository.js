const pool = require('../config/database')

async function getDashboardData(userId) {
  const applicationStatusResult = await pool.query(
    `SELECT status, count(*)::int AS count
     FROM applications
     WHERE user_id = $1
     GROUP BY status`,
    [userId],
  )

  const totalsResult = await pool.query(
    `SELECT
       (SELECT count(*)::int FROM resumes WHERE user_id = $1) AS resume_count,
       (SELECT count(*)::int FROM jobs WHERE user_id = $1) AS job_count,
       (SELECT count(*)::int FROM applications WHERE user_id = $1) AS application_count`,
    [userId],
  )

  const recentApplicationsResult = await pool.query(
    `SELECT a.id, a.status, a.applied_at, a.updated_at,
            j.title, j.company, j.location
     FROM applications a
     JOIN jobs j ON j.id = a.job_id
     WHERE a.user_id = $1
     ORDER BY a.updated_at DESC
     LIMIT 5`,
    [userId],
  )

  const recentMatchesResult = await pool.query(
    `SELECT m.id, m.semantic_similarity, m.matching_skills,
            m.skill_gaps, m.created_at,
            r.title AS resume_title, j.title AS job_title
     FROM matches m
     JOIN resumes r ON r.id = m.resume_id
     JOIN jobs j ON j.id = m.job_id
     WHERE r.user_id = $1 AND j.user_id = $1
     ORDER BY m.created_at DESC
     LIMIT 5`,
    [userId],
  )

  return {
    totals: totalsResult.rows[0],
    application_statuses: applicationStatusResult.rows,
    recent_applications: recentApplicationsResult.rows,
    recent_matches: recentMatchesResult.rows,
  }
}

module.exports = {
  getDashboardData,
}
