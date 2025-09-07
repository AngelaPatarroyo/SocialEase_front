import { jwtDecode } from 'jwt-decode';

export interface DecodedToken {
  userId?: string;
  id?: string;
  email?: string;
  role?: string;
  iat?: number;
  exp?: number;
  [key: string]: any;
}

/**
 * Validates a JWT token and returns decoded data if valid
 * @param token - The JWT token to validate
 * @returns Object with validation result and decoded token data
 */
export const validateJWTToken = (token: string | null): {
  isValid: boolean;
  isExpired: boolean;
  decodedToken: DecodedToken | null;
  error?: string;
} => {
  if (!token) {
    return {
      isValid: false,
      isExpired: false,
      decodedToken: null,
      error: 'No token provided'
    };
  }

  try {
    // Decode the token
    const decodedToken = jwtDecode<DecodedToken>(token);
    
    // Check if token has required fields
    if (!decodedToken) {
      return {
        isValid: false,
        isExpired: false,
        decodedToken: null,
        error: 'Token could not be decoded'
      };
    }

    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    const isExpired = decodedToken.exp ? decodedToken.exp < now : false;

    return {
      isValid: !isExpired,
      isExpired,
      decodedToken,
      error: isExpired ? 'Token has expired' : undefined
    };

  } catch (error) {
    console.error('JWT validation error:', error);
    return {
      isValid: false,
      isExpired: false,
      decodedToken: null,
      error: 'Invalid token format'
    };
  }
};

/**
 * Gets a valid token from localStorage, clearing it if invalid/expired
 * @returns Valid token string or null
 */
export const getValidToken = (): string | null => {
  const token = localStorage.getItem('token');
  const validation = validateJWTToken(token);
  
  if (!validation.isValid) {
    // Clear invalid/expired token
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Only warn if there was actually a token that was invalid/expired
    if (token && validation.error !== 'No token provided') {
      console.warn('Invalid or expired token cleared:', validation.error);
    }
    return null;
  }
  
  return token;
};

/**
 * Checks if current token is valid without clearing it
 * @returns boolean indicating if token is valid
 */
export const isTokenValid = (): boolean => {
  const token = localStorage.getItem('token');
  const validation = validateJWTToken(token);
  return validation.isValid;
};
