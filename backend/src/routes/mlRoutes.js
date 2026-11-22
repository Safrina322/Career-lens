const express = require('express')

const authenticateToken = require('../middleware/authMiddleware')
const {
  preprocessText,
  extractSkills,
  calculateSimilarity,
} = require('../services/mlService')

const router = express.Router()

router.use(authenticateToken)

router.post('/preprocess', async (request, response) => {
  const text =
    typeof request.body.text === 'string'
      ? request.body.text.trim()
      : ''

  if (text.length === 0) {
    return response.status(400).json({
      success: false,
      message: 'Text is required',
    })

    router.post('/skills/extract', async (request, response) => {
      if (typeof request.body.text !== 'string' || request.body.text.trim().length === 0) {
        return response.status(400).json({
          success: false,
          message: 'Text is required',
        })
      }

      try {
        const result = await extractSkills(request.body.text.trim())
        return response.json({ success: true, data: result })
      } catch (error) {
        console.error('Skill extraction failed:', error.message)
        return response.status(503).json({
          success: false,
          message: 'ML service is unavailable',
        })
      }
    })

    router.post('/similarity', async (request, response) => {
      const resumeText =
        typeof request.body.resumeText === 'string'
          ? request.body.resumeText.trim()
          : ''
      const jobText =
        typeof request.body.jobText === 'string'
          ? request.body.jobText.trim()
          : ''

      if (!resumeText || !jobText) {
        return response.status(400).json({
          success: false,
          message: 'Resume text and job text are required',
        })
      }

      try {
        const result = await calculateSimilarity(resumeText, jobText)
        return response.json({ success: true, data: result })
      } catch (error) {
        console.error('Similarity calculation failed:', error.message)
        return response.status(503).json({
          success: false,
          message: 'ML service is unavailable',
        })
      }
    })
  }

  if (text.length > 50000) {
    return response.status(400).json({
      success: false,
      message: 'Text must contain no more than 50000 characters',
    })
  }

  try {
    const result = await preprocessText(text)

    return response.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('ML preprocessing failed:', error.message)
    return response.status(503).json({
      success: false,
      message: 'ML service is unavailable',
    })
  }
})

module.exports = router
