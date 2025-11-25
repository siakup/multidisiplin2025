import { ElectricityBillRepository } from '@/lib/features/electricity-bills/domain/port/ElectricityBillRepository';
import { AppError } from '@/lib/common/errors/AppError';
import prisma from '@/lib/common/database/PrismaClient';

export class UpdateElectricityBillUseCase {
  constructor(private billRepo: ElectricityBillRepository) {}

  async execute(
    id: number,
    data: {
      panelId?: number;
      billingMonth?: Date;
      kwhUse?: number;
      vaStatus?: string;
      totalBills?: number;
    }
  ) {
    const existingBill = await this.billRepo.findById(id);
    if (!existingBill) {
      throw new AppError('Electricity bill not found', 404);
    }

    // Validate panel exists if panelId is being updated
    if (data.panelId !== undefined) {
      const panel = await prisma.panel.findUnique({ where: { id: data.panelId } });
      if (!panel) {
        throw new AppError('Panel not found', 404);
      }
    }

    return this.billRepo.update(id, data);
  }
}

