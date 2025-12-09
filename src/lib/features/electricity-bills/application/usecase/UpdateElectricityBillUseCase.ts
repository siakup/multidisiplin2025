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

    // Validate unique constraint: 1 panel = 1 data per month
    // Only check if panelId or billingMonth is being updated
    if (data.panelId !== undefined || data.billingMonth !== undefined) {
      const checkPanelId = data.panelId ?? existingBill.panelId;
      const checkBillingMonth = data.billingMonth ?? existingBill.billingMonth;

      const billingDate = new Date(checkBillingMonth);
      const startOfMonth = new Date(billingDate.getFullYear(), billingDate.getMonth(), 1);
      const endOfMonth = new Date(billingDate.getFullYear(), billingDate.getMonth() + 1, 0, 23, 59, 59, 999);

      const duplicateBill = await prisma.electricityBill.findFirst({
        where: {
          id: { not: id }, // Exclude current bill
          panelId: checkPanelId,
          billingMonth: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        include: {
          panel: true,
        },
      });

      if (duplicateBill) {
        throw new AppError(
          `Data untuk panel ${duplicateBill.panel.namePanel} pada bulan ${billingDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })} sudah ada. Satu panel hanya bisa memiliki satu data per bulan.`,
          400
        );
      }
    }

    return this.billRepo.update(id, data);
  }
}

