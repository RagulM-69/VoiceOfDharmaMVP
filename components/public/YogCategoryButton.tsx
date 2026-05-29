'use client'

import { useRouter } from 'next/navigation'

interface YogCategoryButtonProps {
  category: string
  label: string
}

export default function YogCategoryButton({ category, label }: YogCategoryButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    // Update URL query param without reloading or scrolling to top
    router.push(`/donate?cause=${category}`, { scroll: false })

    // Smoothly scroll to the donate form
    const form = document.getElementById('donate-form')
    if (form) {
      form.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="mt-6 block w-full text-center px-6 py-3 rounded-full font-semibold text-white text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
      style={{ background: 'linear-gradient(135deg, #C8960C, #F5A623)' }}
    >
      {label}
    </button>
  )
}
