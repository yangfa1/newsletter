import { Suspense } from 'react'
import VerifyClient from './VerifyClient'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function VerifyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center p-8">
        <Suspense fallback={<div>Processing...</div>}>
          <VerifyClient />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
