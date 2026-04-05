import { redirect } from 'next/navigation'
import { verifyAdminSession } from '@/lib/auth'
import NewsletterTypesClient from './NewsletterTypesClient'

export default async function NewsletterTypesPage() {
  const session = await verifyAdminSession()
  if (!session) redirect('/admin/login')
  return <NewsletterTypesClient />
}
