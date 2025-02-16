export const developmentConfig = {
  // API Configuration
  api: {
    baseUrl: 'http://localhost:3000',
    timeout: 60000, // 60 seconds
    retryAttempts: 3,
  },

  // Redis Configuration
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    ttl: 60, // 1 minute for quick testing
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

  // Rate Limiting (disabled for development)
  rateLimit: {
    windowMs: 1,
    max: 99999,
  },

  // Security (relaxed for development)
  security: {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    },
    headers: {},
  },

  // Logging (maximum verbosity for development)
  logging: {
    level: 'debug',
    format: 'pretty',
  },

  // Cache Configuration (minimal caching for development)
  cache: {
    staleWhileRevalidate: 0,
    defaultMaxAge: 0,
  },

  // Performance (disabled for development)
  performance: {
    compression: false,
    minify: false,
    imageOptimization: false,
  },

  // Development-specific features
  features: {
    mockResponses: true, // Enable mock responses
    debugMode: true, // Enable debug mode
    slowMotion: false, // Optional slow motion for testing loading states
  },
}
