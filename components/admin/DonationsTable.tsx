'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabase-client'
import type { Donation } from '@/types'
import Link from 'next/link'

const PURPOSES = ['all', 'karma', 'bhakti', 'gyan', 'general']
const STATUSES = ['all', 'success', 'pending', 'failed']
const PAGE_SIZE = 25

export default function DonationsTable() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const [filters, setFilters] = useState({ purpose: 'all', status: 'all', search: '' })
  const [resending, setResending] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  useEffect(() => {
    fetchDonations()
  }, [page, filters])

  const fetchDonations = async () => {
    setLoading(true)
    const supabase = createSupabaseClient()
    let query = supabase.from('donations').select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

    if (filters.purpose !== 'all') query = query.eq('purpose', filters.purpose)
    if (filters.status !== 'all') query = query.eq('status', filters.status)
    if (filters.search) query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)

    const { data, count } = await query
    setDonations((data as Donation[]) || [])
    setTotal(count || 0)
    setLoading(false)
  }

  const resendReceipt = async (id: string) => {
    setResending(id)
    try {
      const res = await fetch('/api/admin/receipts/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ donationId: id }),
      })
      const data = await res.json()
      if (data.success) showToast('Receipt sent successfully!')
      else showToast('Failed to send receipt: ' + data.error)
    } catch { showToast('Network error') }
    finally { setResending(null) }
  }

  const exportCSV = () => {
    window.location.href = `/api/admin/export?status=${filters.status}&purpose=${filters.purpose}`
  }

  return (
    <div className="p-8">
      {toast && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg z-50 text-sm">{toast}</div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-garamond text-3xl font-semibold text-gray-800">Donations</h1>
          <p className="text-gray-500 text-sm">{total} total records</p>
        </div>
        <button onClick={exportCSV} className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
          📥 Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={filters.search}
          onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 min-w-40 focus:outline-none focus:border-amber-400"
        />
        <select value={filters.purpose} onChange={(e) => { setFilters(f => ({ ...f, purpose: e.target.value })); setPage(0) }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400">
          {PURPOSES.map(p => <option key={p} value={p}>{p === 'all' ? 'All Purposes' : p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
        </select>
        <select value={filters.status} onChange={(e) => { setFilters(f => ({ ...f, status: e.target.value })); setPage(0) }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400">
          {STATUSES.map(s => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Name', 'Email', 'Phone', 'Amount', 'Purpose', 'Status', 'Receipt', 'Date', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {donations.length === 0 ? (
                  <tr><td colSpan={9} className="px-4 py-12 text-center text-gray-400">No donations found</td></tr>
                ) : donations.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{d.name}</td>
                    <td className="px-4 py-3 text-gray-600">{d.email}</td>
                    <td className="px-4 py-3 text-gray-600">{d.phone}</td>
                    <td className="px-4 py-3 text-green-700 font-semibold">₹{d.amount.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 capitalize text-gray-600">{d.purpose}</td>
                    <td className="px-4 py-3"><span className={`badge-${d.status}`}>{d.status}</span></td>
                    <td className="px-4 py-3">
                      <span className={d.receipt_sent ? 'text-green-600' : 'text-gray-400'}>{d.receipt_sent ? '✓ Sent' : '—'}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{new Date(d.created_at).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link href={`/admin/donations/${d.id}`} className="text-xs text-blue-600 hover:underline">View</Link>
                        {d.status === 'success' && (
                          <button onClick={() => resendReceipt(d.id)} disabled={resending === d.id}
                            className="text-xs text-amber-600 hover:underline disabled:opacity-50">
                            {resending === d.id ? '...' : 'Resend'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {total > PAGE_SIZE && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} of {total}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                className="px-3 py-1.5 rounded border text-sm disabled:opacity-50 hover:bg-gray-50">← Prev</button>
              <button onClick={() => setPage(p => p + 1)} disabled={(page + 1) * PAGE_SIZE >= total}
                className="px-3 py-1.5 rounded border text-sm disabled:opacity-50 hover:bg-gray-50">Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
