import { useEffect, useState } from 'react'

import { listResumes } from '../services/resumeService'
import { listJobs } from '../services/jobService'
import {
  calculateMatch,
  listMatches,
} from '../services/matchService'

function MatchesPage() {
  const [resumes, setResumes] = useState([])
  const [jobs, setJobs] = useState([])
  const [matches, setMatches] = useState([])
  const [resumeId, setResumeId] = useState('')
  const [jobId, setJobId] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isCalculating, setIsCalculating] = useState(false)

  useEffect(() => {
    Promise.all([listResumes(), listJobs(), listMatches()])
      .then(([loadedResumes, loadedJobs, loadedMatches]) => {
        setResumes(loadedResumes)
        setJobs(loadedJobs)
        setMatches(loadedMatches)
        setResumeId(loadedResumes[0]?.id || '')
        setJobId(loadedJobs[0]?.id || '')
      })
      .catch(() => setMessage('Unable to load matching data.'))
      .finally(() => setIsLoading(false))
  }, [])

  async function handleCalculate(event) {
    event.preventDefault()
    setMessage('')

    if (!resumeId || !jobId) {
      setMessage('Select both a resume and a job description.')
      return
    }

    setIsCalculating(true)

    try {
      const match = await calculateMatch(resumeId, jobId)
      setMatches((currentMatches) => [
        match,
        ...currentMatches.filter(
          (item) =>
            item.resume_id !== match.resume_id ||
            item.job_id !== match.job_id,
        ),
      ])
      setMessage('Match calculated successfully.')
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          'Unable to calculate match.',
      )
    } finally {
      setIsCalculating(false)
    }
  }

  return (
    <main className="workspace-page">
      <header className="workspace-header">
        <p className="eyebrow">RESUME MATCHING</p>
        <h1>Compare <span>your fit</span></h1>
      </header>

      {isLoading ? (
        <p className="workspace-empty">Loading matching data...</p>
      ) : (
        <div className="resume-layout">
          <section className="resume-form-card">
            <h2>Calculate match</h2>
            <form className="resume-form" onSubmit={handleCalculate}>
              <label htmlFor="match-resume">Resume</label>
              <select
                id="match-resume"
                value={resumeId}
                onChange={(event) => setResumeId(event.target.value)}
              >
                {resumes.map((resume) => (
                  <option value={resume.id} key={resume.id}>
                    {resume.title}
                  </option>
                ))}
              </select>

              <label htmlFor="match-job">Internship</label>
              <select
                id="match-job"
                value={jobId}
                onChange={(event) => setJobId(event.target.value)}
              >
                {jobs.map((job) => (
                  <option value={job.id} key={job.id}>
                    {job.title} · {job.company}
                  </option>
                ))}
              </select>

              {message && (
                <p
                  className={
                    message.toLowerCase().includes('unable') ||
                    message.toLowerCase().includes('select')
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
                disabled={isCalculating}
              >
                {isCalculating ? 'Calculating...' : 'Calculate match'}
              </button>
            </form>
          </section>

          <section className="resume-list">
            <h2>Match history</h2>
            {matches.length === 0 && (
              <p className="workspace-empty">
                No match results yet.
              </p>
            )}
            {matches.map((match) => (
              <article className="resume-card" key={match.id}>
                <h3>
                  {match.resume_title || 'Resume'} vs{' '}
                  {match.job_title || 'Internship'}
                </h3>
                <p>
                  Semantic similarity:{' '}
                  <strong>
                    {(Number(match.semantic_similarity) * 100).toFixed(1)}%
                  </strong>
                </p>
                <p>
                  Matching skills:{' '}
                  {match.matching_skills?.join(', ') || 'None detected'}
                </p>
                <p>
                  Skill gaps:{' '}
                  {match.skill_gaps?.join(', ') || 'None detected'}
                </p>
              </article>
            ))}
          </section>
        </div>
      )}
    </main>
  )
}

export default MatchesPage
