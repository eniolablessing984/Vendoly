import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Container from '../components/Container'
import * as productService from '../data/productService'
import { useAuth } from '../context/AuthContext'
import { formatMoney, getAvailableQuantity } from '../data/marketplaceFormat'
import CatalogImage from '../components/CatalogImage'

export default function AdminProducts(){
  const { user } = useAuth()
  const location = useLocation()
  const [products, setProducts] = useState(() => productService.getForSeller(user?.id))
  const [error, setError] = useState('')
  const [message, setMessage] = useState(location.state?.message || '')
  const [persistenceWarning, setPersistenceWarning] = useState(Boolean(location.state?.persistenceWarning))
  const [storageAvailable, setStorageAvailable] = useState(() => productService.isStorageAvailable())

  function handleDelete(id){
    if (!window.confirm('Remove this product from your demo catalog?')) return
    const result = productService.remove(id, user.id)
    if (!result) {
      setError('This product does not belong to your seller account.')
      return
    }
    setProducts(current => current.filter(product => String(product.id) !== String(id)))
    setPersistenceWarning(!result.persisted)
    setStorageAvailable(result.persisted)
    setMessage(result.persisted ? 'Product removed from your browser catalog.' : 'Product removed for this session only. Browser storage is unavailable.')
  }

  return (
    <Container>
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#3d725a]">Seller workspace</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Your products</h1><p className="mt-1 text-sm text-slate-500">Catalog for {user?.storeName || 'your demo store'}.</p></div><Link to="/vendor/products/new" className="rounded-full bg-[#1d5a49] px-5 py-3 text-sm font-semibold text-white hover:bg-[#164638]">Add a product</Link></div>
        <p className="mb-6 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900">Local demo catalog. Only products created by this signed-in demo seller appear here.</p>
        {!storageAvailable && !persistenceWarning && <p role="alert" className="mb-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">Browser storage is unavailable. Catalog changes will only last for this session.</p>}
        {message && <p role={persistenceWarning ? 'alert' : 'status'} className={`mb-4 rounded-xl p-3 text-sm ${persistenceWarning ? 'bg-amber-50 text-amber-900' : 'bg-emerald-50 text-emerald-800'}`}>{message}</p>}
        {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        <div className="space-y-3">
          {products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center sm:p-12"><p className="font-semibold text-slate-900">Your catalog is ready for its first item.</p><p className="mt-2 text-sm text-slate-500">Marketplace sample products belong to other demo sellers.</p><Link to="/vendor/products/new" className="mt-5 inline-flex rounded-full bg-[#1d5a49] px-5 py-3 text-sm font-semibold text-white">Add your first product</Link></div>
          ) : products.map(product => {
            const stock = getAvailableQuantity(product)
            return <article key={product.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div className="flex min-w-0 items-center gap-4">
                <CatalogImage src={product.image} alt={product.title} fallbackText="No image" fallbackClassName="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-[#f0f2ed] text-xs text-slate-600" className="h-16 w-16 shrink-0 rounded-xl bg-[#f0f2ed] object-cover" />
                <div className="min-w-0"><h2 className="truncate font-semibold text-slate-900">{product.title}</h2><p className="mt-1 text-sm text-slate-600">{formatMoney(product.price)} <span className="text-slate-500">-</span> {product.category || 'Other'}</p><p className={`mt-1 text-xs font-medium ${stock === 0 ? 'text-red-700' : stock <= 3 ? 'text-amber-700' : 'text-slate-500'}`}>{stock === 0 ? 'Out of stock' : `${stock} in stock`}</p>{product.description && <p className="mt-2 line-clamp-2 text-sm text-slate-500">{product.description}</p>}</div>
              </div>
              <div className="flex shrink-0 gap-2"><Link to={`/vendor/products/${product.id}/edit`} className="inline-flex min-h-11 items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Edit</Link><button type="button" aria-label={`Remove ${product.title}`} onClick={() => handleDelete(product.id)} className="min-h-11 rounded-full border border-red-100 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">Remove</button></div>
            </article>
          })}
        </div>
      </div>
    </Container>
  )
}
