// PanelContainer wires up feature-specific implementations and exposes usecases.
import { PrismaPanelRepository } from '@/lib/features/panel/infrastructure/adapter/PanelRepositoryPrisma';
import { CreatePanelUseCase } from '@/lib/features/panel/application/usecase/CreatePanelUseCase';
import { GetPanelUseCase } from '@/lib/features/panel/application/usecase/GetPanelUseCase';
import { ListPanelsUseCase } from '@/lib/features/panel/application/usecase/ListPanelsUseCase';
import { UpdatePanelUseCase } from '@/lib/features/panel/application/usecase/UpdatePanelUseCase';
import { DeletePanelUseCase } from '@/lib/features/panel/application/usecase/DeletePanelUseCase';

export class PanelContainer {
  static instance: PanelContainer | null = null;

  panelRepo = new PrismaPanelRepository();

  createPanelUseCase = new CreatePanelUseCase(this.panelRepo);
  getPanelUseCase = new GetPanelUseCase(this.panelRepo);
  listPanelsUseCase = new ListPanelsUseCase(this.panelRepo);
  updatePanelUseCase = new UpdatePanelUseCase(this.panelRepo);
  deletePanelUseCase = new DeletePanelUseCase(this.panelRepo);

  private constructor() {}

  static getInstance() {
    if (!PanelContainer.instance) PanelContainer.instance = new PanelContainer();
    return PanelContainer.instance;
  }
}

