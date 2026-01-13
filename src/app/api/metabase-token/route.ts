import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const dashboardType = searchParams.get('type') || 'student-housing';

        const METABASE_SITE_URL = process.env.METABASE_SITE_URL;
        const METABASE_SECRET_KEY = process.env.METABASE_SECRET_KEY;

        if (!METABASE_SITE_URL || !METABASE_SECRET_KEY) {
            return NextResponse.json(
                { error: 'Metabase configuration missing' },
                { status: 500 }
            );
        }

        // Get dashboard ID based on type
        const dashboardId =
            dashboardType === 'student-housing'
                ? process.env.METABASE_DASHBOARD_STUDENT_HOUSING || '5'
                : process.env.METABASE_DASHBOARD_FACILITY_MANAGEMENT || '4';

        console.log(`[Metabase Token] Type: ${dashboardType}, Dashboard ID: ${dashboardId}`);

        // Create JWT payload
        const payload = {
            resource: { dashboard: parseInt(dashboardId) },
            params: {},
            exp: Math.round(Date.now() / 1000) + 10 * 60, // 10 minute expiration
        };

        // Sign the token
        const token = jwt.sign(payload, METABASE_SECRET_KEY);

        // Generate iframe URL
        const iframeUrl = `${METABASE_SITE_URL}/embed/dashboard/${token}#bordered=true&titled=true`;

        console.log(`[Metabase Token] Generated URL: ${iframeUrl}`);

        return NextResponse.json({ url: iframeUrl });
    } catch (error: any) {
        console.error('Metabase token generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate Metabase token' },
            { status: 500 }
        );
    }
}
