import { z } from 'zod';

export const updatePanelSchema = z.object({
  namePanel: z.string().min(1, 'Name Panel is required').optional(),
});

export type UpdatePanelRequest = z.infer<typeof updatePanelSchema>;

export function parseUpdatePanel(body: unknown): UpdatePanelRequest {
  return updatePanelSchema.parse(body);
}

