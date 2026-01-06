import { z } from 'zod';

export const createPanelSchema = z.object({
  namePanel: z.string().min(1, 'Name Panel is required'),
});

export type CreatePanelRequest = z.infer<typeof createPanelSchema>;

export function parseCreatePanel(body: unknown): CreatePanelRequest {
  return createPanelSchema.parse(body);
}

