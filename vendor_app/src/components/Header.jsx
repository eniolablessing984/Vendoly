import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import Container from './Container'
import MiniCart from './MiniCart'

const navClass = ({ isActive }) =>
  `rounded-full px-3 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-[#e7f2ed] text-[#1c5b4a]'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`

export default function Header() {
  const { cart } = useCart()
  const { user, signout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const count = cart.reduce((sum, item) => sum + (item.qty || 1), 0)
  const [open, setOpen] = useState(false)

  // Derive initial value from location.search safely without reading window directly
  const searchParam = new URLSearchParams(location.search).get('q') || ''
  const [query, setQuery] = useState(searchParam)

  const ref = useRef(null)

  // Document click listener for outside clicks
  useEffect(() => {
    function onDoc(event) {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false)
    }
    function onKeyDown(event) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onDoc)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onDoc)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  function handleSearch(event) {
    event.preventDefault()
    const search = query.trim()
    navigate(search ? `/?q=${encodeURIComponent(search)}#featured` : '/#featured')
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <Container className="site-header-inner">
        <Link to="/" className="flex shrink-0 items-center gap-2 sm:gap-2.5" aria-label="Vendorly home">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-[#1d5a49] text-lg font-black text-white sm:h-10 sm:w-10">V</span>
          <span className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
            vendorly<span className="text-[#28644d]">.</span>
          </span>
        </Link>

        <div className="site-header-controls absolute right-0 top-3 flex items-center gap-2 sm:relative sm:order-4 sm:col-auto sm:row-auto" ref={ref}>
          {!user ? (
            <div className="flex items-center gap-1">
              <Link to="/login" className="rounded-full px-2 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 sm:px-3 sm:text-sm">
                Log in
              </Link>
              <Link to="/signup" className="rounded-full border border-slate-200 bg-slate-50 px-2 py-2 text-xs font-semibold text-slate-800 hover:border-[#94c9b5] hover:bg-[#f5faf7] sm:px-3 sm:text-sm">
                Sign up
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              {user.role === 'admin' && <Link to="/admin/dashboard" className="rounded-full px-2 py-2 text-xs font-semibold text-[#1d5a49] hover:bg-[#e9f3ed] sm:px-3 sm:text-sm">Admin</Link>}
              <button type="button" onClick={() => signout()} className="rounded-full px-2 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 sm:px-3 sm:text-sm">
                Sign out
              </button>
            </div>
          )}
          <button
            type="button"
            aria-label={`Shopping cart, ${count} items`}
            aria-expanded={open}
            aria-controls="header-mini-cart"
            onClick={() => setOpen((value) => !value)}
            className="relative inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2.5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm hover:border-[#94c9b5] hover:bg-[#f5faf7] sm:px-4"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 4h2l2.2 10.1a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L21 8H6" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="10" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>
            <span className="hidden sm:inline">Cart</span>
            <span className="grid min-h-5 min-w-5 place-items-center rounded-full bg-[#1d5a49] px-1 text-[11px] text-white">
              {count}
            </span>
          </button>
          {open && <MiniCart id="header-mini-cart" onClose={() => setOpen(false)} />}
        </div>

        <form
          onSubmit={handleSearch}
          role="search"
          className="site-header-search order-4 col-span-2 flex box-border min-w-0 items-center rounded-full border border-slate-200 bg-slate-50 p-1 focus-within:border-[#8fbaa3] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#cde4d6] sm:order-2 sm:col-span-1 sm:min-w-40 sm:flex-1"
        >
          <label className="sr-only" htmlFor="store-search">Search products</label>
          <input
            id="store-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products"
            className="min-w-0 flex-1 bg-transparent px-4 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-500"
          />
          <button type="submit" className="shrink-0 rounded-full bg-[#1d5a49] px-3 py-2 text-xs font-semibold text-white hover:bg-[#164638] sm:px-4">
            Search
          </button>
        </form>

        <nav className="order-5 col-span-2 flex w-full items-center gap-1 overflow-x-auto sm:order-3 sm:col-span-1 sm:w-auto" aria-label="Main navigation">
          <NavLink to="/" end className={navClass}>Discover</NavLink>
          <NavLink to="/vendor/register" className={navClass}>Become a seller</NavLink>
          {user && <NavLink to="/vendor/dashboard" className={navClass}>Dashboard</NavLink>}
        </nav>

      </Container>
    </header>
  )
}
