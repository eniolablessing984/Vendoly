import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Container from '../components/Container'
import ProductCard from '../components/ProductCard'
import * as service from '../data/productService'

export default function Homepage({ onAddToCart }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [products] = useState(() => service.getAll())
  const heroSlides = products.slice(0, 4).map(({ id, image, title, price }) => ({ id, image, title, price }))
  const currentSlide = heroSlides[activeIndex] ?? heroSlides[0]

  useEffect(() => {
    if (heroSlides.length < 2) return undefined
    const timer = setInterval(() => setActiveIndex((current) => (current + 1) % heroSlides.length), 5000)
    return () => clearInterval(timer)
  }, [heroSlides.length])

  return (
    <Container>
      <section className="relative isolate overflow-hidden rounded-[2rem] bg-[#e5eee8] px-6 py-12 sm:px-10 sm:py-16 lg:px-16">
        <div className="absolute -right-28 -top-36 -z-10 h-[30rem] w-[30rem] rounded-full bg-[#c8dfd2] blur-2xl" />
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <div className="max-w-xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#b6d2c1] bg-white/65 px-3 py-1.5 text-xs font-bold uppercase tracking-[.16em] text-[#28644d]"><span className="h-2 w-2 rounded-full bg-[#388368]" />A marketplace with a personal touch</p>
            <h1 className="text-4xl font-semibold leading-[1.08] tracking-[-.045em] text-[#172e27] sm:text-5xl lg:text-6xl">Good things, <span className="font-serif italic text-[#488367]">found here.</span></h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-[#4f665c] sm:text-lg">Shop considered pieces from independent sellers, makers and growing brands.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#featured" className="inline-flex items-center gap-2 rounded-full bg-[#1d5a49] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#1d5a49]/15 hover:bg-[#164638]">Explore the collection <span aria-hidden="true">→</span></a>
              <Link to="/vendor/register" className="inline-flex items-center rounded-full border border-[#a9c3b3] bg-white/70 px-6 py-3.5 text-sm font-semibold text-[#284d3d] hover:bg-white">Open your shop</Link>
            </div>
            <div className="mt-10 flex items-center gap-3 text-sm text-[#50665c]"><span className="flex -space-x-2"><span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#e5eee8] bg-[#c7a68c] text-xs">✦</span><span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#e5eee8] bg-[#a9c9b8] text-xs">✿</span><span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#e5eee8] bg-[#e4c8a8] text-xs">♡</span></span><span><strong className="text-[#213d31]">Made by people</strong> who care about the details</span></div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -left-5 top-12 z-10 rounded-2xl bg-white px-4 py-3 shadow-xl shadow-slate-900/10 sm:-left-9"><p className="text-[10px] font-bold uppercase tracking-widest text-[#668074]">Handpicked for you</p><p className="mt-1 text-sm font-semibold text-slate-800">Find your next favorite</p></div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.6rem] bg-[#d9e4dc] shadow-2xl shadow-[#345d49]/15">
              {currentSlide?.image ? <img key={currentSlide.id} src={currentSlide.image} alt={currentSlide.title} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-sm text-slate-500">Discover independent finds</div>}
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              {currentSlide && <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-white sm:p-7"><div><p className="text-xs font-semibold uppercase tracking-[.17em] text-white/75">Featured find</p><h2 className="mt-1 text-xl font-semibold sm:text-2xl">{currentSlide.title}</h2><p className="mt-1 text-sm text-white/80">${currentSlide.price}</p></div><Link to={`/product/${currentSlide.id}`} className="grid h-11 w-11 place-items-center rounded-full bg-white text-lg text-[#1d5a49] hover:bg-[#e7f2ed]" aria-label={`View ${currentSlide.title}`}>↗</Link></div>}
            </div>
            {heroSlides.length > 1 && <div className="absolute bottom-5 right-5 z-10 flex gap-1.5 sm:bottom-7 sm:right-7">{heroSlides.map((slide, index) => <button key={slide.id} onClick={() => setActiveIndex(index)} className={`h-2 rounded-full transition-all ${index === activeIndex ? 'w-6 bg-white' : 'w-2 bg-white/60'}`} aria-label={`Show featured item ${index + 1}`} />)}</div>}
          </div>
        </div>
      </section>

      <section id="featured" className="scroll-mt-28 py-14 sm:py-16">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#488367]">The good stuff</p><h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">A few things we love</h2><p className="mt-2 text-sm text-slate-500">Distinctive finds from our independent sellers.</p></div>
          <span className="hidden rounded-full bg-white px-3 py-2 text-xs font-medium text-slate-500 shadow-sm sm:inline-flex">{products.length} {products.length === 1 ? 'item' : 'items'}</span>
        </div>
        {products.length ? <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{products.map((product) => <ProductCard key={product.id} product={product} onAdd={onAddToCart} />)}</div> : <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-16 text-center text-slate-500">New finds are on their way.</div>}
      </section>
    </Container>
  )
}
