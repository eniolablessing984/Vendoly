import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Container from '../components/Container'
import ProductCard from '../components/ProductCard'
import * as service from '../data/productService'
import { formatMoney } from '../data/marketplaceFormat'
import CatalogImage from '../components/CatalogImage'

export default function Homepage({ onAddToCart }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [carouselPaused, setCarouselPaused] = useState(false)
  const [carouselFocused, setCarouselFocused] = useState(false)
  const [carouselHovered, setCarouselHovered] = useState(false)
  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  const [products] = useState(() => service.getAll())
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeCategory, setActiveCategory] = useState('All')
  const [sortBy, setSortBy] = useState('featured')
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false)
  const query = (searchParams.get('q') || '').trim().toLowerCase()
  const categories = ['All', ...new Set(products.map(product => product.category || 'Other'))]
  const visibleProducts = products
    .filter(product => activeCategory === 'All' || (product.category || 'Other') === activeCategory)
    .filter(product => !query || [product.title, product.subtitle, product.description, product.category].some(value => String(value || '').toLowerCase().includes(query)))
    .sort((left, right) => {
      if (sortBy === 'price-low') return Number(left.price) - Number(right.price)
      if (sortBy === 'price-high') return Number(right.price) - Number(left.price)
      if (sortBy === 'name') return left.title.localeCompare(right.title)
      return 0
    })
  const heroSlides = products.slice(0, 4).map(({ id, image, title, price }) => ({ id, image, title, price }))
  const currentSlide = heroSlides[activeIndex] ?? heroSlides[0]

  useEffect(() => {
    if (heroSlides.length < 2 || carouselPaused || carouselFocused || carouselHovered || prefersReducedMotion) return undefined
    const timer = setInterval(() => setActiveIndex((current) => (current + 1) % heroSlides.length), 5000)
    return () => clearInterval(timer)
  }, [heroSlides.length, carouselPaused, carouselFocused, carouselHovered, prefersReducedMotion])

  return (
    <Container>
      <section className="relative isolate w-full min-w-0 max-w-full overflow-hidden rounded-[2rem] bg-[#e5eee8] px-6 py-12 sm:px-10 sm:py-16 lg:px-16">
        <div className="absolute -right-28 -top-36 -z-10 h-[30rem] w-[30rem] rounded-full bg-[#c8dfd2] blur-2xl" />
        <div className="grid min-w-0 grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <div className="min-w-0 max-w-xl">
            <p className="mb-5 inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-[#b6d2c1] bg-white/65 px-3 py-1.5 text-xs font-bold uppercase tracking-[.16em] text-[#28644d]"><span className="h-2 w-2 shrink-0 rounded-full bg-[#388368]" />A marketplace with a personal touch</p>
            <h1 className="w-full max-w-[12ch] break-words text-4xl font-semibold leading-[1.08] tracking-[-.045em] text-[#172e27] sm:max-w-none sm:text-5xl lg:text-6xl">Good things, <span className="font-serif italic text-[#3d725a]">found here.</span></h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-[#4f665c] sm:text-lg">Shop considered pieces from independent sellers, makers and growing brands.</p>
            <div className="mt-8 flex max-w-full flex-col items-start gap-3 sm:flex-row sm:flex-wrap">
              <a href="#featured" className="inline-flex items-center gap-2 rounded-full bg-[#1d5a49] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#1d5a49]/15 hover:bg-[#164638]">Explore the collection <span aria-hidden="true">→</span></a>
              <Link to="/vendor/register" className="inline-flex items-center rounded-full border border-[#a9c3b3] bg-white/70 px-6 py-3.5 text-sm font-semibold text-[#284d3d] hover:bg-white">Open your shop</Link>
            </div>
            <div className="mt-10 flex min-w-0 flex-wrap items-center gap-3 text-sm text-[#50665c]"><span aria-hidden="true" className="flex shrink-0 -space-x-2"><span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#e5eee8] bg-[#c7a68c] text-xs">✦</span><span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#e5eee8] bg-[#a9c9b8] text-xs">✿</span><span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#e5eee8] bg-[#e4c8a8] text-xs">♡</span></span><span className="min-w-0"><strong className="text-[#213d31]">Made by people</strong> who care about the details</span></div>
          </div>

          <div
            className="relative mx-auto w-full min-w-0 max-w-lg"
            onMouseEnter={() => setCarouselHovered(true)}
            onMouseLeave={() => setCarouselHovered(false)}
            onFocusCapture={() => setCarouselFocused(true)}
            onBlurCapture={event => {
              if (!event.currentTarget.contains(event.relatedTarget)) setCarouselFocused(false)
            }}
          >
              <div className="absolute -left-5 top-12 z-10 rounded-2xl bg-white px-4 py-3 shadow-xl shadow-slate-900/10 sm:-left-9"><p className="text-[10px] font-bold uppercase tracking-widest text-[#50665c]">Handpicked for you</p><p className="mt-1 text-sm font-semibold text-slate-800">Find your next favorite</p></div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.6rem] bg-[#d9e4dc] shadow-2xl shadow-[#345d49]/15">
              {currentSlide && <CatalogImage key={`${currentSlide.id}-${currentSlide.image || ''}`} src={currentSlide.image} alt={currentSlide.title} className="h-full w-full object-cover" fallbackText="Discover independent finds" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              {currentSlide && <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-white sm:p-7"><div><p className="text-xs font-semibold uppercase tracking-[.17em] text-white">Featured find</p><h2 className="mt-1 text-xl font-semibold sm:text-2xl">{currentSlide.title}</h2><p className="mt-1 text-sm text-white">{formatMoney(currentSlide.price)}</p></div><Link to={`/product/${currentSlide.id}`} className="grid h-11 w-11 place-items-center rounded-full bg-white text-lg text-[#1d5a49] hover:bg-[#e7f2ed]" aria-label={`View ${currentSlide.title}`}>↗</Link></div>}
            </div>
            {heroSlides.length > 1 && <div className="absolute right-5 top-5 z-10 flex items-center gap-1 rounded-full bg-black/55 p-1 shadow-md backdrop-blur-sm sm:right-7 sm:top-7">{heroSlides.map((slide, index) => <button key={slide.id} type="button" onClick={() => setActiveIndex(index)} className="grid h-8 w-8 place-items-center rounded-full" aria-label={`Show featured item ${index + 1}`} aria-pressed={index === activeIndex}><span aria-hidden="true" className={`h-2 rounded-full transition-all ${index === activeIndex ? 'w-6 bg-white' : 'w-2 bg-white/80'}`} /></button>)}{!prefersReducedMotion && <button type="button" onClick={() => setCarouselPaused(value => !value)} aria-pressed={carouselPaused} aria-label={carouselPaused ? 'Resume featured items rotation' : 'Pause featured items rotation'} className="ml-1 min-h-8 rounded-full bg-black/70 px-3 py-1.5 text-xs font-semibold text-white hover:bg-black/85">{carouselPaused ? 'Play' : 'Pause'}</button>}</div>}
          </div>
        </div>
      </section>

      <section id="featured" className="scroll-mt-28 py-14 sm:py-16">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#3d725a]">The good stuff</p><h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">A few things we love</h2><p className="mt-2 text-sm text-slate-500">Distinctive finds from our independent sellers.</p></div>
        </div>
        <div className="mb-3"><h3 className="text-sm font-semibold text-slate-800">Shop by category</h3><p className="mt-1 text-[11px] text-slate-500">Browse the kinds of finds you are looking for.</p></div>
        <div role="group" className="mb-6 flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-4 sm:overflow-visible xl:grid-cols-5" aria-label="Filter products by category">
          {categories.map(category => {
            const categoryCount = category === 'All' ? products.length : products.filter(product => (product.category || 'Other') === category).length
            return <button key={category} type="button" aria-pressed={activeCategory === category} onClick={() => setActiveCategory(category)} className={`flex min-w-[96px] shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-left transition sm:min-w-0 sm:gap-2 sm:rounded-xl sm:p-2 ${activeCategory === category ? 'border-[#1d5a49] bg-[#e9f3ed] ring-1 ring-[#1d5a49]' : 'border-slate-200 bg-white hover:border-[#a9c3b3] hover:bg-[#f5faf7]'}`}><span aria-hidden="true" className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#e9f3ed] text-[8px] font-bold text-[#28644d] sm:h-7 sm:w-7 sm:rounded-lg sm:text-[10px]">{category.slice(0, 1)}</span><span className="min-w-0"><span className="block truncate text-[10px] font-semibold text-slate-800 sm:text-[11px]">{category === 'All' ? 'All' : category}</span><span className="mt-0.5 hidden text-[9px] text-slate-600 sm:block">{categoryCount}</span></span></button>
          })}
        </div>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p aria-live="polite" aria-atomic="true" className="text-sm text-slate-500">{visibleProducts.length} {visibleProducts.length === 1 ? 'result' : 'results'}{query ? <> for <strong className="font-semibold text-slate-700">{searchParams.get('q')}</strong></> : null}</p>
          <label className="flex shrink-0 items-center gap-2 text-sm text-slate-500">Sort by<select value={sortBy} onChange={event => setSortBy(event.target.value)} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#cde4d6]"><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name</option></select></label>
        </div>
        {visibleProducts.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} onAdd={onAddToCart} />)}</div> : <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-16 text-center text-slate-500"><p>{products.length === 0 ? 'Our sellers are getting their first products ready. Please check back soon.' : 'No products match your current filters.'}</p>{products.length > 0 && <button type="button" onClick={() => { setActiveCategory('All'); setSortBy('featured'); setSearchParams({}) }} className="mt-3 font-semibold text-[#28644d] underline underline-offset-4">Clear filters</button>}</div>}
      </section>
    </Container>
  )
}
