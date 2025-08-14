import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Simple test: Attempting to connect to backend...');
    
    const response = await fetch('http://localhost:4000/api/admin/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('🧪 Backend response status:', response.status);
    console.log('🧪 Backend response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🧪 Backend error response:', errorText);
      return NextResponse.json({
        success: false,
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        timestamp: new Date().toISOString()
      });
    }

    const data = await response.json();
    console.log('🧪 Backend success response:', data);
    
    return NextResponse.json({
      success: true,
      status: response.status,
      data: data,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('🧪 Connection error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
