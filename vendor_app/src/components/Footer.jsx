import { Link } from 'react-router-dom'
import Container from './Container'

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white">
      <Container className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link to="/" className="text-lg font-extrabold tracking-tight text-slate-900">vendorly<span className="text-[#36866b]">.</span></Link>
          <p className="mt-1 text-sm text-slate-500">Independent finds. Thoughtful sellers.</p>
        </div>
        <div className="flex gap-5 text-sm text-slate-500">
          <Link to="/" className="hover:text-[#1d5a49]">Discover</Link>
          <Link to="/vendor/register" className="hover:text-[#1d5a49]">Sell with us</Link>
          <Link to="/signin" className="hover:text-[#1d5a49]">Seller sign in</Link>
        </div>
        <p className="text-xs text-slate-400">© {new Date().getFullYear()} Vendorly</p>
      </Container>
    </footer>
  )
}
