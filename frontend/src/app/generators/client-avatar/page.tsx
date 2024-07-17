'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ClientAvatarCreator() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    businessType: '',
    targetAudience: '',
    keyProblems: '',
    desiredOutcomes: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Send data to API and get response
    console.log('Form submitted:', formData)
    // For now, we'll just redirect back to the dashboard
    router.push('/dashboard')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Client Avatar Creator</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="businessType" className="block mb-2 font-medium">
            What type of business do you run?
          </label>
          <input
            type="text"
            id="businessType"
            name="businessType"
            value={formData.businessType}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="targetAudience" className="block mb-2 font-medium">
            Describe your target audience:
          </label>
          <textarea
            id="targetAudience"
            name="targetAudience"
            value={formData.targetAudience}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={3}
            required
          />
        </div>
        <div>
          <label htmlFor="keyProblems" className="block mb-2 font-medium">
            What are the key problems your business solves?
          </label>
          <textarea
            id="keyProblems"
            name="keyProblems"
            value={formData.keyProblems}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={3}
            required
          />
        </div>
        <div>
          <label htmlFor="desiredOutcomes" className="block mb-2 font-medium">
            What outcomes do your clients desire?
          </label>
          <textarea
            id="desiredOutcomes"
            name="desiredOutcomes"
            value={formData.desiredOutcomes}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={3}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Generate Client Avatar
        </button>
      </form>
    </div>
  )
}