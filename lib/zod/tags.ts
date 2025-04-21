import { z } from 'zod';

export const getTagSchema = () => {
  return z.object({
    page: z
      .string()
      .transform((val) => parseInt(val))
      .refine((val) => val >= 1, { message: 'page cannot be less than 1' }),
    limit: z
      .enum(['10', '20', '30', '40', '50'])
      .transform((val) => parseInt(val))
      .refine((val) => val >= 10, { message: 'limit cannot be less than 10' }),
    column: z.enum(['name', 'color', 'createdAt']).nullable().optional(),
    order: z.enum(['asc', 'desc']).nullable().optional(),
    search: z.string().nullable(),
  });
};
