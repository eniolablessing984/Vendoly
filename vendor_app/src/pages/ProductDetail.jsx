import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Container from '../components/Container'
import * as service from '../data/productService'
import { useCart } from '../context/CartContext'
import { formatMoney, getAvailableQuantity, getSellerName } from '../data/marketplaceFormat'
import CatalogImage from '../components/CatalogImage'

export default function ProductDetail({ onAddToCart }) {
  const { id } = useParams()
  return <ProductDetailContent key={id} id={id} onAddToCart={onAddToCart} />
}

function ProductDetailContent({ id, onAddToCart }) {
  const product = service.getById(id)
  const { cart, addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const cartQuantity = cart.find(item => item.id === product?.id)?.qty || 0
  const stock = product ? getAvailableQuantity(product) : 0
  const remaining = Math.max(0, stock - cartQuantity)
  const selectedQuantity = remaining ? Math.min(quantity, remaining) : 0
  const isAtCartLimit = stock > 0 && remaining === 0

  function handleAddToCart() {
    if (!selectedQuantity) return
    if (onAddToCart) onAddToCart(product, selectedQuantity)
    else addItem(product, selectedQuantity)
  }

  if (!product) return <Container><div className="rounded-3xl bg-white p-12 text-center"><p className="text-slate-600">We couldn't find that item.</p><Link to="/" className="mt-4 inline-flex rounded-full bg-[#1d5a49] px-5 py-3 text-sm font-semibold text-white">Back to browsing</Link></div></Container>

  return (
    <Container>
      <div className="mb-6 text-sm text-slate-500"><Link to="/" className="hover:text-[#1d5a49]">Discover</Link><span className="mx-2">/</span><span className="text-slate-800">{product.title}</span></div>
      <div className="grid gap-8 rounded-[2rem] border border-slate-200/75 bg-white p-5 shadow-sm sm:p-8 lg:grid-cols-2 lg:gap-12 lg:p-10">
        <div className="overflow-hidden rounded-[1.5rem] bg-[#f0f2ed]"><CatalogImage src={product.image} alt={product.title} className="aspect-square h-full w-full object-cover" fallbackClassName="grid aspect-square place-items-center bg-[#f0f2ed] text-sm text-slate-600" /></div>
        <div className="flex flex-col justify-center py-2 lg:py-8">
          <span className="w-fit rounded-full bg-[#e9f3ed] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-[#28644d]">{product.category || 'Independent find'}</span>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{product.title}</h1>
          {product.subtitle && <p className="mt-3 text-lg text-slate-500">{product.subtitle}</p>}
          <p className="mt-6 text-3xl font-bold tracking-tight text-[#1d5a49]">{formatMoney(product.price)}</p>
          <p className="mt-2 text-sm text-slate-500">Sold by <span className="font-medium text-slate-700">{getSellerName(product)}</span></p>
          <p className={`mt-3 text-sm font-medium ${remaining === 0 ? 'text-red-700' : remaining <= 3 ? 'text-amber-700' : 'text-emerald-700'}`} aria-live="polite">{stock === 0 ? 'Currently unavailable' : isAtCartLimit ? 'All available units are already in your cart' : remaining <= 3 ? `Only ${remaining} left` : 'In stock'}</p>
          <div className="my-7 h-px bg-slate-100" />
          <p className="whitespace-pre-line text-sm leading-7 text-slate-600">{product.description || 'A thoughtful find from one of our independent sellers.'}</p>
          {remaining > 0 && <div className="mt-7 flex flex-wrap items-center gap-3"><label htmlFor="product-quantity" className="text-sm font-medium text-slate-700">Quantity</label><div className="flex items-center rounded-full border border-slate-200 bg-white p-1"><button type="button" aria-label="Decrease quantity" disabled={selectedQuantity <= 1} onClick={() => setQuantity(value => Math.max(1, value - 1))} className="grid h-9 w-9 place-items-center rounded-full text-slate-700 hover:bg-slate-100 disabled:text-slate-300">-</button><input id="product-quantity" aria-label="Quantity" type="number" min="1" step="1" max={remaining} value={selectedQuantity} onChange={event => setQuantity(Math.max(1, Math.min(remaining, Math.floor(Number(event.target.value) || 1))))} className="w-12 border-0 bg-transparent text-center text-sm font-semibold text-slate-800 outline-none" /><button type="button" aria-label="Increase quantity" disabled={selectedQuantity >= remaining} onClick={() => setQuantity(value => Math.min(remaining, value + 1))} className="grid h-9 w-9 place-items-center rounded-full text-slate-700 hover:bg-slate-100 disabled:text-slate-300">+</button></div><span className="text-xs text-slate-500">{cartQuantity ? `${cartQuantity} already in cart` : `${remaining} available`}</span></div>}
          <button type="button" disabled={!selectedQuantity} className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#1d5a49] px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-[#1d5a49]/15 hover:bg-[#164638] disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto" onClick={handleAddToCart}><span className="text-lg">+</span> {remaining ? 'Add to cart' : isAtCartLimit ? 'Maximum in cart' : 'Out of stock'}</button>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500"><span>Independent seller</span><span>Standard shipping shown at checkout</span></div>
        </div>
      </div>
    </Container>
  )
}
