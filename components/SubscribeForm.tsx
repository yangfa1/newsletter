'use client'
import { useState, useEffect } from 'react'

interface NewsletterType {
  id: string
  friendly_name: string
  folder_name: string
  description: string | null
}

export default function SubscribeForm() {
  const [newsletters, setNewsletters] = useState<NewsletterType[]>([])
  const [loadingTypes, setLoadingTypes] = useState(true)
  const [email, setEmail] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/newsletter-types')
      .then(r => r.json())
      .then(d => {
        setNewsletters(d.types || [])
        setSelected((d.types || []).map((t: NewsletterType) => t.folder_name))
        setLoadingTypes(false)
      })
      .catch(() => setLoadingTypes(false))
  }, [])

  const toggle = (slug: string) => {
    setSelected(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    if (selected.length === 0) {
      setMessage('Please select at least one newsletter.')
      setStatus('error')
      return
    }
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newsletters: selected }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('success')
        setMessage(data.message)
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong.')
      }
    } catch {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 text-left max-w-lg mx-auto border border-white/20">
      {status === 'success' ? (
        <div className="text-center py-4">
          <div className="text-4xl mb-3">✉️</div>
          <h3 className="text-xl font-semibold text-white mb-2">Check your inbox!</h3>
          <p className="text-blue-100 text-sm">{message}</p>
          <button onClick={() => setStatus('idle')} className="mt-4 text-gold-400 text-sm underline">
            Submit another request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Newsletters */}
          <div className="space-y-2">
            <p className="text-blue-100 text-sm font-medium">Select newsletters:</p>
            {loadingTypes ? (
              <p className="text-blue-200 text-sm">Loading newsletters...</p>
            ) : newsletters.length === 0 ? (
              <p className="text-blue-200 text-sm">No newsletters available.</p>
            ) : (
              newsletters.map(n => (
                <label key={n.folder_name} className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selected.includes(n.folder_name)}
                    onChange={() => toggle(n.folder_name)}
                    className="mt-1 w-4 h-4 rounded accent-gold-400 cursor-pointer"
                  />
                  <div>
                    <div className="text-white text-sm font-medium group-hover:text-gold-400 transition-colors">
                      {n.friendly_name}
                    </div>
                    {n.description && (
                      <div className="text-blue-200 text-xs">{n.description}</div>
                    )}
                  </div>
                </label>
              ))
            )}
          </div>

          {/* Email */}
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-gold-400 transition"
          />

          {status === 'error' && (
            <p className="text-red-300 text-sm">{message}</p>
          )}

          <button
            type="submit"
            disabled={status === 'loading' || loadingTypes}
            className="w-full bg-gold-500 hover:bg-gold-600 text-brand-950 font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {status === 'loading' ? 'Sending...' : "Subscribe — It's Free"}
          </button>

          <p className="text-blue-200 text-xs text-center">
            Already subscribed? Enter your email above to manage your preferences.
          </p>
        </form>
      )}
    </div>
  )
}
