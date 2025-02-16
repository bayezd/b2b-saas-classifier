'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ContactForm } from '@/components/contact-form'

export default function GetStartedPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user has already submitted contact info
    const userContact = localStorage.getItem('userContact')
    if (userContact) {
      // If submitted within the last 30 days, redirect to classify page
      const { submittedAt } = JSON.parse(userContact)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      if (new Date(submittedAt) > thirtyDaysAgo) {
        router.push('/classify')
      }
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">
                Get Started with B2B Classifier
              </h1>
              <p className="mt-2 text-gray-600">
                Enter your details to access our powerful B2B company classification tool.
              </p>
            </div>

            <ContactForm
              redirectUrl="/classify"
            />
          </div>

          <div className="mt-8 text-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              What you&apos;ll get:
            </h2>
            <div className="grid gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-blue-600 text-xl mb-2">🎯</div>
                <h3 className="font-medium text-gray-900">
                  Accurate Classifications
                </h3>
                <p className="text-sm text-gray-600">
                  AI-powered analysis of B2B companies
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-blue-600 text-xl mb-2">⚡️</div>
                <h3 className="font-medium text-gray-900">
                  Instant Results
                </h3>
                <p className="text-sm text-gray-600">
                  Get classifications in seconds
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-blue-600 text-xl mb-2">📊</div>
                <h3 className="font-medium text-gray-900">
                  Batch Processing
                </h3>
                <p className="text-sm text-gray-600">
                  Classify multiple companies at once
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
