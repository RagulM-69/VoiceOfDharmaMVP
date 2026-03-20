// All TypeScript interfaces for Voice of Dharma Foundation

export interface SiteContent {
  id: string
  page: string
  section: string
  key: string
  value: string
  updated_at: string
}

export type ContentMap = Record<string, Record<string, Record<string, string>>>

export interface Donation {
  id: string
  name: string
  email: string
  phone: string
  amount: number
  purpose: 'karma' | 'bhakti' | 'gyan' | 'general'
  message?: string
  razorpay_order_id?: string
  razorpay_payment_id?: string
  razorpay_signature?: string
  status: 'pending' | 'success' | 'failed'
  receipt_sent: boolean
  ip_address?: string
  created_at: string
}

export interface ContactSubmission {
  id: string
  name: string
  phone: string
  email: string
  message?: string
  replied: boolean
  ip_address?: string
  created_at: string
}

export interface AdminUser {
  id: string
  email: string
  full_name?: string
  role: 'admin' | 'superadmin'
  created_at: string
}

export interface DonationFormData {
  name: string
  email: string
  phone: string
  amount: number
  purpose: 'karma' | 'bhakti' | 'gyan' | 'general'
  message?: string
  recaptchaToken: string
}

export interface ContactFormData {
  name: string
  phone: string
  email: string
  message?: string
  recaptchaToken: string
}

export interface RazorpayOrderResponse {
  orderId: string
  amount: number
  currency: string
  key: string
}

export interface DashboardSummary {
  total_donations: number
  total_amount: number
  total_contacts: number
  pending_replies: number
  donations_last_30_days: number
  amount_last_30_days: number
}

export interface DonationAnalytics {
  day: string
  total_donations: number
  total_amount: number
  purpose: string
  successful: number
  failed: number
}

export interface RateLimitLog {
  id: string
  ip_address: string
  action: string
  created_at: string
}

// Razorpay window type
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance
  }
}

export interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: RazorpayPaymentResponse) => void
  prefill: {
    name: string
    email: string
    contact: string
  }
  theme: {
    color: string
  }
  modal?: {
    ondismiss?: () => void
  }
}

export interface RazorpayPaymentResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

export interface RazorpayInstance {
  open: () => void
}
