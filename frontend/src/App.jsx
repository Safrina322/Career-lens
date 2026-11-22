import './App.css'
import { Link } from 'react-router-dom'

const features = [
  {
    number: '01',
    title: 'Understand your resume',
    description:
      'Organize your experience, projects, and technical skills in one clear place.',
  },
  {
    number: '02',
    title: 'Compare opportunities',
    description:
      'See how your resume relates to the requirements in each internship description.',
  },
  {
    number: '03',
    title: 'Plan your next step',
    description:
      'Identify skill gaps and track applications with evidence-based insights.',
  },
]

function App() {
  return (
    <main className="app-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="CareerLens AI home">
          <span className="brand-mark">C</span>
          <span>CareerLens <em>AI</em></span>
        </a>
        <nav className="site-nav" aria-label="Main navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#features">Features</a>
          <Link className="button button-outline" to="/login">
            Sign in
          </Link>
        </nav>
      </header>

      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">YOUR NEXT OPPORTUNITY, CLEARER</p>
          <h1>Turn your resume into a <span>smarter</span> internship search.</h1>
          <p className="hero-description">
            CareerLens AI helps you understand your strengths, compare your
            resume with real opportunities, and make your next move with
            confidence.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/dashboard">
              Get started <span aria-hidden="true">→</span>
            </Link>
            <a className="text-link" href="#how-it-works">
              Explore the approach <span aria-hidden="true">↓</span>
            </a>
          </div>
          <p className="trust-note">
            <span aria-hidden="true">✦</span> Built for students. Grounded in
            your evidence.
          </p>
        </div>

        <div className="hero-visual" aria-label="Resume analysis preview">
          <div className="visual-orbit orbit-one" />
          <div className="visual-orbit orbit-two" />
          <div className="analysis-card">
            <div className="card-topline">
              <span className="status-dot" />
              <span>RESUME ANALYSIS</span>
              <span className="card-menu">•••</span>
            </div>
            <div className="score-row">
              <div>
                <p className="score-label">Match strength</p>
                <strong>78<span>%</span></strong>
              </div>
              <div className="score-ring"><span>Good fit</span></div>
            </div>
            <div className="skill-list">
              <div><span>React.js</span><i className="skill-bar bar-high" /></div>
              <div><span>Node.js</span><i className="skill-bar bar-high" /></div>
              <div><span>PostgreSQL</span><i className="skill-bar bar-medium" /></div>
            </div>
            <div className="card-footer">3 strengths found <span>↗</span></div>
          </div>
          <div className="floating-label label-top">SEMANTIC INSIGHT <span>✦</span></div>
          <div className="floating-label label-bottom">SKILL GAP <span>+2</span></div>
        </div>
      </section>

      <section className="process-section" id="how-it-works">
        <div className="section-heading">
          <p className="eyebrow">A CLEARER WAY FORWARD</p>
          <h2>Make every application more intentional.</h2>
        </div>
        <p className="section-intro">
          No guesswork. No inflated promises. Just a practical view of how your
          experience connects to the opportunities you want.
        </p>
        <div className="feature-grid" id="features">
          {features.map((feature) => (
            <article className="feature-card" key={feature.number}>
              <span className="feature-number">{feature.number}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <span className="feature-arrow" aria-hidden="true">↗</span>
            </article>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <span>CareerLens AI</span>
        <span>Evidence over assumptions.</span>
      </footer>
    </main>
  )
}

export default App
