import { PanelRepository } from '@/lib/features/panel/domain/port/PanelRepository';
import { AppError } from '@/lib/common/errors/AppError';

export class DeletePanelUseCase {
  constructor(private panelRepo: PanelRepository) {}

  async execute(id: number) {
    const existingPanel = await this.panelRepo.findById(id);
    if (!existingPanel) {
      throw new AppError('Panel not found', 404);
    }

    await this.panelRepo.delete(id);
  }
}

