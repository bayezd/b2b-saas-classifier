export interface ClassificationResult {
  classification: string
  confidence: number
  metadata: {
    categories: string[]
    features: string[]
    description?: string
  }
  cached?: boolean
}

export interface ContactInfo {
  name: string
  email: string
  companyName: string
}

export interface BatchJob {
  jobId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  totalCompanies: number
  processedCount: number
  completedAt?: string
  progress: number
}

export interface Company {
  domain: string
  company_name: string
}
