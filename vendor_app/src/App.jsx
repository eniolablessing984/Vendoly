import { useEffect, useState } from 'react'
import VendorRegistration from "./components/VendorRegistration";
import Layout from "./components/Layout";
import Homepage from "./pages/Homepage";
import ProductDetail from "./pages/ProductDetail";
import AdminProducts from "./pages/AdminProducts";
import AdminProductForm from "./pages/AdminProductForm";
import VendorDashboard from "./pages/VendorDashboard";
import SignIn from './pages/SignIn'
import AdminOrders from './pages/AdminOrders'
import { AuthProvider, RequireAuth } from './context/AuthContext'
import CartPage from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import Analytics from './pages/Analytics'
import NotFound from './pages/NotFound'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext'

function AppShell() {
  const { addItem } = useCart()
  const location = useLocation()
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 1800)
    return () => clearTimeout(timer)
  }, [toast])

  const handleAddToCart = (product, quantity = 1) => {
    addItem(product, quantity)
    setToast(`${quantity} ${quantity === 1 ? 'item' : 'items'} added to cart`)
  }

  return (
    <Layout>
        <Routes>
          <Route path="/" element={<Homepage onAddToCart={handleAddToCart} />} />
          <Route path="/product/:id" element={<ProductDetail onAddToCart={handleAddToCart} />} />
          <Route path="/vendor/register" element={<VendorRegistration />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/vendor/dashboard" element={<RequireAuth><VendorDashboard /></RequireAuth>} />
          <Route path="/vendor/products" element={<RequireAuth><AdminProducts /></RequireAuth>} />
          <Route path="/vendor/products/new" element={<RequireAuth><AdminProductForm key={location.pathname} /></RequireAuth>} />
          <Route path="/vendor/products/:id/edit" element={<RequireAuth><AdminProductForm key={location.pathname} /></RequireAuth>} />
          <Route path="/vendor/orders" element={<RequireAuth><AdminOrders /></RequireAuth>} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
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
