import { z } from 'zod'

export const domainSchema = z
  .string()
  .min(4, 'Domain must be at least 4 characters')
  .max(253, 'Domain is too long')
  .regex(
    /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/,
    'Invalid domain format'
  )

export const classificationSchema = z.object({
  classification: z.string(),
  confidence: z.number().min(0).max(1),
  metadata: z.object({
    categories: z.array(z.string()),
    features: z.array(z.string()),
    description: z.string().optional(),
  }),
})

export type Classification = z.infer<typeof classificationSchema>

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}
