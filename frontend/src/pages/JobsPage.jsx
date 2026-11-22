import { useEffect, useState } from 'react'

import {
  createJob,
  deleteJob,
  listJobs,
  updateJob,
} from '../services/jobService'

const emptyForm = {
  title: '',
  company: '',
  location: '',
  description: '',
  sourceUrl: '',
}

function JobsPage() {
  const [jobs, setJobs] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingJobId, setEditingJobId] = useState(null)

  useEffect(() => {
    listJobs()
      .then(setJobs)
      .catch(() => setMessage('Unable to load job descriptions.'))
      .finally(() => setIsLoading(false))
  }, [])

  function handleChange(event) {
    setForm((currentForm) => ({
      ...currentForm,
      [event.target.name]: event.target.value,
    }))
  }

  function resetForm() {
    setForm(emptyForm)
    setErrors({})
    setEditingJobId(null)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setErrors({})
    setMessage('')
    setIsSubmitting(true)

    try {
      if (editingJobId) {
        const updatedJob = await updateJob(editingJobId, form)
        setJobs((currentJobs) =>
          currentJobs.map((job) =>
            job.id === editingJobId ? updatedJob : job,
          ),
        )
        setMessage('Job description updated successfully.')
      } else {
        const job = await createJob(form)
        setJobs((currentJobs) => [job, ...currentJobs])
        setMessage('Job description created successfully.')
      }

      resetForm()
    } catch (error) {
      const responseData = error.response?.data
      setErrors(responseData?.errors || {})
      setMessage(
        responseData?.message ||
          (editingJobId
            ? 'Unable to update job description.'
            : 'Unable to create job description.'),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleEdit(job) {
    setEditingJobId(job.id)
    setForm({
      title: job.title,
      company: job.company,
      location: job.location || '',
      description: job.description,
      sourceUrl: job.source_url || '',
    })
    setErrors({})
    setMessage('')
  }

  async function handleDelete(job) {
    if (!window.confirm(`Delete "${job.title}" at ${job.company}?`)) {
      return
    }

    try {
      await deleteJob(job.id)
      setJobs((currentJobs) =>
        currentJobs.filter((item) => item.id !== job.id),
      )

      if (editingJobId === job.id) {
        resetForm()
      }

      setMessage('Job description deleted successfully.')
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          'Unable to delete job description.',
      )
    }
  }

  return (
    <main className="workspace-page">
      <header className="workspace-header">
        <div>
          <p className="eyebrow">INTERNSHIP MANAGEMENT</p>
          <h1>Saved <span>opportunities</span></h1>
        </div>
      </header>

      <div className="resume-layout">
        <section
          className="resume-form-card"
          aria-labelledby="job-form-title"
        >
          <h2 id="job-form-title">
            {editingJobId
              ? 'Edit job description'
              : 'Add internship'}
          </h2>

          <form className="resume-form" onSubmit={handleSubmit}>
            <label htmlFor="job-title">Job title</label>
            <input
              id="job-title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Software Engineering Intern"
              required
            />
            {errors.title && (
              <p className="field-error">{errors.title}</p>
            )}

            <label htmlFor="job-company">Company</label>
            <input
              id="job-company"
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="Example Labs"
              required
            />
            {errors.company && (
              <p className="field-error">{errors.company}</p>
            )}

            <label htmlFor="job-location">Location</label>
            <input
              id="job-location"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Remote or city"
            />
            {errors.location && (
              <p className="field-error">{errors.location}</p>
            )}

            <label htmlFor="job-description">Job description</label>
            <textarea
              id="job-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Responsibilities, requirements, and technologies"
              rows="10"
              required
            />
            {errors.description && (
              <p className="field-error">{errors.description}</p>
            )}

            <label htmlFor="job-source-url">Source URL</label>
            <input
              id="job-source-url"
              name="sourceUrl"
              type="url"
              value={form.sourceUrl}
              onChange={handleChange}
              placeholder="https://company.com/careers/..."
            />
            {errors.sourceUrl && (
              <p className="field-error">{errors.sourceUrl}</p>
            )}

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
                : editingJobId
                  ? 'Update internship'
                  : 'Save internship'}
            </button>

            {editingJobId && (
              <button
                type="button"
                className="button resume-cancel-button"
                onClick={resetForm}
              >
                Cancel editing
              </button>
            )}
          </form>
        </section>

        <section className="resume-list" aria-labelledby="saved-jobs-title">
          <h2 id="saved-jobs-title">Saved internships</h2>
          {isLoading && (
            <p className="workspace-empty">Loading internships...</p>
          )}
          {!isLoading && jobs.length === 0 && (
            <p className="workspace-empty">
              No internship descriptions added yet.
            </p>
          )}

          {jobs.map((job) => (
            <article className="resume-card" key={job.id}>
              <h3>{job.title}</h3>
              <p>
                <strong>{job.company}</strong>
                {job.location ? ` · ${job.location}` : ''}
              </p>
              <p className="resume-preview">{job.description}</p>
              {job.source_url && (
                <a
                  className="text-link"
                  href={job.source_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  View source <span aria-hidden="true">↗</span>
                </a>
              )}
              <div className="resume-actions">
                <button
                  type="button"
                  className="resume-action-button"
                  onClick={() => handleEdit(job)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="resume-action-button resume-delete-button"
                  onClick={() => handleDelete(job)}
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

export default JobsPage
