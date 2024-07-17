import Link from 'next/link'

const generators = [
  { name: 'Client Avatar Creator', href: '/dashboard/client-avatar' },
  { name: 'USP Generator', href: '/dashboard/usp' },
  { name: 'Keyword Research Tool', href: '/dashboard/keyword-research' },
  // Add more generators here
]

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome to Your Marketing Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {generators.map((generator) => (
          <Link
            key={generator.name}
            href={generator.href}
            className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100"
          >
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
              {generator.name}
            </h5>
            <p className="font-normal text-gray-700">
              Click to start generating your {generator.name.toLowerCase()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}