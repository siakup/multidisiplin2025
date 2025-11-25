import { NextRequest, NextResponse } from 'next/server';
import { ElectricityBillContainer } from '@/lib/features/electricity-bills/ElectricityBillContainer';
import { parseUpdateElectricityBill } from '@/lib/features/electricity-bills/presentation/dto/UpdateElectricityBillDto';
import { requireApiAuth } from '@/lib/server/auth/requireApiAuth';

const facilityRoles = ['Facility management', 'facility_management', 'FACILITY_MANAGEMENT'];
const facilityUsernames = ['Facility management'];

// GET /api/electricity-bills/[id] - Get electricity bill by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireApiAuth(req, {
      allowedRoles: facilityRoles,
      allowedUsernames: facilityUsernames,
    });
    if ('response' in auth) return auth.response;

    const { id } = await params;
    const billId = parseInt(id, 10);

    if (isNaN(billId)) {
      return NextResponse.json({ error: 'Invalid bill ID' }, { status: 400 });
    }

    const container = ElectricityBillContainer.getInstance();
    const bill = await container.getBillUseCase.execute(billId);

    return NextResponse.json(bill);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
  }
}

// PUT /api/electricity-bills/[id] - Update electricity bill
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireApiAuth(req, {
      allowedRoles: facilityRoles,
      allowedUsernames: facilityUsernames,
    });
    if ('response' in auth) return auth.response;

    const { id } = await params;
    const billId = parseInt(id, 10);

    if (isNaN(billId)) {
      return NextResponse.json({ error: 'Invalid bill ID' }, { status: 400 });
    }

    const body = await req.json();
    const updateData = parseUpdateElectricityBill(body);

    // Convert billingMonth to Date if it's a string
    const processedData = {
      ...updateData,
      billingMonth: updateData.billingMonth
        ? updateData.billingMonth instanceof Date
          ? updateData.billingMonth
          : new Date(updateData.billingMonth)
        : undefined,
    };

    const container = ElectricityBillContainer.getInstance();
    const bill = await container.updateBillUseCase.execute(billId, processedData);

    return NextResponse.json(bill);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
  }
}

// DELETE /api/electricity-bills/[id] - Delete electricity bill
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireApiAuth(req, {
      allowedRoles: facilityRoles,
      allowedUsernames: facilityUsernames,
    });
    if ('response' in auth) return auth.response;

    const { id } = await params;
    const billId = parseInt(id, 10);

    if (isNaN(billId)) {
      return NextResponse.json({ error: 'Invalid bill ID' }, { status: 400 });
    }

    const container = ElectricityBillContainer.getInstance();
    await container.deleteBillUseCase.execute(billId);

    return NextResponse.json({ message: 'Electricity bill deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
  }
}

