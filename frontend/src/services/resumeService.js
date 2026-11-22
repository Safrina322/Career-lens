import api from './api'

export async function listResumes() {
  const response = await api.get('/resumes')
  return response.data.data
}

export async function createResume(title, summary, rawText) {
  const response = await api.post('/resumes', {
    title,
    summary,
    rawText,
  })

  return response.data.data
}

export async function updateResume(resumeId, title, summary, rawText) {
  const response = await api.put(`/resumes/${resumeId}`, {
    title,
    summary,
    rawText,
  })

  return response.data.data
}

export async function deleteResume(resumeId) {
  const response = await api.delete(`/resumes/${resumeId}`)
  return response.data
}

export async function listResumeSections(resumeId) {
  const response = await api.get(`/resumes/${resumeId}/sections`)
  return response.data.data
}

export async function createResumeSection(
  resumeId,
  sectionType,
  content,
  displayOrder,
) {
  const response = await api.post(`/resumes/${resumeId}/sections`, {
    sectionType,
    content,
    displayOrder,
  })

  return response.data.data
}

export async function updateResumeSection(
  resumeId,
  sectionId,
  sectionType,
  content,
  displayOrder,
) {
  const response = await api.put(
    `/resumes/${resumeId}/sections/${sectionId}`,
    {
      sectionType,
      content,
      displayOrder,
    },
  )

  return response.data.data
}

export async function deleteResumeSection(resumeId, sectionId) {
  const response = await api.delete(
    `/resumes/${resumeId}/sections/${sectionId}`,
  )

  return response.data
}

export async function extractResumePdf(file) {
  const formData = new FormData()
  formData.append('resume', file)

  const response = await api.post('/resumes/extract-pdf', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data.data
}
