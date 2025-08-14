export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'suspended' | 'banned';
  createdAt: string;
  lastLogin: string;
  avatar?: string;
  xp: number;
  level: number;
}

export interface UserFeedback {
  _id: string;
  userId: string;
  userName: string;
  scenarioId: string;
  scenarioName: string;
  rating: number;
  reflection: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  updatedAt: string;
}

export interface SystemActivity {
  type: 'feedback' | 'user' | 'progress' | 'assessment';
  action: string;
  user: {
    _id?: string;
    name: string;
    email: string;
  };
  scenario?: {
    _id: string;
    title: string;
  };
  rating?: number;
  timestamp: string;
  details: string;
}

export interface AdminScenario {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  status: 'active' | 'inactive' | 'draft';
  xpReward: number;
  isVR: boolean;
  createdAt: string;
  updatedAt: string;
  completionRate: number;
  averageRating: number;
  totalCompletions: number;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  totalScenarios: number;
  activeScenarios: number;
  totalFeedback: number;
  openFeedback: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
  lastBackup: string;
}

