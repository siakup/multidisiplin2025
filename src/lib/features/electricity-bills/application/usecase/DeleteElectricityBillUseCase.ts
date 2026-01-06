import { ElectricityBillRepository } from '@/lib/features/electricity-bills/domain/port/ElectricityBillRepository';
import { AppError } from '@/lib/common/errors/AppError';

export class DeleteElectricityBillUseCase {
  constructor(private billRepo: ElectricityBillRepository) {}

  async execute(id: number) {
    const existingBill = await this.billRepo.findById(id);
    if (!existingBill) {
      throw new AppError('Electricity bill not found', 404);
    }

    await this.billRepo.delete(id);
  }
}

