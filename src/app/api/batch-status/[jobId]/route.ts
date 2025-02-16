import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import logger from '@/lib/logger'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(
  request: Request,
  { params }: { params: { jobId: string } }
) {
  try {
    const jobId = params.jobId

    // Get job status
    const { data: job, error: jobError } = await supabase
      .from('batch_jobs')
      .select('*')
      .eq('id', jobId)
      .single()

    if (jobError) {
      logger.error('Failed to fetch batch job', { jobId, error: jobError })
      throw new Error('Failed to fetch batch job')
    }

    if (!job) {
      return NextResponse.json(
        { error: 'Batch job not found' },
        { status: 404 }
      )
    }

    // Get processed companies count
    const { count: processedCount, error: countError } = await supabase
      .from('companies')
      .select('*', { count: 'exact', head: true })
      .eq('batch_job_id', jobId)
      .eq('status', 'completed')

    if (countError) {
      logger.error('Failed to get processed count', {
        jobId,
        error: countError,
      })
      throw new Error('Failed to get processed count')
    }

    const progress = {
      jobId,
      status: job.status,
      totalCompanies: job.total_companies,
      processedCount: processedCount || 0,
      completedAt: job.completed_at,
      progress: ((processedCount || 0) / job.total_companies) * 100,
    }

    logger.info('Batch job status fetched', { jobId, progress })

    return NextResponse.json(progress)
  } catch (error: any) {
    logger.error('Batch status error', {
      error: error.message,
      jobId: params.jobId,
    })

    return NextResponse.json(
      { error: 'Failed to fetch batch status' },
      { status: 500 }
    )
  }
}
