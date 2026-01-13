import { z } from 'zod'

export const updateRateSchema = z.object({
  rate_per_second: z
    .number()
    .min(1, 'A taxa deve ser no mínimo 1 log por segundo')
    .max(10000, 'A taxa máxima permitida é 10000 logs por segundo'),
})

export type UpdateRateFormData = z.infer<typeof updateRateSchema>
