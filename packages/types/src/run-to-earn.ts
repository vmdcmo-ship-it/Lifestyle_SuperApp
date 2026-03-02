/**
 * Lifestyle GO - Run-to-Earn System
 * "Sống khỏe mỗi ngày, nhận quà Lifestyle"
 * 
 * Features:
 * - Mission-based challenges (5km, 10km, 21km, 30-day streaks)
 * - Sync with fitness trackers (Strava, Garmin, Apple Health, Google Fit)
 * - Earn Lifestyle Xu rewards
 * - Sponsor integration (brands can sponsor missions)
 * - Leaderboards (Driver vs Merchant vs User)
 * - Virtual medals (shareable to Spotlight)
 * - Multi-layer anti-cheat system
 */

// ============================================================================
// Enums
// ============================================================================

/**
 * Mission types
 */
export enum MissionType {
  DISTANCE = 'DISTANCE', // Distance goal (5km, 10km, 21km)
  STREAK = 'STREAK', // Daily streak (30 days consecutive)
  TIME = 'TIME', // Time goal (30 min, 60 min)
  PACE = 'PACE', // Pace challenge (sub 5:00/km)
  ELEVATION = 'ELEVATION', // Elevation gain (hill running)
  CUSTOM = 'CUSTOM', // Custom challenge
}

/**
 * Mission difficulty
 */
export enum MissionDifficulty {
  BEGINNER = 'BEGINNER', // 2-5km
  INTERMEDIATE = 'INTERMEDIATE', // 5-10km
  ADVANCED = 'ADVANCED', // 10-21km
  EXPERT = 'EXPERT', // 21km+ (half/full marathon)
}

/**
 * Activity type
 */
export enum ActivityType {
  RUNNING = 'RUNNING',
  WALKING = 'WALKING',
  CYCLING = 'CYCLING', // (if allowed)
  HIKING = 'HIKING',
  TRAIL_RUNNING = 'TRAIL_RUNNING',
}

/**
 * Activity status
 */
export enum ActivityStatus {
  IN_PROGRESS = 'IN_PROGRESS', // Currently active
  COMPLETED = 'COMPLETED', // Finished
  PAUSED = 'PAUSED', // Temporarily paused
  CANCELLED = 'CANCELLED', // User cancelled
  PENDING_REVIEW = 'PENDING_REVIEW', // Suspicious, needs review
  VERIFIED = 'VERIFIED', // Passed all checks
  REJECTED = 'REJECTED', // Failed anti-cheat
}

/**
 * Fitness tracker source
 */
export enum FitnessSource {
  STRAVA = 'STRAVA',
  GARMIN = 'GARMIN',
  APPLE_HEALTH = 'APPLE_HEALTH',
  GOOGLE_FIT = 'GOOGLE_FIT',
  SAMSUNG_HEALTH = 'SAMSUNG_HEALTH',
  MANUAL = 'MANUAL', // Manual entry (requires photo proof)
  LIFESTYLE_APP = 'LIFESTYLE_APP', // Built-in GPS tracker
}

/**
 * Anti-cheat flag
 */
export enum AntiCheatFlag {
  VELOCITY_ANOMALY = 'VELOCITY_ANOMALY', // Speed outside 4-20 km/h range
  ACCELERATION_SPIKE = 'ACCELERATION_SPIKE', // Sudden speed changes (10→40→10 km/h)
  HEART_RATE_MISMATCH = 'HEART_RATE_MISMATCH', // HR too low for pace
  PEDOMETER_MISMATCH = 'PEDOMETER_MISMATCH', // Steps don't match distance
  GPS_STRAIGHT_LINE = 'GPS_STRAIGHT_LINE', // Too perfect, robot-like path
  GPS_IMPOSSIBLE_ROUTE = 'GPS_IMPOSSIBLE_ROUTE', // Through buildings, water, etc.
  TRUST_SCORE_LOW = 'TRUST_SCORE_LOW', // Inconsistent with history
  DUPLICATE_GPS = 'DUPLICATE_GPS', // Same path as previous run (robot)
  COMMUNITY_REPORT = 'COMMUNITY_REPORT', // Flagged by other users
  SENSOR_MISSING = 'SENSOR_MISSING', // No pedometer/HR data when expected
}

