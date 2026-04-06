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

const PLATFORMS: Record<string, { label: string; icon: string; placeholder: string }> = {
  facebook:  { label: 'Facebook',  icon: '📘', placeholder: 'https://facebook.com/...' },
  instagram: { label: 'Instagram', icon: '📸', placeholder: 'https://instagram.com/...' },
  youtube:   { label: 'YouTube',   icon: '▶️', placeholder: 'https://youtube.com/...' },
  whatsapp:  { label: 'WhatsApp',  icon: '💬', placeholder: 'https://whatsapp.com/...' },
  twitter:   { label: 'X / Twitter', icon: '🐦', placeholder: 'https://x.com/...' },
  linkedin:  { label: 'LinkedIn',  icon: '💼', placeholder: 'https://linkedin.com/...' },
  telegram:  { label: 'Telegram',  icon: '✈️', placeholder: 'https://t.me/...' },
  custom:    { label: 'Custom',    icon: '🔗', placeholder: 'https://...' },
}

const LONG_KEYS = ['body', 'mission', 'why_gita', 'why_krishna', 'who', 'journey', 'vision', 'message', 'support', 'intro', 'subheading']

export default function ContentEditorPage() {
  const [activeTab, setActiveTab] = useState('home')
  const [contentMap, setContentMap] = useState<ContentMap>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [editValues, setEditValues] = useState<Record<string, string>>({})

  // Social link add form state
  const [addPlatform, setAddPlatform] = useState('facebook')
  const [addUrl, setAddUrl] = useState('')
  const [addLabel, setAddLabel] = useState('')
  const [addingLink, setAddingLink] = useState(false)
  const [deletingKey, setDeletingKey] = useState<string | null>(null)
  const [editingLink, setEditingLink] = useState<string | null>(null)

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

  // ─── Social Links CRUD ────────────────────────────────────────────────────

  const socialLinks = Object.entries(contentMap?.social?.links || {}).map(([key, value]) => ({
    key,
    url: value,
    platform: PLATFORMS[key] ? key : 'custom',
    label: PLATFORMS[key]?.label || key,
    icon: PLATFORMS[key]?.icon || '🔗',
  }))

  const addSocialLink = async () => {
    if (!addUrl.trim()) return
    const key = addPlatform === 'custom' ? (addLabel.trim().toLowerCase().replace(/\s+/g, '_') || `link_${Date.now()}`) : addPlatform
    setAddingLink(true)
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: 'social', section: 'links', key, value: addUrl.trim() }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      setContentMap(prev => ({
        ...prev,
        social: { ...prev.social, links: { ...(prev.social?.links || {}), [key]: addUrl.trim() } }
      }))
      setAddUrl('')
      setAddLabel('')
      setAddPlatform('facebook')
      showToast('Link added!')
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Failed to add link', 'error')
    } finally {
      setAddingLink(false)
    }
  }

  const deleteSocialLink = async (key: string) => {
    if (!confirm(`Delete the ${key} link? This cannot be undone.`)) return
    setDeletingKey(key)
    try {
      const res = await fetch('/api/admin/content/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: 'social', section: 'links', key }),
      })
      if (!res.ok) throw new Error('Delete failed')
      setContentMap(prev => {
        const links = { ...prev.social?.links }
        delete links[key]
        return { ...prev, social: { ...prev.social, links } }
      })
      showToast('Link deleted')
    } catch {
      showToast('Failed to delete link', 'error')
    } finally {
      setDeletingKey(null)
    }
  }

  const saveSocialLink = async (key: string) => {
    const editKey = `social___links___${key}`
    const value = editValues[editKey]
    if (!value) return
    setSaving(editKey)
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: 'social', section: 'links', key, value }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      setContentMap(prev => ({
        ...prev,
        social: { ...prev.social, links: { ...(prev.social?.links || {}), [key]: value } }
      }))
      setEditValues(prev => { const n = { ...prev }; delete n[editKey]; return n })
      setEditingLink(null)
      showToast('Link updated!')
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Failed to save', 'error')
    } finally {
      setSaving(null)
    }
  }

  const renderSocialTab = () => (
    <div className="space-y-6">
      {/* Existing links */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-garamond text-lg font-semibold text-gray-800">Active Social Links</h3>
          <span className="text-xs text-gray-400">{socialLinks.length} links</span>
        </div>
        {socialLinks.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No social links yet. Add one below.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {socialLinks.map(link => {
              const editKey = `social___links___${link.key}`
              const isDirty = editValues[editKey] !== undefined
              const isSaving = saving === editKey
              const isEditing = editingLink === link.key

              return (
                <div key={link.key} className="px-5 py-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{link.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-700">{link.label}</p>
                      {!isEditing && (
                        <p className="text-xs text-gray-400 truncate">{link.url}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => setEditingLink(isEditing ? null : link.key)}
                        className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        {isEditing ? 'Cancel' : '✏️ Edit'}
                      </button>
                      <button
                        onClick={() => deleteSocialLink(link.key)}
                        disabled={deletingKey === link.key}
                        className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        {deletingKey === link.key ? '⏳' : '🗑'}
                      </button>
                    </div>
                  </div>
                  {isEditing && (
                    <div className="flex gap-2 mt-2">
                      <input
                        type="url"
                        value={isDirty ? editValues[editKey] : link.url}
                        onChange={e => setValue('social', 'links', link.key, e.target.value)}
                        placeholder={PLATFORMS[link.platform]?.placeholder || 'https://...'}
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200"
                      />
                      <button
                        onClick={() => saveSocialLink(link.key)}
                        disabled={!isDirty || isSaving}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDirty ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                      >
                        {isSaving ? '⏳' : '💾 Save'}
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Add new link */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <h3 className="font-garamond text-lg font-semibold text-gray-800 mb-1">Add New Social Link</h3>
        <p className="text-gray-500 text-xs mb-4">Add a new platform link to your website footer and social sections.</p>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Platform</label>
              <select
                value={addPlatform}
                onChange={e => { setAddPlatform(e.target.value); setAddLabel('') }}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 bg-white"
              >
                {Object.entries(PLATFORMS).map(([key, p]) => (
                  <option key={key} value={key}>{p.icon} {p.label}</option>
                ))}
              </select>
            </div>
            {addPlatform === 'custom' && (
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Custom Label</label>
                <input
                  type="text"
                  value={addLabel}
                  onChange={e => setAddLabel(e.target.value)}
                  placeholder="e.g. Pinterest, TikTok..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
            )}
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">URL</label>
            <input
              type="url"
              value={addUrl}
              onChange={e => setAddUrl(e.target.value)}
              placeholder={PLATFORMS[addPlatform]?.placeholder || 'https://...'}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
            />
          </div>
          <button
            onClick={addSocialLink}
            disabled={addingLink || !addUrl.trim()}
            className="px-5 py-2 rounded-lg bg-krishna-blue text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {addingLink ? '⏳ Adding...' : '+ Add Link'}
          </button>
        </div>
      </div>
    </div>
  )

  // ─── Haridas Photo Upload ─────────────────────────────────────────────────

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

  const renderHaridasPhotoUpload = () => (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
      <h3 className="font-garamond text-lg font-semibold text-gray-800 mb-1">Profile Photo</h3>
      <p className="text-gray-500 text-xs mb-4">Upload or replace Hari Das&apos;s profile photo.</p>
      <div className="flex items-start gap-6 flex-wrap">
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
          {photoPreview && <p className="text-xs text-center text-gray-400 mt-1">Current photo</p>}
        </div>
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
              photoUploading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-krishna-blue text-white hover:opacity-90 hover:shadow-md'
            }`}
          >
            {photoUploading ? '⏳ Uploading...' : '📸 Upload New Photo'}
          </label>
          <p className="text-xs text-gray-400 mt-2">Max 5MB · JPEG, PNG, or WebP</p>
        </div>
      </div>
    </div>
  )

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

  const renderSection = (page: string) => {
    if (page === 'social') return renderSocialTab()

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

      {/* Tabs */}
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
