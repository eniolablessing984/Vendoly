import { useState } from 'react'
import { Link } from 'react-router-dom'
import Container from '../components/Container'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail) return

    localStorage.setItem('vendor_password_reset_email', normalizedEmail)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <Container>
        <div className="mx-auto max-w-xl rounded-[2rem] border border-slate-200 bg-white px-6 py-14 text-center shadow-sm sm:px-10">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[#3d725a]">Check your inbox</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">Reset link sent</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">A demo reset link has been prepared for {email}.</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/reset-password" className="rounded-full bg-[#1d5a49] px-6 py-3 text-sm font-semibold text-white hover:bg-[#164638]">Reset your password</Link>
            <Link to="/login" className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Back to login</Link>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="mx-auto max-w-xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-[#3d725a]">Account recovery</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Forgot your password?</h1>
        <p className="mt-2 text-sm text-slate-500">Enter your email and we’ll help you set a new password.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label htmlFor="reset-email" className="block text-sm font-medium text-slate-700">
            Email address
            <input
              id="reset-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm focus:border-[#8fbaa3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6]"
              required
            />
          </label>

          <button type="submit" className="w-full rounded-full bg-[#1d5a49] px-4 py-3.5 text-sm font-semibold text-white hover:bg-[#164638]">
            Send reset link
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Remembered it? <Link to="/login" className="font-semibold text-[#28644d] hover:underline">Back to login</Link>
        </p>
      </div>
    </Container>
  )
}
