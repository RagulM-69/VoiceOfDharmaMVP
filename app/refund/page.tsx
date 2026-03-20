import type { Metadata } from 'next'
import Navbar from '@/components/public/Navbar'

export const metadata: Metadata = { title: 'Refund Policy' }

export default function RefundPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20 bg-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-garamond text-4xl font-semibold text-krishna-blue mb-2">Refund Policy</h1>
          <p className="text-gray-500 text-sm mb-10">Last updated: March 2025</p>

          <div className="space-y-8 text-gray-700">
            <div>
              <h2 className="font-garamond text-xl font-semibold text-krishna-blue mb-3">1. General Policy</h2>
              <p className="leading-relaxed">Donations made to Voice of Dharma Foundation are voluntary contributions intended to support our charitable activities. As a registered charitable trust, we generally do not provide refunds on donations once processed.</p>
            </div>

            <div>
              <h2 className="font-garamond text-xl font-semibold text-krishna-blue mb-3">2. Refund Eligibility</h2>
              <p className="leading-relaxed mb-3">Refunds may be considered in the following exceptional circumstances:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Accidental duplicate payment</li>
                <li>Technical error resulting in incorrect amount being charged</li>
                <li>Fraudulent transaction reported within 7 days</li>
              </ul>
            </div>

            <div>
              <h2 className="font-garamond text-xl font-semibold text-krishna-blue mb-3">3. Refund Process</h2>
              <p className="leading-relaxed">To request a refund, please contact us at contact@voiceofdharma.org within 7 days of the transaction, providing your transaction ID and reason for the refund request. All refund requests are reviewed on a case-by-case basis.</p>
            </div>

            <div>
              <h2 className="font-garamond text-xl font-semibold text-krishna-blue mb-3">4. Refund Timeline</h2>
              <p className="leading-relaxed">Approved refunds will be processed within 7–10 business days and will be credited to the original payment method. Refund timelines may vary depending on your bank or payment provider.</p>
            </div>

            <div>
              <h2 className="font-garamond text-xl font-semibold text-krishna-blue mb-3">5. Contact</h2>
              <p className="leading-relaxed">For any refund queries, please write to us at: <a href="mailto:contact@voiceofdharma.org" className="text-amber-600 hover:underline">contact@voiceofdharma.org</a></p>
            </div>

            <div className="p-6 rounded-xl bg-amber-50 border border-amber-200">
              <p className="text-amber-800 text-sm leading-relaxed">
                <strong>Note:</strong> All transactions on this website are conducted in Indian Rupees (INR). Tax exemption certificates (80G) once issued cannot be revoked on refund.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
