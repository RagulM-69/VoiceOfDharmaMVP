'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts'
import type { DonationAnalytics } from '@/types'

interface Props {
  analytics: DonationAnalytics[]
}

const PURPOSE_COLORS: Record<string, string> = {
  karma: '#0A1F44',
  bhakti: '#F5A623',
  gyan: '#C8960C',
  general: '#6366F1',
}

export default function DonationCharts({ analytics }: Props) {
  // Bar chart: last 30 days donations per day
  const barData = analytics
    .slice(0, 30)
    .map((d) => ({
      day: new Date(d.day).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      amount: d.total_amount,
      count: d.total_donations,
    }))
    .reverse()

  // Pie chart: by purpose
  const purposeTotals: Record<string, number> = {}
  analytics.forEach((d) => {
    purposeTotals[d.purpose] = (purposeTotals[d.purpose] || 0) + Number(d.total_amount)
  })
  const pieData = Object.entries(purposeTotals).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }))

  // Line chart: amount over time (last 90 days)
  const lineData = analytics
    .slice(0, 90)
    .map((d) => ({
      day: new Date(d.day).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      amount: d.total_amount,
    }))
    .reverse()

  if (analytics.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 text-center text-gray-400 shadow-sm border border-gray-100">
        <p>No donation data yet. Charts will appear here after first donations.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bar chart */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">Daily Donations (Last 30 Days)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={4} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${v}`} />
            <Tooltip formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, 'Amount']} />
            <Bar dataKey="amount" fill="#C8960C" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie chart */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">Donations by Purpose</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
              {pieData.map((entry, index) => (
                <Cell key={index} fill={PURPOSE_COLORS[entry.name.toLowerCase()] || '#9CA3AF'} />
              ))}
            </Pie>
            <Tooltip formatter={(v: number) => `₹${v.toLocaleString('en-IN')}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Line chart */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 lg:col-span-2">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">Amount Raised Over Time</h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={6} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${v}`} />
            <Tooltip formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, 'Amount']} />
            <Line type="monotone" dataKey="amount" stroke="#C8960C" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
