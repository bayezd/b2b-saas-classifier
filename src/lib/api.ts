import { ClassificationResult, ContactInfo, BatchJob } from './types'

export async function classifyCompany(domain: string): Promise<ClassificationResult> {
  const response = await fetch('/api/classify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ domain }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Classification failed')
  }

  return response.json()
}

export async function submitBatchJob(companies: { domain: string; company_name: string }[]): Promise<{ jobId: string }> {
  const response = await fetch('/api/batch-classify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ companies }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create batch job')
  }

  return response.json()
}

export async function getBatchStatus(jobId: string): Promise<BatchJob> {
  const response = await fetch(`/api/batch-status/${jobId}`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch batch status')
  }

  return response.json()
}

export async function submitContact(contact: ContactInfo): Promise<{ message: string }> {
  const response = await fetch('/api/submit-contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(contact),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to submit contact')
  }

  return response.json()
}

export function getBatchResultsUrl(jobId: string): string {
  return `/api/batch-result/${jobId}/download`
}
