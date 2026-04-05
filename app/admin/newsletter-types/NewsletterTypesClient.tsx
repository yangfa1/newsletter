'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface NewsletterType {
  id: string
  friendly_name: string
  folder_name: string
  description: string | null
  active: boolean
  created_at: string
}

export default function NewsletterTypesClient() {
  const [types, setTypes] = useState<NewsletterType[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ friendly_name: '', folder_name: '', description: '' })

  const load = () => {
    fetch('/api/admin/newsletter-types')
      .then(r => r.json())
      .then(d => { setTypes(d.types || []); setLoading(false) })
  }

  useEffect(() => { load() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const res = await fetch('/api/admin/newsletter-types', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (res.ok) {
      setForm({ friendly_name: '', folder_name: '', description: '' })
      setShowForm(false)
      load()
    } else {
      setError(data.error || 'Something went wrong.')
    }
    setSaving(false)
  }

  const toggleActive = async (id: string, active: boolean) => {
    await fetch(`/api/admin/newsletter-types/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !active }),
    })
    load()
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    await fetch(`/api/admin/newsletter-types/${id}`, { method: 'DELETE' })
    load()
  }

  // Auto-generate folder_name from friendly_name
  const handleNameChange = (val: string) => {
    setForm(f => ({
      ...f,
      friendly_name: val,
      folder_name: f.folder_name === '' || f.folder_name === toSlug(f.friendly_name)
        ? toSlug(val)
        : f.folder_name
    }))
  }

  const toSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-brand-950 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-700 rounded-lg flex items-center justify-center font-bold text-sm">WW</div>
          <span className="font-semibold">Newsletter Types</span>
        </div>
        <Link href="/admin" className="text-blue-300 hover:text-white text-sm">← Dashboard</Link>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* Header + Add button */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-brand-900">Newsletter Types</h1>
            <p className="text-gray-500 text-sm mt-1">Manage which newsletters appear on the subscribe form</p>
          </div>
          <button onClick={() => setShowForm(v => !v)} className="btn-primary text-sm">
            {showForm ? 'Cancel' : '+ Add Newsletter'}
          </button>
        </div>

        {/* Add form */}
        {showForm && (
          <form onSubmit={handleCreate} className="card space-y-4">
            <h2 className="font-semibold text-brand-900">New Newsletter Type</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Friendly Name *</label>
                <input
                  required
                  value={form.friendly_name}
                  onChange={e => handleNameChange(e.target.value)}
                  placeholder="Weekly Financial Report"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Folder Name * <span className="text-gray-400 font-normal">(GitHub folder)</span>
                </label>
                <input
                  required
                  value={form.folder_name}
                  onChange={e => setForm(f => ({ ...f, folder_name: e.target.value }))}
                  placeholder="weekly-financial-report"
                  pattern="[a-z0-9-]+"
                  className="input-field font-mono text-sm"
                />
                <p className="text-xs text-gray-400 mt-1">Lowercase, hyphens only. Must match the GitHub folder name exactly.</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Comprehensive market analysis every Monday morning"
                className="input-field"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? 'Saving...' : 'Create Newsletter Type'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Types table */}
        <div className="card p-0 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : types.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No newsletter types yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Folder Name</th>
                  <th className="px-6 py-3 text-left">Description</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {types.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{t.friendly_name}</td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-500 bg-gray-50">{t.folder_name}</td>
                    <td className="px-6 py-4 text-gray-500 text-xs max-w-xs truncate">{t.description || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        t.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {t.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3 text-xs">
                        <button
                          onClick={() => toggleActive(t.id, t.active)}
                          className="text-brand-700 hover:underline"
                        >
                          {t.active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDelete(t.id, t.friendly_name)}
                          className="text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* GitHub instructions */}
        <div className="card bg-blue-50 border-blue-100">
          <h3 className="font-semibold text-brand-900 mb-2">📁 GitHub Folder Setup</h3>
          <p className="text-sm text-gray-600 mb-3">
            When you add a new newsletter type, create a matching folder in the{' '}
            <a href="https://github.com/yangfa1/wisewin-newsletters" target="_blank" rel="noopener noreferrer"
              className="text-brand-700 underline">wisewin-newsletters</a> repo.
          </p>
          <div className="bg-white rounded-lg p-3 font-mono text-xs text-gray-700">
            {types.filter(t => t.active).map(t => (
              <div key={t.id}>wisewin-newsletters/<span className="text-brand-700">{t.folder_name}</span>/</div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
