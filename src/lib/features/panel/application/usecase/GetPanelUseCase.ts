import { PanelRepository } from '@/lib/features/panel/domain/port/PanelRepository';
import { AppError } from '@/lib/common/errors/AppError';

export class GetPanelUseCase {
  constructor(private panelRepo: PanelRepository) {}

  async execute(id: number) {
    const panel = await this.panelRepo.findById(id);
    if (!panel) {
      throw new AppError('Panel not found', 404);
    }
    return panel;
  }
}

