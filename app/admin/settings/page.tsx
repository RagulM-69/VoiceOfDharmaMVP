'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabase-client'
import type { AdminUser } from '@/types'

export default function SettingsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<{ email: string; id: string } | null>(null)

  useEffect(() => {
    const load = async () => {
      const supabase = createSupabaseClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setCurrentUser({ email: user.email || '', id: user.id })

      const { data } = await supabase.from('admin_users').select('*').order('created_at', { ascending: false })
      setAdmins((data as AdminUser[]) || [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="font-garamond text-3xl font-semibold text-gray-800">Settings</h1>
        <p className="text-gray-500 text-sm">Manage admin users and site configuration</p>
      </div>

      {/* Admin users */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-garamond text-lg font-semibold text-gray-800">Admin Users</h2>
        </div>
        {loading ? <p className="p-6 text-gray-400">Loading...</p> : (
          <div className="divide-y divide-gray-100">
            {admins.map(admin => (
              <div key={admin.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{admin.full_name || admin.email}</p>
                  <p className="text-gray-500 text-xs">{admin.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge-${admin.role === 'superadmin' ? 'success' : 'pending'}`}>{admin.role}</span>
                  {admin.id === currentUser?.id && <span className="text-xs text-gray-400">(You)</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add admin instructions */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
        <h3 className="font-garamond text-lg font-semibold text-amber-900 mb-3">Invite a New Admin</h3>
        <ol className="space-y-2 text-sm text-amber-800 list-decimal list-inside">
          <li>Go to Supabase Dashboard → Authentication → Users → Invite user</li>
          <li>Enter the admin&apos;s real email address and send the invite</li>
          <li>They receive a confirmation email and set their password</li>
          <li>Run this SQL to grant admin access:</li>
        </ol>
        <pre className="mt-3 bg-amber-100 rounded-lg p-3 text-xs text-amber-900 overflow-x-auto">{`INSERT INTO admin_users (id, email, full_name, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'new@email.com'),
  'new@email.com',
  'Admin Name',
  'admin'
);`}</pre>
      </div>

      {/* Change password */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-garamond text-lg font-semibold text-gray-800 mb-3">Change Password</h3>
        <p className="text-gray-600 text-sm mb-4">Password changes are handled via Supabase Auth. Click the button below to receive a password reset email.</p>
        <button
          onClick={async () => {
            const supabase = createSupabaseClient()
            if (currentUser?.email) {
              await supabase.auth.resetPasswordForEmail(currentUser.email)
              alert('Password reset email sent to ' + currentUser.email)
            }
          }}
          className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50"
        >
          Send Password Reset Email
        </button>
      </div>
    </div>
  )
}
