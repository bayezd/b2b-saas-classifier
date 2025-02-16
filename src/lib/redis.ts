import Redis from 'ioredis'
import logger from './logger'

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

redis.on('error', (error) => {
  logger.error('Redis connection error', { error: error.message })
})

redis.on('connect', () => {
  logger.info('Redis connected successfully')
})

export const CACHE_TTL = 60 * 60 * 24 * 7 // 1 week in seconds

export async function getCachedClassification(domain: string) {
  try {
    const cached = await redis.get(`classification:${domain}`)
    if (cached) {
      logger.info('Cache hit for domain', { domain })
      return JSON.parse(cached)
    }
    logger.info('Cache miss for domain', { domain })
    return null
  } catch (error: any) {
    logger.error('Redis get error', { error: error.message, domain })
    return null
  }
}

export async function cacheClassification(domain: string, classification: any) {
  try {
    await redis.set(
      `classification:${domain}`,
      JSON.stringify(classification),
      'EX',
      CACHE_TTL
    )
    logger.info('Cached classification for domain', { domain })
  } catch (error: any) {
    logger.error('Redis set error', { error: error.message, domain })
  }
}

export default redis
