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
    const fullUrl = `${backendUrl}/api/admin/feedback`;
    
    console.log('🔍 Frontend API Route: Attempting to fetch feedback from:', fullUrl);
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

    const feedback = await response.json();
    console.log('✅ Successfully fetched feedback from backend');
    console.log('📊 Feedback type:', typeof feedback);
    console.log('📊 Is array?', Array.isArray(feedback));
    console.log('📊 Feedback length:', Array.isArray(feedback) ? feedback.length : 'N/A');
    console.log('📊 First item sample:', Array.isArray(feedback) && feedback.length > 0 ? feedback[0] : 'No items');
    
    return NextResponse.json(feedback);
  } catch (error) {
    console.error('💥 Error fetching feedback from backend:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch feedback from backend',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
