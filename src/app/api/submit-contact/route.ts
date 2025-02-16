import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'
import { z } from 'zod'
import logger from '@/lib/logger'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const contactSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email format'),
  companyName: z.string().min(2, 'Company name is too short'),
})

export async function POST(request: Request) {
  const headersList = headers()
  const ip = headersList.get('x-forwarded-for') || 'unknown'

  try {
    const body = await request.json()

    // Validate input
    const validatedData = contactSchema.parse(body)

    // Store in Supabase
    const { error: dbError } = await supabase.from('user_contacts').insert({
      name: validatedData.name,
      email: validatedData.email,
      company_name: validatedData.companyName,
    })

    if (dbError) {
      logger.error('Failed to store contact', { error: dbError })
      throw new Error('Failed to store contact information')
    }

    // TODO: Add HubSpot integration here
    // const hubspotResponse = await sendToHubspot(validatedData)

    logger.info('Contact submitted successfully', {
      email: validatedData.email,
    })

    return NextResponse.json({
      message: 'Contact information submitted successfully',
    })
  } catch (error: any) {
    logger.error('Contact submission error', {
      error: error.message,
      ip,
    })

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to submit contact information' },
      { status: 500 }
    )
  }
}
