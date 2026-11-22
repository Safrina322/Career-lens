import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { register } from '../services/authService'

function RegisterPage() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setErrors({})
    setMessage('')
    setIsSubmitting(true)

    try {
      await register(fullName, email, password)
      navigate('/login', {
        replace: true,
        state: {
          message: 'Account created successfully. Please sign in.',
        },
      })
    } catch (error) {
      const responseData = error.response?.data

      if (responseData?.errors) {
        setErrors(responseData.errors)
      }

      setMessage(
        responseData?.message ||
          'Unable to create account. Please try again.',
      )
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

        <p className="eyebrow">CREATE YOUR ACCOUNT</p>
        <h1>Start your <span>career search.</span></h1>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="fullName">Full name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            required
          />
          {errors.fullName && (
            <p className="field-error">{errors.fullName}</p>
          )}

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
          {errors.email && <p className="field-error">{errors.email}</p>}

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          {errors.password && (
            <p className="field-error">{errors.password}</p>
          )}

          {message && (
            <p className="auth-error" role="alert">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="button button-primary auth-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
        <Link className="text-link auth-back" to="/">
          <span aria-hidden="true">←</span> Back to home
        </Link>
      </div>
    </main>
  )
}

export default RegisterPage
