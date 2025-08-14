import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    console.log('🔐 Login attempt for:', email);
    
    // Call your backend login endpoint
    const response = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Login failed:', errorData);
      return NextResponse.json(
        { success: false, error: errorData.error || 'Login failed' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Login successful for:', email);
    
    return NextResponse.json({
      success: true,
      token: data.token,
      user: data.user,
    });
    
  } catch (error) {
    console.error('💥 Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
