import { z } from 'zod';

export const createElectricityBillSchema = z.object({
  panelId: z.number().int().positive('Panel ID must be positive'),
  userId: z.number().int().positive('User ID must be positive'),
  billingMonth: z.string().or(z.date()),
  kwhUse: z.number().positive('kWh usage must be positive'),
  vaStatus: z.string().optional(),
  totalBills: z.number().positive('Total bills must be positive'),
  statusPay: z.string().optional(),
});

export type CreateElectricityBillRequest = z.infer<typeof createElectricityBillSchema>;

export function parseCreateElectricityBill(body: unknown): CreateElectricityBillRequest {
  const parsed = createElectricityBillSchema.parse(body);
  return {
    ...parsed,
    billingMonth: typeof parsed.billingMonth === 'string' ? new Date(parsed.billingMonth) : parsed.billingMonth,
  };
}

