import { z } from 'zod';

export const updateElectricityBillSchema = z.object({
  panelId: z.number().int().positive('Panel ID must be positive').optional(),
  billingMonth: z.string().or(z.date()).optional(),
  kwhUse: z.number().positive('kWh usage must be positive').optional(),
  vaStatus: z.string().optional(),
  totalBills: z.number().positive('Total bills must be positive').optional(),
});

export type UpdateElectricityBillRequest = z.infer<typeof updateElectricityBillSchema>;

export function parseUpdateElectricityBill(body: unknown): UpdateElectricityBillRequest {
  const parsed = updateElectricityBillSchema.parse(body);
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

