import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Container from '../components/Container'
import { useCart } from '../context/CartContext'
import * as orderService from '../data/orderService'
import { calculateSubtotalMinor, DEMO_CURRENCY, formatMinorMoney, getAvailableQuantity, getSellerName, toMinorUnits } from '../data/marketplaceFormat'
import { simulateCardPayment } from '../services/paymentService'
import { sendOrderNotification } from '../services/notificationService'
import * as productService from '../data/productService'

const emptyCustomer = { name: '', email: '', phone: '', address: '', city: '', region: '', postal: '', country: '' }
const emptyCardDetails = { cardholderName: '', cardType: '', cardNumber: '', expiryDate: '', cvv: '', bank: '' }

export default function Checkout(){
  const { cart, clearCart, storageAvailable } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [customer, setCustomer] = useState(emptyCustomer)
  const [cardDetails, setCardDetails] = useState(emptyCardDetails)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [error, setError] = useState('')
  const checkoutItems = productService.refreshCartItems(cart)
  const subtotalMinor = calculateSubtotalMinor(checkoutItems)
  const shippingMinor = 0
  const totalMinor = subtotalMinor + shippingMinor
  const hasUnavailableItems = checkoutItems.some(item => !item.catalogAvailable)
  const hasStockIssue = hasUnavailableItems || checkoutItems.some(item => item.qty > getAvailableQuantity(item))

  function updateCustomer(event){
    const { name, value } = event.target
    setCustomer(current => ({ ...current, [name]: value }))
  }

  function updateCardDetails(event){
    const { name, value } = event.target
    setCardDetails(current => ({ ...current, [name]: value }))
  }

  async function handlePlaceOrder(event){
    event.preventDefault()
    setError('')
    if (!cart.length) {
      setError('Your cart is empty. Add an item before checkout.')
      return
    }
    if (hasStockIssue) {
      setError(hasUnavailableItems ? 'A product is no longer available. Return to your cart and remove it.' : 'One or more quantities exceed current availability. Return to your cart and adjust them.')
      return
    }

    if (paymentMethod === 'card') {
      const requiredCardFields = ['cardholderName', 'cardType', 'cardNumber', 'expiryDate', 'cvv', 'bank']
      const missingCardDetails = requiredCardFields.some(key => !String(cardDetails[key] || '').trim())
      if (missingCardDetails) {
        setError('Please complete all card details before paying with your local bank card.')
        return
      }
    }

    setLoading(true)
    let payment = { method: paymentMethod, status: 'pending' }
    if (paymentMethod === 'card') {
      try {
        const result = await simulateCardPayment({ amount: totalMinor / 100, cardDetails })
        if (result.status !== 'succeeded') {
          setError('The demo payment could not be completed. Please try again.')
          setLoading(false)
          return
        }
        payment = { method: 'card', status: 'paid', provider: result.provider, paymentId: result.id, amountMinor: totalMinor, currency: DEMO_CURRENCY, bank: cardDetails.bank || 'Local bank', cardType: cardDetails.cardType || 'Card' }
      } catch {
        setError('The demo payment could not be completed. Please try again.')
        setLoading(false)
        return
      }
    }

    const orderItems = checkoutItems.map(item => {
      const snapshot = { ...item, unitAmountMinor: toMinorUnits(item.price), quantity: item.qty }
      delete snapshot.catalogAvailable
      return snapshot
    })
    const order = {
      items: orderItems,
      currency: DEMO_CURRENCY,
      subtotalMinor,
      shippingMinor,
      totalMinor,
      subtotal: (subtotalMinor / 100).toFixed(2),
      total: (totalMinor / 100).toFixed(2),
      status: 'confirmed',
      shipping: { ...customer },
      delivery: { method: 'standard', chargeMinor: shippingMinor, estimate: 'Demo estimate; delivery timing is not connected yet.' },
      payment,
      createdAt: new Date().toISOString(),
    }

    try {
      const { order: saved, persisted } = orderService.create(order)
      sendOrderNotification(saved).catch(() => {})
      clearCart()
      navigate(`/checkout/success?orderId=${encodeURIComponent(saved.id)}`, { state: { orderId: saved.id, orderPersisted: persisted } })
    } catch {
      setError('We could not save this demo order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!cart.length) return (
    <Container><div className="mx-auto max-w-xl rounded-[2rem] border border-slate-200 bg-white px-6 py-14 text-center shadow-sm"><div aria-hidden="true" className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#e9f3ed] text-2xl text-[#28644d]">&#9825;</div><h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">Your cart is empty</h1><p className="mt-2 text-sm text-slate-500">Add a few finds before heading to checkout.</p><button type="button" onClick={() => navigate('/')} className="mt-6 rounded-full bg-[#1d5a49] px-6 py-3 text-sm font-semibold text-white hover:bg-[#164638]">Explore the collection</button></div></Container>
  )

  return (
    <Container>
      <div className="mx-auto grid max-w-6xl items-start gap-6 py-6 lg:grid-cols-12 lg:gap-8">
        <form onSubmit={handlePlaceOrder} aria-busy={loading} className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8 lg:col-span-7">
          <div className="mb-7">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#3d725a]">Almost there</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Checkout</h1>
            <p className="mt-1 text-sm text-slate-500">Add delivery details and choose how you would like to pay.</p>
            {!storageAvailable && <p role="alert" className="mt-3 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900">Browser storage is unavailable. Cart changes will not survive a refresh.</p>}
          </div>

          <fieldset className="space-y-4">
            <legend className="text-xs font-semibold uppercase tracking-wider text-[#3d725a]">1. Delivery details</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs font-medium text-slate-700 sm:col-span-2">Full name<input name="name" autoComplete="name" value={customer.name} onChange={updateCustomer} placeholder="Your name" className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6]" required /></label>
              <label className="text-xs font-medium text-slate-700">Email<input name="email" type="email" autoComplete="email" value={customer.email} onChange={updateCustomer} placeholder="you@example.com" className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6]" required /></label>
              <label className="text-xs font-medium text-slate-700">Phone<input name="phone" type="tel" autoComplete="tel" value={customer.phone} onChange={updateCustomer} placeholder="Phone number" className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6]" required /></label>
              <label className="text-xs font-medium text-slate-700 sm:col-span-2">Street address<input name="address" autoComplete="street-address" value={customer.address} onChange={updateCustomer} placeholder="Street and house number" className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6]" required /></label>
              <label className="text-xs font-medium text-slate-700">City or town<input name="city" autoComplete="address-level2" value={customer.city} onChange={updateCustomer} placeholder="City" className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6]" required /></label>
              <label className="text-xs font-medium text-slate-700">State or region<input name="region" autoComplete="address-level1" value={customer.region} onChange={updateCustomer} placeholder="State or region" className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6]" required /></label>
              <label className="text-xs font-medium text-slate-700">Postal code<input name="postal" autoComplete="postal-code" value={customer.postal} onChange={updateCustomer} placeholder="Postal code" className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6]" required /></label>
              <label className="text-xs font-medium text-slate-700">Country<input name="country" autoComplete="country-name" value={customer.country} onChange={updateCustomer} placeholder="Country" className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6]" required /></label>
            </div>
          </fieldset>

          <hr className="my-7 border-slate-100" />

          <fieldset className="space-y-3">
            <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#3d725a]">2. Payment method</legend>
            <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${paymentMethod === 'card' ? 'border-[#1d5a49] bg-[#f3f8f5] ring-1 ring-[#1d5a49]' : 'border-slate-200 bg-white'}`}>
              <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
              <span><span className="block text-sm font-semibold text-slate-900">Local bank card</span><span className="mt-1 block text-xs text-slate-500">Use your debit or prepaid card to pay instantly from your local bank account.</span></span>
            </label>
            <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${paymentMethod === 'cod' ? 'border-[#1d5a49] bg-[#f3f8f5] ring-1 ring-[#1d5a49]' : 'border-slate-200 bg-white'}`}>
              <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
              <span><span className="block text-sm font-semibold text-slate-900">Cash on delivery (demo)</span><span className="mt-1 block text-xs text-slate-500">Payment will show as due on delivery in this prototype.</span></span>
            </label>
          </fieldset>

          {paymentMethod === 'card' && (
            <div className="mt-5 rounded-2xl border border-[#dfeae3] bg-[#f8fbf9] p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-slate-900">Card details</h3>
                <span className="rounded-full bg-[#eaf6ef] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-[#28644d]">Secure</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-xs font-medium text-slate-700 sm:col-span-2">Cardholder name<input name="cardholderName" value={cardDetails.cardholderName} onChange={updateCardDetails} placeholder="Name on card" className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6]" required /></label>
                <label className="text-xs font-medium text-slate-700">Card type<select name="cardType" value={cardDetails.cardType} onChange={updateCardDetails} className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6]" required><option value="">Select card type</option><option value="Visa">Visa</option><option value="MasterCard">MasterCard</option><option value="Verve">Verve</option><option value="American Express">American Express</option><option value="Discover">Discover</option></select></label>
                <label className="text-xs font-medium text-slate-700">Local bank<select name="bank" value={cardDetails.bank} onChange={updateCardDetails} className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6]" required><option value="">Select your bank</option><option value="Access Bank">Access Bank</option><option value="First Bank">First Bank</option><option value="GTBank">GTBank</option><option value="Zenith Bank">Zenith Bank</option><option value="UBA">UBA</option><option value="Other">Other local bank</option></select></label>
                <label className="text-xs font-medium text-slate-700 sm:col-span-2">Card number<input name="cardNumber" inputMode="numeric" value={cardDetails.cardNumber} onChange={updateCardDetails} placeholder="1234 5678 9012 3456" className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6]" required /></label>
                <label className="text-xs font-medium text-slate-700">Expiry date<input name="expiryDate" value={cardDetails.expiryDate} onChange={updateCardDetails} placeholder="MM/YY" className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6]" required /></label>
                <label className="text-xs font-medium text-slate-700">CVV<input name="cvv" inputMode="numeric" value={cardDetails.cvv} onChange={updateCardDetails} placeholder="123" className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#cde4d6]" required /></label>
              </div>
            </div>
          )}

          {hasStockIssue && <p role="alert" className="mt-5 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">{hasUnavailableItems ? 'A product is no longer available.' : 'A cart quantity is above current availability.'} <Link to="/cart" className="font-semibold underline underline-offset-2">Review your cart</Link> before placing the order.</p>}
          {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={loading || hasStockIssue} className="mt-7 flex w-full items-center justify-center rounded-full bg-[#1d5a49] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#164638] disabled:cursor-not-allowed disabled:bg-slate-400"><span aria-live="polite">{loading ? 'Placing demo order...' : paymentMethod === 'card' ? 'Pay and place demo order' : 'Place cash-on-delivery demo order'}</span></button>
          <p className="mt-3 text-center text-xs text-slate-500">This is a frontend demo. Your order is stored only in this browser.</p>
        </form>

        <aside className="h-fit rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm lg:sticky lg:top-28 lg:col-span-5">
          <h2 className="border-b border-slate-100 pb-4 text-base font-bold text-slate-900">Order summary</h2>
          <div className="max-h-96 space-y-4 overflow-y-auto py-4 pr-1">
            {checkoutItems.map(item => <div key={item.id} className="flex items-start justify-between gap-4 text-sm"><div className="min-w-0"><p className="truncate font-medium text-slate-800">{item.title}</p><p className="mt-1 text-xs text-slate-500">{getSellerName(item)} - Qty {item.qty}</p></div><span className="shrink-0 font-semibold tabular-nums text-slate-900">{formatMinorMoney(toMinorUnits(item.price) * item.qty)}</span></div>)}
          </div>
          <div className="space-y-3 border-t border-slate-100 pt-4 text-sm">
            <div className="flex justify-between text-slate-600"><span>Subtotal</span><span className="tabular-nums">{formatMinorMoney(subtotalMinor)}</span></div>
            <div className="flex justify-between text-slate-600"><span>Standard delivery</span><span className="font-medium text-[#34775d]">Free (demo)</span></div>
            <div className="flex justify-between border-t border-slate-100 pt-3 font-bold text-slate-900"><span>Total</span><span className="tabular-nums">{formatMinorMoney(totalMinor)}</span></div>
          </div>
          <p className="mt-4 text-xs leading-5 text-slate-500">Delivery price and timing are placeholders until a delivery option is selected for your market.</p>
        </aside>
      </div>
    </Container>
  )
}
