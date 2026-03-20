import { redirect } from 'next/navigation'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase-server'
import type { DashboardSummary, DonationAnalytics, Donation, ContactSubmission } from '@/types'
import DonationCharts from '@/components/admin/DonationCharts'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const service = createSupabaseServiceClient()

  // Fetch dashboard data in parallel
  const [summaryResult, analyticsResult, recentDonationsResult, recentContactsResult] = await Promise.all([
    service.from('dashboard_summary').select('*').single(),
    service.from('donation_analytics').select('*').limit(90),
    service.from('donations').select('*').order('created_at', { ascending: false }).limit(10),
    service.from('contact_submissions').select('*').order('created_at', { ascending: false }).limit(5),
  ])

  const summary = summaryResult.data as DashboardSummary | null
  const analytics = (analyticsResult.data as DonationAnalytics[]) || []
  const recentDonations = (recentDonationsResult.data as Donation[]) || []
  const recentContacts = (recentContactsResult.data as ContactSubmission[]) || []

  const cards = [
    { label: 'Total Donations', value: summary?.total_donations?.toString() ?? '0', icon: '🙏', color: '#C8960C' },
    { label: 'Total Amount Raised', value: `₹${Number(summary?.total_amount ?? 0).toLocaleString('en-IN')}`, icon: '💰', color: '#16A34A' },
    { label: 'Donations This Month', value: summary?.donations_last_30_days?.toString() ?? '0', icon: '📅', color: '#0A1F44' },
    { label: 'Amount This Month', value: `₹${Number(summary?.amount_last_30_days ?? 0).toLocaleString('en-IN')}`, icon: '📈', color: '#F5A623' },
    { label: 'Total Contact Forms', value: summary?.total_contacts?.toString() ?? '0', icon: '📬', color: '#6366F1' },
    { label: 'Pending Replies', value: summary?.pending_replies?.toString() ?? '0', icon: '⏳', color: '#DC2626' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-garamond text-3xl font-semibold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Voice of Dharma Foundation — Admin Overview</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{card.icon}</span>
              <div className="w-2 h-2 rounded-full" style={{ background: card.color }} />
            </div>
            <p className="text-2xl font-bold text-gray-800 font-garamond">{card.value}</p>
            <p className="text-gray-500 text-xs mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="mb-10">
        <h2 className="font-garamond text-xl font-semibold text-gray-800 mb-4">Analytics</h2>
        <DonationCharts analytics={analytics} />
      </div>

      {/* Recent donations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-garamond text-lg font-semibold text-gray-800">Recent Donations</h2>
            <Link href="/admin/donations" className="text-xs text-amber-600 hover:underline">View all →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Name', 'Amount', 'Purpose', 'Status', 'Date'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentDonations.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No donations yet</td></tr>
                ) : recentDonations.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{d.name}</td>
                    <td className="px-4 py-3 text-green-700 font-semibold">₹{d.amount.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 capitalize text-gray-600">{d.purpose}</td>
                    <td className="px-4 py-3">
                      <span className={`badge-${d.status}`}>{d.status}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{new Date(d.created_at).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent contacts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-garamond text-lg font-semibold text-gray-800">Recent Contact Forms</h2>
            <Link href="/admin/contacts" className="text-xs text-amber-600 hover:underline">View all →</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentContacts.length === 0 ? (
              <p className="px-4 py-8 text-center text-gray-400">No contact forms yet</p>
            ) : recentContacts.map((c) => (
              <div key={c.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{c.name}</p>
                    <p className="text-gray-500 text-xs">{c.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={c.replied ? 'badge-success' : 'badge-pending'}>
                      {c.replied ? 'Replied' : 'Pending'}
                    </span>
                    <span className="text-gray-400 text-xs">{new Date(c.created_at).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
                {c.message && <p className="text-gray-500 text-xs mt-1 truncate">{c.message}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
