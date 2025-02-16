export const stagingConfig = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '',
    timeout: 60000, // 60 seconds (longer timeout for staging)
    retryAttempts: 5,
  },

  // Redis Configuration
  redis: {
    url: process.env.REDIS_URL || '',
    ttl: 60 * 5, // 5 minutes (shorter TTL for staging)
  },

  // Supabase Configuration
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  },

  // OpenAI Configuration
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000,
  },

  // Rate Limiting (more lenient for staging)
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // Higher limit for testing
  },

  // Security (slightly relaxed for staging)
  security: {
    cors: {
      origin: '*', // Allow all origins in staging
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
    },
  },

  // Logging (more verbose for staging)
  logging: {
    level: 'debug',
    format: 'json',
  },

  // Cache Configuration (shorter durations for staging)
  cache: {
    staleWhileRevalidate: 30,
    defaultMaxAge: 300, // 5 minutes
  },

  // Performance (some optimizations disabled for debugging)
  performance: {
    compression: true,
    minify: false,
    imageOptimization: true,
  },
}
