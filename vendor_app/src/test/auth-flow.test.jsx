import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'
import ProductCard from '../components/ProductCard'
import Checkout from '../pages/Checkout'
import { AuthProvider } from '../context/AuthContext'
import { CartProvider } from '../context/CartContext'

describe('customer auth flow', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.pushState({}, '', '/')
  })

  it('renders a dedicated customer login page at /login', async () => {
    window.history.pushState({}, '', '/login')
    render(<App />)

    expect(await screen.findByRole('heading', { name: /log in to continue/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /create an account/i })).toBeInTheDocument()
  })

  it('redirects anonymous users away from checkout', async () => {
    window.history.pushState({}, '', '/checkout')
    render(<App />)

    expect(await screen.findByRole('heading', { name: /log in to continue/i })).toBeInTheDocument()
  })

  it('renders the admin login route and protects the company dashboard', async () => {
    window.history.pushState({}, '', '/admin/dashboard')
    render(<App />)

    expect(await screen.findByRole('heading', { name: /company admin login/i })).toBeInTheDocument()
  })

  it('shows an out-of-stock label and disables adding stockless products from the catalog card', () => {
    render(
      <MemoryRouter>
        <CartProvider>
          <ProductCard product={{ id: '999', title: 'Out of stock item', price: '19.00', stockQuantity: 0, category: 'Accessories', sellerName: 'Demo Seller' }} />
        </CartProvider>
      </MemoryRouter>
    )

    expect(screen.getByRole('button', { name: /out of stock/i })).toBeDisabled()
    expect(screen.getByText('Out of stock', { selector: 'p' })).toBeInTheDocument()
  })

  it('collects local bank card details when a customer selects card payment at checkout', async () => {
    localStorage.setItem('vendor_user', JSON.stringify({ id: 'customer-demo', email: 'customer@example.com', role: 'customer', name: 'Jane Doe' }))
    localStorage.setItem('vendor_cart', JSON.stringify([{ id: '1', title: 'Test item', price: '49.00', qty: 1, stockQuantity: 5, sellerName: 'Demo Seller' }]))

    render(
      <MemoryRouter>
        <AuthProvider>
          <CartProvider>
            <Checkout />
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    )

    expect(await screen.findByLabelText(/cardholder name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/card type/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/card number/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/expiry date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/cvv/i)).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /local bank/i })).toBeInTheDocument()
  })
})
