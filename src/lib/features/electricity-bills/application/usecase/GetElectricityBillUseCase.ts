import { ElectricityBillRepository } from '@/lib/features/electricity-bills/domain/port/ElectricityBillRepository';
import { AppError } from '@/lib/common/errors/AppError';

export class GetElectricityBillUseCase {
  constructor(private billRepo: ElectricityBillRepository) {}

  async execute(id: number) {
    const bill = await this.billRepo.findById(id);
    if (!bill) {
      throw new AppError('Electricity bill not found', 404);
    }
    return bill;
  }
}

