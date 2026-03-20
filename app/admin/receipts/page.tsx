'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabase-client'
import type { Donation } from '@/types'

export default function ReceiptsPage() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'sent' | 'unsent'>('all')
  const [resending, setResending] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  useEffect(() => { fetchDonations() }, [filter])

  const fetchDonations = async () => {
    setLoading(true)
    const supabase = createSupabaseClient()
    let query = supabase.from('donations').select('*').eq('status', 'success').order('created_at', { ascending: false })
    if (filter === 'sent') query = query.eq('receipt_sent', true)
    if (filter === 'unsent') query = query.eq('receipt_sent', false)
    const { data } = await query
    setDonations((data as Donation[]) || [])
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
      if (data.success) { showToast('Receipt sent!'); fetchDonations() }
      else showToast('Failed: ' + data.error)
    } catch { showToast('Network error') }
    finally { setResending(null) }
  }

  return (
    <div className="p-8">
      {toast && <div className="fixed top-4 right-4 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg z-50 text-sm">{toast}</div>}

      <div className="mb-6">
        <h1 className="font-garamond text-3xl font-semibold text-gray-800">Receipt Management</h1>
        <p className="text-gray-500 text-sm">Manage and resend donation receipts</p>
      </div>

      <div className="flex gap-2 mb-6">
        {(['all', 'unsent', 'sent'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f ? 'bg-amber-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? <p className="p-8 text-center text-gray-400">Loading...</p> : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Name', 'Email', 'Amount', 'Purpose', 'Date', 'Receipt Status', 'Action'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {donations.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-gray-400">No donations found</td></tr>
              ) : donations.map(d => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{d.name}</td>
                  <td className="px-4 py-3 text-gray-600">{d.email}</td>
                  <td className="px-4 py-3 text-green-700 font-semibold">₹{d.amount.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 capitalize text-gray-600">{d.purpose}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(d.created_at).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <span className={d.receipt_sent ? 'badge-success' : 'badge-pending'}>
                      {d.receipt_sent ? '✓ Sent' : 'Not sent'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => resendReceipt(d.id)} disabled={resending === d.id}
                      className="text-xs text-amber-600 hover:underline disabled:opacity-50">
                      {resending === d.id ? 'Sending...' : d.receipt_sent ? 'Resend' : 'Send Now'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
