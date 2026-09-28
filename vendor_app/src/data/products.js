import walletImage from '../assets/download.jpg'
import mugImage from '../assets/download (1).jpg'
import shirtImage from '../assets/Panda 🐼.jpg'
import watchImage from '../assets/Dodge Challenger 4K Wallpaper_💨🔥.jpg'

export const SAMPLE_PRODUCTS = [
  { id: '1', title: 'Handmade Leather Wallet', subtitle: 'Premium full-grain leather', price: '49.00', image: walletImage },
  { id: '2', title: 'Ceramic Coffee Mug', subtitle: '350ml, dishwasher safe', price: '18.00', image: mugImage },
  { id: '3', title: 'Organic Cotton T-Shirt', subtitle: 'Comfy everyday tee', price: '25.00', image: shirtImage },
  { id: '4', title: 'Minimalist Watch', subtitle: 'Quartz movement', price: '129.00', image: watchImage },
  { id: '5', title: 'Classic Travel Tote', subtitle: 'Durable everyday carry', price: '69.00', image: walletImage },
  { id: '6', title: 'Bespoke Desk Mug', subtitle: 'Matte finish, ideal for gifting', price: '22.00', image: mugImage },
  { id: '7', title: 'Premium Street Tee', subtitle: 'Heavyweight cotton staple', price: '32.00', image: shirtImage },
  { id: '8', title: 'Urban Smart Watch', subtitle: 'Sleek face with metal strap', price: '149.00', image: watchImage },
]

export function findProductById(id){
  return SAMPLE_PRODUCTS.find(p => p.id === String(id));
}
