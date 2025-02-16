'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { submitContact } from '@/lib/api'
import { setCookie } from '@/lib/cookies'

interface ContactFormProps {
  onSuccess?: () => void
  redirectUrl?: string
}

export function ContactForm({ onSuccess, redirectUrl }: ContactFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    companyName: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await submitContact(formData)
      
      // Store in localStorage
      localStorage.setItem('userContact', JSON.stringify({
        ...formData,
        submittedAt: new Date().toISOString(),
      }))

      // Set cookie for server-side contact gating
      setCookie('hasSubmittedContact', 'true', 30) // 30 days expiry

      if (onSuccess) {
        onSuccess()
      }

      // Redirect to original destination or default
      const from = searchParams.get('from')
      router.push(from || redirectUrl || '/classify')
    } catch (err: any) {
      setError(err.message || 'Failed to submit contact information')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          placeholder="John Doe"
          value={formData.name}
          onChange={handleChange}
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Work Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="john@company.com"
          value={formData.email}
          onChange={handleChange}
          disabled={isSubmitting}
          pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
          title="Please enter a valid email address"
        />
      </div>

      <div>
        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
          Company Name
        </label>
        <Input
          id="companyName"
          name="companyName"
          type="text"
          required
          placeholder="Acme Inc."
          value={formData.companyName}
          onChange={handleChange}
          disabled={isSubmitting}
        />
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md p-3">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <Spinner className="mr-2" />
            Submitting...
          </>
        ) : (
          'Get Started'
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center mt-4">
        By submitting this form, you agree to our{' '}
        <a href="/terms" className="text-blue-600 hover:underline">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="/privacy" className="text-blue-600 hover:underline">
          Privacy Policy
        </a>
        .
      </p>
    </form>
  )
}
