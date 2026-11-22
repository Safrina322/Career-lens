import api from './api'

export async function listApplications() {
  const response = await api.get('/applications')
  return response.data.data
}

export async function createApplication(jobId, status, notes, appliedAt) {
  const response = await api.post('/applications', {
    jobId,
    status,
    notes,
    appliedAt,
  })

  return response.data.data
}

export async function updateApplication(
  applicationId,
  status,
  notes,
  appliedAt,
) {
  const response = await api.put(`/applications/${applicationId}`, {
    status,
    notes,
    appliedAt,
  })

  return response.data.data
}

export async function deleteApplication(applicationId) {
  const response = await api.delete(`/applications/${applicationId}`)
  return response.data
}
