import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { calculateSubtotalMinor, formatMinorMoney, getAvailableQuantity, toMinorUnits } from '../data/marketplaceFormat'
import * as productService from '../data/productService'

export default function MiniCart({ id, onClose }){
  const { cart, setQuantity, removeItem, storageAvailable } = useCart()
  const currentCart = productService.refreshCartItems(cart)
  const totalMinor = calculateSubtotalMinor(currentCart)
  const itemCount = currentCart.reduce((sum, item) => sum + (item.qty || 1), 0)

  return (
    <div id={id} role="region" aria-label="Shopping cart preview" className="absolute right-0 top-full mt-3 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15">
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="font-semibold text-slate-900">Your cart <span className="ml-1 text-xs font-normal text-slate-500">({itemCount})</span></div>
          <button type="button" className="grid h-8 w-8 place-items-center rounded-full text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800" onClick={onClose} aria-label="Close cart">Close</button>
        </div>

        {!storageAvailable && <p role="alert" className="mb-3 rounded-lg bg-amber-50 p-2.5 text-xs leading-5 text-amber-900">Cart changes may be lost if you refresh this page.</p>}

        {currentCart.length === 0 ? (
          <div className="rounded-xl bg-[#f9faf8] px-4 py-7 text-center text-sm text-slate-500">Your cart is waiting for a favorite find.</div>
        ) : (
          <div className="space-y-3">
            {currentCart.map(item => {
              const stock = getAvailableQuantity(item)
              return <div key={item.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0 text-sm">
                  <div className="line-clamp-1 font-medium text-slate-900">{item.title}</div>
                  <div className="mt-1 text-xs text-slate-500">{formatMinorMoney(toMinorUnits(item.price))}</div>
                  {!item.catalogAvailable && <div className="mt-1 text-xs font-medium text-red-700">No longer available</div>}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button type="button" aria-label={`Decrease quantity of ${item.title}`} className="grid h-7 w-7 place-items-center rounded-full border border-slate-200 text-slate-600" onClick={() => setQuantity(item.id, item.qty - 1)}>-</button>
                  <span className="min-w-4 text-center text-sm">{item.qty}</span>
                  <button type="button" aria-label={`Increase quantity of ${item.title}`} disabled={!item.catalogAvailable || item.qty >= stock} className="grid h-7 w-7 place-items-center rounded-full border border-slate-200 text-slate-600 disabled:cursor-not-allowed disabled:text-slate-300" onClick={() => setQuantity(item.id, item.qty + 1)}>+</button>
                  <button type="button" className="px-1 py-1 text-xs text-red-600" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.title}`}>Remove</button>
                </div>
              </div>
            })}

            <div className="flex items-center justify-between border-t pt-3">
              <div className="font-semibold">Total</div>
              <div className="font-bold">{formatMinorMoney(totalMinor)}</div>
            </div>

            <div className="mt-3 flex gap-2">
              <Link to="/cart" className="flex-1 rounded-full border border-slate-200 px-3 py-2.5 text-center text-xs font-semibold text-slate-700 hover:bg-slate-50" onClick={onClose}>View cart</Link>
              <Link to="/checkout" className="flex-1 rounded-full bg-[#1d5a49] px-3 py-2.5 text-center text-xs font-semibold text-white hover:bg-[#164638]" onClick={onClose}>Checkout</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
