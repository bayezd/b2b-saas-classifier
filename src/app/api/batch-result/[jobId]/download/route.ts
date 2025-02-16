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

    // Get all classified companies for this batch
    const { data: companies, error } = await supabase
      .from('companies')
      .select('*')
      .eq('batch_job_id', jobId)
      .order('created_at', { ascending: true })

    if (error) {
      logger.error('Failed to fetch batch results', { jobId, error })
      throw new Error('Failed to fetch batch results')
    }

    if (!companies || companies.length === 0) {
      return NextResponse.json(
        { error: 'No results found for this batch' },
        { status: 404 }
      )
    }

    // Convert to CSV format
    const csvHeader = 'Company Name,Domain,Classification,Confidence,Categories,Features\n'
    const csvRows = companies.map(company => {
      const metadata = company.metadata || {}
      const categories = metadata.categories?.join(';') || ''
      const features = metadata.features?.join(';') || ''
      
      return [
        company.company_name,
        company.domain,
        company.classification,
        company.confidence,
        categories,
        features,
      ].map(field => \`"\${String(field).replace(/"/g, '""')}"\`).join(',')
    })

    const csvContent = csvHeader + csvRows.join('\n')

    logger.info('Generated batch results CSV', {
      jobId,
      rowCount: companies.length,
    })

    // Return CSV file
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': \`attachment; filename="batch-\${jobId}-results.csv"\`,
      },
    })
  } catch (error: any) {
    logger.error('Batch download error', {
      error: error.message,
      jobId: params.jobId,
    })

    return NextResponse.json(
      { error: 'Failed to generate batch results' },
      { status: 500 }
    )
  }
}
