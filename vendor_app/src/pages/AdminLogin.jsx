import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Container from '../components/Container'
import { useAuth } from '../context/AuthContext'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const { signin } = useAuth()
  const [email, setEmail] = useState('admin@vendorly.com')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const succeeded = signin({ email, password, role: 'admin' }, () => navigate('/admin/dashboard', { replace: true }))
    if (!succeeded) {
      setError('Incorrect company admin credentials. Use the admin login details provided by the platform.')
    }
  }

  return (
    <Container>
      <div className="mx-auto max-w-xl rounded-4xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-[#3d725a]">Company access</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Company Admin Login</h1>
        <p className="mt-2 text-sm text-slate-500">Review seller applications, verify approved sellers, and ban accounts that violate marketplace policies.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label htmlFor="admin-email" className="block text-sm font-medium text-slate-700">
            Admin email
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm focus:border-[#8fbaa3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6]"
              required
            />
          </label>

          <label htmlFor="admin-password" className="block text-sm font-medium text-slate-700">
            Password
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm focus:border-[#8fbaa3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6]"
              required
            />
          </label>

          {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

          <button type="submit" className="w-full rounded-full bg-[#1d5a49] px-4 py-3.5 text-sm font-semibold text-white hover:bg-[#164638]">
            Access admin dashboard
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Need the marketplace? <Link to="/" className="font-semibold text-[#28644d] hover:underline">Return home</Link>
        </p>
      </div>
    </Container>
  )
}
