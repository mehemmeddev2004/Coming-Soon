"use client";
import "./globals.css"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { CartProvider } from "@/providers/CartProvider"
import { usePathname } from "next/navigation"


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')
  
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {!isAdminRoute && <Header />}
          {children}
          {!isAdminRoute && <Footer />}
        </CartProvider>
      </body>
    </html>
  )
}
