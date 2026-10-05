import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatMoney, getAvailableQuantity, getSellerName } from '../data/marketplaceFormat'
import CatalogImage from './CatalogImage'

export default function ProductCard({ product, onAdd }) {
  const { addItem, cart } = useCart()
  const handleAdd = () => onAdd ? onAdd(product) : addItem(product)
  const alreadyInCart = cart.find(item => item.id === product.id)?.qty || 0
  const stock = getAvailableQuantity(product)
  const remaining = Math.max(0, stock - alreadyInCart)

  return (
    <article className="group overflow-hidden rounded-[1.2rem] border border-slate-200/75 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5 sm:rounded-[1.35rem]">
      <Link to={`/product/${product.id}`} className="relative block aspect-[4/3] overflow-hidden bg-[#f0f2ed]">
        <CatalogImage src={product.image} alt={product.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
        <span className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-[#3d725a] shadow-sm sm:left-3 sm:top-3 sm:px-3 sm:text-[10px]">{product.category || 'Independent find'}</span>
      </Link>
      <div className="p-3 sm:p-5">
        <Link to={`/product/${product.id}`} className="block text-sm font-semibold leading-snug text-slate-900 hover:text-[#28644d] sm:text-base">{product.title}</Link>
        {product.subtitle && <p className="mt-1 line-clamp-1 text-xs text-slate-500 sm:text-sm">{product.subtitle}</p>}
        <p className="mt-2 text-[11px] text-slate-500 sm:text-xs">Sold by <span className="font-medium text-slate-700">{getSellerName(product)}</span></p>
        <div className="mt-3 flex items-center justify-between gap-2 sm:mt-5">
          <p className="text-base font-bold tracking-tight text-[#1d5a49] sm:text-lg">{formatMoney(product.price)}</p>
          <button type="button" onClick={handleAdd} disabled={remaining === 0} className="inline-flex items-center gap-1 rounded-full bg-[#1d5a49] px-2.5 py-2 text-[10px] font-semibold text-white hover:bg-[#164638] disabled:cursor-not-allowed disabled:bg-slate-300 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-xs" aria-label={remaining ? `Add ${product.title} to cart` : `${product.title} is unavailable`}>{remaining ? <><span className="text-sm leading-none sm:text-base">+</span> Add</> : stock > 0 ? 'Max' : 'Sold out'}</button>
        </div>
      </div>
    </article>
  )
}
