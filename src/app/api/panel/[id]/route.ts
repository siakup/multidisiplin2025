import { NextRequest, NextResponse } from 'next/server';
import { PanelContainer } from '@/lib/features/panel/PanelContainer';
import { parseUpdatePanel } from '@/lib/features/panel/presentation/dto/UpdatePanelDto';

// GET /api/panel/[id] - Get panel by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const panelId = parseInt(id, 10);

    if (isNaN(panelId)) {
      return NextResponse.json({ error: 'Invalid panel ID' }, { status: 400 });
    }

    const container = PanelContainer.getInstance();
    const panel = await container.getPanelUseCase.execute(panelId);

    return NextResponse.json(panel);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
  }
}

// PUT /api/panel/[id] - Update panel
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const panelId = parseInt(id, 10);

    if (isNaN(panelId)) {
      return NextResponse.json({ error: 'Invalid panel ID' }, { status: 400 });
    }

    const body = await req.json();
    const updateData = parseUpdatePanel(body);

    if (!updateData.namePanel) {
      return NextResponse.json({ error: 'Name Panel is required' }, { status: 400 });
    }

    const container = PanelContainer.getInstance();
    const panel = await container.updatePanelUseCase.execute(panelId, updateData.namePanel);

    return NextResponse.json(panel);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
  }
}

// DELETE /api/panel/[id] - Delete panel
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const panelId = parseInt(id, 10);

    if (isNaN(panelId)) {
      return NextResponse.json({ error: 'Invalid panel ID' }, { status: 400 });
    }

    const container = PanelContainer.getInstance();
    await container.deletePanelUseCase.execute(panelId);

    return NextResponse.json({ message: 'Panel deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
  }
}

