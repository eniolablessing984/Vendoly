import { Link, useParams } from 'react-router-dom'
import Container from '../components/Container'
import * as service from '../data/productService'

export default function ProductDetail({ onAddToCart }) {
  const { id } = useParams()
  const product = service.getById(id)

  if (!product) return <Container><div className="rounded-3xl bg-white p-12 text-center"><p className="text-slate-600">We couldn't find that item.</p><Link to="/" className="mt-4 inline-flex rounded-full bg-[#1d5a49] px-5 py-3 text-sm font-semibold text-white">Back to browsing</Link></div></Container>

  return (
    <Container>
      <div className="mb-6 text-sm text-slate-500"><Link to="/" className="hover:text-[#1d5a49]">Discover</Link><span className="mx-2">/</span><span className="text-slate-800">{product.title}</span></div>
      <div className="grid gap-8 rounded-[2rem] border border-slate-200/75 bg-white p-5 shadow-sm sm:p-8 lg:grid-cols-2 lg:gap-12 lg:p-10">
        <div className="overflow-hidden rounded-[1.5rem] bg-[#f0f2ed]">{product.image ? <img src={product.image} alt={product.title} className="aspect-square h-full w-full object-cover" /> : <div className="grid aspect-square place-items-center text-sm text-slate-400">Image coming soon</div>}</div>
        <div className="flex flex-col justify-center py-2 lg:py-8">
          <span className="w-fit rounded-full bg-[#e9f3ed] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-[#28644d]">Independent find</span>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{product.title}</h1>
          {product.subtitle && <p className="mt-3 text-lg text-slate-500">{product.subtitle}</p>}
          <p className="mt-6 text-3xl font-bold tracking-tight text-[#1d5a49]">${Number(product.price).toFixed(2)}</p>
          <div className="my-7 h-px bg-slate-100" />
          <p className="whitespace-pre-line text-sm leading-7 text-slate-600">{product.description || 'A thoughtful find from one of our independent sellers.'}</p>
          <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-[#1d5a49] px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-[#1d5a49]/15 hover:bg-[#164638] sm:w-auto" onClick={() => onAddToCart?.(product)}><span className="text-lg">+</span> Add to cart</button>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500"><span>✓ Carefully selected</span><span>✓ Secure checkout</span><span>✓ Free standard shipping</span></div>
        </div>
      </div>
    </Container>
  )
}
