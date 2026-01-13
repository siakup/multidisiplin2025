import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/common/database/PrismaClient';
import { requireApiAuth } from '@/lib/server/auth/requireApiAuth';

export async function GET(req: NextRequest) {
    const authResult = await requireApiAuth(req, {
        allowedRoles: ['Facility Management', 'facility_management', 'FACILITY_MANAGEMENT']
    });

    if (authResult instanceof NextResponse) return authResult;

    try {
        const { searchParams } = new URL(req.url);
        const startMonth = searchParams.get('startMonth'); // YYYY-MM
        const endMonth = searchParams.get('endMonth');     // YYYY-MM
        const threshold = Number(searchParams.get('threshold')) || 100; // Default 100 kWh for campus

        if (!startMonth || !endMonth) {
            return NextResponse.json(
                { error: 'Start month and end month are required' },
                { status: 400 }
            );
        }

        const startDate = new Date(`${startMonth}-01`);
        // End date should be the last day of the end month
        const endDate = new Date(new Date(`${endMonth}-01`).setMonth(new Date(`${endMonth}-01`).getMonth() + 1));

        // 1. Get all panels for Facility Management
        const panels = await prisma.panel.findMany({
            where: {
                category: 'FACILITY_MANAGEMENT' // Adjust if your enum is different
            },
            select: {
                id: true,
                namePanel: true
            }
        });

        // 2. Aggregate bills within the date range
        const bills = await prisma.electricityBill.groupBy({
            by: ['panelId'],
            where: {
                billingMonth: {
                    gte: startDate,
                    lt: endDate
                },
                panel: {
                    category: 'FACILITY_MANAGEMENT'
                }
            },
            _sum: {
                kwhUse: true,
                totalBills: true
            }
        });

        // 3. Merge data
        const analysisMap = new Map();

        // Initialize with all panels (to catch those with 0 usage)
        panels.forEach(p => {
            analysisMap.set(p.id, {
                panelName: p.namePanel,
                totalKwh: 0,
                totalCost: 0,
                status: 'Inactive (Unused)', // Default to inactive
                emissions: 0
            });
        });

        // Update with actual usage
        bills.forEach(b => {
            const kwh = b._sum.kwhUse || 0;
            const cost = b._sum.totalBills || 0;
            const status = kwh >= threshold ? 'Active (In Use)' : 'Inactive (Unused)';
            const emissions = kwh * 0.85; // 0.85 kg CO2e/kWh

            analysisMap.set(b.panelId, {
                panelName: analysisMap.get(b.panelId)?.panelName || 'Unknown',
                totalKwh: kwh,
                totalCost: cost,
                status: status,
                emissions: emissions
            });
        });

        const results = Array.from(analysisMap.values());

        return NextResponse.json({
            period: `${startMonth} to ${endMonth}`,
            thresholdUsed: threshold,
            summary: {
                totalActive: results.filter(r => r.status === 'Active (In Use)').length,
                totalInactive: results.filter(r => r.status === 'Inactive (Unused)').length,
                totalEmissions: results.reduce((acc, curr) => acc + curr.emissions, 0)
            },
            data: results.sort((a, b) => b.totalKwh - a.totalKwh)
        });

    } catch (error: any) {
        console.error('Analysis error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
