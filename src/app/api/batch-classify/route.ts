import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'
import logger from '@/lib/logger'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: Request) {
  const headersList = headers()
  const ip = headersList.get('x-forwarded-for') || 'unknown'

  try {
    const { companies } = await request.json()

    if (!Array.isArray(companies) || companies.length === 0) {
      return NextResponse.json(
        { error: 'Invalid input: companies array is required' },
        { status: 400 }
      )
    }

    // Create a new batch job
    const { data: job, error: jobError } = await supabase
      .from('batch_jobs')
      .insert({
        total_companies: companies.length,
        processed_count: 0,
        status: 'pending',
      })
      .select()
      .single()

    if (jobError) {
      logger.error('Failed to create batch job', { error: jobError })
      throw new Error('Failed to create batch job')
    }

    // Queue companies for processing
    const companiesWithJobId = companies.map(company => ({
      ...company,
      batch_job_id: job.id,
      status: 'pending'
    }))

    const { error: companiesError } = await supabase
      .from('companies')
      .insert(companiesWithJobId)

    if (companiesError) {
      logger.error('Failed to queue companies', { error: companiesError })
      throw new Error('Failed to queue companies')
    }

    logger.info('Successfully created batch job', {
      jobId: job.id,
      totalCompanies: companies.length,
    })

    return NextResponse.json({
      jobId: job.id,
      message: 'Batch job created successfully',
    })
  } catch (error: any) {
    logger.error('Batch job creation error', {
      error: error.message,
      ip,
    })

    return NextResponse.json(
      { error: 'Failed to create batch job' },
      { status: 500 }
    )
  }
}
