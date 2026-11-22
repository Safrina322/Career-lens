import { useEffect, useState } from 'react'

import {
  createResume,
  deleteResume,
  listResumes,
  listResumeSections,
  createResumeSection,
  updateResumeSection,
  deleteResumeSection,
  extractResumePdf,
  updateResume,
} from '../services/resumeService'

function ResumesPage() {
  const [resumes, setResumes] = useState([])
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [rawText, setRawText] = useState('')
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingResumeId, setEditingResumeId] = useState(null)
  const [selectedResumeId, setSelectedResumeId] = useState(null)
  const [sections, setSections] = useState([])
  const [sectionType, setSectionType] = useState('education')
  const [sectionContent, setSectionContent] = useState('')
  const [sectionOrder, setSectionOrder] = useState(0)
  const [editingSectionId, setEditingSectionId] = useState(null)
  const [sectionErrors, setSectionErrors] = useState({})
  const [isExtractingPdf, setIsExtractingPdf] = useState(false)

  useEffect(() => {
    listResumes()
      .then((loadedResumes) => {
        setResumes(loadedResumes)
        setSelectedResumeId((currentId) =>
          currentId || loadedResumes[0]?.id || null,
        )
      })
      .catch(() => setMessage('Unable to load resumes.'))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    if (!selectedResumeId) {
      return
    }

    listResumeSections(selectedResumeId)
      .then(setSections)
      .catch(() => setMessage('Unable to load resume sections.'))
  }, [selectedResumeId])

  async function handleSubmit(event) {
    event.preventDefault()
    setErrors({})
    setMessage('')
    setIsSubmitting(true)

    try {
      if (editingResumeId) {
        const updatedResume = await updateResume(
          editingResumeId,
          title,
          summary,
          rawText,
        )

        setResumes((currentResumes) =>
          currentResumes.map((resume) =>
            resume.id === editingResumeId ? updatedResume : resume,
          ),
        )
        setMessage('Resume updated successfully.')
      } else {
        const resume = await createResume(title, summary, rawText)
        setResumes((currentResumes) => [resume, ...currentResumes])
        setMessage('Resume created successfully.')
      }

      setTitle('')
      setSummary('')
      setRawText('')
      setEditingResumeId(null)
    } catch (error) {
      const responseData = error.response?.data
      setErrors(responseData?.errors || {})
      setMessage(
        responseData?.message ||
          (editingResumeId
            ? 'Unable to update resume.'
            : 'Unable to create resume.'),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handlePdfUpload(event) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setErrors((currentErrors) => ({
      ...currentErrors,
      rawText: undefined,
    }))
    setMessage('')
    setIsExtractingPdf(true)

    try {
      const extracted = await extractResumePdf(file)
      setRawText(extracted.rawText)
      setMessage(
        `PDF text extracted successfully. ${extracted.pageCount} page(s), ${extracted.characterCount} characters.`,
      )
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          'Unable to extract text from the PDF.',
      )
    } finally {
      setIsExtractingPdf(false)
      event.target.value = ''
    }
  }

  function handleEdit(resume) {
    setEditingResumeId(resume.id)
    setTitle(resume.title)
    setSummary(resume.summary || '')
    setRawText(resume.raw_text)
    setErrors({})
    setMessage('')
  }

  function cancelEdit() {
    setEditingResumeId(null)
    setTitle('')
    setSummary('')
    setRawText('')
    setErrors({})
    setMessage('')
  }

  async function handleDelete(resume) {
    const confirmed = window.confirm(
      `Delete "${resume.title}"? This action cannot be undone.`,
    )

    if (!confirmed) {
      return
    }

    try {
      await deleteResume(resume.id)
      const remainingResumes = resumes.filter(
        (item) => item.id !== resume.id,
      )
      setResumes(remainingResumes)

      if (editingResumeId === resume.id) {
        cancelEdit()
      }

      if (selectedResumeId === resume.id) {
        setSelectedResumeId(remainingResumes[0]?.id || null)
        setSections([])
      }

      setMessage('Resume deleted successfully.')
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Unable to delete resume.',
      )
    }
  }

  function resetSectionForm() {
    setEditingSectionId(null)
    setSectionType('education')
    setSectionContent('')
    setSectionOrder(0)
    setSectionErrors({})
  }

  async function handleSectionSubmit(event) {
    event.preventDefault()
    setSectionErrors({})

    if (!selectedResumeId) {
      setMessage('Select a resume before adding a section.')
      return
    }

    try {
      if (editingSectionId) {
        const updatedSection = await updateResumeSection(
          selectedResumeId,
          editingSectionId,
          sectionType,
          sectionContent,
          Number(sectionOrder),
        )
        setSections((currentSections) =>
          currentSections.map((section) =>
            section.id === editingSectionId ? updatedSection : section,
          ),
        )
        setMessage('Resume section updated successfully.')
      } else {
        const section = await createResumeSection(
          selectedResumeId,
          sectionType,
          sectionContent,
          Number(sectionOrder),
        )
        setSections((currentSections) =>
          [...currentSections, section].sort(
            (left, right) => left.display_order - right.display_order,
          ),
        )
        setMessage('Resume section created successfully.')
      }

      resetSectionForm()
    } catch (error) {
      const responseData = error.response?.data
      setSectionErrors(responseData?.errors || {})
      setMessage(
        responseData?.message || 'Unable to save resume section.',
      )
    }
  }

  function handleSectionEdit(section) {
    setEditingSectionId(section.id)
    setSectionType(section.section_type)
    setSectionContent(section.content)
    setSectionOrder(section.display_order)
    setSectionErrors({})
  }

  async function handleSectionDelete(section) {
    if (!window.confirm('Delete this resume section?')) {
      return
    }

    try {
      await deleteResumeSection(selectedResumeId, section.id)
      setSections((currentSections) =>
        currentSections.filter((item) => item.id !== section.id),
      )

      if (editingSectionId === section.id) {
        resetSectionForm()
      }

      setMessage('Resume section deleted successfully.')
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          'Unable to delete resume section.',
      )
    }
  }

  return (
    <main className="workspace-page">
      <header className="workspace-header">
        <div>
          <p className="eyebrow">RESUME MANAGEMENT</p>
          <h1>Your <span>resumes</span></h1>
        </div>
      </header>

      <div className="resume-layout">
        <section className="resume-form-card" aria-labelledby="create-resume-title">
          <h2 id="create-resume-title">
            {editingResumeId ? 'Edit resume' : 'Add resume'}
          </h2>
          <form className="resume-form" onSubmit={handleSubmit}>
            <label htmlFor="resume-title">Resume title</label>
            <input
              id="resume-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Software Engineering Internship"
              required
            />
            {errors.title && <p className="field-error">{errors.title}</p>}

            <label htmlFor="resume-summary">Summary</label>
            <textarea
              id="resume-summary"
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              placeholder="A short professional summary"
              rows="3"
            />
            {errors.summary && <p className="field-error">{errors.summary}</p>}

            <label htmlFor="resume-pdf">Extract from PDF</label>
            <input
              id="resume-pdf"
              type="file"
              accept="application/pdf,.pdf"
              onChange={handlePdfUpload}
              disabled={isExtractingPdf}
            />
            {isExtractingPdf && (
              <p className="field-error">Extracting PDF text...</p>
            )}

            <label htmlFor="resume-text">Resume text</label>
            <textarea
              id="resume-text"
              value={rawText}
              onChange={(event) => setRawText(event.target.value)}
              placeholder="Paste your skills, education, projects, and experience"
              rows="10"
              required
            />
            {errors.rawText && <p className="field-error">{errors.rawText}</p>}

            {message && (
              <p
                className={
                  message.toLowerCase().includes('unable') ||
                  message.toLowerCase().includes('not found')
                    ? 'auth-error'
                    : 'auth-success'
                }
                role="status"
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              className="button button-primary"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Saving...'
                : editingResumeId
                  ? 'Update resume'
                  : 'Save resume'}
            </button>
            {editingResumeId && (
              <button
                type="button"
                className="button resume-cancel-button"
                onClick={cancelEdit}
              >
                Cancel editing
              </button>
            )}
          </form>

          {selectedResumeId && (
            <div className="section-editor">
              <h3>
                {editingSectionId ? 'Edit section' : 'Add section'}
              </h3>
              <form
                className="resume-form"
                onSubmit={handleSectionSubmit}
              >
                <label htmlFor="section-type">Section type</label>
                <select
                  id="section-type"
                  value={sectionType}
                  onChange={(event) => setSectionType(event.target.value)}
                >
                  <option value="education">Education</option>
                  <option value="experience">Experience</option>
                  <option value="project">Project</option>
                  <option value="skills">Skills</option>
                  <option value="other">Other</option>
                </select>
                {sectionErrors.sectionType && (
                  <p className="field-error">
                    {sectionErrors.sectionType}
                  </p>
                )}

                <label htmlFor="section-content">Section content</label>
                <textarea
                  id="section-content"
                  value={sectionContent}
                  onChange={(event) =>
                    setSectionContent(event.target.value)
                  }
                  rows="4"
                  required
                />
                {sectionErrors.content && (
                  <p className="field-error">{sectionErrors.content}</p>
                )}

                <label htmlFor="section-order">Display order</label>
                <input
                  id="section-order"
                  type="number"
                  min="0"
                  value={sectionOrder}
                  onChange={(event) =>
                    setSectionOrder(event.target.value)
                  }
                />

                <button
                  type="submit"
                  className="button button-primary"
                >
                  {editingSectionId
                    ? 'Update section'
                    : 'Save section'}
                </button>
                {editingSectionId && (
                  <button
                    type="button"
                    className="button resume-cancel-button"
                    onClick={resetSectionForm}
                  >
                    Cancel section edit
                  </button>
                )}
              </form>
            </div>
          )}
        </section>

        <section className="resume-list" aria-labelledby="saved-resumes-title">
          <h2 id="saved-resumes-title">Saved resumes</h2>
          {isLoading && <p className="workspace-empty">Loading resumes...</p>}
          {!isLoading && resumes.length === 0 && (
            <p className="workspace-empty">No resumes added yet.</p>
          )}
          {resumes.map((resume) => (
            <article
              className={
                selectedResumeId === resume.id
                  ? 'resume-card resume-card-selected'
                  : 'resume-card'
              }
              key={resume.id}
            >
              <h3>{resume.title}</h3>
              {resume.summary && <p>{resume.summary}</p>}
              <p className="resume-preview">{resume.raw_text}</p>
              {selectedResumeId === resume.id && (
                <div className="resume-sections-list">
                  <h4>Structured sections</h4>
                  {sections.length === 0 && (
                    <p className="workspace-empty">
                      No structured sections yet.
                    </p>
                  )}
                  {sections.map((section) => (
                    <article
                      className="resume-section-item"
                      key={section.id}
                    >
                      <div>
                        <span>{section.section_type}</span>
                        <small>Order: {section.display_order}</small>
                      </div>
                      <p>{section.content}</p>
                      <div className="resume-actions">
                        <button
                          type="button"
                          className="resume-action-button"
                          onClick={() => handleSectionEdit(section)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="resume-action-button resume-delete-button"
                          onClick={() => handleSectionDelete(section)}
                        >
                          Delete
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
              <div className="resume-actions">
                <button
                  type="button"
                  className="resume-action-button"
                  onClick={() => setSelectedResumeId(resume.id)}
                >
                  Sections
                </button>
                <button
                  type="button"
                  className="resume-action-button"
                  onClick={() => handleEdit(resume)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="resume-action-button resume-delete-button"
                  onClick={() => handleDelete(resume)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}

export default ResumesPage
