import Container from '../components/Container'
import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'
import { calculateSubtotalMinor, formatMinorMoney, getAvailableQuantity, getSellerName, toMinorUnits } from '../data/marketplaceFormat'
import * as productService from '../data/productService'
import CatalogImage from '../components/CatalogImage'

export default function CartPage(){
  const { cart, removeItem, clearCart, setQuantity, storageAvailable } = useCart()
  const currentCart = productService.refreshCartItems(cart)
  const subtotalMinor = calculateSubtotalMinor(currentCart)
  const hasStockIssue = currentCart.some(item => !item.catalogAvailable || item.qty > getAvailableQuantity(item))

  return (
    <Container>
      <div className="mx-auto max-w-5xl">
        <div className="mb-7"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#3d725a]">Almost yours</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Your cart</h1><p className="mt-1 text-sm text-slate-500">Review your finds before checking out.</p></div>
        {!storageAvailable && <p role="alert" className="mb-5 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">Browser storage is unavailable. Your cart is only saved for this session and may be lost if you refresh.</p>}
        {currentCart.length === 0 ? (
          <div className="rounded-[1.5rem] border border-slate-200 bg-white px-6 py-16 text-center shadow-sm"><div aria-hidden="true" className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#e9f3ed] text-2xl text-[#28644d]">&#9825;</div><h2 className="mt-4 text-lg font-semibold text-slate-900">Your cart is waiting for something lovely</h2><p className="mt-2 text-sm text-slate-500">Explore unique finds from independent sellers.</p><Link to="/" className="mt-6 inline-flex rounded-full bg-[#1d5a49] px-5 py-3 text-sm font-semibold text-white hover:bg-[#164638]">Discover the collection</Link></div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            <div className="space-y-3">
              {currentCart.map(item => {
                const stock = getAvailableQuantity(item)
                const overStock = !item.catalogAvailable || item.qty > stock
                return <article key={item.id} className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-4 sm:p-5">
                  <CatalogImage src={item.image} alt="" fallbackText="" fallbackClassName="row-span-2 h-20 w-20 rounded-xl bg-[#f0f2ed] sm:row-span-1 sm:h-24 sm:w-24" className="row-span-2 h-20 w-20 rounded-xl bg-[#f0f2ed] object-cover sm:row-span-1 sm:h-24 sm:w-24" />
                  <div className="min-w-0 flex-1">
                    <Link to={`/product/${item.id}`} className="block truncate font-semibold text-slate-900 hover:text-[#28644d]">{item.title}</Link>
                    <div className="mt-1 text-sm text-slate-500">Sold by {getSellerName(item)}</div>
                    <div className="mt-1 text-sm text-slate-500">{formatMinorMoney(toMinorUnits(item.price))} each</div>
                    {overStock && <p className="mt-2 text-xs font-medium text-red-700">{item.catalogAvailable ? `Only ${stock} available. Reduce the quantity to continue.` : 'This product is no longer in the catalog. Remove it before checkout.'}</p>}
                    <div className="mt-3 flex items-center gap-2">
                      <button type="button" aria-label={`Decrease quantity of ${item.title}`} className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50" onClick={() => setQuantity(item.id, item.qty - 1)}>-</button>
                      <span className="min-w-6 text-center text-sm font-semibold" aria-live="polite">{item.qty}</span>
                      <button type="button" aria-label={`Increase quantity of ${item.title}`} disabled={!item.catalogAvailable || item.qty >= stock} className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300" onClick={() => setQuantity(item.id, item.qty + 1)}>+</button>
                      <button type="button" onClick={() => removeItem(item.id)} className="ml-2 text-xs font-medium text-slate-600 underline decoration-slate-300 underline-offset-4 hover:text-red-700">Remove</button>
                    </div>
                  </div>
                  <div className="col-start-2 text-left text-sm font-bold text-slate-900 sm:col-auto sm:text-right">{formatMinorMoney(toMinorUnits(item.price) * item.qty)}</div>
                </article>
              })}
            </div>

            <aside className="h-fit rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm lg:sticky lg:top-28">
              <h2 className="text-lg font-semibold text-slate-900">Order summary</h2>
              <div className="mt-5 flex justify-between text-sm text-slate-600"><span>Subtotal</span><span>{formatMinorMoney(subtotalMinor)}</span></div>
              <div className="mt-3 flex justify-between text-sm text-slate-600"><span>Standard delivery</span><span className="font-medium text-[#34775d]">Free (demo)</span></div>
              <div className="my-5 border-t border-slate-100" />
              <div className="flex justify-between font-semibold text-slate-900"><span>Total</span><span>{formatMinorMoney(subtotalMinor)}</span></div>
              {hasStockIssue ? <div role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">Remove unavailable products or adjust quantities to match stock before checkout.</div> : <Link to="/checkout" className="mt-5 flex w-full justify-center rounded-full bg-[#1d5a49] px-4 py-3.5 text-sm font-semibold text-white hover:bg-[#164638]">Continue to checkout</Link>}
              <button type="button" className="mt-4 text-xs font-medium text-slate-600 hover:text-red-700" onClick={clearCart}>Clear cart</button>
            </aside>
          </div>
        )}
      </div>
    </Container>
  )
}
