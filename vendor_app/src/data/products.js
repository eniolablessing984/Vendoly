import leatherWalletImage from '../assets/products/leather-wallet.jpg'
import ceramicMugImage from '../assets/products/ceramic-mug.jpg'
import cottonTshirtImage from '../assets/products/cotton-tshirt.jpg'
import wristwatchImage from '../assets/products/wristwatch.jpg'
import toteBagImage from '../assets/products/tote-bag.jpg'
import smartwatchImage from '../assets/products/smartwatch.jpg'

export const SAMPLE_PRODUCTS = [
  { id: '1', title: 'Handmade Leather Wallet', subtitle: 'Premium full-grain leather', category: 'Accessories', sellerId: 'seller-northwind', sellerName: 'Northwind Leather', stockQuantity: 8, price: '49.00', image: leatherWalletImage },
  { id: '2', title: 'Ceramic Coffee Mug', subtitle: '350ml, dishwasher safe', category: 'Home & Living', sellerId: 'seller-clay-kin', sellerName: 'Clay & Kin', stockQuantity: 14, price: '18.00', image: ceramicMugImage },
  { id: '3', title: 'Organic Cotton T-Shirt', subtitle: 'Comfy everyday tee', category: 'Fashion', sellerId: 'seller-common-thread', sellerName: 'Common Thread', stockQuantity: 5, price: '25.00', image: cottonTshirtImage },
  { id: '4', title: 'Minimalist Watch', subtitle: 'Quartz movement', category: 'Electronics', sellerId: 'seller-momentum', stockQuantity: 3, price: '129.00', image: wristwatchImage },
  { id: '5', title: 'Classic Travel Tote', subtitle: 'Durable everyday carry', category: 'Accessories', sellerId: 'seller-northwind', stockQuantity: 0, price: '69.00', image: toteBagImage },
  { id: '6', title: 'Bespoke Desk Mug', subtitle: 'Matte finish, ideal for gifting', category: 'Home & Living', sellerId: 'seller-clay-kin', stockQuantity: 6, price: '22.00', image: ceramicMugImage },
  { id: '7', title: 'Premium Street Tee', subtitle: 'Heavyweight cotton staple', category: 'Fashion', sellerId: 'seller-common-thread', sellerName: 'Common Thread', stockQuantity: 12, price: '32.00', image: cottonTshirtImage },
  { id: '8', title: 'Urban Smart Watch', subtitle: 'Sleek face with metal strap', category: 'Electronics', sellerId: 'seller-momentum', stockQuantity: 2, price: '149.00', image: smartwatchImage },
]

export function findProductById(id){
  return SAMPLE_PRODUCTS.find(product => product.id === String(id))
}
