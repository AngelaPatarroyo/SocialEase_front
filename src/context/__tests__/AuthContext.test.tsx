import React from 'react'
import { render, screen } from '@testing-library/react'
import { AuthContext, AuthProvider, useAuth } from '../AuthContext'

// Mock the API module
jest.mock('@/utils/api', () => ({
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}))

// Test component that uses the context
const TestComponent = () => {
  const { user, isAuthenticated, login, logout, refreshProfile } = useAuth()
  
  return (
    <div>
      <div data-testid="user-info">
        {isAuthenticated ? `Welcome ${user?.name}` : 'Not authenticated'}
      </div>
      <button onClick={() => login('test@example.com', 'password')} data-testid="login-btn">
        Login
      </button>
      <button onClick={logout} data-testid="logout-btn">
        Logout
      </button>
      <button onClick={refreshProfile} data-testid="refresh-btn">
        Refresh Profile
      </button>
    </div>
  )
}

describe('AuthContext', () => {
  describe('AuthProvider', () => {
    it('provides authentication context to children', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      expect(screen.getByTestId('user-info')).toBeInTheDocument()
      expect(screen.getByTestId('login-btn')).toBeInTheDocument()
      expect(screen.getByTestId('logout-btn')).toBeInTheDocument()
      expect(screen.getByTestId('refresh-btn')).toBeInTheDocument()
    })

    it('initializes with no authenticated user', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      expect(screen.getByTestId('user-info')).toHaveTextContent('Not authenticated')
    })
  })

  describe('useAuth Hook', () => {
    it('throws error when used outside of AuthProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      expect(() => render(<TestComponent />)).toThrow(
        'useAuth must be used within an AuthProvider'
      )
      
      consoleSpy.mockRestore()
    })

    it('provides authentication methods', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      expect(screen.getByTestId('login-btn')).toBeInTheDocument()
      expect(screen.getByTestId('logout-btn')).toBeInTheDocument()
      expect(screen.getByTestId('refresh-btn')).toBeInTheDocument()
    })
  })
})
