import { init as initSentry } from '@sentry/nextjs'
import { Integrations } from '@sentry/tracing'
import { productionConfig } from '@/config/production'

export function initializeMonitoring() {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    initSentry({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      integrations: [new Integrations.BrowserTracing()],
      tracesSampleRate: 1.0,
      environment: process.env.NODE_ENV,
    })
  }
}

export function captureError(error: Error, context?: Record<string, any>) {
  if (process.env.NODE_ENV === 'production') {
    // Send to Sentry
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      Sentry.captureException(error, { extra: context })
    }
    
    // Log to console in JSON format for log aggregation
    console.error(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'error',
      message: error.message,
      stack: error.stack,
      ...context,
    }))
  } else {
    // Development logging
    console.error(error)
    if (context) {
      console.error('Error Context:', context)
    }
  }
}

export function logMetric(
  name: string,
  value: number,
  tags?: Record<string, string>
) {
  if (process.env.NODE_ENV === 'production') {
    // Log metrics in a format suitable for aggregation
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      type: 'metric',
      name,
      value,
      tags,
    }))
  }
}

export function logEvent(
  name: string,
  properties?: Record<string, any>
) {
  if (process.env.NODE_ENV === 'production') {
    // Log events in a format suitable for aggregation
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      type: 'event',
      name,
      properties,
    }))
  }
}
