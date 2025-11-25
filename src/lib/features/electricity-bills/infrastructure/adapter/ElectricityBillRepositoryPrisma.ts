import prisma from '@/lib/common/database/PrismaClient';
import { ElectricityBillRepository } from '@/lib/features/electricity-bills/domain/port/ElectricityBillRepository';
import { ElectricityBill } from '@/generated/prisma';

export class PrismaElectricityBillRepository implements ElectricityBillRepository {
  async create(data: {
    panelId: number;
    userId: number;
    billingMonth: Date;
    kwhUse: number;
    vaStatus?: string;
    totalBills: number;
  }): Promise<ElectricityBill> {
    return prisma.electricityBill.create({
      data: {
        panelId: data.panelId,
        userId: data.userId,
        billingMonth: data.billingMonth,
        kwhUse: data.kwhUse,
        vaStatus: data.vaStatus,
        totalBills: data.totalBills,
      },
      include: {
        panel: true,
        user: true,
      },
    });
  }

  async findById(id: number): Promise<ElectricityBill | null> {
    return prisma.electricityBill.findUnique({
      where: { id },
      include: {
        panel: true,
        user: true,
      },
    });
  }

  async findAll(filters?: {
    userId?: number;
    panelId?: number;
    billingMonth?: Date;
  }): Promise<ElectricityBill[]> {
    const where: any = {};

    if (filters?.userId) {
      where.userId = filters.userId;
    }

    if (filters?.panelId) {
      where.panelId = filters.panelId;
    }

    if (filters?.billingMonth) {
      const startOfMonth = new Date(filters.billingMonth);
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const endOfMonth = new Date(filters.billingMonth);
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);
      endOfMonth.setDate(0);
      endOfMonth.setHours(23, 59, 59, 999);

      where.billingMonth = {
        gte: startOfMonth,
        lte: endOfMonth,
      };
    }

    return prisma.electricityBill.findMany({
      where,
      include: {
        panel: true,
        user: true,
      },
      orderBy: { billingMonth: 'desc' },
    });
  }

  async update(
    id: number,
    data: {
      panelId?: number;
      billingMonth?: Date;
      kwhUse?: number;
      vaStatus?: string;
      totalBills?: number;
    }
  ): Promise<ElectricityBill> {
    return prisma.electricityBill.update({
      where: { id },
      data: {
        ...(data.panelId !== undefined && { panelId: data.panelId }),
        ...(data.billingMonth !== undefined && { billingMonth: data.billingMonth }),
        ...(data.kwhUse !== undefined && { kwhUse: data.kwhUse }),
        ...(data.vaStatus !== undefined && { vaStatus: data.vaStatus }),
        ...(data.totalBills !== undefined && { totalBills: data.totalBills }),
      },
      include: {
        panel: true,
        user: true,
      },
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.electricityBill.delete({
      where: { id },
    });
  }
}

