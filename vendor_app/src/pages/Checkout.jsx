import { useState } from 'react'
import Container from '../components/Container'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'
import * as orderService from '../data/orderService'
import { processCardPayment } from '../services/paymentService'
import { sendOrderNotification } from '../services/notificationService'

export default function Checkout(){
  const { cart, clearCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [postal, setPostal] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')

  const total = cart.reduce((s, it) => s + ((parseFloat(it.price)||0) * (it.qty||1)), 0)

  if (cart.length === 0) return (
    <Container><div className="mx-auto max-w-xl rounded-[2rem] border border-slate-200 bg-white px-6 py-14 text-center shadow-sm"><div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#e9f3ed] text-2xl text-[#28644d]">♡</div><h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">Your cart is empty</h1><p className="mt-2 text-sm text-slate-500">Add a few finds before heading to checkout.</p><button onClick={() => navigate('/')} className="mt-6 rounded-full bg-[#1d5a49] px-6 py-3 text-sm font-semibold text-white hover:bg-[#164638]">Explore the collection</button></div></Container>
  )

  function isExpiryValid(value){
    const m = String(value).match(/^(\d{1,2})\/(\d{2})$/)
    if(!m) return false
    const mm = parseInt(m[1],10)
    const yy = parseInt(m[2],10)
    if(mm < 1 || mm > 12) return false
    const now = new Date()
    const year = 2000 + yy
    const exp = new Date(year, mm)
    return exp > now
  }

  function formatCardNumber(v){
    const d = String(v).replace(/\D/g,'')
    return d.replace(/(.{4})/g,'$1 ').trim()
  }

  async function handlePlaceOrder(e){
    e.preventDefault()
    if(cart.length === 0){ alert('Cart is empty'); return }
    setLoading(true)
    // validate payment inputs if card selected
    let payment = { method: paymentMethod, status: 'pending' }
    if(paymentMethod === 'card'){
      const digits = String(cardNumber).replace(/\D/g,'')
      if(digits.length < 12 || digits.length > 19){
        setLoading(false)
        return alert('Enter a valid card number')
      }
      if(String(cardCvc).replace(/\D/g,'').length < 3){ setLoading(false); return alert('Enter a valid CVC') }
      if(!isExpiryValid(cardExpiry)){ setLoading(false); return alert('Enter a valid future expiry (MM/YY)') }

      try{
        const result = await processCardPayment({ cardNumber: digits, cardExpiry, cardCvc, amount: total.toFixed(2) })
        if(result.status !== 'succeeded'){
          setLoading(false)
          return alert('Payment failed: ' + (result.error || 'card declined'))
        }
        payment = { method: 'card', status: 'paid', card: result.card, paymentId: result.id }
      }catch(err){
        console.error(err)
        setLoading(false)
        return alert('Payment processing error')
      }
    }

    const order = {
      items: cart,
      total: total.toFixed(2),
      shipping: { name, address, city, postal },
      payment,
      createdAt: new Date().toISOString()
    }

    try{
      const saved = orderService.create(order)
      // send mock notification (async, fire-and-forget)
      sendOrderNotification({ ...saved, shipping: { ...saved.shipping, email: saved.shipping?.email } }).catch(e => console.error('notify', e))
      clearCart()
      setLoading(false)
      navigate('/checkout/success', { state: { orderId: saved.id, payment } })
    }catch(err){
      console.error(err)
      setLoading(false)
      alert('Failed to place order')
    }
  }

  return (
    <Container>
  <div className="grid lg:grid-cols-12 gap-8 items-start py-6">
    {/* Left Column: Form Section */}
    <form 
      onSubmit={handlePlaceOrder} 
      className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-xl border border-slate-200/80 shadow-xs"
    >
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-[#488367]">Almost there</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Checkout</h2>
        <p className="text-sm text-slate-500 mt-1">Enter your delivery and payment details to place your order.</p>
      </div>

      {/* Shipping Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-[#488367] uppercase tracking-wider">1. Shipping address</h3>
        
        <div className="grid gap-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
            <input 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="e.g. John Doe" 
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" 
              required 
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Street Address</label>
            <input 
              value={address} 
              onChange={e => setAddress(e.target.value)} 
              placeholder="123 Main St, Apt 4B" 
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" 
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">City</label>
              <input 
                value={city} 
                onChange={e => setCity(e.target.value)} 
                placeholder="New York" 
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" 
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Postal Code</label>
              <input 
                value={postal} 
                onChange={e => setPostal(e.target.value)} 
                placeholder="10001" 
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" 
                required 
              />
            </div>
          </div>
        </div>
      </div>

      <hr className="my-6 border-slate-100" />

      {/* Payment Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-[#488367] uppercase tracking-wider">2. Payment method</h3>

        <div className="grid grid-cols-2 gap-3">
          <label className={`relative flex items-center justify-between p-3.5 rounded-lg border cursor-pointer transition-all ${
            paymentMethod === 'card' 
              ? 'border-slate-900 bg-slate-900/5 ring-1 ring-slate-900' 
              : 'border-slate-200 bg-slate-50 hover:bg-slate-100/80'
          }`}>
            <div className="flex items-center gap-2.5">
              <input 
                type="radio" 
                name="pm" 
                value="card" 
                checked={paymentMethod === 'card'} 
                onChange={() => setPaymentMethod('card')} 
                className="h-4 w-4 text-slate-900 focus:ring-slate-900 accent-slate-900" 
              />
              <span className="text-sm font-medium text-slate-900">Credit Card</span>
            </div>
          </label>

          <label className={`relative flex items-center justify-between p-3.5 rounded-lg border cursor-pointer transition-all ${
            paymentMethod === 'cod' 
              ? 'border-slate-900 bg-slate-900/5 ring-1 ring-slate-900' 
              : 'border-slate-200 bg-slate-50 hover:bg-slate-100/80'
          }`}>
            <div className="flex items-center gap-2.5">
              <input 
                type="radio" 
                name="pm" 
                value="cod" 
                checked={paymentMethod === 'cod'} 
                onChange={() => setPaymentMethod('cod')} 
                className="h-4 w-4 text-slate-900 focus:ring-slate-900 accent-slate-900" 
              />
              <span className="text-sm font-medium text-slate-900">Cash on Delivery</span>
            </div>
          </label>
        </div>

        {paymentMethod === 'card' && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3 mt-3 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Card Number</label>
              <input 
                value={formatCardNumber(cardNumber)} 
                onChange={e => setCardNumber(e.target.value)} 
                placeholder="0000 0000 0000 0000" 
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" 
                inputMode="numeric" 
                required 
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Expiration</label>
                <input 
                  value={cardExpiry} 
                  onChange={e => setCardExpiry(e.target.value)} 
                  placeholder="MM/YY" 
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" 
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">CVC / CVV</label>
                <input 
                  value={cardCvc} 
                  onChange={e => setCardCvc(e.target.value)} 
                  placeholder="123" 
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" 
                  inputMode="numeric" 
                  required 
                />
              </div>
            </div>
            <p className="text-xs text-slate-500 pt-1 flex items-center gap-1.5">
              <span>🔒</span> Demo environment — test data only. Use a test card ending with <strong>4242</strong> for success.
            </p>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button 
        disabled={loading} 
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-[#1d5a49] px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#164638] focus:outline-none focus:ring-2 focus:ring-[#1d5a49] focus:ring-offset-2 active:scale-[0.99] disabled:bg-slate-400"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{paymentMethod === 'card' ? 'Processing Payment...' : 'Placing Order...'}</span>
          </>
        ) : (
          'Place Order'
        )}
      </button>
    </form>

    {/* Right Column: Order Summary */}
    <aside className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs sticky top-6">
      <h3 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">Order Summary</h3>
      
      <div className="space-y-3.5 max-h-95 overflow-y-auto pr-1">
        {cart.map(i => (
          <div key={i.id} className="flex items-center justify-between text-sm py-1">
            <div className="flex-1 pr-4">
              <div className="font-medium text-slate-800 line-clamp-1">{i.title}</div>
              <div className="text-xs text-slate-500">Qty: {i.qty}</div>
            </div>
            <div className="font-semibold text-slate-900 tabular-nums">
              ${((parseFloat(i.price) || 0) * i.qty).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-100 mt-6 pt-4 space-y-2">
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Subtotal</span>
          <span className="tabular-nums">${total.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Shipping</span>
          <span className="text-emerald-600 font-medium">Free</span>
        </div>
        <div className="border-t border-slate-100 pt-3 mt-3 flex items-center justify-between">
          <span className="font-bold text-base text-slate-900">Total</span>
          <span className="font-extrabold text-lg text-slate-900 tabular-nums">${total.toFixed(2)}</span>
        </div>
      </div>
    </aside>
  </div>
</Container>
  )
}
