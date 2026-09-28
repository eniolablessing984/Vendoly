import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Container from '../components/Container'
import * as service from '../data/productService'

const emptyProduct = { title: '', subtitle: '', price: '', description: '', image: '' }

export default function AdminProductForm(){
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(() => {
    if (!id) return emptyProduct
    return service.getById(id) || emptyProduct
  })
  const [showImageWarning, setShowImageWarning] = useState(false)

  function handleChange(e){
    const { name, value } = e.target
    setProduct(prev => ({ ...prev, [name]: value }))
  }

  function handleFileChange(e){
    const file = e.target.files && e.target.files[0]
    if(!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setProduct(prev => ({ ...prev, image: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  function handleSubmit(e){
    e.preventDefault()
    submitProduct()
  }

  function submitProduct(){
    if(!product.title || !product.price){
      alert('Please provide a title and price.')
      return
    }

    if(!id && !product.image){
      setShowImageWarning(true)
      return
    }

    if(id){
      service.update(id, product)
    } else {
      const created = service.create(product)
      console.log('Created product:', created)
    }
    navigate('/vendor/products')
  }

  return (
    <Container>
      <div className="mx-auto max-w-2xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-6 sm:px-8"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#488367]">Seller workspace</p><h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{id ? 'Edit product' : 'Add a product'}</h1><p className="mt-1 text-sm text-slate-500">Give shoppers the details they need to fall in love with it.</p></div>
        <div className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block text-sm font-medium text-slate-700">Product name<input name="title" value={product.title} onChange={handleChange} placeholder="e.g. Hand-thrown ceramic vase" className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm focus:border-[#8fbaa3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6]" required /></label>
          <label className="block text-sm font-medium text-slate-700">Short description<input name="subtitle" value={product.subtitle} onChange={handleChange} placeholder="A quick detail shoppers will love" className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm focus:border-[#8fbaa3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6]" /></label>
          <label className="block text-sm font-medium text-slate-700">Product story<textarea name="description" value={product.description} onChange={handleChange} placeholder="Share what makes this item special" className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm focus:border-[#8fbaa3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6]" rows={4} /></label>
          <label className="block text-sm font-medium text-slate-700">Price<input name="price" type="number" min="0" step="0.01" value={product.price} onChange={handleChange} placeholder="0.00" className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm focus:border-[#8fbaa3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6]" required /></label>

          <div>
            <label className="block text-sm font-medium mb-1">Product image</label>
            <div className="flex items-center gap-3">
              <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-[#e9f3ed] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-[#28644d]" />
              {product.image && (
                <img src={product.image} alt="preview" className="h-16 object-cover border rounded" />
              )}
            </div>
          </div>

          {showImageWarning && (
            <div className="p-3 rounded border border-amber-200 bg-amber-50 text-amber-800">
              <div className="flex items-center justify-between gap-3">
                <span>No image selected. Continue without it?</span>
                <div className="flex gap-2">
                  <button type="button" onClick={() => { setShowImageWarning(false); service.create(product); navigate('/vendor/products') }} className="px-3 py-1 bg-primary text-white rounded">Continue</button>
                  <button type="button" onClick={() => setShowImageWarning(false)} className="px-3 py-1 border rounded">Cancel</button>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!(product.title && product.price)}
              className="rounded-full bg-[#1d5a49] px-5 py-3 text-sm font-semibold text-white hover:bg-[#164638] disabled:opacity-50"
              
            >
              {id ? 'Save' : 'Add product'} 
            </button>
            <button type="button" className="rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50" onClick={() => navigate('/vendor/products')}>
              Cancel
            </button>
          </div>
        </form>
        </div>
      </div>
    </Container>
  )
}
