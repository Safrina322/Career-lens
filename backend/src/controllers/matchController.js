const {
  findOwnedResume,
  findOwnedJob,
  saveMatch,
  listMatchesByUser,
} = require('../repositories/matchRepository')
const {
  extractSkills,
  calculateSimilarity,
} = require('../services/mlService')

async function create(request, response) {
  const resumeId = request.body.resumeId
  const jobId = request.body.jobId

  if (!resumeId || !jobId) {
    return response.status(400).json({
      success: false,
      message: 'Resume ID and job ID are required',
    })
  }

  try {
    const resume = await findOwnedResume(resumeId, request.user.id)
    const job = await findOwnedJob(jobId, request.user.id)

    if (!resume || !job) {
      return response.status(404).json({
        success: false,
        message: 'Resume or job description not found',
      })
    }

    const resumeSkillsResult = await extractSkills(resume.raw_text)
    const jobSkillsResult = await extractSkills(job.description)
    const resumeSkills = new Set(resumeSkillsResult.skills)
    const jobSkills = new Set(jobSkillsResult.skills)

    const matchingSkills = [...jobSkills].filter((skill) =>
      resumeSkills.has(skill),
    )
    const skillGaps = [...jobSkills].filter(
      (skill) => !resumeSkills.has(skill),
    )

    const similarity = await calculateSimilarity(
      resume.raw_text,
      job.description,
    )

    const match = await saveMatch({
      resumeId,
      jobId,
      semanticSimilarity: similarity.semantic_similarity,
      matchingSkills,
      skillGaps,
    })

    return response.status(201).json({
      success: true,
      message: 'Resume and job match calculated',
      data: {
        ...match,
        semantic_similarity: Number(match.semantic_similarity),
      },
    })
  } catch (error) {
    console.error('Match calculation failed:', error.message)
    return response.status(503).json({
      success: false,
      message: 'ML matching service is unavailable',
    })
  }
}

async function list(request, response) {
  try {
    const matches = await listMatchesByUser(request.user.id)
    return response.json({
      success: true,
      data: matches,
    })
  } catch (error) {
    console.error('Match listing failed:', error.message)
    return response.status(500).json({
      success: false,
      message: 'Unable to list match results',
    })
  }
}

module.exports = {
  create,
  list,
}
