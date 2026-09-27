export type UserRole = 'donor' | 'consumer' | 'admin';

export type DonorType = 'institutional' | 'individual';

export type ConsumerType = 'orphanage' | 'old_age_home';

export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'suspended';

export interface VerificationDocument {
  id: string;
  userId: string;
  docType: 'fssai_license' | 'ngo_darpan' | 'trust_deed' | 'registration_cert' | 'gov_id';
  title: string;
  fileName: string;
  fileUrl: string;
  fileSize: string;
  uploadedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  donorType?: DonorType;
  consumerType?: ConsumerType;
  institutionName?: string;
  institutionCategory?: string; // college, restaurant, caterer, hospital, etc.
  whatsappNumber?: string;
  address: string;
  city: string;
  district: string;
  state: string;
  residentCount?: number;
  verificationStatus: VerificationStatus;
  documents: VerificationDocument[];
  joinedYear: number;
  avatarUrl?: string;
  stats?: {
    totalDonations?: number;
    totalPlates?: number;
    successfulRedistributions?: number;
    foodRequests?: number;
    foodReceived?: number;
  };
}

export type MealPeriod = 'breakfast' | 'lunch' | 'evening' | 'dinner';

export type DonationStatus =
  | 'draft'
  | 'published'
  | 'partially_reserved'
  | 'fully_reserved'
  | 'completed'
  | 'cancelled'
  | 'expired';

export interface FoodDonation {
  id: string;
  donorId: string;
  donorName: string;
  donorType: DonorType;
  institutionName: string;
  isDonorVerified: boolean;
  mealPeriod: MealPeriod;
  foodQuantity: number; // original plates
  reservedPlates: number; // reserved plates
  remainingPlates: number; // available plates
  foodType: 'veg' | 'non_veg' | 'jain_veg' | 'mixed';
  menuItems: string[];
  foodImageUrl?: string;
  city: string;
  area: string;
  pickupAddress: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  announcementTime: string; // e.g. "01:30 PM"
  normalDeadline: string; // e.g. "03:00 PM"
  availableUntil: string; // e.g. "03:30 PM" (hard cutoff)
  expiresAtIso: string; // ISO string for live timestamp comparisons
  isLateWindow: boolean;
  safetyCertifications: {
    hygienicPrep: boolean;
    storedProperly: boolean;
    safeWindow: boolean;
    noContamination: boolean;
    accurateInfo: boolean;
  };
  status: DonationStatus;
  createdAt: string;
  specialInstructions?: string;
}

export type RequestStatus =
  | 'pending'
  | 'accepted'
  | 'declined'
  | 'ready_for_pickup'
  | 'in_transit'
  | 'received'
  | 'completed'
  | 'cancelled';

export type TransportPreference =
  | 'self_pickup' // Orphanage/Elderly Home sends their own vehicle/team
  | 'donor_delivery' // Institutional donor or commoner delivers directly
  | 'on_demand_courier'; // Uber Parcel, Rapido, or Porter simulation

export interface FoodRequest {
  id: string; // e.g. FL-2026-000124
  donationId: string;
  consumerId: string;
  consumerName: string;
  consumerType: ConsumerType;
  isConsumerVerified: boolean;
  donorId: string;
  donorName: string;
  residentCount: number;
  requestedPlates: number;
  recommendedExtraPlates: number;
  status: RequestStatus;
  transportPreference: TransportPreference;
  courierProvider?: 'uber_parcel' | 'rapido' | 'porter';
  deliveryDetails?: {
    trackingCode: string;
    riderName: string;
    riderPhone: string;
    vehicleType: string;
    vehicleNumber: string;
    estimatedDistanceKm: number;
    estimatedCostInr: number;
    currentProgressPercent: number;
    currentStepIndex: number; // 0: Requested, 1: Accepted, 2: Ready, 3: In Transit, 4: Received, 5: Completed
  };
  requestedAt: string;
  acceptedAt?: string;
  receivedAt?: string;
  completedAt?: string;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  requestId: string;
  donationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
  read: boolean;
}

export type NotificationType =
  | 'new_donation'
  | 'urgent_expiry'
  | 'request_received'
  | 'request_accepted'
  | 'request_declined'
  | 'delivery_update'
  | 'food_received'
  | 'verification_status';

export interface AppNotification {
  id: string;
  recipientId: string; // strictly isolated: only this user can see
  recipientRole: UserRole;
  type: NotificationType;
  title: string;
  message: string;
  donationId?: string;
  requestId?: string;
  isRead: boolean;
  createdAt: string;
  isUrgent?: boolean;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  targetId?: string;
  details: string;
  timestamp: string;
}

export type LanguageCode = 'en' | 'hi' | 'te' | 'ta' | 'kn' | 'bn' | 'mr' | 'es';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeName: string;
}
