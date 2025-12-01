import { Panel } from '@/generated/prisma';

// Port: abstraction for panel persistence
export interface PanelRepository {
  create(namePanel: string): Promise<Panel>;

  findById(id: number): Promise<Panel | null>;

  findAll(): Promise<Panel[]>;

  update(id: number, namePanel: string): Promise<Panel>;

  delete(id: number): Promise<void>;
}

