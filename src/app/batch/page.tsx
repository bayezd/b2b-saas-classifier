'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import Papa from 'papaparse'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { submitBatchJob, getBatchStatus, getBatchResultsUrl } from '@/lib/api'
import type { Company, BatchJob } from '@/lib/types'

export default function BatchPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [jobId, setJobId] = useState<string | null>(null)
  const [batchStatus, setBatchStatus] = useState<BatchJob | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null)
    const file = acceptedFiles[0]

    if (!file) return
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file')
      return
    }

    Papa.parse(file, {
      complete: (results) => {
        if (results.errors.length > 0) {
          setError('Failed to parse CSV file')
          return
        }

        const parsedCompanies = results.data
          .slice(1) // Skip header row
          .filter((row: any[]) => row.length >= 2) // Ensure we have both name and domain
          .map((row: any[]) => ({
            company_name: row[0],
            domain: row[1],
          }))

        if (parsedCompanies.length === 0) {
          setError('No valid companies found in CSV')
          return
        }

        setCompanies(parsedCompanies)
      },
      error: (error) => {
        setError(\`Failed to parse CSV: \${error.message}\`)
      },
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    multiple: false,
  })

  const handleSubmit = async () => {
    if (companies.length === 0) return

    setIsUploading(true)
    setError(null)

    try {
      const { jobId } = await submitBatchJob(companies)
      setJobId(jobId)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsUploading(false)
    }
  }

  // Poll for batch status
  useEffect(() => {
    if (!jobId) return

    const interval = setInterval(async () => {
      try {
        const status = await getBatchStatus(jobId)
        setBatchStatus(status)

        if (status.status === 'completed' || status.status === 'failed') {
          clearInterval(interval)
        }
      } catch (err) {
        console.error('Failed to fetch batch status:', err)
      }
    }, 5000) // Poll every 5 seconds

    return () => clearInterval(interval)
  }, [jobId])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Batch Classification</h1>

      {!jobId && (
        <>
          <div
            {...getRootProps()}
            className={\`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              \${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
              \${companies.length > 0 ? 'border-green-500 bg-green-50' : ''}
            \`}
          >
            <input {...getInputProps()} />
            {companies.length > 0 ? (
              <div>
                <p className="text-lg font-medium text-green-700">
                  ✅ {companies.length} companies loaded
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Drop a new file to replace
                </p>
              </div>
            ) : isDragActive ? (
              <p className="text-lg">Drop the CSV file here</p>
            ) : (
              <div>
                <p className="text-lg">
                  Drag & drop a CSV file here, or click to select
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  CSV should have company name and domain in first two columns
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {companies.length > 0 && (
            <div className="mt-8">
              <Button
                onClick={handleSubmit}
                disabled={isUploading}
                className="w-full"
              >
                {isUploading ? (
                  <>
                    <Spinner className="mr-2" />
                    Uploading...
                  </>
                ) : (
                  \`Classify \${companies.length} Companies\`
                )}
              </Button>
            </div>
          )}
        </>
      )}

      {jobId && batchStatus && (
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Batch Job Status</h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">
                  {batchStatus.processedCount} / {batchStatus.totalCompanies}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={\`rounded-full h-4 \${
                    batchStatus.status === 'completed'
                      ? 'bg-green-500'
                      : batchStatus.status === 'failed'
                      ? 'bg-red-500'
                      : 'bg-blue-500'
                  }\`}
                  style={{ width: \`\${batchStatus.progress}%\` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={\`px-3 py-1 rounded-full text-sm font-medium \${
                  batchStatus.status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : batchStatus.status === 'failed'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-blue-100 text-blue-700'
                }\`}
              >
                {batchStatus.status.charAt(0).toUpperCase() +
                  batchStatus.status.slice(1)}
              </span>
            </div>

            {batchStatus.status === 'completed' && (
              <div className="pt-4">
                <a
                  href={getBatchResultsUrl(jobId)}
                  className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  download
                >
                  📥 Download Results
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
