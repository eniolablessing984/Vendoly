export const DEMO_CURRENCY = 'USD'

export function toMinorUnits(amount) {
  const value = Number(amount)
  return Number.isFinite(value) ? Math.round(value * 100) : 0
}

export function formatMoney(amount, currency = DEMO_CURRENCY) {
  const value = Number(amount)
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(Number.isFinite(value) ? value : 0)
}

export function formatMinorMoney(amountMinor, currency = DEMO_CURRENCY) {
  return formatMoney((Number(amountMinor) || 0) / 100, currency)
}

export function calculateSubtotalMinor(items = []) {
  return items.reduce((sum, item) => sum + toMinorUnits(item.price) * Math.max(0, Math.floor(Number(item.qty) || 0)), 0)
}

export function getAvailableQuantity(product) {
  const quantity = Number(product?.stockQuantity)
  return Number.isInteger(quantity) && quantity >= 0 ? quantity : 0
}

export function getSellerName(product) {
  return product?.sellerName || 'Vendorly seller'
}
