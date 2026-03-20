'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase-client'
import { useState } from 'react'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/donations', label: 'Donations', icon: '📛' },
  { href: '/admin/interests', label: 'Donation Interests', icon: '🙏' },
  { href: '/admin/contacts', label: 'Contact Forms', icon: '📬' },
  { href: '/admin/content', label: 'Content Editor', icon: '✏️' },
  { href: '/admin/receipts', label: 'Receipts', icon: '🧾' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    const supabase = createSupabaseClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="w-64 min-h-screen flex flex-col" style={{ background: '#0A1F44' }}>
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="block">
          <p className="font-garamond text-lg font-semibold text-amber-400">Voice of Dharma</p>
          <p className="text-gray-400 text-xs mt-0.5">Admin Dashboard</p>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`admin-sidebar-link ${
              pathname === item.href || pathname.startsWith(item.href + '/')
                ? 'active'
                : ''
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <Link
          href="/"
          className="admin-sidebar-link block mb-2"
          style={{ color: '#9CA3AF' }}
        >
          <span>🌐</span>
          <span>View Website</span>
        </Link>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="admin-sidebar-link w-full text-left text-red-400 hover:bg-red-900/20 hover:text-red-300"
        >
          <span>🚪</span>
          <span>{loggingOut ? 'Signing out...' : 'Sign Out'}</span>
        </button>
      </div>
    </aside>
  )
}
