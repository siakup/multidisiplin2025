import { PanelRepository } from '@/lib/features/panel/domain/port/PanelRepository';
import { AppError } from '@/lib/common/errors/AppError';

export class CreatePanelUseCase {
  constructor(private panelRepo: PanelRepository) {}

  async execute(namePanel: string) {
    const panel = await this.panelRepo.create(namePanel);
    return panel;
  }
}

