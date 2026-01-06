import prisma from '@/lib/common/database/PrismaClient';
import { PanelRepository } from '@/lib/features/panel/domain/port/PanelRepository';
import { Panel } from '@/generated/prisma';

export class PrismaPanelRepository implements PanelRepository {
  async create(namePanel: string): Promise<Panel> {
    return prisma.panel.create({
      data: { namePanel },
    });
  }

  async findById(id: number): Promise<Panel | null> {
    return prisma.panel.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<Panel[]> {
    return prisma.panel.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: number, namePanel: string): Promise<Panel> {
    return prisma.panel.update({
      where: { id },
      data: { namePanel },
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.panel.delete({
      where: { id },
    });
  }
}

