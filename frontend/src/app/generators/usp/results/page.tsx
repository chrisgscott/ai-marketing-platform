'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function USPResults() {
  const [usp, setUSP] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUSP = async () => {
      const uspId = localStorage.getItem('uspId')
      if (uspId) {
        try {
          const response = await fetch(`http://localhost:3001/api/usp/${uspId}`)
          if (response.ok) {
            const data = await response.json()
            setUSP(data)
          } else {
            throw new Error('Failed to fetch USP')
          }
        } catch (error) {
          console.error('Error fetching USP:', error)
          setError('Failed to fetch USP. Please try again.')
        }
      } else {
        setError('No USP found. Please create a new USP.')
      }
    }

    fetchUSP()
  }, [router])

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Error</h1>
        <p className="mb-4">{error}</p>
        <Link href="/generators/usp" className="text-blue-500 hover:text-blue-700">
          Create New USP
        </Link>
      </div>
    )
  }

  if (!usp) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Generated Unique Selling Proposition</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-2">Your USP</h2>
        <p className="mb-4">{usp.generatedUSP}</p>

        <h2 className="text-xl font-semibold mb-2">Explanation</h2>
        <p className="mb-4">{usp.explanation}</p>
      </div>
      <div className="flex justify-between">
        <Link href="/generators/usp" className="text-blue-500 hover:text-blue-700">
          Create Another USP
        </Link>
        <Link href="/dashboard" className="text-blue-500 hover:text-blue-700">
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}