/**
 * Medal tier
 */
export enum MedalTier {
  BRONZE = 'BRONZE', // Complete mission
  SILVER = 'SILVER', // Complete with good time
  GOLD = 'GOLD', // Complete with excellent time
  DIAMOND = 'DIAMOND', // Complete with record-breaking time
}

/**
 * Sponsor benefit type
 */
export enum SponsorBenefitType {
  BANNER_AD = 'BANNER_AD', // Banner on mission page
  PUSH_NOTIFICATION = 'PUSH_NOTIFICATION', // Push to participants
  MISSION_BRANDING = 'MISSION_BRANDING', // Branded mission
  REWARD_PRODUCT = 'REWARD_PRODUCT', // Product as reward
  DISCOUNT_CODE = 'DISCOUNT_CODE', // Discount for participants
}

/**
 * Leaderboard type
 */
export enum LeaderboardType {
  WEEKLY = 'WEEKLY', // Reset every Monday
  MONTHLY = 'MONTHLY', // Reset 1st of month
  ALL_TIME = 'ALL_TIME', // Lifetime stats
}

/**
 * Leaderboard category
 */
export enum LeaderboardCategory {
  ALL = 'ALL', // All users
  DRIVER = 'DRIVER', // Only drivers
  MERCHANT = 'MERCHANT', // Only merchants
  USER = 'USER', // Regular users
  GENDER_MALE = 'GENDER_MALE',
  GENDER_FEMALE = 'GENDER_FEMALE',
  AGE_18_25 = 'AGE_18_25',
  AGE_26_35 = 'AGE_26_35',
  AGE_36_45 = 'AGE_36_45',
  AGE_46_PLUS = 'AGE_46_PLUS',
}

// ============================================================================
// Interfaces - Core
// ============================================================================

/**
 * Mission (Challenge)
 */
export interface Mission {
  id: string;
  missionNumber: string; // LS-RUN-001
  
  // Basic info
  title: string; // "Chạy 5km trong tuần này"
  description: string;
  type: MissionType;
  difficulty: MissionDifficulty;
  
  // Goal
  targetDistance?: number; // Meters (e.g., 5000 for 5km)
  targetTime?: number; // Minutes (e.g., 30)
  targetPace?: number; // Seconds per km (e.g., 300 for 5:00/km)
  targetElevation?: number; // Meters
  targetStreakDays?: number; // For streak missions (e.g., 30)
  
  // Allowed activities
  allowedActivityTypes: ActivityType[];
  
  // Rewards
  rewards: MissionReward[];
  
  // Sponsor
  sponsorId?: string;
  sponsorName?: string;
  sponsorLogo?: string;
  isSponsor: boolean;
  
  // Participation
  totalParticipants: number;
  completionRate: number; // %
  
  // Timeframe
  startDate: Date;
  endDate: Date;
  
  // Visual
  coverImage: string;
  badgeImage: string; // Medal image for completion
  
  // Status
  isActive: boolean;
  isFeatured: boolean; // Featured on homepage
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mission reward
 */
export interface MissionReward {
  id: string;
  
  // Reward type
  type: 'XU' | 'MEDAL' | 'VOUCHER' | 'PRODUCT' | 'BADGE';
  
  // For XU
  xuAmount?: number; // Lifestyle Xu points
  
  // For MEDAL
  medalTier?: MedalTier;
  medalTitle?: string;
  medalImage?: string;
  
  // For VOUCHER
  voucherId?: string;
  voucherValue?: number;
  
  // For PRODUCT
  productId?: string;
  productName?: string;
  productImage?: string;
  
  // For BADGE
  badgeId?: string;
  badgeTitle?: string;
  badgeImage?: string;
  
  // Conditions
  requiredTime?: number; // Max time to qualify (seconds)
  requiredPace?: number; // Max pace to qualify (s/km)
  
