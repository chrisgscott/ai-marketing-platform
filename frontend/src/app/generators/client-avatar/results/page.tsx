'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ClientAvatarResults() {
  const [avatar, setAvatar] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const storedAvatar = localStorage.getItem('clientAvatar')
    if (storedAvatar) {
      setAvatar(JSON.parse(storedAvatar))
    } else {
      router.push('/generators/client-avatar')
    }
  }, [router])

  if (!avatar) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Generated Client Avatar</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-2">Business Type</h2>
        <p className="mb-4">{avatar.businessType}</p>

        <h2 className="text-xl font-semibold mb-2">Target Audience</h2>
        <p className="mb-4">{avatar.targetAudience}</p>

        <h2 className="text-xl font-semibold mb-2">Key Problems</h2>
        <p className="mb-4">{avatar.keyProblems}</p>

        <h2 className="text-xl font-semibold mb-2">Desired Outcomes</h2>
        <p className="mb-4">{avatar.desiredOutcomes}</p>

        <h2 className="text-xl font-semibold mb-2">Generated Description</h2>
        <p className="mb-4">{avatar.generatedDescription}</p>
      </div>
      <div className="flex justify-between">
        <Link href="/generators/client-avatar" className="text-blue-500 hover:text-blue-700">
          Create Another Avatar
        </Link>
        <Link href="/dashboard" className="text-blue-500 hover:text-blue-700">
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}