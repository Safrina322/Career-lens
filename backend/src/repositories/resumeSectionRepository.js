const pool = require('../config/database')

async function resumeBelongsToUser(resumeId, userId) {
  const result = await pool.query(
    'SELECT id FROM resumes WHERE id = $1 AND user_id = $2',
    [resumeId, userId],
  )

  return Boolean(result.rows[0])
}

async function listSections(resumeId) {
  const result = await pool.query(
    `SELECT id, section_type, content, display_order
     FROM resume_sections
     WHERE resume_id = $1
     ORDER BY display_order ASC, id ASC`,
    [resumeId],
  )

  return result.rows
}

async function createSection({ resumeId, sectionType, content, displayOrder }) {
  const result = await pool.query(
    `INSERT INTO resume_sections
       (resume_id, section_type, content, display_order)
     VALUES ($1, $2, $3, $4)
     RETURNING id, section_type, content, display_order`,
    [resumeId, sectionType, content, displayOrder],
  )

  return result.rows[0]
}

async function updateSection({
  sectionId,
  resumeId,
  sectionType,
  content,
  displayOrder,
}) {
  const result = await pool.query(
    `UPDATE resume_sections
     SET section_type = $1,
         content = $2,
         display_order = $3
     WHERE id = $4 AND resume_id = $5
     RETURNING id, section_type, content, display_order`,
    [sectionType, content, displayOrder, sectionId, resumeId],
  )

  return result.rows[0] || null
}

async function deleteSection(sectionId, resumeId) {
  const result = await pool.query(
    `DELETE FROM resume_sections
     WHERE id = $1 AND resume_id = $2
     RETURNING id`,
    [sectionId, resumeId],
  )

  return result.rows[0] || null
}

module.exports = {
  resumeBelongsToUser,
  listSections,
  createSection,
  updateSection,
  deleteSection,
}
