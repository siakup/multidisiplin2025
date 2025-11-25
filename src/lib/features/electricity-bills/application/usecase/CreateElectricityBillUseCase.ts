import { ElectricityBillRepository } from '@/lib/features/electricity-bills/domain/port/ElectricityBillRepository';
import { AppError } from '@/lib/common/errors/AppError';
import prisma from '@/lib/common/database/PrismaClient';

export class CreateElectricityBillUseCase {
  constructor(private billRepo: ElectricityBillRepository) {}

  async execute(data: {
    panelId: number;
    userId: number;
    billingMonth: Date;
    kwhUse: number;
    vaStatus?: string;
    totalBills: number;
    statusPay?: string;
  }) {
    // Validate panel exists
    const panel = await prisma.panel.findUnique({ where: { id: data.panelId } });
    if (!panel) {
      throw new AppError('Panel not found', 404);
    }

    // Validate user exists
    const user = await prisma.user.findUnique({ where: { id: data.userId } });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const bill = await this.billRepo.create(data);
    return bill;
  }
}

