import { z } from 'zod';

export const getApiTokenSchema = () => {
  return z.object({
    page: z
      .string()
      .transform((val) => parseInt(val))
      .refine((val) => val >= 1, { message: 'page cannot be less than 1' }),
    limit: z
      .string()
      .transform((val) => parseInt(val))
      .refine((val) => val >= 10, { message: 'limit cannot be less than 10' }),
    column: z.enum(['name', 'lastUsed', 'createdAt']).nullable().optional(),
    order: z.enum(['desc', 'asc']).nullable().optional(),
  });
};

export const createApiTokenSchema = () => {
  return z.object({
    name: z.string().min(1, { message: 'Name is required' }),
  });
};
