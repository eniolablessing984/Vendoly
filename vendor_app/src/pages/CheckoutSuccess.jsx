import { Link, useLocation, useSearchParams } from 'react-router-dom'
import Container from '../components/Container'
import * as orderService from '../data/orderService'
import { formatMinorMoney, getSellerName, toMinorUnits } from '../data/marketplaceFormat'

export default function CheckoutSuccess(){
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const orderId = location.state?.orderId || searchParams.get('orderId')
  const order = orderId ? orderService.getById(orderId) : null
  const subtotalMinor = order?.subtotalMinor ?? toMinorUnits(order?.subtotal)
  const shippingMinor = order?.shippingMinor ?? 0
  const totalMinor = order?.totalMinor ?? toMinorUnits(order?.total)

  return (
    <Container>
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <div className="text-center">
          <div aria-hidden="true" className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#e9f3ed] text-2xl font-semibold text-[#28644d]">&#10003;</div>
          <p className="mt-5 text-xs font-bold uppercase tracking-[.18em] text-[#3d725a]">{order ? 'Demo order confirmed' : 'Order status'}</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{order ? 'Thank you. Your order is placed.' : 'We could not find that order.'}</h1>
          {order ? <><p className="mt-2 text-sm text-slate-600">Order ID: <span className="font-semibold text-slate-800">{order.id}</span></p><p role={location.state?.orderPersisted === false ? 'alert' : undefined} className={`mt-1 text-xs ${location.state?.orderPersisted === false ? 'text-amber-800' : 'text-slate-500'}`}>{location.state?.orderPersisted === false ? 'This order is available only for this browser session because storage is unavailable. It may not survive a refresh.' : 'This confirmation is saved in this browser only.'}</p></> : <p className="mt-2 text-sm text-slate-600">{location.state?.orderPersisted === false ? 'Browser storage was unavailable, and the session-only order is no longer available.' : 'The order may have been cleared from this browser.'}</p>}
        </div>

        {order && <div className="mt-8 grid gap-6 border-t border-slate-100 pt-6 sm:grid-cols-2">
          <section>
            <h2 className="text-sm font-semibold text-slate-900">Items</h2>
            <ul className="mt-3 space-y-3">
              {order.items?.map(item => <li key={item.id} className="flex justify-between gap-3 text-sm"><span className="min-w-0"><span className="block truncate font-medium text-slate-800">{item.title}</span><span className="mt-1 block text-xs text-slate-500">{getSellerName(item)} - Qty {item.qty || item.quantity || 1}</span></span><span className="shrink-0 font-medium text-slate-700">{formatMinorMoney((item.unitAmountMinor ?? toMinorUnits(item.price)) * (item.qty || item.quantity || 1), order.currency)}</span></li>)}
            </ul>
          </section>
          <section>
            <h2 className="text-sm font-semibold text-slate-900">Delivery and payment</h2>
            <p className="mt-3 text-sm text-slate-700">{order.shipping?.name}</p>
            <p className="mt-1 text-sm text-slate-600">{[order.shipping?.address, order.shipping?.city, order.shipping?.region, order.shipping?.postal, order.shipping?.country].filter(Boolean).join(', ')}</p>
            <p className="mt-1 text-sm text-slate-600">{order.shipping?.email}</p>
            <p className="mt-3 text-xs text-slate-500">Standard delivery - Demo estimate only</p>
            <p className="mt-2 text-sm text-slate-700">Payment: <strong>{order.payment?.method === 'cod' ? 'Due on delivery (demo)' : 'Paid (demo)'}</strong></p>
          </section>
          <section className="rounded-xl bg-slate-50 p-4 sm:col-span-2">
            <div className="flex justify-between text-sm text-slate-600"><span>Subtotal</span><span>{formatMinorMoney(subtotalMinor, order.currency)}</span></div>
            <div className="mt-2 flex justify-between text-sm text-slate-600"><span>Standard delivery</span><span>{formatMinorMoney(shippingMinor, order.currency)}</span></div>
            <div className="mt-3 flex justify-between border-t border-slate-200 pt-3 font-semibold text-slate-900"><span>Total</span><span>{formatMinorMoney(totalMinor, order.currency)}</span></div>
          </section>
        </div>}

        <div className="mt-8 flex justify-center">
          <Link to="/" className="rounded-full bg-[#1d5a49] px-5 py-3 text-sm font-semibold text-white hover:bg-[#164638]">Continue browsing</Link>
        </div>
      </div>
    </Container>
  )
}
