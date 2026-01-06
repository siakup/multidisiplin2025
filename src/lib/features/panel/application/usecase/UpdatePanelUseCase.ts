import { PanelRepository } from '@/lib/features/panel/domain/port/PanelRepository';
import { AppError } from '@/lib/common/errors/AppError';

export class UpdatePanelUseCase {
  constructor(private panelRepo: PanelRepository) {}

  async execute(id: number, namePanel: string) {
    const existingPanel = await this.panelRepo.findById(id);
    if (!existingPanel) {
      throw new AppError('Panel not found', 404);
    }

    return this.panelRepo.update(id, namePanel);
  }
}

