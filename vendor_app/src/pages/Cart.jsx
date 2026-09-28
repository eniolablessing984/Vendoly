
import { useState } from 'react'
import Container from '../components/Container'
import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'
import * as orderService from '../data/orderService'

export default function CartPage(){
  const { cart, removeItem, clearCart, setQuantity } = useCart()
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [requestData, setRequestData] = useState({ name: '', phone: '', notes: '' })

  const total = cart.reduce((s, it) => s + ((parseFloat(it.price) || 0) * (it.qty || 1)), 0)

  function handleRequestSubmit(e){
    e.preventDefault()

    if (cart.length === 0) {
      alert('Cart is empty')
      return
    }

    const request = {
      type: 'order_request',
      customer: {
        name: requestData.name,
        phone: requestData.phone,
        notes: requestData.notes,
      },
      items: cart,
      total: total.toFixed(2),
      createdAt: new Date().toISOString(),
    }

    orderService.create(request)
    clearCart()
    setRequestData({ name: '', phone: '', notes: '' })
    setShowRequestForm(false)
    alert('Order request sent successfully.')
  }

  return (
    <Container>
      <div className="mx-auto max-w-5xl">
        <div className="mb-7"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#488367]">Almost yours</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Your cart</h1><p className="mt-1 text-sm text-slate-500">Review your finds before checking out.</p></div>
        {cart.length === 0 ? (
          <div className="rounded-[1.5rem] border border-slate-200 bg-white px-6 py-16 text-center shadow-sm"><div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#e9f3ed] text-2xl text-[#28644d]">♡</div><h2 className="mt-4 text-lg font-semibold text-slate-900">Your cart is waiting for something lovely</h2><p className="mt-2 text-sm text-slate-500">Explore unique finds from independent sellers.</p><Link to="/" className="mt-6 inline-flex rounded-full bg-[#1d5a49] px-5 py-3 text-sm font-semibold text-white hover:bg-[#164638]">Discover the collection</Link></div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            <div className="space-y-3">
            {cart.map(item => (
              <div key={item.id} className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
                {item.image ? <img src={item.image} alt="" className="h-20 w-20 rounded-xl bg-[#f0f2ed] object-cover sm:h-24 sm:w-24" /> : <div className="h-20 w-20 rounded-xl bg-[#f0f2ed] sm:h-24 sm:w-24" />}
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold text-slate-900">{item.title}</div>
                  <div className="mt-1 text-sm text-slate-500">${Number(item.price).toFixed(2)} each</div>
                  <div className="mt-3 flex items-center gap-2">
                    <button aria-label={`Decrease quantity of ${item.title}`} className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50" onClick={() => setQuantity(item.id, (item.qty||1) - 1)}>-</button>
                    <span className="min-w-6 text-center text-sm font-semibold">{item.qty}</span>
                    <button aria-label={`Increase quantity of ${item.title}`} className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50" onClick={() => setQuantity(item.id, (item.qty||1) + 1)}>+</button>
                    <button onClick={() => removeItem(item.id)} className="ml-2 text-xs font-medium text-slate-400 underline decoration-slate-300 underline-offset-4 hover:text-red-600">Remove</button>
                  </div>
                </div>
                <div className="shrink-0 text-right text-sm font-bold text-slate-900">${((parseFloat(item.price) || 0) * item.qty).toFixed(2)}</div>
              </div>
            ))}
            </div>

            <aside className="h-fit rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm lg:sticky lg:top-28">
              <h2 className="text-lg font-semibold text-slate-900">Order summary</h2>
              <div className="mt-5 flex justify-between text-sm text-slate-600"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
              <div className="mt-3 flex justify-between text-sm text-slate-600"><span>Shipping</span><span className="font-medium text-[#34775d]">Free</span></div>
              <div className="my-5 border-t border-slate-100" />
              <div className="flex justify-between font-semibold text-slate-900"><span>Total</span><span>${total.toFixed(2)}</span></div>
              <Link to="/checkout" className="mt-5 flex w-full justify-center rounded-full bg-[#1d5a49] px-4 py-3.5 text-sm font-semibold text-white hover:bg-[#164638]">Continue to checkout</Link>
              <div className="mt-4 flex justify-between gap-2">
                <button
                  className="text-xs font-medium text-slate-500 underline underline-offset-4 hover:text-slate-900"
                  onClick={() => setShowRequestForm(v => !v)}
                >
                  {showRequestForm ? 'Close request' : 'Request an order instead'}
                </button>
                <button className="text-xs font-medium text-slate-400 hover:text-red-600" onClick={clearCart}>Clear cart</button>
              </div>
            </aside>

            {showRequestForm && (
              <form onSubmit={handleRequestSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
                <h2 className="text-lg font-semibold text-slate-900">Send an order request</h2>

                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    value={requestData.name}
                    onChange={(e) => setRequestData({ ...requestData, name: e.target.value })}
                    placeholder="Full name"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-[#8fbaa3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6]"
                    required
                  />
                  <input
                    value={requestData.phone}
                    onChange={(e) => setRequestData({ ...requestData, phone: e.target.value })}
                    placeholder="Phone number"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-[#8fbaa3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6]"
                    required
                  />
                </div>

                <textarea
                  value={requestData.notes}
                  onChange={(e) => setRequestData({ ...requestData, notes: e.target.value })}
                  placeholder="Order notes or delivery details"
                  rows="3"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-[#8fbaa3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6]"
                />

                <div className="flex justify-end">
                  <button type="submit" className="rounded-full bg-[#1d5a49] px-5 py-3 text-sm font-semibold text-white hover:bg-[#164638]">
                    Send request
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </Container>
  )
}
