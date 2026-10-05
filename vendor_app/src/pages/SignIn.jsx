import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Container from '../components/Container'
import { useAuth } from '../context/AuthContext'

export default function SignIn(){
  const location = useLocation()
  const [email, setEmail] = useState(() => location.state?.demoApplication?.email || '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { signin } = useAuth()
  const navigate = useNavigate()
  const from = location.state?.from?.pathname || '/vendor/dashboard'

  function handleSubmit(event){
    event.preventDefault()
    setError('')

    const succeeded = signin({
      email,
      password,
      storeName: location.state?.demoApplication?.storeName,
      name: location.state?.demoApplication?.name,
      logo: location.state?.demoApplication?.logoData || '',
      role: 'seller',
    }, () => navigate(from, { replace: true }))
    if (!succeeded) {
      setError('This seller account is not approved yet or has been banned by the admin team.')
    }
  }

  return (
    <Container>
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm md:grid-cols-2">
        <div className="hidden flex-col justify-between bg-[#e5eee8] p-10 md:flex"><div><span className="text-xs font-bold uppercase tracking-[.18em] text-[#3d725a]">Vendorly for sellers</span><h2 className="mt-5 max-w-sm text-4xl font-semibold leading-tight tracking-tight text-[#172e27]">Your next chapter starts with a storefront.</h2><p className="mt-4 max-w-sm text-sm leading-6 text-[#50665c]">Manage your products, connect with customers and grow your business in one simple place.</p></div><span className="text-sm font-medium text-[#50665c]">Independent business, made easier.</span></div>
        <div className="p-6 sm:p-10 lg:p-14">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[#3d725a]">Seller workspace</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in to manage your storefront and orders.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label htmlFor="seller-email" className="block text-sm font-medium text-slate-700">Email
              <input id="seller-email" type="email" autoComplete="username" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm focus:border-[#8fbaa3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6]" required />
            </label>
            <label htmlFor="seller-password" className="block text-sm font-medium text-slate-700">Password
              <input id="seller-password" type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} placeholder="Enter your password" className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm focus:border-[#8fbaa3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6]" required />
            </label>
            {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <button type="submit" className="w-full rounded-full bg-[#1d5a49] px-4 py-3.5 text-sm font-semibold text-white hover:bg-[#164638]">Open seller demo</button>
          </form>

          <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900">Seller access is controlled by the company admin. Only approved sellers can open a storefront and start selling.</p>
          <p className="mt-6 text-center text-sm text-slate-500">New to Vendorly? <Link to="/vendor/register" className="font-semibold text-[#28644d] hover:underline">Apply to become a seller</Link></p>
        </div>
      </div>
    </Container>
  )
}