  // Quantity
  totalAvailable?: number; // -1 = unlimited
  claimed: number;
}

/**
 * User activity (Running session)
 */
export interface RunActivity {
  id: string;
  activityNumber: string; // LS-ACT-240214-001
  
  // User
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: 'DRIVER' | 'MERCHANT' | 'USER';
  
  // Mission (if part of challenge)
  missionId?: string;
  missionTitle?: string;
  
  // Activity details
  type: ActivityType;
  
  // Stats
  distance: number; // Meters
  duration: number; // Seconds
  avgPace: number; // Seconds per km
  avgSpeed: number; // km/h
  calories: number; // kcal
  elevationGain: number; // Meters
  
  // Route
  startLocation: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  endLocation: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  gpsPoints: GPSPoint[]; // Full route
  
  // Time
  startTime: Date;
  endTime: Date;
  
  // Health data
  avgHeartRate?: number; // bpm
  maxHeartRate?: number;
  steps?: number; // From pedometer
  
  // Source
  source: FitnessSource;
  externalId?: string; // Strava activity ID, etc.
  
  // Sync data (raw from external)
  rawData?: Record<string, any>;
  
  // Media
  photoUrls?: string[]; // Photos from run (selfies, scenic shots)
  
  // Status
  status: ActivityStatus;
  
  // Anti-cheat
  trustScore: number; // 0-100
  flags: AntiCheatFlag[];
  flagDetails?: AntiCheatAnalysis;
  
  // Rewards earned
  xuEarned: number;
  medalsEarned: string[]; // Medal IDs
  
  // Social
  likes: number;
  comments: number;
  isPublic: boolean; // Share to feed
  
  // Moderation
  moderatedBy?: string;
  moderatedAt?: Date;
  moderationNote?: string;
  
  // Dates
  createdAt: Date;
  updatedAt: Date;
}

/**
 * GPS Point
 */
export interface GPSPoint {
  latitude: number;
  longitude: number;
  altitude?: number; // Meters above sea level
  timestamp: Date;
  accuracy?: number; // GPS accuracy in meters
  speed?: number; // Instantaneous speed (km/h)
  heartRate?: number; // If available from watch
}

/**
 * Anti-cheat analysis
 */
export interface AntiCheatAnalysis {
  // Velocity check
  velocityCheck: {
    passed: boolean;
    minSpeed: number; // km/h
    maxSpeed: number;
    avgSpeed: number;
    anomalies: {
      timestamp: Date;
      speed: number;
      reason: string;
    }[];
  };
  
  // Acceleration check
  accelerationCheck: {
    passed: boolean;
    maxAcceleration: number; // m/s²
    spikes: {
      timestamp: Date;
      from: number; // km/h
      to: number;
      deltaT: number; // seconds
    }[];
  };
  
  // Heart rate check
  heartRateCheck?: {
    passed: boolean;
    avgHeartRate: number;
    expectedMin: number; // For given pace
    expectedMax: number;
    anomalies: string[];
  };
  
  // Pedometer check
  pedometerCheck?: {
    passed: boolean;
    steps: number;
    expectedSteps: number; // Based on distance
    deviation: number; // %
  };
  
  // GPS path check
  gpsPathCheck: {
    passed: boolean;
    totalPoints: number;
    straightLineScore: number; // 0-1 (1 = perfectly straight, suspicious)
    routeFeasibility: number; // 0-1 (1 = feasible route)
    impossibleSegments: {
      start: GPSPoint;
      end: GPSPoint;
      reason: string; // "Through building", "Over water", etc.
    }[];
  };
  
  // Trust score calculation
  trustScoreBreakdown: {
    historicalConsistency: number; // 0-30 points
    velocityScore: number; // 0-20 points
    heartRateScore: number; // 0-20 points
    gpsScore: number; // 0-20 points
    communityScore: number; // 0-10 points
    total: number; // 0-100
  };
  
