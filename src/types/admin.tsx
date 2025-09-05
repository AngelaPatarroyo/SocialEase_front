export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status?: 'active' | 'suspended' | 'banned';
  createdAt: string;
  lastLogin?: string;
  avatar?: string;
  xp: number;
  level: number;
  streak?: number;
  badges?: string[];
  hasCompletedSelfAssessment?: boolean;
  goals?: any[];
  provider?: string;
  theme?: string;
  updatedAt?: string;
  lastCompletedDate?: string;
  selfAssessmentCompletedAt?: string;
  selfAssessmentUpdatedAt?: string;
}

export interface UserFeedback {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email?: string;
  };
  scenarioId: {
    _id: string;
    title: string;
    slug?: string;
  };
  reflection: string;
  rating: number;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  updatedAt: string;
}

export interface SystemActivity {
  type: 'feedback' | 'user' | 'progress' | 'assessment';
  action: string;
  user: {
    _id: string;
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

