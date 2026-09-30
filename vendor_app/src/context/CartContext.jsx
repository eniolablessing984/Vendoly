import  { createContext, useContext, useEffect, useState } from 'react'
import { getAvailableQuantity } from '../data/marketplaceFormat'
import * as productService from '../data/productService'

const CartContext = createContext(null)

// Context hooks are exported alongside providers, so Fast Refresh needs this exception.
// eslint-disable-next-line react-refresh/only-export-components
export function useCart(){
  return useContext(CartContext)
}

export function CartProvider({ children }){
  const [storageAvailable, setStorageAvailable] = useState(() => {
    try {
      localStorage.getItem('vendor_cart')
      return true
    } catch {
      return false
    }
  })
  const [cart, setCart] = useState(() => {
    try{
      const raw = localStorage.getItem('vendor_cart')
      const savedCart = raw ? JSON.parse(raw) : []
      return Array.isArray(savedCart) ? savedCart.filter(item => item && item.id).map(item => ({ ...item, qty: Math.max(1, Math.floor(Number(item.qty) || 1)) })) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try{
      localStorage.setItem('vendor_cart', JSON.stringify(cart))
      setStorageAvailable(true)
    }catch{
      setStorageAvailable(false)
    }
  }, [cart])

  function addItem(product, quantity = 1){
    const requestedQuantity = Math.max(1, Math.floor(Number(quantity) || 1))
    setCart(current => {
      const existing = current.find(item => item.id === product.id)
      const currentQuantity = existing?.qty || 0
      const stock = getAvailableQuantity(product)
      if (currentQuantity >= stock) return current
      const nextQuantity = Math.min(currentQuantity + requestedQuantity, stock)
      if (existing) {
        return current.map(item => item.id === product.id ? { ...item, ...product, qty: nextQuantity } : item)
      }
      return [...current, { ...product, qty: nextQuantity }]
    })
  }

  function removeItem(productId){
    setCart((c) => c.filter(it => it.id !== productId))
  }

  function setQuantity(productId, qty){
    setCart((c) => {
      if (qty <= 0) return c.filter(it => it.id !== productId)
      const product = c.find(it => it.id === productId)
      const currentProduct = productService.getById(productId)
      const stockSource = currentProduct || product
      if (currentProduct && getAvailableQuantity(currentProduct) === 0) return c.filter(it => it.id !== productId)
      return c.map(it => it.id === productId ? { ...it, ...(currentProduct || {}), qty: Math.min(Math.floor(Number(qty) || 1), getAvailableQuantity(stockSource)) } : it)
    })
  }

  function clearCart(){
    setCart([])
  }

  const value = { cart, addItem, removeItem, clearCart, setQuantity, storageAvailable }

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  )
}

export default CartContext
