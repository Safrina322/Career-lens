import { useEffect, useState } from 'react'

import { listJobs } from '../services/jobService'
import {
  createApplication,
  deleteApplication,
  listApplications,
  updateApplication,
} from '../services/applicationService'

const statuses = [
  'saved',
  'applied',
  'interview',
  'rejected',
  'accepted',
]

function ApplicationsPage() {
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [jobId, setJobId] = useState('')
  const [status, setStatus] = useState('saved')
  const [notes, setNotes] = useState('')
  const [appliedAt, setAppliedAt] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    Promise.all([listJobs(), listApplications()])
      .then(([loadedJobs, loadedApplications]) => {
        setJobs(loadedJobs)
        setApplications(loadedApplications)
        setJobId(loadedJobs[0]?.id || '')
      })
      .catch(() => setMessage('Unable to load applications.'))
      .finally(() => setIsLoading(false))
  }, [])

  function resetForm() {
    setEditingId(null)
    setStatus('saved')
    setNotes('')
    setAppliedAt('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')

    if (!jobId && !editingId) {
      setMessage('Select an internship.')
      return
    }

    try {
      if (editingId) {
        const updated = await updateApplication(
          editingId,
          status,
          notes,
          appliedAt,
        )
        setApplications((current) =>
          current.map((item) =>
            item.id === editingId ? { ...item, ...updated } : item,
          ),
        )
        setMessage('Application updated successfully.')
      } else {
        await createApplication(
          jobId,
          status,
          notes,
          appliedAt,
        )
        const refreshedApplications = await listApplications()
        setApplications(refreshedApplications)
        setMessage('Application saved successfully.')
      }

      resetForm()
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          'Unable to save application.',
      )
    }
  }

  function handleEdit(application) {
    setEditingId(application.id)
    setStatus(application.status)
    setNotes(application.notes || '')
    setAppliedAt(application.applied_at?.slice(0, 10) || '')
    setMessage('')
  }

  async function handleDelete(application) {
    if (!window.confirm(`Delete this ${application.title} application?`)) {
      return
    }

    try {
      await deleteApplication(application.id)
      setApplications((current) =>
        current.filter((item) => item.id !== application.id),
      )
      if (editingId === application.id) resetForm()
      setMessage('Application deleted successfully.')
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          'Unable to delete application.',
      )
    }
  }

  return (
    <main className="workspace-page">
      <header className="workspace-header">
        <p className="eyebrow">APPLICATION TRACKING</p>
        <h1>Your <span>applications</span></h1>
      </header>

      {isLoading ? (
        <p className="workspace-empty">Loading applications...</p>
      ) : (
        <div className="resume-layout">
          <section className="resume-form-card">
            <h2>{editingId ? 'Edit application' : 'Track application'}</h2>
            <form className="resume-form" onSubmit={handleSubmit}>
              {!editingId && (
                <>
                  <label htmlFor="application-job">Internship</label>
                  <select
                    id="application-job"
                    value={jobId}
                    onChange={(event) => setJobId(event.target.value)}
                  >
                    {jobs.map((job) => (
                      <option value={job.id} key={job.id}>
                        {job.title} · {job.company}
                      </option>
                    ))}
                  </select>
                </>
              )}

              <label htmlFor="application-status">Status</label>
              <select
                id="application-status"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                {statuses.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>

              <label htmlFor="application-date">Applied date</label>
              <input
                id="application-date"
                type="date"
                value={appliedAt}
                onChange={(event) => setAppliedAt(event.target.value)}
              />

              <label htmlFor="application-notes">Notes</label>
              <textarea
                id="application-notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows="5"
              />

              {message && (
                <p
                  className={
                    message.toLowerCase().includes('unable')
                      ? 'auth-error'
                      : 'auth-success'
                  }
                  role="status"
                >
                  {message}
                </p>
              )}

              <button type="submit" className="button button-primary">
                {editingId ? 'Update application' : 'Save application'}
              </button>
              {editingId && (
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

          <section className="resume-list">
            <h2>Tracked applications</h2>
            {applications.length === 0 && (
              <p className="workspace-empty">
                No applications tracked yet.
              </p>
            )}
            {applications.map((application) => (
              <article className="resume-card" key={application.id}>
                <h3>{application.title}</h3>
                <p>
                  <strong>{application.company}</strong>
                  {application.location
                    ? ` · ${application.location}`
                    : ''}
                </p>
                <p>Status: <strong>{application.status}</strong></p>
                {application.notes && <p>{application.notes}</p>}
                <div className="resume-actions">
                  <button
                    type="button"
                    className="resume-action-button"
                    onClick={() => handleEdit(application)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="resume-action-button resume-delete-button"
                    onClick={() => handleDelete(application)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </section>
        </div>
      )}
    </main>
  )
}

export default ApplicationsPage
