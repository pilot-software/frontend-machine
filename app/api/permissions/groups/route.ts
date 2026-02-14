import { NextRequest, NextResponse } from 'next/server';

const PERMISSION_SERVICE_URL = process.env.PERMISSION_SERVICE_URL || 'http://localhost:8080';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    const response = await fetch(`${PERMISSION_SERVICE_URL}/api/permissions/groups`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader || '',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch permission groups' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Permission groups API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const body = await request.json();
    
    const response = await fetch(`${PERMISSION_SERVICE_URL}/api/permissions/groups`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to create permission group' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Permission groups API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}