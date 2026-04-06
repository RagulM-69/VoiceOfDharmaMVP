'use client'

import { useState, useEffect, useMemo } from 'react'
import { createSupabaseClient } from '@/lib/supabase-client'

interface DonationInterest {
  id: string
  name: string
  email: string
  phone: string
  amount: number
  purpose: string
  message: string | null
  created_at: string
}

export default function DonationInterestsPage() {
  const [interests, setInterests] = useState<DonationInterest[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [purposeFilter, setPurposeFilter] = useState('all')
  const [deleting, setDeleting] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => { fetchInterests() }, [])

  const fetchInterests = async () => {
    setLoading(true)
    const supabase = createSupabaseClient()
    const { data } = await supabase
      .from('donation_interests')
      .select('*')
      .order('created_at', { ascending: false })
    setInterests((data as DonationInterest[]) || [])
    setLoading(false)
  }

  const deleteInterest = async (id: string) => {
    if (!confirm('Delete this donation interest record? This cannot be undone.')) return
    setDeleting(id)
    try {
      const res = await fetch('/api/admin/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table: 'donation_interests', id }),
      })
      if (!res.ok) throw new Error('Delete failed')
      setInterests(prev => prev.filter(i => i.id !== id))
      showToast('Deleted successfully')
    } catch {
      showToast('Failed to delete. Please try again.', false)
    } finally {
      setDeleting(null)
    }
  }

  const filtered = useMemo(() => {
    let result = interests
    if (purposeFilter !== 'all') result = result.filter(i => i.purpose === purposeFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.email.toLowerCase().includes(q) ||
        i.phone.includes(q)
      )
    }
    return result
  }, [interests, search, purposeFilter])

  const totalAmount = filtered.reduce((sum, i) => sum + (i.amount || 0), 0)

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Amount', 'Purpose', 'Message', 'Date']
    const rows = filtered.map(i => [
      i.name, i.email, i.phone, i.amount, i.purpose,
      (i.message || '').replace(/,/g, ';'),
      new Date(i.created_at).toLocaleString('en-IN')
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `donation-interests-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 lg:p-8">
      {toast && (
        <div className={`fixed top-4 right-4 px-5 py-3 rounded-lg shadow-xl z-50 text-sm text-white font-medium ${toast.ok ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.msg}
        </div>
      )}

      <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-garamond text-3xl font-semibold text-gray-800">Donation Interests</h1>
          <p className="text-gray-500 text-sm mt-1">
            People who intended to donate before payment went live.
            {filtered.length > 0 && (
              <span className="ml-2 font-medium text-amber-600">
                {filtered.length} records · ₹{totalAmount.toLocaleString('en-IN')} intended
              </span>
            )}
          </p>
        </div>
        <button onClick={exportCSV}
          className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
          📥 Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search by name, email or phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-48 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
        />
        <select value={purposeFilter} onChange={e => setPurposeFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400">
          <option value="all">All Causes</option>
          <option value="karma">Karma Yog</option>
          <option value="bhakti">Bhakti Yog</option>
          <option value="gyan">Gyaan Yog</option>
          <option value="general">General Fund</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 animate-pulse">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-4xl mb-3">🙏</div>
            <p className="text-gray-400 text-sm">No donation interests recorded yet.</p>
            <p className="text-gray-300 text-xs mt-1">They will appear here when someone fills the donation form.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Name', 'Email', 'Phone', 'Amount', 'Cause', 'Message', 'Date', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(i => (
                  <tr key={i.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{i.name}</td>
                    <td className="px-4 py-3 text-gray-600">
                      <a href={`mailto:${i.email}`} className="hover:text-amber-600">{i.email}</a>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <a href={`tel:${i.phone}`} className="hover:text-green-600">{i.phone}</a>
                    </td>
                    <td className="px-4 py-3 text-green-700 font-semibold">₹{i.amount.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 capitalize">
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                        {i.purpose}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{i.message || '—'}</td>
                    <td className="px-4 py-3 text-gray-400 whitespace-nowrap text-xs">
                      {new Date(i.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => deleteInterest(i.id)}
                        disabled={deleting === i.id}
                        className="px-3 py-1 rounded-lg border border-red-200 text-red-600 text-xs font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        {deleting === i.id ? '⏳' : '🗑 Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
