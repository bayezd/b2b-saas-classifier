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

## License

Proprietary - All rights reserved
