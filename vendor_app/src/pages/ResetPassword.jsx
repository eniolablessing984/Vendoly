import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Container from '../components/Container'
import { useAuth } from '../context/AuthContext'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const { signin } = useAuth()
  const [email, setEmail] = useState(() => localStorage.getItem('vendor_password_reset_email') || '')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('We need your email address before resetting your password.')
      return
    }

    if (password.length < 6) {
      setError('Use at least 6 characters for your new password.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.')
      return
    }

    localStorage.removeItem('vendor_password_reset_email')
    signin({ email, password, role: 'customer' }, () => navigate('/checkout', { replace: true }))
  }

  return (
    <Container>
      <div className="mx-auto max-w-xl rounded-4xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-[#3d725a]">Security</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Reset your password</h1>
        <p className="mt-2 text-sm text-slate-500">Choose a new password to continue your order.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label htmlFor="reset-password-email" className="block text-sm font-medium text-slate-700">
            Email
            <input
              id="reset-password-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm focus:border-[#8fbaa3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6]"
              required
            />
          </label>

          <label htmlFor="new-password" className="block text-sm font-medium text-slate-700">
            New password
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter a new password"
              className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm focus:border-[#8fbaa3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6]"
              required
            />
          </label>

          <label htmlFor="confirm-new-password" className="block text-sm font-medium text-slate-700">
            Confirm new password
            <input
              id="confirm-new-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Confirm your password"
              className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm focus:border-[#8fbaa3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6]"
              required
            />
          </label>

          {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

          <button type="submit" className="w-full rounded-full bg-[#1d5a49] px-4 py-3.5 text-sm font-semibold text-white hover:bg-[#164638]">
            Update password
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Need help? <Link to="/login" className="font-semibold text-[#28644d] hover:underline">Return to login</Link>
        </p>
      </div>
    </Container>
  )
}
