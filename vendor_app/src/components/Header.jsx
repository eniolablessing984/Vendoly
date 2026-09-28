import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import Container from './Container'
import MiniCart from './MiniCart'

const navClass = ({ isActive }) => `rounded-full px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-[#e7f2ed] text-[#1c5b4a]' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`

export default function Header() {
  const { cart } = useCart()
  const { user, signout } = useAuth()
  const count = cart.reduce((sum, item) => sum + (item.qty || 1), 0)
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function onDoc(event) {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false)
    }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <Container className="flex min-h-[76px] flex-wrap items-center justify-between gap-x-6 gap-y-3 py-3">
        <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="Vendorly home">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#1d5a49] text-lg font-black text-white">V</span>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">vendorly<span className="text-[#36866b]">.</span></span>
        </Link>

        <nav className="order-3 flex w-full items-center gap-1 overflow-x-auto sm:order-2 sm:w-auto" aria-label="Main navigation">
          <NavLink to="/" end className={navClass}>Discover</NavLink>
          <NavLink to="/vendor/register" className={navClass}>Become a seller</NavLink>
          {user && <NavLink to="/vendor/dashboard" className={navClass}>Dashboard</NavLink>}
        </nav>

        <div className="relative order-2 flex items-center gap-2 sm:order-3" ref={ref}>
          {!user ? (
            <Link to="/signin" className="rounded-full px-2 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 sm:px-3 sm:text-sm">Sign in</Link>
          ) : (
            <button onClick={() => signout()} className="hidden rounded-full px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 sm:inline-flex">Sign out</button>
          )}
          <button aria-label={`Shopping cart, ${count} items`} aria-expanded={open} onClick={() => setOpen((value) => !value)} className="relative inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm hover:border-[#94c9b5] hover:bg-[#f5faf7]">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8"><path d="M3 4h2l2.2 10.1a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L21 8H6" strokeLinecap="round" strokeLinejoin="round"/><circle cx="10" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg>
            <span>Cart</span><span className="grid min-h-5 min-w-5 place-items-center rounded-full bg-[#1d5a49] px-1 text-[11px] text-white">{count}</span>
          </button>
          {open && <MiniCart onClose={() => setOpen(false)} />}
        </div>
      </Container>
    </header>
  )
}
