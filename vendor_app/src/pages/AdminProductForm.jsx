import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Container from '../components/Container'
import * as productService from '../data/productService'
import { useAuth } from '../context/AuthContext'
import CatalogImage from '../components/CatalogImage'

const categories = ['Accessories', 'Electronics', 'Fashion', 'Home & Living', 'Other']
const emptyProduct = { title: '', subtitle: '', description: '', category: 'Accessories', price: '', stockQuantity: '10', image: '' }

export default function AdminProductForm(){
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [storageAvailable] = useState(() => productService.isStorageAvailable())
  const existingProduct = id ? productService.getByIdForSeller(id, user?.id) : null
  const [product, setProduct] = useState(() => existingProduct ? { ...existingProduct } : { ...emptyProduct })
  const [error, setError] = useState('')
  const [imageError, setImageError] = useState('')

  function handleChange(event){
    const { name, value } = event.target
    setProduct(current => ({ ...current, [name]: value }))
    setError('')
  }

  function handleFileChange(event){
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setImageError('Choose an image file.')
      event.target.value = ''
      return
    }
    if (file.size > 1.5 * 1024 * 1024) {
      setImageError('Choose an image smaller than 1.5 MB for this browser demo.')
      event.target.value = ''
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setProduct(current => ({ ...current, image: String(reader.result || '') }))
      setImageError('')
    }
    reader.onerror = () => setImageError('The image could not be opened. Choose another file.')
    reader.readAsDataURL(file)
  }

  function handleSubmit(event){
    event.preventDefault()
    const price = Number(product.price)
    const stockQuantity = Number(product.stockQuantity)
    if (!product.title.trim()) return setError('Enter a product name.')
    if (!Number.isFinite(price) || price <= 0) return setError('Enter a price greater than zero.')
    if (!Number.isInteger(stockQuantity) || stockQuantity < 0) return setError('Enter a whole stock quantity of zero or more.')
    if (imageError) return setError('Fix the image selection before saving.')

    const productData = {
      ...product,
      title: product.title.trim(),
      subtitle: product.subtitle.trim(),
      description: product.description.trim(),
      price: price.toFixed(2),
      stockQuantity,
      category: product.category || 'Other',
      sellerId: user.id,
      sellerName: user.storeName,
    }
    const result = id
      ? productService.update(id, productData, user.id)
      : productService.create(productData, user.id)
    if (!result) return setError('This product does not belong to your seller account.')
    const message = result.persisted
      ? (id ? 'Product changes saved in this browser.' : 'Product added to your browser catalog.')
      : (id ? 'Product changes are available for this session only. Browser storage is unavailable.' : 'Product was added for this session only. Browser storage is unavailable.')
    navigate('/vendor/products', { state: { message, persistenceWarning: !result.persisted } })
  }

  if (id && !existingProduct) return <Container><div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center">{!storageAvailable && <p role="alert" className="mb-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">Browser storage is unavailable, so this product could not be loaded.</p>}<h1 className="text-xl font-semibold text-slate-900">{storageAvailable ? 'Product not found' : 'Product unavailable'}</h1><p className="mt-2 text-sm text-slate-600">{storageAvailable ? 'This product is not part of your seller catalog.' : 'Restore browser storage and try again, or return to your catalog.'}</p><Link to="/vendor/products" className="mt-5 inline-flex rounded-full bg-[#1d5a49] px-5 py-3 text-sm font-semibold text-white">Back to products</Link></div></Container>

  return (
    <Container>
      <div className="mx-auto max-w-2xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-6 sm:px-8"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#3d725a]">Seller workspace</p><h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{id ? 'Edit product' : 'Add a product'}</h1><p className="mt-1 text-sm text-slate-500">Set the details customers will see in your listing.</p></div>
        <form onSubmit={handleSubmit} className="space-y-4 p-6 sm:p-8">
          <p className="rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900">Demo catalog only. Product details and images are stored in this browser.</p>
          {!storageAvailable && <p role="alert" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">Browser storage is unavailable. Product changes will only last for this session.</p>}
          <label htmlFor="product-title" className="block text-sm font-medium text-slate-700">Product name<input id="product-title" name="title" value={product.title} onChange={handleChange} placeholder="e.g. Hand-thrown ceramic vase" className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm focus:border-[#8fbaa3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6]" required /></label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label htmlFor="product-category" className="block text-sm font-medium text-slate-700">Category<select id="product-category" name="category" value={product.category || 'Other'} onChange={handleChange} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm focus:border-[#8fbaa3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6]">{categories.map(category => <option key={category}>{category}</option>)}</select></label>
            <label htmlFor="product-price" className="block text-sm font-medium text-slate-700">Price (USD demo)<input id="product-price" name="price" type="number" min="0.01" step="0.01" value={product.price} onChange={handleChange} placeholder="0.00" className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm focus:border-[#8fbaa3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6]" required /></label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label htmlFor="product-stock" className="block text-sm font-medium text-slate-700">Available stock<input id="product-stock" name="stockQuantity" type="number" min="0" step="1" value={product.stockQuantity ?? 0} onChange={handleChange} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm focus:border-[#8fbaa3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6]" required /><span className="mt-1 block text-xs font-normal text-slate-500">Use 0 when the item is unavailable.</span></label>
            <label htmlFor="product-subtitle" className="block text-sm font-medium text-slate-700">Short description<input id="product-subtitle" name="subtitle" value={product.subtitle || ''} onChange={handleChange} placeholder="A quick detail shoppers will love" className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm focus:border-[#8fbaa3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6]" /></label>
          </div>
          <label htmlFor="product-description" className="block text-sm font-medium text-slate-700">Product description<textarea id="product-description" name="description" value={product.description || ''} onChange={handleChange} placeholder="Share what makes this item special" rows={4} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm focus:border-[#8fbaa3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6]" /></label>
          <div>
            <label htmlFor="product-image" className="block text-sm font-medium text-slate-700">Product image <span className="font-normal text-slate-500">(optional, max 1.5 MB)</span></label>
            <div className="mt-1.5 flex flex-col gap-3 sm:flex-row sm:items-center"><input id="product-image" type="file" accept="image/*" onChange={handleFileChange} aria-describedby={imageError ? 'product-image-error' : 'product-image-hint'} className="block min-w-0 flex-1 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-[#e9f3ed] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-[#28644d]" />{product.image && <div className="flex items-center gap-3"><CatalogImage src={product.image} alt="Product preview" className="h-20 w-20 rounded-xl border border-slate-200 object-cover" fallbackClassName="grid h-20 w-20 shrink-0 place-items-center rounded-xl bg-[#f0f2ed] text-xs text-slate-600" fallbackText="Preview unavailable" /><button type="button" onClick={() => { setProduct(current => ({ ...current, image: '' })); setImageError('') }} className="text-xs font-semibold text-red-700 underline underline-offset-2 hover:text-red-800">Remove image</button></div>}</div>
            <p id={imageError ? 'product-image-error' : 'product-image-hint'} className={`mt-1 text-xs ${imageError ? 'text-red-700' : 'text-slate-500'}`}>{imageError || 'Image storage is local to this browser demo.'}</p>
          </div>
          {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <div className="flex flex-wrap gap-3 pt-2"><button type="submit" className="rounded-full bg-[#1d5a49] px-5 py-3 text-sm font-semibold text-white hover:bg-[#164638]">{id ? 'Save changes' : 'Add product'}</button><Link to="/vendor/products" className="rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</Link></div>
        </form>
      </div>
    </Container>
  )
}
