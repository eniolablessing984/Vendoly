import { Link } from 'react-router-dom'
import Container from '../components/Container'

export default function NotFound(){
  return (
    <Container>
      <section className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-[#3d725a]">Page not found</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">This page isn’t here</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">The link may be outdated, or the address may have been typed incorrectly.</p>
        <Link to="/" className="mt-6 inline-flex rounded-full bg-[#1d5a49] px-5 py-3 text-sm font-semibold text-white hover:bg-[#164638]">Back to marketplace</Link>
      </section>
    </Container>
  )
}
