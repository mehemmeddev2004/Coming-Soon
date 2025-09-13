import Header from '@/components/Header'
import './globals.css'
import React from 'react'
import Footer from '@/components/Footer'
import { CartProvider } from '@/providers/CartProvider'


export const metadata = {
  title: 'My App',
  description: 'Next.js 13 App',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <CartProvider>
          <Header />

          <main>{children}</main>

          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
