import { NextRequest, NextResponse } from 'next/server';

const PERMISSION_SERVICE_URL = process.env.PERMISSION_SERVICE_URL || 'http://localhost:8080';

export async function DELETE(request: NextRequest, { params }: { params: { userId: string; permissionId: string } }) {
  try {
    const authHeader = request.headers.get('authorization');
    
    const response = await fetch(`${PERMISSION_SERVICE_URL}/api/permissions/users/${params.userId}/custom/${params.permissionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader || '',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to revoke custom permission from user' },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('User custom permission revoke API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}