import Header from '@/components/Header'
import './globals.css'
import React from 'react'
import Footer from '@/components/Footer'


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
   
        <Header />

        <main>{children}</main>

      
        <Footer />
      </body>
    </html>
  )
}
