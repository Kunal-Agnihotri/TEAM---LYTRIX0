import { UserProfile, WorkforceRequirement, WorkerMatch, Contract, NotificationItem } from '../types';

export const INITIAL_PROFILES: Record<string, UserProfile> = {
  farmer: {
    id: 'FARM-98421',
    name: 'Ravi Kumar',
    role: 'farmer',
    username: '@ravikisan',
    email: 'ravi.farmer@bridge.com',
    phone: '+91 9876543210',
    location: 'Punjab, India',
    bio: 'Farmer and grower focused on fresh, quality crops and reliable workforce coordination through BRIDGE.',
    farmName: 'Green Valley Farm',
    crops: ['Wheat', 'Paddy', 'Maize'],
    farmerId: '11223344556',
    rating: 4.8,
  },
  worker: {
    id: 'WRK-55219',
    name: 'Sukhdev Singh',
    role: 'worker',
    username: '@sukhdev_worker',
    email: 'sukhdev.worker@bridge.com',
    phone: '+91 9123456780',
    location: 'Ludhiana, Punjab',
    bio: 'Experienced agricultural worker specializing in harvesting, sowing, and crop management.',
    rating: 4.9,
  },
  buyer: {
    id: 'BUY-88120',
    name: 'Apex Agro Industries',
    role: 'buyer',
    username: '@apex_agro',
    email: 'procurement@apexagro.com',
    phone: '+91 9988776655',
    location: 'New Delhi, India',
    bio: 'Institutional grain processor and wholesale buyer requiring verified grain produce contracts.',
    gstNumber: '07AAAAA0000A1Z5',
    rating: 4.7,
  }
};

export const INITIAL_REQUIREMENTS: WorkforceRequirement[] = [
  {
    id: 'REQ-101',
    farmerId: 'FARM-98421',
    farmerName: 'Ravi Kumar',
    location: 'Ludhiana, Punjab',
    workersRequired: 12,
    startDate: '2026-10-01',
    endDate: '2026-10-15',
    workHours: '07:00 AM - 03:00 PM',
    dailyRate: 450,
    cropRequirement: 'Wheat Harvesting & Bundling',
    status: 'active'
  },
  {
    id: 'REQ-102',
    farmerId: 'FARM-98421',
    farmerName: 'Ravi Kumar',
    location: 'Amritsar, Punjab',
    workersRequired: 8,
    startDate: '2026-10-20',
    endDate: '2026-11-05',
    workHours: '08:00 AM - 04:00 PM',
    dailyRate: 420,
    cropRequirement: 'Paddy Sowing & Irrigation',
    status: 'active'
  }
];

export const INITIAL_MATCHES: WorkerMatch[] = [
  {
    id: 'WM-1',
    workerName: 'Sukhdev Singh',
    location: 'Ludhiana, Punjab',
    compatibilityScore: 94,
    factors: {
      locationMatch: true,
      availabilityMatch: true,
      rateMatch: true,
      skillMatch: true
    },
    expectedRate: 450,
    pastRating: 4.9,
    skills: ['Wheat Harvesting', 'Irrigation', 'Sowing']
  },
  {
    id: 'WM-2',
    workerName: 'Gurpreet Singh',
    location: 'Jalandhar, Punjab',
    compatibilityScore: 88,
    factors: {
      locationMatch: true,
      availabilityMatch: true,
      rateMatch: false,
      skillMatch: true
    },
    expectedRate: 480,
    pastRating: 4.7,
    skills: ['Paddy Transplanter', 'Tractor Operation']
  },
  {
    id: 'WM-3',
    workerName: 'Manoj Sharma',
    location: 'Patiala, Punjab',
    compatibilityScore: 79,
    factors: {
      locationMatch: false,
      availabilityMatch: true,
      rateMatch: true,
      skillMatch: true
    },
    expectedRate: 400,
    pastRating: 4.6,
    skills: ['General Farming', 'Weeding']
  }
];

export const INITIAL_CONTRACTS: Contract[] = [
  {
    id: 'CON-501',
    parties: ['Apex Agro Industries', 'Ravi Kumar (Green Valley Farm)'],
    cropOrTask: 'Wheat (Grade A Premium)',
    quantityOrWorkers: '250 Quintals',
    durationOrDelivery: 'Delivery by 30 October 2026',
    paymentTerms: '15 percent advance, 85 percent upon quality verification at warehouse',
    status: 'active',
    lastUpdated: '2026-09-18',
    proposedBy: 'Apex Agro Industries'
  },
  {
    id: 'CON-502',
    parties: ['Ravi Kumar', 'Sukhdev Singh (Worker Group)'],
    cropOrTask: 'Harvesting Workforce Agreement',
    quantityOrWorkers: '12 Workers for 15 Days',
    durationOrDelivery: '01 October 2026 to 15 October 2026',
    paymentTerms: 'Daily wage settlement with platform escrow guarantee',
    status: 'negotiating',
    lastUpdated: '2026-09-18',
    proposedBy: 'Ravi Kumar'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NOTIF-1',
    title: 'New Contract Proposal',
    message: 'Apex Agro Industries sent a new produce contract proposal for 250 quintals of wheat.',
    timestamp: 'Today, 10:45 AM',
    isRead: false
  },
  {
    id: 'NOTIF-2',
    title: 'Workforce Match Found',
    message: 'AI matching engine found 3 highly compatible workers in your district.',
    timestamp: 'Yesterday',
    isRead: false
  },
  {
    id: 'NOTIF-3',
    title: 'Government MSP Update',
    message: 'New MSP benchmark for Rabi crops announced for 2026-2027 season.',
    timestamp: '3 days ago',
    isRead: true
  }
];

export const MSP_REFERENCE_DATA = [
  { crop: 'Wheat', msp: '₹2,585 / qtl', modal: '₹2,605 / qtl' },
  { crop: 'Paddy (Common)', msp: '₹2,441 / qtl', modal: '₹3,500 / qtl' },
  { crop: 'Maize', msp: '₹2,410 / qtl', modal: '₹2,323 / qtl' },
  { crop: 'Bajra', msp: '₹2,900 / qtl', modal: '₹2,400 / qtl' },
  { crop: 'Cotton', msp: '₹8,267 / qtl', modal: '₹8,640 / qtl' },
  { crop: 'Soybean', msp: '₹5,708 / qtl', modal: '₹5,850 / qtl' }
];

export const GOVERNMENT_SCHEMES = [
  { title: 'PM-KISAN Samman Nidhi', benefit: '₹6,000 per year income support for eligible farmer families.', eligibility: 'All landholding farmers.' },
  { title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)', benefit: 'Comprehensive crop insurance coverage against natural calamities.', eligibility: 'Notified crops and areas.' },
  { title: 'Kisan Credit Card (KCC)', benefit: 'Institutional credit at subsidized interest rates up to ₹3 Lakhs.', eligibility: 'Farmers, cultivators, and sharecroppers.' },
  { title: 'Agriculture Infrastructure Fund (AIF)', benefit: 'Medium-long term debt financing facility for post-harvest management infrastructure.', eligibility: 'Farmers, FPOs, PACS, and Agri-entrepreneurs.' }
];
