import { validateJWTToken, getValidToken, isTokenValid } from '../jwt';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('JWT Token Validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validateJWTToken', () => {
    it('should return invalid for null token', () => {
      const result = validateJWTToken(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('No token provided');
    });

    it('should return invalid for empty token', () => {
      const result = validateJWTToken('');
      expect(result.isValid).toBe(false);
    });

    it('should return invalid for malformed token', () => {
      const result = validateJWTToken('invalid.token');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid token format');
    });

    it('should return invalid for expired token', () => {
      // Create an expired token (exp: past timestamp)
      const expiredPayload = {
        userId: '123',
        exp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
        iat: Math.floor(Date.now() / 1000) - 7200, // 2 hours ago
      };
      
      const expiredToken = 'header.' + btoa(JSON.stringify(expiredPayload)) + '.signature';
      const result = validateJWTToken(expiredToken);
      
      expect(result.isValid).toBe(false);
      expect(result.isExpired).toBe(true);
      expect(result.error).toBe('Token has expired');
    });

    it('should return valid for non-expired token', () => {
      // Create a valid token (exp: future timestamp)
      const validPayload = {
        userId: '123',
        exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
        iat: Math.floor(Date.now() / 1000), // now
      };
      
      const validToken = 'header.' + btoa(JSON.stringify(validPayload)) + '.signature';
      const result = validateJWTToken(validToken);
      
      expect(result.isValid).toBe(true);
      expect(result.isExpired).toBe(false);
      expect(result.decodedToken).toEqual(validPayload);
    });
  });

  describe('getValidToken', () => {
    it('should return null and clear localStorage for invalid token', () => {
      localStorageMock.getItem.mockReturnValue('invalid.token');
      
      const result = getValidToken();
      
      expect(result).toBe(null);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
    });

    it('should return valid token from localStorage', () => {
      const validPayload = {
        userId: '123',
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
      };
      const validToken = 'header.' + btoa(JSON.stringify(validPayload)) + '.signature';
      
      localStorageMock.getItem.mockReturnValue(validToken);
      
      const result = getValidToken();
      
      expect(result).toBe(validToken);
      expect(localStorageMock.removeItem).not.toHaveBeenCalled();
    });
  });

  describe('isTokenValid', () => {
    it('should return false for invalid token', () => {
      localStorageMock.getItem.mockReturnValue('invalid.token');
      
      const result = isTokenValid();
      
      expect(result).toBe(false);
    });

    it('should return true for valid token', () => {
      const validPayload = {
        userId: '123',
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
      };
      const validToken = 'header.' + btoa(JSON.stringify(validPayload)) + '.signature';
      
      localStorageMock.getItem.mockReturnValue(validToken);
      
      const result = isTokenValid();
      
      expect(result).toBe(true);
    });
  });
});
