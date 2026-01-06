import { ElectricityBillRepository } from '@/lib/features/electricity-bills/domain/port/ElectricityBillRepository';

export class ListElectricityBillsUseCase {
  constructor(private billRepo: ElectricityBillRepository) {}

  async execute(filters?: {
    userId?: number;
    panelId?: number;
    billingMonth?: Date;
  }) {
    return this.billRepo.findAll(filters);
  }
}

