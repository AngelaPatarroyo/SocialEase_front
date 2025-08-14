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
    const fullUrl = `${backendUrl}/api/admin/users`;
    
    console.log('🔍 Frontend API Route: Attempting to fetch users from:', fullUrl);
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

    const users = await response.json();
    console.log('✅ Successfully fetched users:', users);
    return NextResponse.json(users);
  } catch (error) {
    console.error('💥 Error fetching users from backend:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch users from backend',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
    
    // Get the user data from the request body
    const userData = await request.json();
    console.log('📝 Creating user with data:', userData);
    
    // Replace this URL with your actual backend URL
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000';
    const fullUrl = `${backendUrl}/api/admin/users`;
    
    console.log('🔍 Frontend API Route: Attempting to create user at:', fullUrl);
    console.log('🔑 Using token:', token.substring(0, 20) + '...');
    
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    console.log('📡 Backend Response Status:', response.status);
    console.log('📡 Backend Response Headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Backend Error Response:', errorText);
      throw new Error(`Backend responded with status: ${response.status}: ${errorText}`);
    }

    const createdUser = await response.json();
    console.log('✅ Successfully created user:', createdUser);
    return NextResponse.json(createdUser);
  } catch (error) {
    console.error('💥 Error creating user in backend:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create user in backend',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
