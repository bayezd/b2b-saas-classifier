import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { headers } from 'next/headers'
import logger from '@/lib/logger'
import rateLimit from '@/lib/rate-limiter'
import { domainSchema, classificationSchema, ValidationError } from '@/lib/validation'
import { getCachedClassification, cacheClassification } from '@/lib/redis'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
})

const SYSTEM_PROMPT = `You are an expert B2B company classifier. Your task is to analyze company websites and classify them into specific B2B categories.

Output format must be valid JSON with the following structure:
{
  "classification": "Primary category of the company",
  "confidence": 0.0 to 1.0,
  "metadata": {
    "categories": ["Category1", "Category2", "Category3"],
    "features": ["Feature1", "Feature2", "Feature3"],
    "description": "Brief description of what the company does"
  }
}

Categories should be specific B2B/SaaS categories like:
- Marketing Technology
- Sales Intelligence
- Customer Support Software
- HR Management
- Financial Technology
- Developer Tools
- Business Intelligence
- etc.

Features should be specific product capabilities or services offered.`

async function fetchWebsiteContent(domain: string) {
  try {
    logger.info('Fetching website content', { domain })
    const response = await fetch(`https://${domain}`)
    
    if (!response.ok) {
      logger.error('Failed to fetch website', {
        domain,
        status: response.status,
        statusText: response.statusText,
      })
      throw new Error(`Failed to fetch website: ${response.statusText}`)
    }
    
    const html = await response.text()
    
    // Extract text content from HTML
    const textContent = html
      .replace(/<[^>]*>/g, ' ') // Remove HTML tags
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
      .slice(0, 4000) // Limit content length
    
    logger.info('Successfully fetched website content', {
      domain,
      contentLength: textContent.length,
    })
    
    return textContent
  } catch (error: any) {
    logger.error('Error fetching website content', {
      domain,
      error: error.message,
      stack: error.stack,
    })
    throw new Error(`Failed to fetch website content: ${error.message}`)
  }
}

export async function POST(request: Request) {
  const headersList = headers()
  const ip = headersList.get('x-forwarded-for') || 'unknown'
  const userAgent = headersList.get('user-agent') || 'unknown'

  try {
    // Rate limiting
    try {
      await limiter.check(10, ip) // 10 requests per minute per IP
    } catch (error) {
      logger.warn('Rate limit exceeded', { ip, userAgent })
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    
    // Validate domain
    try {
      const { domain } = body
      domainSchema.parse(domain)
    } catch (error: any) {
      logger.warn('Invalid domain format', { ip, domain: body.domain, error: error.message })
      return NextResponse.json(
        { error: error.message || 'Invalid domain format' },
        { status: 400 }
      )
    }

    const { domain } = body

    // Check cache first
    const cachedResult = await getCachedClassification(domain)
    if (cachedResult) {
      logger.info('Returning cached classification', { domain })
      return NextResponse.json({
        ...cachedResult,
        cached: true
      })
    }

    // Fetch website content
    const websiteContent = await fetchWebsiteContent(domain)

    // Create user prompt
    const userPrompt = `Analyze this B2B company website content and classify it:
Domain: ${domain}
Content: ${websiteContent}`

    logger.info('Sending request to OpenAI', { domain })

    // Get classification from OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.5,
      response_format: { type: "json_object" }
    })

    const result = JSON.parse(completion.choices[0].message.content)

    // Validate classification result
    try {
      classificationSchema.parse(result)
    } catch (error: any) {
      logger.error('Invalid classification result from OpenAI', {
        domain,
        result,
        error: error.message,
      })
      throw new ValidationError('Invalid classification result from AI')
    }

    // Cache the successful classification
    await cacheClassification(domain, result)

    logger.info('Successfully classified domain', {
      domain,
      classification: result.classification,
      confidence: result.confidence,
    })

    return NextResponse.json({
      ...result,
      cached: false
    })
  } catch (error: any) {
    logger.error('Classification error', {
      error: error.message,
      stack: error.stack,
      ip,
      userAgent,
    })

    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'An error occurred while classifying the company. Please try again.' },
      { status: 500 }
    )
  }
}
