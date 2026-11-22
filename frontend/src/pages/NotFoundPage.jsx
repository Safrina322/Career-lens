import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <main className="placeholder-page">
      <p className="eyebrow">404</p>
      <h1>That page could not be <span>found.</span></h1>
      <Link className="button button-primary" to="/">Return home</Link>
    </main>
  )
}

export default NotFoundPage
