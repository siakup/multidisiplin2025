import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/common/database/PrismaClient';
import { requireApiAuth } from '@/lib/server/auth/requireApiAuth';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

export async function GET(req: NextRequest) {
    const authResult = await requireApiAuth(req, {
        allowedRoles: ['Student Housing', 'student housing', 'STUDENT_HOUSING'],
    });

    if (authResult instanceof NextResponse) return authResult;
    if ('response' in authResult) return authResult.response;

    const { searchParams } = new URL(req.url);
    const exportFormat = searchParams.get('format') || 'csv';

    try {
        // 1. Fetch Electricity Bills for Student Housing
        const bills = await prisma.electricityBill.findMany({
            where: {
                panel: {
                    category: 'STUDENT_HOUSING',
                },
            },
            include: {
                panel: true,
                user: true,
            },
            orderBy: {
                billingMonth: 'desc',
            },
        });

        // 2. Fetch Dorm Records
        const dormRecords = await prisma.dormRecord.findMany({
            orderBy: {
                period: 'desc',
            },
        });

        if (exportFormat === 'csv') {
            return generateCSV(bills, dormRecords);
        } else if (exportFormat === 'pdf') {
            return generatePDF(bills, dormRecords);
        } else {
            return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
        }
    } catch (error: any) {
        console.error('Export error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

function generateCSV(bills: any[], dormRecords: any[]) {
    let csv = 'REKAP DATA STUDENT HOUSING\n\n';

    // Section 1: Electricity Bills
    csv += 'TAGIHAN LISTRIK PANEL ASRAMA\n';
    csv += 'ID,Panel,Bulan,Penggunaan (kWh),Total Tagihan,Status\n';
    bills.forEach((b) => {
        const month = format(new Date(b.billingMonth), 'MMMM yyyy');
        csv += `${b.id},"${b.panel.namePanel}","${month}",${b.kwhUse},${b.totalBills},"${b.statusPay}"\n`;
    });

    csv += '\n\nRECORD PENGGUNAAN ASRAMA (DORM RECORD)\n';
    csv += 'ID,Periode,Nama Asrama,Total kWh,Total Tagihan\n';
    dormRecords.forEach((r) => {
        const period = format(new Date(r.period), 'MMMM yyyy');
        csv += `${r.id},"${period}","${r.dormName}",${r.totalKwh},${r.billAmount}\n`;
    });

    return new NextResponse(csv, {
        headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="student_housing_export_${format(new Date(), 'yyyyMMdd')}.csv"`,
        },
    });
}

function generatePDF(bills: any[], dormRecords: any[]) {
    const doc = new jsPDF() as any;
    const now = new Date();
    const dateStr = format(now, 'dd/MM/yyyy HH:mm');

    doc.setFontSize(18);
    doc.text('Rekap Data Student Housing', 14, 20);
    doc.setFontSize(10);
    doc.text(`Dicetak pada: ${dateStr}`, 14, 28);

    // Section 1: Electricity Bills
    doc.setFontSize(14);
    doc.text('Tagihan Listrik Panel Asrama', 14, 40);

    const billRows = bills.map((b) => [
        b.panel.namePanel,
        format(new Date(b.billingMonth), 'MMMM yyyy'),
        `${b.kwhUse} kWh`,
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(b.totalBills)),
        b.statusPay
    ]);

    doc.autoTable({
        startY: 45,
        head: [['Panel', 'Bulan', 'kWh', 'Total Tagihan', 'Status']],
        body: billRows,
    });

    // Section 2: Dorm Records
    const finalY = (doc as any).lastAutoTable.finalY || 50;
    doc.setFontSize(14);
    doc.text('Record Penggunaan Asrama (Dorm Record)', 14, finalY + 15);

    const dormRows = dormRecords.map((r) => [
        r.dormName,
        format(new Date(r.period), 'MMMM yyyy'),
        `${r.totalKwh} kWh`,
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(r.billAmount)
    ]);

    doc.autoTable({
        startY: finalY + 20,
        head: [['Nama Asrama', 'Periode', 'Total kWh', 'Total Tagihan']],
        body: dormRows,
    });

    const pdfOutput = doc.output('arraybuffer');

    return new NextResponse(pdfOutput, {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="student_housing_export_${format(now, 'yyyyMMdd')}.pdf"`,
        },
    });
}
