import { Suspense } from 'react'
import ManageClient from './ManageClient'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ManagePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center p-8">
        <Suspense fallback={<div className="text-gray-400">Loading...</div>}>
          <ManageClient />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
