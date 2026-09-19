export type UserRole = 'farmer' | 'worker' | 'buyer';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  username: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  farmName?: string;
  crops?: string[];
  gstNumber?: string;
  farmerId?: string;
  rating?: number;
}

export interface WorkforceRequirement {
  id: string;
  farmerId: string;
  farmerName: string;
  location: string;
  workersRequired: number;
  startDate: string;
  endDate: string;
  workHours: string;
  dailyRate: number;
  cropRequirement: string;
  status: 'active' | 'fulfilled' | 'cancelled';
}

export interface WorkerMatch {
  id: string;
  workerName: string;
  location: string;
  compatibilityScore: number;
  factors: {
    locationMatch: boolean;
    availabilityMatch: boolean;
    rateMatch: boolean;
    skillMatch: boolean;
  };
  expectedRate: number;
  pastRating: number;
  skills: string[];
}

export interface Contract {
  id: string;
  parties: string[];
  cropOrTask: string;
  quantityOrWorkers: string;
  durationOrDelivery: string;
  paymentTerms: string;
  status: 'proposed' | 'negotiating' | 'active' | 'completed';
  lastUpdated: string;
  proposedBy: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
