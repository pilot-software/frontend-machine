import { NextRequest, NextResponse } from 'next/server';

const PERMISSION_SERVICE_URL = process.env.PERMISSION_SERVICE_URL || 'http://localhost:8080';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get('authorization');
    const body = await request.json();
    
    const response = await fetch(`${PERMISSION_SERVICE_URL}/api/permissions/organization/permissions/${params.id}/toggle`, {
      method: 'PUT',
      headers: {
        'Authorization': authHeader || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to toggle organization permission' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Organization permission toggle API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}