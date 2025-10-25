"use client";
import "./globals.css"
import "react-toastify/dist/ReactToastify.css"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { CartProvider } from '@/providers/CartProvider'
import QueryProvider from '@/providers/QueryProvider'
import { ToastContainer } from 'react-toastify'
import { usePathname } from "next/navigation"


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')
  const isShopRoute = pathname?.startsWith('/shop')
  
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <CartProvider>
            {!isAdminRoute && <Header />}
            {children}
            {!isAdminRoute && <Footer />}

            <ToastContainer />
          </CartProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
