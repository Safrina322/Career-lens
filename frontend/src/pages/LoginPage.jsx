import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { login } from '../services/authService'

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const result = await login(email, password)
      sessionStorage.setItem('careerlens_token', result.token)
      sessionStorage.setItem('careerlens_user', JSON.stringify(result.user))
      navigate('/dashboard')
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Unable to sign in. Please try again.'

      setErrorMessage(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <Link className="brand auth-brand" to="/" aria-label="CareerLens AI home">
          <span className="brand-mark">C</span>
          <span>CareerLens <em>AI</em></span>
        </Link>

        <p className="eyebrow">WELCOME BACK</p>
        <h1>Sign in to <span>CareerLens.</span></h1>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {errorMessage && (
            <p className="auth-error" role="alert">
              {errorMessage}
            </p>
          )}

          {location.state?.message && !errorMessage && (
            <p className="auth-success" role="status">
              {location.state.message}
            </p>
          )}

          <button
            type="submit"
            className="button button-primary auth-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="auth-switch">
          New to CareerLens? <Link to="/register">Create an account</Link>
        </p>

        <Link className="text-link auth-back" to="/">
          <span aria-hidden="true">←</span> Back to home
        </Link>
      </div>
    </main>
  )
}

export default LoginPage
