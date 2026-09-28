// Simulated payment service to mimic Stripe test behavior
// In a real app you'd call your backend which talks to Stripe using secret keys.
export async function processCardPayment({ cardNumber, amount }){
  // normalize
  const digits = String(cardNumber || '').replace(/\D/g,'')
  // simple simulation: card numbers ending with 4242 succeed
  await new Promise(r => setTimeout(r, 800))
  if(digits.endsWith('4242')){
    return { status: 'succeeded', id: 'pay_' + Date.now(), card: `**** **** **** ${digits.slice(-4)}`, amount }
  }

  // simulate decline for other numbers with 20% chance
  if(Math.random() < 0.2){
    return { status: 'failed', error: 'Card declined' }
  }

  return { status: 'succeeded', id: 'pay_' + Date.now(), card: `**** **** **** ${digits.slice(-4)}`, amount }
}
