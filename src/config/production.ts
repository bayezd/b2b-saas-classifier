export const productionConfig = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '',
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
  },

  // Redis Configuration
  redis: {
    url: process.env.REDIS_URL || '',
    ttl: 60 * 60 * 24, // 24 hours
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

  // Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
  },

  // Security
  security: {
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['*'],
      methods: ['GET', 'POST'],
    },
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    },
  },

  // Logging
  logging: {
    level: 'info',
    format: 'json',
  },

  // Cache Configuration
  cache: {
    staleWhileRevalidate: 60, // seconds
    defaultMaxAge: 3600, // 1 hour
  },

  // Performance
  performance: {
    compression: true,
    minify: true,
    imageOptimization: true,
  },
}
