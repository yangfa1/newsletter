'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface NewsletterType {
  id: string
  friendly_name: string
  folder_name: string
  description: string | null
}

export default function ManageClient() {
  const params = useSearchParams()
  const token = params.get('token')

  const [email, setEmail] = useState('')
  const [allNewsletters, setAllNewsletters] = useState<NewsletterType[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error' | 'unsubscribed' | 'invalid'>('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) { setStatus('invalid'); setLoading(false); return }

    // Load subscriber preferences + available newsletters in parallel
    Promise.all([
      fetch(`/api/manage?token=${token}`).then(r => r.json()),
      fetch('/api/newsletter-types').then(r => r.json())
    ]).then(([sub, types]) => {
      if (sub.error) { setStatus('invalid'); setLoading(false); return }
      setEmail(sub.email)
      setSelected(sub.newsletters || [])
      setAllNewsletters(types.types || [])
      setLoading(false)
    }).catch(() => { setStatus('invalid'); setLoading(false) })
  }, [token])

  const toggle = (slug: string) => {
    setSelected(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    )
  }

  const handleSave = async () => {
    if (selected.length === 0) { setMessage('Please select at least one newsletter.'); setStatus('error'); return }
    setStatus('saving')
    const res = await fetch(`/api/manage?token=${token}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newsletters: selected }),
    })
    const data = await res.json()
    if (res.ok) { setStatus('success'); setMessage(data.message) }
    else { setStatus('error'); setMessage(data.error || 'Something went wrong.') }
  }

  const handleUnsubscribeAll = async () => {
    if (!confirm('Unsubscribe from all newsletters?')) return
    setStatus('saving')
    const res = await fetch(`/api/manage?token=${token}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ unsubscribeAll: true }),
    })
    const data = await res.json()
    if (res.ok) { setStatus('unsubscribed'); setMessage(data.message) }
    else { setStatus('error'); setMessage(data.error || 'Something went wrong.') }
  }

  if (loading) return (
    <div className="text-center"><p className="text-gray-400">Loading your preferences...</p></div>
  )

  if (status === 'invalid') return (
    <div className="card text-center max-w-sm w-full">
      <div className="text-4xl mb-3">⚠️</div>
      <h2 className="text-xl font-bold text-red-700 mb-2">Invalid or expired link</h2>
      <p className="text-gray-500 text-sm mb-4">This link has expired or is invalid. Please re-enter your email on the homepage.</p>
      <Link href="/" className="btn-primary inline-block">Back to Homepage</Link>
    </div>
  )

  if (status === 'unsubscribed') return (
    <div className="card text-center max-w-sm w-full">
      <div className="text-4xl mb-3">👋</div>
      <h2 className="text-xl font-bold text-brand-900 mb-2">Unsubscribed</h2>
      <p className="text-gray-500 text-sm mb-4">You've been removed from all newsletters. You can resubscribe anytime.</p>
      <Link href="/" className="btn-primary inline-block">Back to Homepage</Link>
    </div>
  )

  if (status === 'success') return (
    <div className="card text-center max-w-sm w-full">
      <div className="text-4xl mb-3">✅</div>
      <h2 className="text-xl font-bold text-brand-900 mb-2">Preferences Updated!</h2>
      <p className="text-gray-500 text-sm mb-4">{message}</p>
      <Link href="/" className="btn-primary inline-block">Back to Homepage</Link>
    </div>
  )

  return (
    <div className="card max-w-md w-full">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-brand-900 mb-1">Manage Your Subscriptions</h1>
        <p className="text-gray-500 text-sm">{email}</p>
      </div>

      <div className="space-y-3 mb-6">
        <p className="text-sm font-medium text-gray-700">Your newsletters:</p>
        {allNewsletters.map(n => (
          <label key={n.folder_name} className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={selected.includes(n.folder_name)}
              onChange={() => toggle(n.folder_name)}
              className="mt-1 w-4 h-4 rounded accent-brand-700 cursor-pointer"
            />
            <div>
              <div className="text-gray-900 text-sm font-medium group-hover:text-brand-700 transition-colors">
                {n.friendly_name}
              </div>
              {n.description && (
                <div className="text-gray-400 text-xs">{n.description}</div>
              )}
            </div>
          </label>
        ))}
      </div>

      {status === 'error' && (
        <p className="text-red-500 text-sm mb-4">{message}</p>
      )}

      <div className="space-y-3">
        <button
          onClick={handleSave}
          disabled={status === 'saving'}
          className="btn-primary w-full"
        >
          {status === 'saving' ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          onClick={handleUnsubscribeAll}
          disabled={status === 'saving'}
          className="w-full border border-red-300 text-red-500 hover:bg-red-50 font-medium py-2.5 rounded-lg transition-colors text-sm disabled:opacity-50"
        >
          Unsubscribe from All
        </button>
      </div>
    </div>
  )
}
