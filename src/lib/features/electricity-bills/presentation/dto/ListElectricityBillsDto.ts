import { z } from 'zod';

export const listElectricityBillsSchema = z.object({
  userId: z.number().int().positive().optional(),
  panelId: z.number().int().positive().optional(),
  billingMonth: z.string().or(z.date()).optional(),
});

export type ListElectricityBillsRequest = z.infer<typeof listElectricityBillsSchema>;

export function parseListElectricityBills(query: unknown): ListElectricityBillsRequest {
  const parsed = listElectricityBillsSchema.parse(query);
  return {
    ...parsed,
    billingMonth:
      parsed.billingMonth !== undefined
        ? typeof parsed.billingMonth === 'string'
          ? new Date(parsed.billingMonth)
          : parsed.billingMonth
        : undefined,
  };
}

