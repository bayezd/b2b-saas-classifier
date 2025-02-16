'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { classifyCompany } from '@/lib/api'
import type { ClassificationResult } from '@/lib/types'

export default function ClassifyPage() {
  const [domain, setDomain] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ClassificationResult | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const result = await classifyCompany(domain)
      setResult(result)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Classify Company</h1>
      
      <form onSubmit={handleSubmit} className="max-w-xl">
        <div className="flex gap-4 mb-8">
          <Input
            type="text"
            placeholder="Enter company domain (e.g., company.com)"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !domain}>
            {isLoading ? <Spinner /> : 'Classify'}
          </Button>
        </div>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-red-700">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="grid gap-4">
            <div>
              <h3 className="font-semibold text-gray-900">Classification</h3>
              <p className="text-2xl font-bold text-blue-600">{result.classification}</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900">Confidence</h3>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-blue-600 rounded-full h-4"
                    style={{ width: `${result.confidence * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium">
                  {Math.round(result.confidence * 100)}%
                </span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">Categories</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {result.metadata.categories.map((category) => (
                  <span
                    key={category}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">Features</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {result.metadata.features.map((feature) => (
                  <span
                    key={feature}
                    className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {result.metadata.description && (
              <div>
                <h3 className="font-semibold text-gray-900">Description</h3>
                <p className="text-gray-600 mt-1">{result.metadata.description}</p>
              </div>
            )}

            {result.cached && (
              <div className="text-sm text-gray-500 mt-2">
                ⚡️ Results loaded from cache
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
