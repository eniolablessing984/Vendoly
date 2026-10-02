import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Container from '../components/Container'
import { useAuth } from '../context/AuthContext'

export default function SignUpPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signup } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const from = location.state?.from?.pathname || '/'

  function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields to create your account.')
      return
    }

    if (password.length < 6) {
      setError('Use at least 6 characters for your password.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.')
      return
    }

    signup({ name, email, password }, () => navigate(from, { replace: true }))
  }

  return (
    <Container>
      <div className="mx-auto max-w-5xl overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-sm md:grid-cols-2">
        <div className="hidden flex-col justify-between bg-[#e5eee8] p-10 md:flex">
          <div>
            <span className="text-xs font-bold uppercase tracking-[.18em] text-[#3d725a]">Create account</span>
            <p className="mt-5 max-w-sm text-4xl font-semibold leading-tight tracking-tight text-[#172e27]">Start shopping with confidence.</p>
            <p className="mt-4 max-w-sm text-sm leading-6 text-[#50665c]">Sign up to save your cart, check out faster, and keep track of your orders.</p>
          </div>
          <span className="text-sm font-medium text-[#50665c]">Fast, secure, and easy.</span>
        </div>

        <div className="p-6 sm:p-10 lg:p-14">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[#3d725a]">Welcome</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Create an account</h1>
          <p className="mt-2 text-sm text-slate-500">Join Vendorly to continue your purchase.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label htmlFor="signup-name" className="block text-sm font-medium text-slate-700">
              Full name
              <input
                id="signup-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your full name"
                className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm focus:border-[#8fbaa3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6]"
                required
              />
            </label>

            <label htmlFor="signup-email" className="block text-sm font-medium text-slate-700">
              Email
              <input
                id="signup-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm focus:border-[#8fbaa3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6]"
                required
              />
            </label>

            <label htmlFor="signup-password" className="block text-sm font-medium text-slate-700">
              Password
              <input
                id="signup-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Create a password"
                className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm focus:border-[#8fbaa3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6]"
                required
              />
            </label>

            <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-slate-700">
              Confirm password
              <input
                id="signup-confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Repeat your password"
                className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm focus:border-[#8fbaa3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6]"
                required
              />
            </label>

            {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

            <button type="submit" className="w-full rounded-full bg-[#1d5a49] px-4 py-3.5 text-sm font-semibold text-white hover:bg-[#164638]">
              Create account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account? <Link to="/login" className="font-semibold text-[#28644d] hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </Container>
  )
}
