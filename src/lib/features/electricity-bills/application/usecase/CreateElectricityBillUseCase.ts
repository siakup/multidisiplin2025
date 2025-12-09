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

    // Validate unique constraint: 1 panel = 1 data per month
    // Check if data already exists for this panel in this month
    const billingDate = new Date(data.billingMonth);
    const startOfMonth = new Date(billingDate.getFullYear(), billingDate.getMonth(), 1);
    const endOfMonth = new Date(billingDate.getFullYear(), billingDate.getMonth() + 1, 0, 23, 59, 59, 999);

    const existingBill = await prisma.electricityBill.findFirst({
      where: {
        panelId: data.panelId,
        billingMonth: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    if (existingBill) {
      throw new AppError(
        `Data untuk panel ${panel.namePanel} pada bulan ${billingDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })} sudah ditambahkan. Satu panel hanya bisa memiliki satu data per bulan.`,
        400
      );
    }

    const bill = await this.billRepo.create(data);
    return bill;
  }
}

