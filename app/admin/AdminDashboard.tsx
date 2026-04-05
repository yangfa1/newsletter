'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Stats { total: number; active: number; pending: number; inactive: number }
interface Subscriber { id: string; email: string; status: string; newsletters: string[]; created_at: string; verified_at: string | null }

export default function AdminDashboard({ email }: { email: string }) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats').then(r => r.json()).then(d => setStats(d.stats))
  }, [])

  useEffect(() => {
    setLoading(true)
    fetch(`/api/admin/subscribers?status=${filter}&page=${page}`)
      .then(r => r.json())
      .then(d => { setSubscribers(d.subscribers); setTotal(d.total); setLoading(false) })
  }, [filter, page])

  const statusColor = (s: string) => ({
    active: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    inactive: 'bg-gray-100 text-gray-500',
  }[s] || 'bg-gray-100 text-gray-500')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-brand-950 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-700 rounded-lg flex items-center justify-center font-bold text-sm">WW</div>
          <span className="font-semibold">Admin Panel</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-blue-200">{email}</span>
          <Link href="/admin/newsletter-types" className="text-blue-300 hover:text-white">Newsletters</Link>
          <Link href="/" className="text-blue-300 hover:text-white">← Site</Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total', value: stats.total, color: 'brand' },
              { label: 'Active', value: stats.active, color: 'green' },
              { label: 'Pending', value: stats.pending, color: 'yellow' },
              { label: 'Inactive', value: stats.inactive, color: 'gray' },
            ].map(s => (
              <div key={s.label} className="card text-center">
                <div className="text-3xl font-bold text-brand-800">{s.value}</div>
                <div className="text-gray-500 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Subscribers */}
        <div className="card p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-semibold text-brand-900">Subscribers</h2>
            <div className="flex gap-2 text-sm">
              {['all', 'active', 'pending', 'inactive'].map(f => (
                <button key={f} onClick={() => { setFilter(f); setPage(1) }}
                  className={`px-3 py-1 rounded-full capitalize transition-colors ${
                    filter === f ? 'bg-brand-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : subscribers.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No subscribers found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-3 text-left">Email</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Newsletters</th>
                    <th className="px-6 py-3 text-left">Subscribed</th>
                    <th className="px-6 py-3 text-left">Verified</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {subscribers.map(s => (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3 font-medium text-gray-900">{s.email}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(s.status)}`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-gray-500 text-xs">
                        {(s.newsletters || []).map((n: string) => (
                          <span key={n} className="inline-block bg-blue-50 text-blue-700 rounded px-1.5 py-0.5 mr-1 mb-1">{n}</span>
                        ))}
                      </td>
                      <td className="px-6 py-3 text-gray-500">{new Date(s.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-3 text-gray-500">{s.verified_at ? new Date(s.verified_at).toLocaleDateString() : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {total > 20 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
              <span>{total} total</span>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-3 py-1 rounded border disabled:opacity-40">← Prev</button>
                <span className="px-3 py-1">Page {page}</span>
                <button onClick={() => setPage(p => p + 1)} disabled={page * 20 >= total}
                  className="px-3 py-1 rounded border disabled:opacity-40">Next →</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
