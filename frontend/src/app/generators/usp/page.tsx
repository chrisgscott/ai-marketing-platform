'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function USPGenerator() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    businessName: '',
    productService: '',
    targetAudience: '',
    keyBenefits: '',
    competitors: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:3001/api/usp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user123', // Replace with actual user ID when you have authentication
          ...formData
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      localStorage.setItem('uspId', data.id);
      router.push('/generators/usp/results');
    } catch (err) {
      console.error('Error details:', err);
      setError('An error occurred while generating the USP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Unique Selling Proposition Generator</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="businessName" className="block mb-2 font-medium">
            Business Name
          </label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="productService" className="block mb-2 font-medium">
            Main Product or Service
          </label>
          <input
            type="text"
            id="productService"
            name="productService"
            value={formData.productService}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="targetAudience" className="block mb-2 font-medium">
            Target Audience
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
          <label htmlFor="keyBenefits" className="block mb-2 font-medium">
            Key Benefits of Your Product/Service
          </label>
          <textarea
            id="keyBenefits"
            name="keyBenefits"
            value={formData.keyBenefits}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={3}
            required
          />
        </div>
        <div>
          <label htmlFor="competitors" className="block mb-2 font-medium">
            Main Competitors
          </label>
          <input
            type="text"
            id="competitors"
            name="competitors"
            value={formData.competitors}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate USP'}
        </button>
      </form>
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  )
}