import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product, onAdd }) {
  const { addItem } = useCart()
  const handleAdd = () => onAdd ? onAdd(product) : addItem(product)

  return (
    <article className="group overflow-hidden rounded-[1.35rem] border border-slate-200/75 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5">
      <Link to={`/product/${product.id}`} className="relative block aspect-[4/3] overflow-hidden bg-[#f0f2ed]">
        {product.image ? <img src={product.image} alt={product.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" /> : <div className="grid h-full place-items-center text-sm text-slate-400">Image coming soon</div>}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#3d725a] shadow-sm">Independent find</span>
      </Link>
      <div className="p-4 sm:p-5">
        <Link to={`/product/${product.id}`} className="block text-base font-semibold leading-snug text-slate-900 hover:text-[#28644d]">{product.title}</Link>
        {product.subtitle && <p className="mt-1 line-clamp-1 text-sm text-slate-500">{product.subtitle}</p>}
        <div className="mt-5 flex items-center justify-between gap-2">
          <p className="text-lg font-bold tracking-tight text-[#1d5a49]">${Number(product.price).toFixed(2)}</p>
          <button onClick={handleAdd} className="inline-flex items-center gap-2 rounded-full bg-[#1d5a49] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#164638]" aria-label={`Add ${product.title} to cart`}><span className="text-base leading-none">+</span> Add to cart</button>
        </div>
      </div>
    </article>
  )
}
