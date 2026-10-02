import { render, screen } from '@testing-library/react'
import App from '../App'

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
})
