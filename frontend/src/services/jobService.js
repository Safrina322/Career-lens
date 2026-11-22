import api from './api'

export async function listJobs() {
  const response = await api.get('/jobs')
  return response.data.data
}

export async function createJob(job) {
  const response = await api.post('/jobs', job)
  return response.data.data
}

export async function updateJob(jobId, job) {
  const response = await api.put(`/jobs/${jobId}`, job)
  return response.data.data
}

export async function deleteJob(jobId) {
  const response = await api.delete(`/jobs/${jobId}`)
  return response.data
}
