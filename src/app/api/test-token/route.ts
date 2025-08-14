import { NextRequest, NextResponse } from 'next/server';

// Function to decode JWT token
const decodeToken = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

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
    
    // Also check for referer to see if we're on a different port
    const referer = request.headers.get('referer');
    console.log('🔍 Referer:', referer);
    console.log('🔍 Auth header:', authHeader ? 'Present' : 'Missing');
    console.log('🔍 Cookies:', request.headers.get('cookie') ? 'Present' : 'Missing');
    
    if (!token) {
      return NextResponse.json({
        error: 'No token found',
        message: 'Please log in to get a valid token',
        debug: {
          hasAuthHeader: !!authHeader,
          authHeaderValue: authHeader ? authHeader.substring(0, 50) + '...' : null,
          hasCookies: !!request.headers.get('cookie'),
          cookieValue: request.headers.get('cookie') ? request.headers.get('cookie')?.substring(0, 100) + '...' : null
        }
      }, { status: 401 });
    }
    
    // Decode the token
    const tokenData = decodeToken(token);
    
    if (!tokenData) {
      return NextResponse.json({
        error: 'Invalid token format',
        message: 'The token could not be decoded',
        debug: {
          tokenLength: token.length,
          tokenStart: token.substring(0, 20) + '...',
          tokenEnd: '...' + token.substring(token.length - 20),
          hasThreeParts: token.split('.').length === 3
        }
      }, { status: 400 });
    }
    
    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    const isExpired = tokenData.exp && tokenData.exp < now;
    
    return NextResponse.json({
      success: true,
      tokenInfo: {
        userId: tokenData.userId || tokenData.id,
        email: tokenData.email,
        role: tokenData.role,
        issuedAt: tokenData.iat ? new Date(tokenData.iat * 1000).toISOString() : 'Unknown',
        expiresAt: tokenData.exp ? new Date(tokenData.exp * 1000).toISOString() : 'Unknown',
        isExpired: isExpired,
        hasAdminRole: tokenData.role === 'admin'
      },
      fullTokenData: tokenData
    });
    
  } catch (error) {
    console.error('Error testing token:', error);
    return NextResponse.json({
      error: 'Failed to test token',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
