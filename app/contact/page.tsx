import type { Metadata } from 'next'
import { getSiteContent, getContent } from '@/lib/content'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import ContactForm from '@/components/public/ContactForm'
import SectionWrapper from '@/components/public/SectionWrapper'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the Voice of Dharma Foundation.',
}

export const revalidate = 3600

export default async function ContactPage() {
  const content = await getSiteContent()
  const heading = getContent(content, 'contact', 'hero', 'heading', 'Contact Us')
  const subheading = getContent(content, 'contact', 'hero', 'subheading', 'We\'d love to hear from you.')
  const email = getContent(content, 'footer', 'info', 'email', 'contact@voiceofdharma.org')
  const phone = getContent(content, 'footer', 'info', 'phone', '')
  const address = getContent(content, 'footer', 'info', 'address', '')

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-20 text-center overflow-hidden" style={{ background: '#0A1F44' }}>
          <div className="absolute inset-0">
            <Image
              src="/images/diya-lamp.png"
              alt="Contact Voice of Dharma Foundation"
              fill className="object-cover opacity-25" priority sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A1F44]/60 via-[#0A1F44]/50 to-[#0A1F44]" />
          </div>
          <div className="relative">
            <SectionWrapper>
              <div className="text-amber-400/50 text-4xl mb-4 select-none font-garamond">॥</div>
              <h1 className="font-garamond text-5xl md:text-6xl font-semibold text-white mb-4">{heading}</h1>
              <p className="text-gray-300 text-lg max-w-xl mx-auto">{subheading}</p>
            </SectionWrapper>
          </div>
        </section>

        {/* Contact grid */}
        <section className="py-20 bg-cream">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              {/* Info */}
              <SectionWrapper className="lg:col-span-2">
                <h2 className="font-garamond text-2xl font-semibold text-krishna-blue mb-6">Get in Touch</h2>
                <div className="space-y-4 text-gray-700">
                  {email && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 mb-1">Email</p>
                      <a href={`mailto:${email}`} className="hover:text-amber-600 transition-colors">{email}</a>
                    </div>
                  )}
                  {phone && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 mb-1">Phone</p>
                      <a href={`tel:${phone}`} className="hover:text-amber-600 transition-colors">{phone}</a>
                    </div>
                  )}
                  {address && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 mb-1">Address</p>
                      <p className="leading-relaxed">{address}</p>
                    </div>
                  )}
                </div>

                <div className="mt-10 p-6 rounded-xl" style={{ background: 'rgba(10,31,68,0.05)', borderLeft: '4px solid #C8960C' }}>
                  <p className="font-garamond text-lg italic text-krishna-blue leading-relaxed">
                    &ldquo;A person who is not disturbed in mind, even amidst the threefold miseries and who is not elated when there is happiness, and who is free from attachment, fear, and anger, is called a sage of steady mind.&rdquo;
                  </p>
                  <p className="text-amber-600 text-sm mt-2">— Bhagavad Gita 2.56</p>
                </div>
              </SectionWrapper>

              {/* Form */}
              <SectionWrapper className="lg:col-span-3" delay={0.2}>
                <div className="card-glass p-8">
                  <h2 className="font-garamond text-2xl font-semibold text-krishna-blue mb-6">Send a Message</h2>
                  <ContactForm />
                </div>
              </SectionWrapper>
            </div>
          </div>
        </section>
      </main>
      <Footer content={content} />
    </>
  )
}
