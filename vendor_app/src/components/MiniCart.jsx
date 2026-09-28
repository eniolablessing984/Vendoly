import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function MiniCart({ onClose }){
  const { cart, setQuantity, removeItem } = useCart()
  const total = cart.reduce((s, it) => s + ((parseFloat(it.price)||0) * (it.qty||1)), 0)

  return (
    <div className="absolute right-0 top-full mt-3 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15">
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="font-semibold text-slate-900">Your cart <span className="ml-1 text-xs font-normal text-slate-400">({cart.length})</span></div>
          <button className="grid h-8 w-8 place-items-center rounded-full text-lg text-slate-400 hover:bg-slate-100 hover:text-slate-800" onClick={onClose} aria-label="Close cart">×</button>
        </div>

        {cart.length === 0 ? (
          <div className="rounded-xl bg-[#f7f8f6] px-4 py-7 text-center text-sm text-slate-500">Your cart is waiting for a favorite find.</div>
        ) : (
          <div className="space-y-3">
            {cart.map(item => (
              <div key={item.id} className="flex items-center justify-between gap-3">
                <div className="text-sm">
                  <div className="line-clamp-1 font-medium text-slate-900">{item.title}</div>
                  <div className="mt-1 text-xs text-slate-500">${Number(item.price).toFixed(2)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button aria-label={`Decrease quantity of ${item.title}`} className="grid h-7 w-7 place-items-center rounded-full border border-slate-200 text-slate-600" onClick={() => setQuantity(item.id, (item.qty||1) - 1)}>-</button>
                  <div className="text-sm">{item.qty}</div>
                  <button aria-label={`Increase quantity of ${item.title}`} className="grid h-7 w-7 place-items-center rounded-full border border-slate-200 text-slate-600" onClick={() => setQuantity(item.id, (item.qty||1) + 1)}>+</button>
                  <button className="px-2 py-1 text-red-600" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.title}`}>Remove</button>
                </div>
              </div>
            ))}

            <div className="border-t pt-3 flex items-center justify-between">
              <div className="font-semibold">Total</div>
              <div className="font-bold">${total.toFixed(2)}</div>
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
