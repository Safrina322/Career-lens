const pool = require('../config/database')

async function findOwnedResume(resumeId, userId) {
  const result = await pool.query(
    `SELECT id, raw_text
     FROM resumes
     WHERE id = $1 AND user_id = $2`,
    [resumeId, userId],
  )

  return result.rows[0] || null
}

async function findOwnedJob(jobId, userId) {
  const result = await pool.query(
    `SELECT id, description
     FROM jobs
     WHERE id = $1 AND user_id = $2`,
    [jobId, userId],
  )

  return result.rows[0] || null
}

async function saveMatch({
  resumeId,
  jobId,
  semanticSimilarity,
  matchingSkills,
  skillGaps,
}) {
  const result = await pool.query(
    `INSERT INTO matches
       (resume_id, job_id, semantic_similarity, matching_skills, skill_gaps)
     VALUES ($1, $2, $3, $4::jsonb, $5::jsonb)
     ON CONFLICT (resume_id, job_id)
     DO UPDATE SET
       semantic_similarity = EXCLUDED.semantic_similarity,
       matching_skills = EXCLUDED.matching_skills,
       skill_gaps = EXCLUDED.skill_gaps,
       created_at = NOW()
     RETURNING id, resume_id, job_id, semantic_similarity,
               matching_skills, skill_gaps, created_at`,
    [
      resumeId,
      jobId,
      semanticSimilarity,
      JSON.stringify(matchingSkills),
      JSON.stringify(skillGaps),
    ],
  )

  return result.rows[0]
}

async function listMatchesByUser(userId) {
  const result = await pool.query(
    `SELECT m.id, m.resume_id, m.job_id, m.semantic_similarity,
            m.matching_skills, m.skill_gaps, m.created_at,
            r.title AS resume_title, j.title AS job_title,
            j.company
     FROM matches m
     JOIN resumes r ON r.id = m.resume_id
     JOIN jobs j ON j.id = m.job_id
     WHERE r.user_id = $1 AND j.user_id = $1
     ORDER BY m.created_at DESC`,
    [userId],
  )

  return result.rows
}

module.exports = {
  findOwnedResume,
  findOwnedJob,
  saveMatch,
  listMatchesByUser,
}
