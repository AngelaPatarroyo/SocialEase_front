import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000';
    const testUrl = `${backendUrl}/api/admin/users`;
    
    console.log('🧪 Testing backend connection to:', testUrl);
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json({
      success: true,
      backendUrl,
      testUrl,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('🧪 Backend connection test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      backendUrl: process.env.BACKEND_URL || 'http://localhost:3001',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
