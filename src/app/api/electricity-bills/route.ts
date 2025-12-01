import { NextRequest, NextResponse } from 'next/server';
import { ElectricityBillContainer } from '@/lib/features/electricity-bills/ElectricityBillContainer';
import { parseCreateElectricityBill } from '@/lib/features/electricity-bills/presentation/dto/CreateElectricityBillDto';
import { parseListElectricityBills } from '@/lib/features/electricity-bills/presentation/dto/ListElectricityBillsDto';
import { requireApiAuth } from '@/lib/server/auth/requireApiAuth';

const facilityRoles = ['Facility management', 'facility_management', 'FACILITY_MANAGEMENT'];
const facilityUsernames = ['Facility management'];

// GET /api/electricity-bills - List all electricity bills with optional filters
export async function GET(req: NextRequest) {
  try {
    const auth = await requireApiAuth(req, {
      allowedRoles: facilityRoles,
      allowedUsernames: facilityUsernames,
    });
    if ('response' in auth) return auth.response;

    const { searchParams } = new URL(req.url);
    const filters: any = {};

    if (searchParams.get('userId')) {
      filters.userId = parseInt(searchParams.get('userId')!, 10);
    }
    if (searchParams.get('panelId')) {
      filters.panelId = parseInt(searchParams.get('panelId')!, 10);
    }
    if (searchParams.get('billingMonth')) {
      filters.billingMonth = new Date(searchParams.get('billingMonth')!);
    }

    const container = ElectricityBillContainer.getInstance();
    const bills = await container.listBillsUseCase.execute(Object.keys(filters).length > 0 ? filters : undefined);

    return NextResponse.json(bills);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
  }
}

// POST /api/electricity-bills - Create a new electricity bill
export async function POST(req: NextRequest) {
  try {
    const auth = await requireApiAuth(req, {
      allowedRoles: facilityRoles,
      allowedUsernames: facilityUsernames,
    });
    if ('response' in auth) return auth.response;

    const body = await req.json();
    const data = parseCreateElectricityBill(body);

    const container = ElectricityBillContainer.getInstance();
    const billingMonth = data.billingMonth instanceof Date ? data.billingMonth : new Date(data.billingMonth);
    
    const bill = await container.createBillUseCase.execute({
      panelId: data.panelId,
      userId: data.userId,
      billingMonth,
      kwhUse: data.kwhUse,
      vaStatus: data.vaStatus,
      totalBills: data.totalBills,
      statusPay: data.statusPay,
    });

    return NextResponse.json(bill, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
  }
}

