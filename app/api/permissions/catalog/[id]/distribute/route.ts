import { NextRequest, NextResponse } from 'next/server';

const PERMISSION_SERVICE_URL = process.env.PERMISSION_SERVICE_URL || 'http://localhost:8080';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    console.log('Frontend API - Received ID:', id);
    console.log('Frontend API - ID type:', typeof id);
    console.log('Frontend API - Full params:', JSON.stringify({ id }));
    
    const authHeader = request.headers.get('authorization');
    const body = await request.json();
    
    console.log('Calling backend:', `${PERMISSION_SERVICE_URL}/api/permissions/catalog/${id}/distribute`);
    
    const response = await fetch(`${PERMISSION_SERVICE_URL}/api/permissions/catalog/${id}/distribute`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error:', errorText);
      return NextResponse.json(
        { error: 'Failed to distribute permission' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Permission distribute API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
