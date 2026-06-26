interface Spec {
  label: string
  value: string | number | undefined | null
}

interface Props {
  specs: Spec[]
  title?: string
}

export default function PublicationSpecs({ specs, title = 'Book Specifications' }: Props) {
  // Filter out empty/null/undefined specs
  const validSpecs = specs.filter(
    (s) => s.value !== undefined && s.value !== null && s.value !== ''
  )

  if (validSpecs.length === 0) return null

  return (
    <section className="py-12 bg-gray-50 border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="section-divider" />
          <h2 className="font-garamond text-2xl font-semibold text-gray-800">{title}</h2>
        </div>

        <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
          <table className="w-full text-sm" role="table" aria-label="Book specifications">
            <tbody>
              {validSpecs.map((spec, i) => (
                <tr
                  key={spec.label}
                  className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td
                    className="py-3.5 px-5 font-medium text-gray-500 w-40 md:w-52 border-r border-gray-100"
                    aria-label={`${spec.label} label`}
                  >
                    {spec.label}
                  </td>
                  <td className="py-3.5 px-5 text-gray-800 font-medium" aria-label={`${spec.label} value`}>
                    {String(spec.value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
