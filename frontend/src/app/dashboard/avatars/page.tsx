'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function UserAvatars() {
  const [avatars, setAvatars] = useState([])

  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/user/user123/avatars') // Replace user123 with actual user ID
        if (response.ok) {
          const data = await response.json()
          setAvatars(data)
        } else {
          throw new Error('Failed to fetch avatars')
        }
      } catch (error) {
        console.error('Error fetching avatars:', error)
      }
    }

    fetchAvatars()
  }, [])

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Client Avatars</h1>
      {avatars.map((avatar: any) => (
        <div key={avatar._id} className="mb-4 p-4 border rounded">
          <h2 className="text-xl font-semibold">{avatar.businessType}</h2>
          <p className="mb-2">{avatar.targetAudience}</p>
          <Link href={`/generators/client-avatar/results?id=${avatar._id}`} className="text-blue-500 hover:text-blue-700">
            View Details
          </Link>
        </div>
      ))}
    </div>
  )
}