'use client'

import { useState, useEffect, useRef } from 'react'
import { createSupabaseClient } from '@/lib/supabase-client'
import Image from 'next/image'
import type { ContentMap, SiteContent } from '@/types'

const TABS = [
  { id: 'home',       label: '🏠 Home' },
  { id: 'about',      label: '🕌 About' },
  { id: 'karma',      label: '⚙️ Karma' },
  { id: 'bhakti',     label: '🪔 Bhakti' },
  { id: 'gyan',       label: '📖 Gyaan' },
  { id: 'donate',     label: '💰 Donate' },
  { id: 'philosophy', label: '📿 Philosophy' },
  { id: 'haridas',    label: '🙏 Haridas' },
  { id: 'contact',    label: '📬 Contact' },
  { id: 'footer',     label: '🔗 Footer' },
  { id: 'social',     label: '📱 Social Links' },
]

const LONG_KEYS = ['body', 'mission', 'why_gita', 'why_krishna', 'who', 'journey', 'vision', 'message', 'support', 'intro', 'subheading']

export default function ContentEditorPage() {
  const [activeTab, setActiveTab] = useState('home')
  const [contentMap, setContentMap] = useState<ContentMap>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [editValues, setEditValues] = useState<Record<string, string>>({})

  // Haridas photo upload state
  const [photoUploading, setPhotoUploading] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => { fetchContent() }, [])

  const fetchContent = async () => {
    setLoading(true)
    const supabase = createSupabaseClient()
    const { data } = await supabase.from('site_content').select('*')
    const map: ContentMap = {}
    for (const row of (data as SiteContent[] || [])) {
      if (!map[row.page]) map[row.page] = {}
      if (!map[row.page][row.section]) map[row.page][row.section] = {}
      map[row.page][row.section][row.key] = row.value
    }
    setContentMap(map)
    // Set initial photo preview if exists
    const existingPhoto = map?.haridas?.profile?.photo_url
    if (existingPhoto) setPhotoPreview(existingPhoto)
    setLoading(false)
  }

  const getValue = (page: string, section: string, key: string): string => {
    const editKey = `${page}___${section}___${key}`
    return editValues[editKey] ?? contentMap?.[page]?.[section]?.[key] ?? ''
  }

  const setValue = (page: string, section: string, key: string, value: string) => {
    const editKey = `${page}___${section}___${key}`
    setEditValues(prev => ({ ...prev, [editKey]: value }))
  }

  const saveField = async (page: string, section: string, key: string) => {
    const saveKey = `${page}___${section}___${key}`
    const value = getValue(page, section, key)
    setSaving(saveKey)
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page, section, key, value }),
      })
      const data = await res.json()
      if (data.success) {
        showToast('Saved!')
        setContentMap(prev => ({
          ...prev,
          [page]: { ...prev[page], [section]: { ...prev[page]?.[section], [key]: value } }
        }))
        setEditValues(prev => { const n = { ...prev }; delete n[saveKey]; return n })
      } else {
        showToast('Save failed: ' + data.error, 'error')
      }
    } catch { showToast('Network error', 'error') }
    finally { setSaving(null) }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('bucket', 'haridas-profile')
      fd.append('path', 'profile')

      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      const url = data.url
      setPhotoPreview(url)

      // Save URL to site_content
      await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: 'haridas', section: 'profile', key: 'photo_url', value: url }),
      })
      showToast('Profile photo updated!')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Upload failed', 'error')
    } finally {
      setPhotoUploading(false)
      if (photoInputRef.current) photoInputRef.current.value = ''
    }
  }

  const renderField = (page: string, section: string, key: string, isLong = false) => {
    const fieldKey = `${page}___${section}___${key}`
    const value = getValue(page, section, key)
    const isDirty = editValues[fieldKey] !== undefined
    const isSaving = saving === fieldKey

    return (
      <div key={fieldKey} className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{key.replace(/_/g, ' ')}</label>
          <button
            onClick={() => saveField(page, section, key)}
            disabled={!isDirty || isSaving}
            className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors ${isDirty ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
          >
            {isSaving ? '⏳ Saving...' : isDirty ? '💾 Save' : '✓ Saved'}
          </button>
        </div>
        {isLong ? (
          <textarea
            value={value}
            onChange={(e) => setValue(page, section, key, e.target.value)}
            rows={5}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200 resize-y transition-colors"
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(page, section, key, e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200 transition-colors"
          />
        )}
      </div>
    )
  }

  const renderHaridasPhotoUpload = () => (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
      <h3 className="font-garamond text-lg font-semibold text-gray-800 mb-1">Profile Photo</h3>
      <p className="text-gray-500 text-xs mb-4">Upload or replace Hari Das's profile photo. Shown in the Haridas page hero section.</p>
      <div className="flex items-start gap-6 flex-wrap">
        {/* Preview */}
        <div className="flex-shrink-0">
          {photoPreview ? (
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-amber-300 shadow">
              <Image src={photoPreview} alt="Haridas profile" fill className="object-cover" />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-3xl font-garamond font-semibold select-none shadow">
              H
            </div>
          )}
          {photoPreview && (
            <p className="text-xs text-center text-gray-400 mt-1">Current photo</p>
          )}
        </div>
        {/* Upload */}
        <div className="flex-1 min-w-48">
          <input
            ref={photoInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handlePhotoUpload}
            className="hidden"
            id="haridas-photo-upload"
          />
          <label
            htmlFor="haridas-photo-upload"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all ${
              photoUploading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-krishna-blue text-white hover:opacity-90 hover:shadow-md'
            }`}
          >
            {photoUploading ? '⏳ Uploading...' : '📸 Upload New Photo'}
          </label>
          <p className="text-xs text-gray-400 mt-2">Max 5MB · JPEG, PNG, or WebP</p>
          {photoPreview && (
            <p className="text-xs text-green-600 mt-1 break-all">
              ✓ Photo saved to profile
            </p>
          )}
        </div>
      </div>
    </div>
  )

  const renderSection = (page: string) => {
    const sections = contentMap[page] || {}
    const hasContent = Object.keys(sections).length > 0

    if (!hasContent && !loading) {
      return (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <p className="text-gray-400 text-sm">No content fields found for this page.</p>
          <p className="text-gray-400 text-xs mt-1">Content for this page will appear here once it&apos;s been added to the database.</p>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        {page === 'haridas' && renderHaridasPhotoUpload()}
        {Object.entries(sections)
          .filter(([section]) => !(page === 'haridas' && section === 'profile'))
          .map(([section, keys]) => (
            <div key={section} className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-garamond text-lg font-semibold text-gray-800 mb-4 capitalize">{section.replace(/_/g, ' ')}</h3>
              {Object.keys(keys).map(key =>
                renderField(page, section, key, LONG_KEYS.some(lk => key.includes(lk)))
              )}
            </div>
          ))}
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      {toast && (
        <div className={`fixed top-4 right-4 px-5 py-3 rounded-lg shadow-xl z-50 text-sm text-white font-medium transition-all ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
          {toast.msg}
        </div>
      )}

      <div className="mb-6">
        <h1 className="font-garamond text-3xl font-semibold text-gray-800">Content Editor</h1>
        <p className="text-gray-500 text-sm mt-1">Edit all website content without touching code. Changes apply instantly.</p>
      </div>

      {/* Tabs — scrollable on mobile */}
      <div className="flex gap-2 flex-wrap mb-6">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-krishna-blue text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className="max-w-3xl">
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-50 rounded-xl p-5 animate-pulse">
                <div className="h-5 w-32 bg-gray-200 rounded mb-4" />
                <div className="space-y-3">
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                  <div className="h-10 bg-gray-200 rounded-lg" />
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                  <div className="h-24 bg-gray-200 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          renderSection(activeTab)
        )}
      </div>
    </div>
  )
}
