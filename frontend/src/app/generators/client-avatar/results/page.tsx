'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ClientAvatarResults() {
  const [avatar, setAvatar] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchAvatar = async () => {
      const avatarId = localStorage.getItem('clientAvatarId')
      if (avatarId) {
        try {
          const response = await fetch(`http://localhost:3001/api/client-avatar/${avatarId}`)
          if (response.ok) {
            const data = await response.json()
            setAvatar(data)
          } else {
            throw new Error('Failed to fetch avatar')
          }
        } catch (error) {
          console.error('Error fetching avatar:', error)
          setError('Failed to fetch avatar. Please try again.')
        }
      } else {
        setError('No avatar found. Please create a new avatar.')
      }
    }

    fetchAvatar()
  }, [router])

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Error</h1>
        <p className="mb-4">{error}</p>
        <Link href="/generators/client-avatar" className="text-blue-500 hover:text-blue-700">
          Create New Avatar
        </Link>
      </div>
    )
  }

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

        <h2 className="text-xl font-semibold mb-2">Generated Avatar</h2>
        <p className="mb-4 whitespace-pre-line">{avatar.generatedAvatar}</p>
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