  // AI analysis
  aiVerdict: {
    prediction: 'GENUINE' | 'SUSPICIOUS' | 'FRAUDULENT';
    confidence: number; // 0-1
    reasoning: string[];
  };
  
  // Overall result
  overallDecision: 'APPROVE' | 'FLAG_FOR_REVIEW' | 'REJECT';
  
  // Timestamp
  analyzedAt: Date;
}

/**
 * Virtual medal
 */
export interface VirtualMedal {
  id: string;
  
  // Medal info
  title: string; // "Chạy 5km - Tuần 1 Tháng 2"
  description: string;
  tier: MedalTier;
  
  // Visual
  imageUrl: string; // Medal design
  badgeIcon: string; // Small icon for profile
  
  // Mission
  missionId: string;
  missionTitle: string;
  
  // User
  userId: string;
  userName: string;
  
  // Achievement
  activityId: string; // Run activity that earned this
  earnedDate: Date;
  
  // Stats (at time of earning)
  distance: number;
  time: number; // seconds
  pace: number; // s/km
  
  // Sponsor (if mission was sponsored)
  sponsorName?: string;
  sponsorLogo?: string;
  
  // Social
  isShared: boolean; // Shared to Spotlight
  spotlightPostId?: string;
  likes: number;
  
  // Rarity
  totalAwarded: number; // How many people got this medal
  
  // Dates
  createdAt: Date;
}

// ============================================================================
// Interfaces - Leaderboard
// ============================================================================

/**
 * Leaderboard entry
 */
export interface LeaderboardEntry {
  rank: number;
  
  // User
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: 'DRIVER' | 'MERCHANT' | 'USER';
  
  // Stats (for leaderboard period)
  totalDistance: number; // Meters
  totalActivities: number;
  avgPace: number; // s/km
  totalXuEarned: number;
  medalsEarned: number;
  
  // Streak
  currentStreak: number; // Days
  longestStreak: number;
  
  // Change from previous period
  rankChange: number; // +5, -2, 0
  
  // Verified
  trustScore: number; // Avg across activities
}

/**
 * Leaderboard
 */
export interface Leaderboard {
  id: string;
  
  // Type
  type: LeaderboardType; // Weekly, Monthly, All-time
  category: LeaderboardCategory; // All, Driver, Merchant, User, etc.
  
  // Period
  periodStart: Date;
  periodEnd?: Date; // Null for all-time
  
  // Entries
  entries: LeaderboardEntry[];
  totalEntries: number;
  
  // Stats
  avgDistance: number;
  avgPace: number;
  totalDistance: number; // Sum of all participants
  
  // Top performer
  topPerformer?: LeaderboardEntry;
  
  // Sponsor (if sponsored leaderboard)
  sponsorId?: string;
  sponsorName?: string;
  sponsorPrize?: string; // "Top 10 nhận giày Nike"
  
  // Dates
  lastUpdated: Date;
  createdAt: Date;
}

// ============================================================================
// Interfaces - Sponsor
// ============================================================================

/**
 * Sponsor
 */
export interface RunSponsor {
  id: string;
  
  // Company
  companyName: string;
  logo: string;
  website?: string;
  
  // Contact
  contactName: string;
  email: string;
  phone: string;
  
  // Industry
  industry: 'SPORTS_APPAREL' | 'NUTRITION' | 'BEVERAGE' | 'SKINCARE' | 'FITNESS_TECH' | 'OTHER';
  products: string[]; // ["Giày chạy", "Nước giải khát"]
  
  // Sponsorship
  activeMissions: string[]; // Mission IDs
  totalSponsored: number; // Total missions sponsored
  totalBudget: number; // Total spent (VND)
  
  // Benefits provided
  benefits: {
    type: SponsorBenefitType;
    description: string;
  }[];
  
  // Performance
  totalImpressions: number;
  totalClicks: number;
  totalParticipants: number; // In sponsored missions
  ctr: number; // Click-through rate
  
  // Status
  status: 'ACTIVE' | 'PAUSED' | 'ENDED';
  
