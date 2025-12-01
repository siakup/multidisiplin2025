import { PanelRepository } from '@/lib/features/panel/domain/port/PanelRepository';

export class ListPanelsUseCase {
  constructor(private panelRepo: PanelRepository) {}

  async execute() {
    return this.panelRepo.findAll();
  }
}

