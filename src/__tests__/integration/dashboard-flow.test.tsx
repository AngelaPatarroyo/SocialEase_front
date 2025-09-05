import React from 'react'
import { render, screen } from '@testing-library/react'
import DashboardPage from '@/app/dashboard/page'
import { AuthProvider } from '@/context/AuthContext'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
    has: jest.fn(),
  }),
}))

describe('Dashboard Integration Flow', () => {
  it('renders dashboard page without crashing', () => {
    // This test just ensures the component renders without errors
    expect(() => render(
      <AuthProvider>
        <DashboardPage />
      </AuthProvider>
    )).not.toThrow()
  })

  it('shows loading state initially', () => {
    render(
      <AuthProvider>
        <DashboardPage />
      </AuthProvider>
    )
    expect(screen.getByText('Loading your dashboard...')).toBeInTheDocument()
  })
})
