import { useState } from 'react'
import Container from '../components/Container'
import { useAuth } from '../context/AuthContext'
import { useNavigate, useLocation, Link } from 'react-router-dom'

export default function SignIn(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/vendor/dashboard'

  function handleSubmit(e){
    e.preventDefault()
    signin({ email, password }, () => navigate(from, { replace: true }))
  }

  return (
    <Container>
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm md:grid-cols-2">
        <div className="hidden flex-col justify-between bg-[#e5eee8] p-10 md:flex"><div><span className="text-xs font-bold uppercase tracking-[.18em] text-[#488367]">Vendorly for sellers</span><h2 className="mt-5 max-w-sm text-4xl font-semibold leading-tight tracking-tight text-[#172e27]">Your next chapter starts with a storefront.</h2><p className="mt-4 max-w-sm text-sm leading-6 text-[#50665c]">Manage your products, connect with customers and grow your business in one simple place.</p></div><span className="text-sm font-medium text-[#50665c]">Independent business, made easier.</span></div>
        <div className="p-6 sm:p-10 lg:p-14">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-[#488367]">Seller workspace</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-500">Sign in to manage your storefront and orders.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm focus:border-[#8fbaa3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm focus:border-[#8fbaa3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6]"
              required
            />
          </div>

          <button type="submit" className="w-full rounded-full bg-[#1d5a49] px-4 py-3.5 text-sm font-semibold text-white hover:bg-[#164638]">
            Sign in
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">New to Vendorly? <Link to="/vendor/register" className="font-semibold text-[#28644d] hover:underline">Create a seller account</Link></p>
        </div>
      </div>
    </Container>
  )
}
