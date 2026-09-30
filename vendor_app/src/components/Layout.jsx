import Header from './Header'
import Footer from './Footer'

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f9faf8] text-[#17211f]">
      <Header />
      <main className="flex-1 py-7 sm:py-10">{children}</main>
      <Footer />
    </div>
  )
}
