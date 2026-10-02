import { useEffect, useState } from 'react'
import VendorRegistration from "./components/VendorRegistration";
import Layout from "./components/Layout";
import Homepage from "./pages/Homepage";
import ProductDetail from "./pages/ProductDetail";
import AdminProducts from "./pages/AdminProducts";
import AdminProductForm from "./pages/AdminProductForm";
import VendorDashboard from "./pages/VendorDashboard";
import SignIn from './pages/SignIn'
import LoginPage from './pages/Login'
import SignUpPage from './pages/SignUp'
import ForgotPasswordPage from './pages/ForgotPassword'
import ResetPasswordPage from './pages/ResetPassword'
import AdminLoginPage from './pages/AdminLogin'
import AdminDashboardPage from './pages/AdminDashboard'
import AdminOrders from './pages/AdminOrders'
import { AuthProvider, RequireAuth, useAuth } from './context/AuthContext'
import CartPage from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import Analytics from './pages/Analytics'
import NotFound from './pages/NotFound'
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext'

function AppShell() {
  const { addItem } = useCart()
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 1800)
    return () => clearTimeout(timer)
  }, [toast])

  const handleAddToCart = (product, quantity = 1) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: location.pathname, search: location.search } } })
      setToast('Please log in or sign up before continuing.')
      return
    }

    addItem(product, quantity)
    setToast(`${quantity} ${quantity === 1 ? 'item' : 'items'} added to cart`)
  }

  return (
    <Layout>
        <Routes>
          <Route path="/" element={<Homepage onAddToCart={handleAddToCart} />} />
          <Route path="/product/:id" element={<ProductDetail onAddToCart={handleAddToCart} />} />
          <Route path="/vendor/register" element={<VendorRegistration />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<RequireAuth role="admin" redirectTo="/admin/login"><AdminDashboardPage /></RequireAuth>} />
          <Route path="/vendor/dashboard" element={<RequireAuth><VendorDashboard /></RequireAuth>} />
          <Route path="/vendor/products" element={<RequireAuth><AdminProducts /></RequireAuth>} />
          <Route path="/vendor/products/new" element={<RequireAuth><AdminProductForm key={location.pathname} /></RequireAuth>} />
          <Route path="/vendor/products/:id/edit" element={<RequireAuth><AdminProductForm key={location.pathname} /></RequireAuth>} />
          <Route path="/vendor/orders" element={<RequireAuth><AdminOrders /></RequireAuth>} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/analytics" element={<RequireAuth><Analytics /></RequireAuth>} />
          <Route path="*" element={<NotFound />} />
        </Routes>

      {toast && (
        <div role="status" className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-xl sm:bottom-8">
          {toast}
        </div>
      )}
    </Layout>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppShell />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
