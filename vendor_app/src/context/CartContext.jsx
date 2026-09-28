import  { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)

// Context hooks are exported alongside providers, so Fast Refresh needs this exception.
// eslint-disable-next-line react-refresh/only-export-components
export function useCart(){
  return useContext(CartContext)
}

export function CartProvider({ children }){
  const [cart, setCart] = useState(() => {
    try{
      const raw = localStorage.getItem('vendor_cart')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try{
      localStorage.setItem('vendor_cart', JSON.stringify(cart))
    }catch{
      // The in-memory cart remains available when browser storage is unavailable.
    }
  }, [cart])

  function addItem(product){
    setCart((c) => {
      const existing = c.find(it => it.id === product.id)
      if(existing){
        return c.map(it => it.id === product.id ? { ...it, qty: it.qty + 1 } : it)
      }
      return [...c, { ...product, qty: 1 }]
    })
  }

  function removeItem(productId){
    setCart((c) => c.filter(it => it.id !== productId))
  }

  function setQuantity(productId, qty){
    setCart((c) => {
      if (qty <= 0) return c.filter(it => it.id !== productId)
      return c.map(it => it.id === productId ? { ...it, qty } : it)
    })
  }

  function clearCart(){
    setCart([])
  }

  const value = { cart, addItem, removeItem, clearCart, setQuantity }

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  )
}

export default CartContext
