import { Link, useLocation } from 'react-router-dom'
import Container from '../components/Container'

export default function CheckoutSuccess(){
  const location = useLocation()
  const { orderId, payment } = location.state || {}

  return (
    <Container>
      <div className="mx-auto max-w-xl rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#e9f3ed] text-2xl font-semibold text-[#28644d]">✓</div>
        <p className="mt-5 text-xs font-bold uppercase tracking-[.18em] text-[#488367]">Order confirmed</p>
        <h1 className="text-2xl font-bold mb-2">Thank you — order placed</h1>
        {orderId ? <p className="text-slate-600 mb-4">Order ID: <span className="font-medium">{orderId}</span></p> : null}
        {payment ? (
          <div className="mb-4 text-slate-700">
            <div>Payment status: <strong>{payment.status}</strong></div>
            {payment.card && <div>Card: <strong>{payment.card}</strong></div>}
          </div>
        ) : null}

        <div className="flex justify-center gap-3">
          <Link to="/" className="rounded-full bg-[#1d5a49] px-5 py-3 text-sm font-semibold text-white hover:bg-[#164638]">Continue browsing</Link>
        </div>
      </div>
    </Container>
  )
}