  // Dates
  partnerSince: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Sponsor campaign (For a specific mission)
 */
export interface SponsorCampaign {
  id: string;
  
  // Sponsor
  sponsorId: string;
  sponsorName: string;
  
  // Mission
  missionId: string;
  missionTitle: string;
  
  // Budget
  totalBudget: number; // VND
  costPerParticipant?: number; // If paying per user
  
  // Rewards contribution
  xuContribution: number; // Xu points sponsored
  productRewards?: {
    productName: string;
    quantity: number;
    unitValue: number;
  }[];
  
  // Benefits
  benefits: {
    type: SponsorBenefitType;
    details: string;
    impressions: number;
    clicks: number;
  }[];
  
  // Performance
  participants: number;
  completions: number;
  completionRate: number;
  totalRewardsDistributed: number; // VND value
  roi: number; // (Revenue - Cost) / Cost × 100%
  
  // Dates
  startDate: Date;
  endDate: Date;
  createdAt: Date;
}

// ============================================================================
// Interfaces - User Stats & Progress
// ============================================================================

/**
 * User running profile
 */
export interface UserRunProfile {
  userId: string;
  
  // Overall stats
  totalDistance: number; // Meters (lifetime)
  totalActivities: number;
  totalDuration: number; // Seconds
  totalCalories: number;
  totalElevationGain: number;
  
  // Personal bests
  longestRun: number; // Meters
  fastestPace: number; // s/km
  longestStreak: number; // Days
  
  // Current
  currentStreak: number; // Days
  thisWeekDistance: number;
  thisMonthDistance: number;
  
  // Rewards
  totalXuEarned: number;
  totalMedals: number;
  medalsBreakdown: {
    bronze: number;
    silver: number;
    gold: number;
    diamond: number;
  };
  
  // Missions
  missionsJoined: number;
  missionsCompleted: number;
  missionCompletionRate: number; // %
  
  // Trust
  avgTrustScore: number; // 0-100
  totalFlagged: number;
  totalRejected: number;
  
  // Rank
  overallRank?: number; // In all-time leaderboard
  categoryRank?: number; // In their category (Driver/Merchant/User)
  
  // Level (Gamification)
  level: number; // Based on total distance
  xpToNextLevel: number;
  
  // Fitness trackers
  connectedSources: FitnessSource[];
  
  // Preferences
  preferredActivityType: ActivityType;
  isPublicProfile: boolean;
  
  // Dates
  firstRunDate: Date;
  lastRunDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mission participation
 */
export interface MissionParticipation {
  id: string;
  
  // User
  userId: string;
  
  // Mission
  missionId: string;
  missionTitle: string;
  missionType: MissionType;
  
  // Progress
  currentProgress: number; // e.g., 3000 meters (for 5km mission)
  targetProgress: number; // e.g., 5000 meters
  progressPercentage: number; // %
  
  // Activities
  activities: string[]; // Activity IDs that count toward this mission
  
  // Status
  status: 'JOINED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  
  // Result
  completedAt?: Date;
  finalTime?: number; // Seconds
  finalPace?: number; // s/km
  
  // Rewards
  rewardsClaimed: boolean;
  xuEarned: number;
  medalsEarned: string[];
  
  // Dates
  joinedAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Interfaces - Admin & Moderation
// ============================================================================

/**
 * Fraud report (Admin view)
 */
export interface FraudReport {
  id: string;
  reportNumber: string; // LS-FRAUD-001
  
  // Activity
  activityId: string;
  activity: RunActivity;
  
  // User
  userId: string;
  userName: string;
  userTrustScore: number;
  
  // Flags
  flags: AntiCheatFlag[];
  analysis: AntiCheatAnalysis;
  
  // Community reports
  communityReports?: {
    reportedBy: string;
    reason: string;
    reportedAt: Date;
  }[];
  
  // Severity
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  
  // Review
  reviewedBy?: string;
  reviewedAt?: Date;
  decision: 'PENDING' | 'APPROVED' | 'REJECTED' | 'BANNED';
  reviewNote?: string;
  
