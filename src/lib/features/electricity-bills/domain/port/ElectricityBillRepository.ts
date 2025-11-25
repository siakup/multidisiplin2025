import { ElectricityBill } from '@/generated/prisma';

// Port: abstraction for electricity bill persistence
export interface ElectricityBillRepository {
  create(data: {
    panelId: number;
    userId: number;
    billingMonth: Date;
    kwhUse: number;
    vaStatus?: string;
    totalBills: number;
  }): Promise<ElectricityBill>;

  findById(id: number): Promise<ElectricityBill | null>;

  findAll(filters?: {
    userId?: number;
    panelId?: number;
    billingMonth?: Date;
  }): Promise<ElectricityBill[]>;

  update(
    id: number,
    data: {
      panelId?: number;
      billingMonth?: Date;
      kwhUse?: number;
      vaStatus?: string;
      totalBills?: number;
    }
  ): Promise<ElectricityBill>;

  delete(id: number): Promise<void>;
}

