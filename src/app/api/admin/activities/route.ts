import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get the user's session token from cookies or headers
    const authHeader = request.headers.get('authorization');
    let token = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else {
      // Try to get token from cookies (if using session-based auth)
      const cookies = request.headers.get('cookie');
      if (cookies) {
        const tokenMatch = cookies.match(/token=([^;]+)/);
        if (tokenMatch) {
          token = tokenMatch[1];
        }
      }
    }
    
    if (!token) {
      console.log('🔍 No token found in request');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Replace this URL with your actual backend URL
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000';
    const fullUrl = `${backendUrl}/api/admin/activities`;
    
    console.log('🔍 Frontend API Route: Attempting to fetch activities from:', fullUrl);
    console.log('🔑 Using token:', token.substring(0, 20) + '...');
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('📡 Backend Response Status:', response.status);
    console.log('📡 Backend Response Headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Backend Error Response:', errorText);
      throw new Error(`Backend responded with status: ${response.status}: ${errorText}`);
    }

    const activities = await response.json();
    console.log('✅ Successfully fetched activities from backend');
    console.log('📊 Activities count:', activities.length);
    
    return NextResponse.json(activities);
    
  } catch (error) {
    console.error('💥 Error fetching activities from backend:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch activities from backend',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
