import api from './api'

export async function calculateMatch(resumeId, jobId) {
  const response = await api.post('/matches', {
    resumeId,
    jobId,
  })

  return response.data.data
}

export async function listMatches() {
  const response = await api.get('/matches')
  return response.data.data
}