  // Action taken
  xuRevoked?: number;
  medalsRevoked?: string[];
  userSuspended?: boolean;
  suspensionDuration?: number; // Days
  
  // Dates
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Run-to-Earn analytics (Admin)
 */
export interface RunAnalytics {
  period: 'TODAY' | 'WEEK' | 'MONTH' | 'YEAR';
  
  // Participation
  totalUsers: number;
  activeUsers: number; // Ran at least once in period
  newUsers: number; // First run in period
  
  // Activities
  totalActivities: number;
  totalDistance: number; // Meters
  avgDistance: number;
  avgPace: number;
  
  // Missions
  activeMissions: number;
  missionsCompleted: number;
  avgParticipantsPerMission: number;
  avgCompletionRate: number; // %
  
  // Rewards
  totalXuDistributed: number;
  totalMedalsAwarded: number;
  avgXuPerActivity: number;
  
  // Anti-cheat
  totalFlagged: number;
  flaggedRate: number; // %
  totalRejected: number;
  rejectionRate: number; // %
  mostCommonFlag: AntiCheatFlag;
  
  // Sponsors
  activeSponsorships: number;
  totalSponsorBudget: number;
  avgROI: number; // % across all campaigns
  
  // Top performers
  topRunners: LeaderboardEntry[];
  
  // Trends
  weekOverWeekGrowth: number; // %
  monthOverMonthGrowth: number; // %
  
  // Dates
  periodStart: Date;
  periodEnd: Date;
  generatedAt: Date;
}

// ============================================================================
// API Request/Response Types
// ============================================================================

/**
 * Request: Join mission
 */
export interface JoinMissionRequest {
  missionId: string;
}

export interface JoinMissionResponse {
  participation: MissionParticipation;
  mission: Mission;
}

/**
 * Request: Start activity
 */
export interface StartActivityRequest {
  type: ActivityType;
  missionId?: string; // If part of mission
  source: FitnessSource;
}

export interface StartActivityResponse {
  activity: RunActivity;
  trackingEnabled: boolean;
}

/**
 * Request: Complete activity
 */
export interface CompleteActivityRequest {
  activityId: string;
  
  // Stats
  distance: number;
  duration: number;
  calories: number;
  elevationGain?: number;
  
  // Route
  gpsPoints: GPSPoint[];
  
  // Health
  avgHeartRate?: number;
  maxHeartRate?: number;
  steps?: number;
  
  // Media
  photoUrls?: string[];
  
  // Source data
  externalId?: string; // If from Strava, etc.
  rawData?: Record<string, any>;
}

export interface CompleteActivityResponse {
  activity: RunActivity;
  antiCheatAnalysis: AntiCheatAnalysis;
  xuEarned: number;
  medalsEarned: VirtualMedal[];
  missionProgress?: MissionParticipation;
}

/**
 * Request: Sync external activity
 */
export interface SyncExternalActivityRequest {
  source: FitnessSource;
  externalId: string; // Strava activity ID, etc.
  accessToken: string; // OAuth token
}

export interface SyncExternalActivityResponse {
  activity: RunActivity;
  synced: boolean;
}

/**
 * Request: Report fraudulent activity
 */
export interface ReportFraudRequest {
  activityId: string;
  reason: string;
  details?: string;
}

export interface ReportFraudResponse {
  reported: boolean;
  reportId: string;
}

/**
 * Request: Get leaderboard
 */
export interface GetLeaderboardRequest {
  type: LeaderboardType;
  category: LeaderboardCategory;
  limit?: number; // Default 50
  offset?: number;
}

export interface GetLeaderboardResponse {
  leaderboard: Leaderboard;
  myRank?: LeaderboardEntry; // Current user's rank
}

/**
 * Request: Share medal to Spotlight
 */
export interface ShareMedalRequest {
  medalId: string;
  caption?: string;
}

export interface ShareMedalResponse {
  spotlightPost: any; // Redcomment type (from spotlight system)
  shared: boolean;
}
