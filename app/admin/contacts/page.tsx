'use client'

import { useState, useEffect, useMemo } from 'react'
import { createSupabaseClient } from '@/lib/supabase-client'
import type { ContactSubmission } from '@/types'

export default function ContactsPage() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unreplied' | 'replied'>('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<ContactSubmission | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => { fetchContacts() }, [filter])

  const fetchContacts = async () => {
    setLoading(true)
    const supabase = createSupabaseClient()
    let query = supabase.from('contact_submissions').select('*').order('created_at', { ascending: false })
    if (filter === 'unreplied') query = query.eq('replied', false)
    if (filter === 'replied') query = query.eq('replied', true)
    const { data } = await query
    setContacts((data as ContactSubmission[]) || [])
    setLoading(false)
  }

  const markReplied = async (id: string, replied: boolean) => {
    const supabase = createSupabaseClient()
    await supabase.from('contact_submissions').update({ replied }).eq('id', id)
    setContacts(prev => prev.map(c => c.id === id ? { ...c, replied } : c))
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, replied } : prev)
    showToast(replied ? '✓ Marked as replied' : '↩ Marked as unreplied')
  }

  const deleteContact = async (id: string) => {
    if (!confirm('Delete this contact submission? This cannot be undone.')) return
    setDeleting(id)
    try {
      const res = await fetch('/api/admin/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table: 'contact_submissions', id }),
      })
      if (!res.ok) throw new Error('Delete failed')
      setContacts(prev => prev.filter(c => c.id !== id))
      if (selected?.id === id) setSelected(null)
      showToast('Deleted successfully')
    } catch {
      showToast('Failed to delete. Please try again.', false)
    } finally {
      setDeleting(null)
    }
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return contacts
    const q = search.toLowerCase()
    return contacts.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone || '').includes(q)
    )
  }, [contacts, search])

  const unrepliedCount = contacts.filter(c => !c.replied).length

  return (
    <div className="p-6 lg:p-8">
      {toast && (
        <div className={`fixed top-4 right-4 px-5 py-3 rounded-lg shadow-xl z-50 text-sm text-white font-medium ${toast.ok ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.msg}
        </div>
      )}

      <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-garamond text-3xl font-semibold text-gray-800">Contact Forms</h1>
          <p className="text-gray-500 text-sm mt-1">
            {contacts.length} total
            {unrepliedCount > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                {unrepliedCount} pending
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name, email or phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-48 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200"
        />
        <div className="flex gap-2">
          {(['all', 'unreplied', 'replied'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f ? 'bg-amber-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="divide-y divide-gray-100">
              {[1,2,3,4].map(i => (
                <div key={i} className="p-4 animate-pulse">
                  <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                  <div className="h-3 w-48 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="p-8 text-center text-gray-400 text-sm">No contact forms found</p>
          ) : (
            <div className="divide-y divide-gray-100 max-h-[70vh] overflow-y-auto">
              {filtered.map(c => (
                <div key={c.id} onClick={() => setSelected(c)}
                  className={`p-4 cursor-pointer hover:bg-amber-50 transition-colors ${selected?.id === c.id ? 'bg-amber-50 border-l-2 border-amber-400' : ''}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800 text-sm truncate">{c.name}</p>
                      <p className="text-gray-500 text-xs truncate">{c.email}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.replied ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {c.replied ? 'Replied' : 'Pending'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    {c.message && <p className="text-gray-400 text-xs truncate flex-1">{c.message}</p>}
                    <p className="text-gray-300 text-xs flex-shrink-0 ml-2">
                      {new Date(c.created_at).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <div className="flex items-start justify-between mb-5">
                <h2 className="font-garamond text-2xl font-semibold text-gray-800">{selected.name}</h2>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${selected.replied ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {selected.replied ? '✓ Replied' : '⏳ Pending'}
                </span>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                <a href={`mailto:${selected.email}?subject=Re: Your message to Voice of Dharma`}
                  className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors">
                  <span className="text-lg">✉️</span>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Email</p>
                    <p className="text-sm text-blue-600 hover:underline truncate">{selected.email}</p>
                  </div>
                </a>
                <a href={`tel:${selected.phone}`}
                  className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 hover:bg-green-50 transition-colors">
                  <span className="text-lg">📞</span>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Phone</p>
                    <p className="text-sm text-green-600">{selected.phone}</p>
                  </div>
                </a>
              </div>

              {/* Message */}
              {selected.message ? (
                <div className="bg-gray-50 rounded-xl p-4 mb-5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Message</p>
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-4 mb-5 text-center text-gray-400 text-sm italic">No message provided</div>
              )}

              {/* Meta */}
              <p className="text-xs text-gray-400 mb-5">
                Submitted on {new Date(selected.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
              </p>

              {/* Actions */}
              <div className="flex gap-3 flex-wrap">
                <a href={`mailto:${selected.email}?subject=Re: Your message to Voice of Dharma`}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-krishna-blue text-white text-sm font-medium hover:opacity-90 transition-opacity">
                  ✉️ Reply via Email
                </a>
                {selected.phone && (
                  <a href={`https://wa.me/91${selected.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:opacity-90 transition-opacity">
                    💬 WhatsApp
                  </a>
                )}
                <button onClick={() => markReplied(selected.id, !selected.replied)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors">
                  {selected.replied ? '↩ Mark Unreplied' : '✓ Mark Replied'}
                </button>
                <button onClick={() => deleteContact(selected.id)} disabled={deleting === selected.id}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50">
                  🗑 {deleting === selected.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="text-4xl mb-3">📬</div>
              <p className="text-gray-400 text-sm">Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
