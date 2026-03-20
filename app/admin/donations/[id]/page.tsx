import { redirect, notFound } from 'next/navigation'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase-server'
import type { Donation } from '@/types'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function DonationDetailPage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const service = createSupabaseServiceClient()
  const { data: donation, error } = await service.from('donations').select('*').eq('id', params.id).single()
  if (error || !donation) notFound()

  const d = donation as Donation

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <Link href="/admin/donations" className="text-amber-600 text-sm hover:underline">← Back to Donations</Link>
        <h1 className="font-garamond text-3xl font-semibold text-gray-800 mt-2">Donation Detail</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Status banner */}
        <div className={`px-6 py-3 ${d.status === 'success' ? 'bg-green-50 border-b border-green-100' : d.status === 'failed' ? 'bg-red-50 border-b border-red-100' : 'bg-amber-50 border-b border-amber-100'}`}>
          <span className={`badge-${d.status} text-sm`}>{d.status.toUpperCase()}</span>
          {d.receipt_sent && <span className="ml-3 text-green-600 text-xs font-medium">✓ Receipt sent</span>}
        </div>

        <div className="p-6 space-y-6">
          {/* Donor info */}
          <div>
            <h2 className="font-garamond text-lg font-semibold text-gray-800 mb-3">Donor Information</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                { label: 'Name', value: d.name },
                { label: 'Email', value: d.email },
                { label: 'Phone', value: d.phone },
                { label: 'Amount', value: `₹${d.amount.toLocaleString('en-IN')}` },
                { label: 'Purpose', value: d.purpose.charAt(0).toUpperCase() + d.purpose.slice(1) + ' Yoga' },
                { label: 'Date', value: new Date(d.created_at).toLocaleString('en-IN') },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">{label}</p>
                  <p className="text-gray-800 font-medium">{value}</p>
                </div>
              ))}
              {d.message && (
                <div className="col-span-2">
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">Message</p>
                  <p className="text-gray-700 leading-relaxed">{d.message}</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment info */}
          <div className="border-t border-gray-100 pt-4">
            <h2 className="font-garamond text-lg font-semibold text-gray-800 mb-3">Payment Details</h2>
            <div className="space-y-2 text-sm font-mono">
              {d.razorpay_order_id && <div><span className="text-gray-500">Order ID: </span><span className="text-gray-800">{d.razorpay_order_id}</span></div>}
              {d.razorpay_payment_id && <div><span className="text-gray-500">Payment ID: </span><span className="text-gray-800">{d.razorpay_payment_id}</span></div>}
              {d.ip_address && <div><span className="text-gray-500">IP Address: </span><span className="text-gray-800">{d.ip_address}</span></div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
