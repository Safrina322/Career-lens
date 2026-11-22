import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { getCurrentUser } from '../services/authService'

function ProtectedRoute() {
  const [status, setStatus] = useState(() =>
    sessionStorage.getItem('careerlens_token') ? 'checking' : 'unauthorized',
  )

  useEffect(() => {
    const token = sessionStorage.getItem('careerlens_token')

    if (!token) {
      return
    }

    getCurrentUser()
      .then(() => setStatus('authorized'))
      .catch(() => {
        sessionStorage.removeItem('careerlens_token')
        sessionStorage.removeItem('careerlens_user')
        setStatus('unauthorized')
      })
  }, [])

  if (status === 'checking') {
    return <main className="auth-loading">Checking your session...</main>
  }

  if (status === 'unauthorized') {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
