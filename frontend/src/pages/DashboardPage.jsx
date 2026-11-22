import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { getDashboard } from '../services/dashboardService'

function DashboardPage() {
  const [dashboard, setDashboard] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    getDashboard()
      .then(setDashboard)
      .catch(() => setMessage('Unable to load dashboard data.'))
  }, [])

  return (
    <main className="workspace-page">
      <header className="workspace-header">
        <p className="eyebrow">YOUR WORKSPACE</p>
        <h1>Internship search, <span>in focus.</span></h1>
      </header>

      {message && <p className="auth-error" role="alert">{message}</p>}

      {dashboard && (
        <>
          <section className="dashboard-stats" aria-label="CareerLens statistics">
            <article>
              <span>Resumes</span>
              <strong>{dashboard.totals.resume_count}</strong>
            </article>
            <article>
              <span>Saved jobs</span>
              <strong>{dashboard.totals.job_count}</strong>
            </article>
            <article>
              <span>Applications</span>
              <strong>{dashboard.totals.application_count}</strong>
            </article>
          </section>

          <section className="dashboard-grid">
            <article className="resume-card">
              <h2>Application status</h2>
              {dashboard.application_statuses.length === 0 ? (
                <p>No applications tracked yet.</p>
              ) : (
                dashboard.application_statuses.map((item) => (
                  <p key={item.status}>
                    <strong>{item.status}</strong>: {item.count}
                  </p>
                ))
              )}
            </article>

            <article className="resume-card">
              <h2>Recent applications</h2>
              {dashboard.recent_applications.length === 0 ? (
                <p>No recent applications.</p>
              ) : (
                dashboard.recent_applications.map((application) => (
                  <p key={application.id}>
                    <strong>{application.title}</strong> · {application.status}
                  </p>
                ))
              )}
            </article>

            <article className="resume-card">
              <h2>Recent matches</h2>
              {dashboard.recent_matches.length === 0 ? (
                <p>No matches calculated yet.</p>
              ) : (
                dashboard.recent_matches.map((match) => (
                  <p key={match.id}>
                    <strong>{match.job_title}</strong>:{' '}
                    {(Number(match.semantic_similarity) * 100).toFixed(1)}%
                  </p>
                ))
              )}
            </article>
          </section>
        </>
      )}

      <nav className="dashboard-links" aria-label="CareerLens sections">
        <Link className="button button-primary" to="/resumes">Resumes</Link>
        <Link className="button button-outline" to="/jobs">Jobs</Link>
        <Link className="button button-outline" to="/matches">Matches</Link>
        <Link className="button button-outline" to="/applications">Applications</Link>
      </nav>
    </main>
  )
}

export default DashboardPage
