// ElectricityBillContainer wires up feature-specific implementations and exposes usecases.
import { PrismaElectricityBillRepository } from '@/lib/features/electricity-bills/infrastructure/adapter/ElectricityBillRepositoryPrisma';
import { CreateElectricityBillUseCase } from '@/lib/features/electricity-bills/application/usecase/CreateElectricityBillUseCase';
import { GetElectricityBillUseCase } from '@/lib/features/electricity-bills/application/usecase/GetElectricityBillUseCase';
import { ListElectricityBillsUseCase } from '@/lib/features/electricity-bills/application/usecase/ListElectricityBillsUseCase';
import { UpdateElectricityBillUseCase } from '@/lib/features/electricity-bills/application/usecase/UpdateElectricityBillUseCase';
import { DeleteElectricityBillUseCase } from '@/lib/features/electricity-bills/application/usecase/DeleteElectricityBillUseCase';

export class ElectricityBillContainer {
  static instance: ElectricityBillContainer | null = null;

  billRepo = new PrismaElectricityBillRepository();

  createBillUseCase = new CreateElectricityBillUseCase(this.billRepo);
  getBillUseCase = new GetElectricityBillUseCase(this.billRepo);
  listBillsUseCase = new ListElectricityBillsUseCase(this.billRepo);
  updateBillUseCase = new UpdateElectricityBillUseCase(this.billRepo);
  deleteBillUseCase = new DeleteElectricityBillUseCase(this.billRepo);

  private constructor() {}

  static getInstance() {
    if (!ElectricityBillContainer.instance)
      ElectricityBillContainer.instance = new ElectricityBillContainer();
    return ElectricityBillContainer.instance;
  }
}

