# B2B SaaS Classification Tool

An AI-powered tool for classifying B2B SaaS companies using website data and advanced machine learning.

## Tech Stack

- **Frontend**: Next.js (React)
- **Backend**: Supabase (PostgreSQL)
- **External APIs**:
  - Firecrawl API (Website scraping)
  - OpenAI GPT-4 (AI classification)
  - HubSpot (CRM integration)

## Features

- Single company classification
- Batch processing via CSV upload
- Real-time classification status
- Contact gating system
- HubSpot CRM integration

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.env.local` file with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   OPENAI_API_KEY=your_openai_key
   HUBSPOT_API_KEY=your_hubspot_key
   FIRECRAWL_API_KEY=your_firecrawl_key
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── components/       # Reusable UI components
├── pages/           # Next.js pages and API routes
├── public/          # Static assets
├── styles/         # Global styles and CSS modules
├── lib/            # Utility functions and API clients
└── types/          # TypeScript type definitions
```

## Development Workflow

1. Frontend First: Build and test UI components
2. Backend Integration: Connect with Supabase and external APIs
3. Testing: Comprehensive testing of all features
4. Deployment: Production deployment and monitoring

## Production Deployment

### Prerequisites

1. Vercel account
2. Supabase project
3. Redis instance (e.g., Upstash)
4. OpenAI API key
5. Sentry account (optional, for error tracking)

### Environment Variables

Copy `.env.production.template` to `.env.production` and fill in the values:

```bash
cp .env.production.template .env.production
```

Required variables:
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `REDIS_URL`
- `OPENAI_API_KEY`

Optional variables:
- `NEXT_PUBLIC_SENTRY_DSN`
- `NEXT_PUBLIC_ANALYTICS_ID`

### Deployment Steps

1. **GitHub Setup**:
   ```bash
   # Initialize git repository
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Vercel Setup**:
   - Connect your GitHub repository to Vercel
   - Configure environment variables in Vercel dashboard
   - Enable automatic deployments

3. **CI/CD Configuration**:
   Add the following secrets to your GitHub repository:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
   - All environment variables from `.env.production`

4. **Database Setup**:
   ```bash
   # Apply Supabase migrations
   supabase db push
   ```

### Monitoring Setup

1. **Sentry Integration**:
   - Create a Sentry project
   - Add `NEXT_PUBLIC_SENTRY_DSN` to environment variables
   - Sentry will automatically track errors and performance

2. **Logging**:
   - Production logs are formatted as JSON for easy parsing
   - Use `src/lib/monitoring.ts` utilities for consistent logging
   - Configure log aggregation service (e.g., DataDog, LogDNA)

3. **Metrics**:
   - Use `logMetric()` for tracking custom metrics
   - Monitor API response times and error rates
   - Set up alerts for critical thresholds

### Performance Monitoring

1. **Vercel Analytics**:
   - Enabled by default with Vercel deployment
   - Monitors Core Web Vitals
   - Tracks user experience metrics

2. **Custom Monitoring**:
   ```typescript
   import { logMetric, logEvent } from '@/lib/monitoring'

   // Track API performance
   logMetric('api_response_time', duration, { endpoint: '/classify' })

   // Track business events
   logEvent('classification_completed', { company: 'example.com' })
   ```

## Security Considerations

1. **API Rate Limiting**:
   - Configured in `src/config/production.ts`
   - Prevents abuse and ensures fair usage

2. **Security Headers**:
   - CORS configuration
   - CSP headers
   - HSTS enabled

3. **Authentication**:
   - Supabase handles user authentication
   - JWT tokens for API requests
   - Protected routes with middleware

## Maintenance

1. **Backup Strategy**:
   - Supabase automated backups
   - Redis persistence enabled
   - Regular state exports

2. **Updates**:
   - Regular dependency updates via Dependabot
   - Security patches automatically applied
   - Monthly maintenance window

## Support

For issues and feature requests, please use the GitHub issue tracker.

## License

Proprietary - All rights reserved
