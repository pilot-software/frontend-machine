import { NextRequest, NextResponse } from 'next/server';

const PERMISSION_SERVICE_URL = process.env.PERMISSION_SERVICE_URL || 'http://localhost:8080';

export async function POST(request: NextRequest, context: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await context.params;
    const authHeader = request.headers.get('authorization');
    const body = await request.json();
    
    const response = await fetch(`${PERMISSION_SERVICE_URL}/api/permissions/users/${userId}/groups`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to assign groups to user' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('User group assignment API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}