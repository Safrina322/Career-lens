async function getMlServiceHealth() {
  const serviceUrl = process.env.ML_SERVICE_URL

  if (!serviceUrl) {
    throw new Error('ML_SERVICE_URL is not configured')
  }

  const response = await fetch(`${serviceUrl}/health`, {
    signal: AbortSignal.timeout(5000),
  })

  if (!response.ok) {
    throw new Error(`ML service returned HTTP ${response.status}`)
  }

  return response.json()
}

async function preprocessText(text) {
  const serviceUrl = process.env.ML_SERVICE_URL

  if (!serviceUrl) {
    throw new Error('ML_SERVICE_URL is not configured')
  }

  const response = await fetch(`${serviceUrl}/preprocess`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
    signal: AbortSignal.timeout(15000),
  })

  if (!response.ok) {
    throw new Error(`ML service returned HTTP ${response.status}`)
  }

  return response.json()
}

async function extractSkills(text) {
  const serviceUrl = process.env.ML_SERVICE_URL

  if (!serviceUrl) {
    throw new Error('ML_SERVICE_URL is not configured')
  }

  const response = await fetch(`${serviceUrl}/skills/extract`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
    signal: AbortSignal.timeout(15000),
  })

  if (!response.ok) {
    throw new Error(`ML service returned HTTP ${response.status}`)
  }

  return response.json()
}

async function calculateSimilarity(resumeText, jobText) {
  const serviceUrl = process.env.ML_SERVICE_URL

  if (!serviceUrl) {
    throw new Error('ML_SERVICE_URL is not configured')
  }

  const response = await fetch(`${serviceUrl}/similarity`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      resume_text: resumeText,
      job_text: jobText,
    }),
    signal: AbortSignal.timeout(60000),
  })

  if (!response.ok) {
    throw new Error(`ML service returned HTTP ${response.status}`)
  }

  return response.json()
}

module.exports = {
  getMlServiceHealth,
  preprocessText,
  extractSkills,
  calculateSimilarity,
}