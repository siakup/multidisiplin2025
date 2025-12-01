import { NextRequest, NextResponse } from 'next/server';
import { PanelContainer } from '@/lib/features/panel/PanelContainer';
import { parseCreatePanel } from '@/lib/features/panel/presentation/dto/CreatePanelDto';

// GET /api/panel - List all panels
export async function GET(req: NextRequest) {
  try {
    const container = PanelContainer.getInstance();
    const panels = await container.listPanelsUseCase.execute();

    return NextResponse.json(panels);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
  }
}

// POST /api/panel - Create a new panel
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { namePanel } = parseCreatePanel(body);

    const container = PanelContainer.getInstance();
    const panel = await container.createPanelUseCase.execute(namePanel);

    return NextResponse.json(panel, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
  }
}

