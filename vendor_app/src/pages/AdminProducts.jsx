import { useState } from 'react'
import Container from '../components/Container'
import { Link } from 'react-router-dom'
import * as service from '../data/productService'

export default function AdminProducts() {
  const [products, setProducts] = useState(() => service.getAll() || [])

  async function handleDelete(id) {
    if (!confirm('Delete this product?')) return
    try {
      await service.remove(id)
      setProducts((current) => current.filter((product) => product.id !== id))
    } catch (error) {
      console.error('Failed to delete product:', error)
    }
  }

  return (
    <Container>
      <div className="mx-auto max-w-6xl">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#488367]">Seller workspace</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Your products</h1><p className="mt-1 text-sm text-slate-500">Manage the items in your store.</p></div><Link to="/vendor/products/new" className="rounded-full bg-[#1d5a49] px-5 py-3 text-sm font-semibold text-white hover:bg-[#164638]">+ Add a product</Link></div>

        <div className="space-y-3">
          {products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-600">
              <p className="mb-3 font-medium">Your catalog is ready for its first item.</p>
              <Link to="/vendor/products/new" className="inline-flex rounded-full bg-[#1d5a49] px-5 py-3 text-sm font-semibold text-white">Add a product</Link>
            </div>
          ) : (
            products.map((p) => (
            <div key={p.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div className="flex min-w-0 items-center gap-4">
                {p.image ? (
                    <img src={p.image} alt={p.title} className="h-16 w-16 rounded-xl bg-[#f0f2ed] object-cover" />
                ) : (
                  <div className="grid h-16 w-16 place-items-center rounded-xl bg-[#f0f2ed] text-xs text-slate-500">
                    No image
                  </div>
                )}
                <div>
                  <div className="font-semibold text-slate-900">{p.title}</div>
                  <div className="mt-1 text-sm text-slate-500">
                    ${Number(p.price).toFixed(2)} — {p.subtitle}
                  </div>
                  {p.description && (
                    <div className="text-sm text-slate-600 mt-1">{p.description}</div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Link to={`/vendor/products/${p.id}/edit`} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="rounded-full border border-red-100 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
            ))
          )}
        </div>
      </div>
    </Container>
  )
}
