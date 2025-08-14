# Admin Management System

This document describes the Admin Management system implemented for the SocialEase application.

## Overview

The Admin Management system provides comprehensive administrative capabilities for managing users, feedback, system activities, and scenarios. It's designed with role-based access control, ensuring only users with admin privileges can access these features.

## Features

### 1. User Management (`/admin/users`)
- **View all users** with detailed information (name, email, role, status, XP, level)
- **Moderate user accounts** by changing status (active, suspended, banned)
- **Update user roles** (user, moderator, admin)
- **Search and filter** users by various criteria
- **Real-time updates** when changes are made

### 2. Feedback Management (`/admin/feedback`)
- **Review user feedback** including bugs, feature requests, complaints, and praise
- **Update feedback status** (open, in-progress, resolved, closed)
- **Assign feedback** to specific admins for handling
- **Filter by type, priority, and status**
- **Search functionality** across all feedback content

### 3. System Activity Monitoring (`/admin/activities`)
- **Real-time monitoring** of system and user activities
- **Track various activity types**:
  - User logins/logouts
  - Scenario starts/completions
  - Goal creation/completion
  - System errors
- **Filter by severity** (info, warning, error)
- **Time-based filtering** (1h, 24h, 7d, 30d, all time)
- **Activity statistics** dashboard

### 4. Scenario Management (`/admin/scenarios`)
- **Create new scenarios** with full configuration
- **Manage existing scenarios** (activate, deactivate, draft)
- **View performance metrics** (completion rate, ratings, total completions)
- **Filter by level and status**
- **Bulk operations** for scenario management

### 5. Admin Dashboard (`/admin`)
- **Overview statistics** for all system components
- **Quick access** to all admin functions
- **System health monitoring**
- **Real-time data** updates

## Technical Implementation

### Architecture
- **Frontend**: React with TypeScript and Next.js
- **State Management**: React Context API with custom hooks
- **Styling**: Tailwind CSS with responsive design
- **Navigation**: Next.js routing with active state indicators

### Key Components

#### AdminContext (`src/context/AdminContext.tsx`)
- Centralized state management for all admin data
- API integration with backend endpoints
- Error handling and loading states
- Optimistic updates for better UX

#### Admin Types (`src/types/admin.ts`)
- TypeScript interfaces for all admin entities
- Strict typing for better development experience
- Comprehensive data models

#### Admin Pages
- **Main Dashboard**: `/admin`
- **User Management**: `/admin/users`
- **Feedback Management**: `/admin/feedback`
- **Activity Monitoring**: `/admin/activities`
- **Scenario Management**: `/admin/scenarios`

### Security Features
- **Role-based access control** - Only admin users can access
- **Route protection** - Automatic redirects for unauthorized users
- **Session validation** - Continuous authentication checks
- **API security** - Proper authorization headers

## API Endpoints

The system expects the following backend endpoints:

### Users
- `GET /admin/users` - Fetch all users
- `PATCH /admin/users/:id/status` - Update user status
- `PATCH /admin/users/:id/role` - Update user role

### Feedback
- `GET /admin/feedback` - Fetch all feedback
- `PATCH /admin/feedback/:id/status` - Update feedback status
- `PATCH /admin/feedback/:id/assign` - Assign feedback to admin

### Activities
- `GET /admin/activities` - Fetch system activities

### Scenarios
- `GET /admin/scenarios` - Fetch all scenarios
- `POST /admin/scenarios` - Create new scenario
- `PATCH /admin/scenarios/:id/status` - Update scenario status

### Statistics
- `GET /admin/stats` - Fetch system statistics

## Usage

### Accessing the Admin Panel
1. **Login** with an admin account
2. **Navigate** to `/admin` or click the "Admin Panel" button on the dashboard
3. **Use the navigation** to access different admin functions

### User Management
1. Go to `/admin/users`
2. Use filters to find specific users
3. Click on role/status dropdowns to make changes
4. Changes are applied immediately

### Feedback Management
1. Go to `/admin/feedback`
2. Review feedback items
3. Update status or assign to yourself
4. Use filters to focus on specific types

### System Monitoring
1. Go to `/admin/activities`
2. View real-time system activity
3. Use time filters to focus on recent events
4. Monitor system health through statistics

### Scenario Management
1. Go to `/admin/scenarios`
2. Create new scenarios using the "Create Scenario" button
3. Manage existing scenarios by updating their status
4. View performance metrics for each scenario

## Customization

### Adding New Admin Features
1. **Create new types** in `src/types/admin.ts`
2. **Add API methods** in `src/context/AdminContext.tsx`
3. **Create new page** in `src/app/admin/`
4. **Update navigation** in `src/components/AdminNav.tsx`

### Styling
- All components use Tailwind CSS classes
- Consistent design system across all admin pages
- Responsive design for mobile and desktop
- Dark mode support (inherits from main app)

### Data Models
- Extend existing interfaces in `src/types/admin.ts`
- Maintain consistency with backend API responses
- Use proper TypeScript typing for all data

## Troubleshooting

### Common Issues

#### Access Denied Errors
- Ensure user has admin role
- Check authentication status
- Verify backend API is running

#### Data Not Loading
- Check browser console for API errors
- Verify backend endpoints are accessible
- Check network connectivity

#### Permission Issues
- Ensure user role is properly set in backend
- Check if user account is active
- Verify admin privileges are correctly assigned

### Debug Mode
- Enable browser developer tools
- Check Network tab for API calls
- Review Console for error messages
- Use React DevTools for component debugging

## Future Enhancements

### Planned Features
- **Bulk operations** for user management
- **Advanced analytics** and reporting
- **Audit logging** for admin actions
- **Email notifications** for critical events
- **Export functionality** for data analysis

### Performance Optimizations
- **Pagination** for large datasets
- **Real-time updates** using WebSockets
- **Caching strategies** for frequently accessed data
- **Lazy loading** for better initial load times

## Support

For technical support or feature requests:
1. Check the main application documentation
2. Review backend API documentation
3. Contact the development team
4. Submit issues through the project repository

---

**Note**: This admin system is designed to be secure and user-friendly. Always ensure proper access controls are in place and regularly audit admin actions for security compliance.

