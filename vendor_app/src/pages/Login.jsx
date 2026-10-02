import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Container from '../components/Container'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signin } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const from = location.state?.from?.pathname || '/'

  function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password to continue.')
      return
    }

    signin({ email, password, role: 'customer' }, () => navigate(from, { replace: true }))
  }

  return (
    <Container>
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm md:grid-cols-2">
        <div className="hidden flex-col justify-between bg-[#e5eee8] p-10 md:flex">
          <div>
            <span className="text-xs font-bold uppercase tracking-[.18em] text-[#3d725a]">Customer access</span>
            <p className="mt-5 max-w-sm text-4xl font-semibold leading-tight tracking-tight text-[#172e27]">Log in to continue</p>
            <p className="mt-4 max-w-sm text-sm leading-6 text-[#50665c]">Save your basket, track your order, and finish checkout in a few clicks.</p>
          </div>
          <span className="text-sm font-medium text-[#50665c]">Welcome back to Vendorly.</span>
        </div>

        <div className="p-6 sm:p-10 lg:p-14">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[#3d725a]">Account</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Log in to continue</h1>
          <p className="mt-2 text-sm text-slate-500">Use your email and password to access your account.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label htmlFor="customer-email" className="block text-sm font-medium text-slate-700">
              Email
              <input
                id="customer-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm focus:border-[#8fbaa3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6]"
                required
              />
            </label>

            <label htmlFor="customer-password" className="block text-sm font-medium text-slate-700">
              Password
              <input
                id="customer-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm focus:border-[#8fbaa3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6]"
                required
              />
            </label>

            <div className="flex items-center justify-between text-sm">
              <Link to="/forgot-password" className="font-medium text-[#28644d] hover:underline">Forgot password?</Link>
            </div>

            {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

            <button type="submit" className="w-full rounded-full bg-[#1d5a49] px-4 py-3.5 text-sm font-semibold text-white hover:bg-[#164638]">
              Log in
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            New here? <Link to="/signup" className="font-semibold text-[#28644d] hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </Container>
  )
}
