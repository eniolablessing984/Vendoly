// Frontend-only placeholder. Live payments will be handled by a backend provider integration.
export async function simulateCardPayment({ amount, cardDetails }) {
  await new Promise(resolve => setTimeout(resolve, 500))
  return {
    status: 'succeeded',
    id: `demo_pay_${Date.now()}`,
    amount,
    provider: 'local-bank-demo',
    bank: cardDetails?.bank || 'Local bank',
  }
}
