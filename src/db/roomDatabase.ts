/**
 * Room-style Local Database & DAOs for FoodLoop AI
 * Implements relational entities, typed Data Access Objects (DAOs),
 * foreign key integrity, reactivity, and strict role isolation.
 */
import {
  User,
  FoodDonation,
  FoodRequest,
  ChatMessage,
  AppNotification,
  AuditLog,
  VerificationDocument,
  VerificationStatus,
  UserRole,
} from '../types';

const STORAGE_KEY = 'foodloop_ai_db_v1';

// Initial Demo Seed Data
const INITIAL_USERS: User[] = [
  // 1. Institutional Donor (ABC Institution, Narasaraopet)
  {
    id: 'donor-abc-inst',
    name: 'ABC Educational Institution',
    email: 'catering@abcinstitution.edu.in',
    phone: '+91 98480 12345',
    role: 'donor',
    donorType: 'institutional',
    institutionName: 'ABC Educational Institution & Mess',
    institutionCategory: 'College Campus & Central Mess',
    address: 'Kotappakonda Road, Palnadu District',
    city: 'Narasaraopet',
    district: 'Palnadu',
    state: 'Andhra Pradesh',
    verificationStatus: 'verified',
    joinedYear: 2026,
    avatarUrl: '',
    stats: {
      totalDonations: 27,
      totalPlates: 3420,
      successfulRedistributions: 25,
    },
    documents: [
      {
        id: 'doc-fssai-abc',
        userId: 'donor-abc-inst',
        docType: 'fssai_license',
        title: 'FSSAI Central Canteen License',
        fileName: 'FSSAI_ABC_2026_REG.pdf',
        fileUrl: '#fssai-doc',
        fileSize: '1.4 MB',
        uploadedAt: '2026-02-10',
        status: 'approved',
      },
      {
        id: 'doc-inst-reg',
        userId: 'donor-abc-inst',
        docType: 'registration_cert',
        title: 'University Affiliation & Mess Registry',
        fileName: 'Govt_Affiliation_Cert.pdf',
        fileUrl: '#affiliation-cert',
        fileSize: '2.1 MB',
        uploadedAt: '2026-02-10',
        status: 'approved',
      },
    ],
  },
  // 2. Commoner / Restaurant Donor
  {
    id: 'donor-royal-caterer',
    name: 'Royal Heritage Caterers & Hall',
    email: 'events@royalheritage.com',
    phone: '+91 94401 88990',
    role: 'donor',
    donorType: 'individual',
    institutionName: 'Royal Heritage Caterers',
    institutionCategory: 'Marriage & Banquet Hall',
    address: 'Station Road, Opp Head Post Office',
    city: 'Narasaraopet',
    district: 'Palnadu',
    state: 'Andhra Pradesh',
    verificationStatus: 'verified',
    joinedYear: 2026,
    stats: {
      totalDonations: 12,
      totalPlates: 1850,
      successfulRedistributions: 11,
    },
    documents: [
      {
        id: 'doc-royal-gst',
        userId: 'donor-royal-caterer',
        docType: 'fssai_license',
        title: 'Catering FSSAI Food Safety Cert',
        fileName: 'Royal_FSSAI_Lic.pdf',
        fileUrl: '#royal-fssai',
        fileSize: '890 KB',
        uploadedAt: '2026-03-01',
        status: 'approved',
      },
    ],
  },
  // 3. New Pending Donor awaiting Admin Review
  {
    id: 'donor-pending-cafe',
    name: 'Sravani Family Restaurant & Bakers',
    email: 'contact@sravanirestaurant.in',
    phone: '+91 99887 76655',
    role: 'donor',
    donorType: 'institutional',
    institutionName: 'Sravani Multi-Cuisine Restaurant',
    institutionCategory: 'Commercial Restaurant',
    address: 'Arundelpet 4th Line',
    city: 'Narasaraopet',
    district: 'Palnadu',
    state: 'Andhra Pradesh',
    verificationStatus: 'pending',
    joinedYear: 2026,
    documents: [
      {
        id: 'doc-sravani-fssai',
        userId: 'donor-pending-cafe',
        docType: 'fssai_license',
        title: 'Municipal Trade & Food Safety License',
        fileName: 'Sravani_Trade_License.pdf',
        fileUrl: '#license-view',
        fileSize: '1.8 MB',
        uploadedAt: '2026-09-25',
        status: 'pending',
      },
    ],
  },

  // 4. Verified Consumer: ABC Old Age Home (Narasaraopet)
  {
    id: 'consumer-abc-oah',
    name: 'ABC Old Age Home',
    email: 'care@abcoldagehome.org',
    phone: '+91 94900 11223',
    whatsappNumber: '+91 94900 11223',
    role: 'consumer',
    consumerType: 'old_age_home',
    institutionName: 'ABC Senior Citizens & Elder Care Trust',
    address: 'Near Gandhi Park, Ramireddypet',
    city: 'Narasaraopet',
    district: 'Palnadu',
    state: 'Andhra Pradesh',
    residentCount: 85,
    verificationStatus: 'verified',
    joinedYear: 2026,
    stats: {
      foodRequests: 42,
      foodReceived: 39,
    },
    documents: [
      {
        id: 'doc-darpan-oah',
        userId: 'consumer-abc-oah',
        docType: 'ngo_darpan',
        title: 'NITI Aayog NGO Darpan Registration',
        fileName: 'NGO_DARPAN_AP_2026_883.pdf',
        fileUrl: '#darpan-doc',
        fileSize: '1.2 MB',
        uploadedAt: '2026-01-15',
        status: 'approved',
      },
      {
        id: 'doc-trust-deed',
        userId: 'consumer-abc-oah',
        docType: 'trust_deed',
        title: 'Registered Public Charitable Trust Deed',
        fileName: 'Trust_Deed_Registered.pdf',
        fileUrl: '#trust-deed',
        fileSize: '3.4 MB',
        uploadedAt: '2026-01-15',
        status: 'approved',
      },
    ],
  },

  // 5. Verified Consumer: XYZ Orphanage Home
  {
    id: 'consumer-xyz-orphanage',
    name: 'Karuna Children Orphanage Home',
    email: 'director@karunachildren.org',
    phone: '+91 98492 55443',
    whatsappNumber: '+91 98492 55443',
    role: 'consumer',
    consumerType: 'orphanage',
    institutionName: 'Karuna Child Welfare Society',
    address: 'Prakash Nagar 2nd Cross, Vinukonda Road',
    city: 'Narasaraopet',
    district: 'Palnadu',
    state: 'Andhra Pradesh',
    residentCount: 62,
    verificationStatus: 'verified',
    joinedYear: 2026,
    stats: {
      foodRequests: 31,
      foodReceived: 30,
    },
    documents: [
      {
        id: 'doc-jj-cert',
        userId: 'consumer-xyz-orphanage',
        docType: 'registration_cert',
        title: 'Juvenile Justice Act (JJ Act) Registration',
        fileName: 'JJ_Act_Welfare_Cert.pdf',
        fileUrl: '#jj-cert',
        fileSize: '2.5 MB',
        uploadedAt: '2026-02-01',
        status: 'approved',
      },
    ],
  },

  // 6. Pending Consumer
  {
    id: 'consumer-ananda-pending',
    name: 'Ananda Nilayam Elder Care',
    email: 'info@anandanilayam.org',
    phone: '+91 91772 33445',
    whatsappNumber: '+91 91772 33445',
    role: 'consumer',
    consumerType: 'old_age_home',
    institutionName: 'Ananda Nilayam Welfare Trust',
    address: 'Sattentenapalli Road Bypass',
    city: 'Narasaraopet',
    district: 'Palnadu',
    state: 'Andhra Pradesh',
    residentCount: 45,
    verificationStatus: 'pending',
    joinedYear: 2026,
    documents: [
      {
        id: 'doc-ananda-trust',
        userId: 'consumer-ananda-pending',
        docType: 'trust_deed',
        title: 'Trust Deed Document',
        fileName: 'Ananda_Trust_Draft.pdf',
        fileUrl: '#draft-deed',
        fileSize: '1.9 MB',
        uploadedAt: '2026-09-24',
        status: 'pending',
      },
    ],
  },

  // 7. Administrator
  {
    id: 'admin-super',
    name: 'FoodLoop State Admin',
    email: 'admin@foodloop.org',
    phone: '+91 99000 88000',
    role: 'admin',
    address: 'Civil Supplies & Social Welfare Complex',
    city: 'Narasaraopet / Amaravati',
    district: 'Palnadu',
    state: 'Andhra Pradesh',
    verificationStatus: 'verified',
    joinedYear: 2025,
    documents: [],
  },
];

// Initial Demo Donations (Matching user prompt exact specifications)
const INITIAL_DONATIONS: FoodDonation[] = [
  {
    id: 'don-2026-001',
    donorId: 'donor-abc-inst',
    donorName: 'ABC Educational Institution',
    donorType: 'institutional',
    institutionName: 'ABC Educational Institution & Mess',
    isDonorVerified: true,
    mealPeriod: 'lunch',
    foodQuantity: 100,
    reservedPlates: 90, // 90 reserved by ABC Old Age Home in demo flow
    remainingPlates: 10,
    foodType: 'veg',
    menuItems: ['Steamed Rice', 'Pappu / Dal Tadka', 'Carrot & Beans Vegetable Curry', 'Fresh Curd', 'Papad'],
    city: 'Narasaraopet',
    area: 'Kotappakonda Road',
    pickupAddress: 'Block C Campus Central Mess, ABC Institution, Kotappakonda Road',
    coordinates: { lat: 16.2359, lng: 80.0496 },
    announcementTime: '01:30 PM',
    normalDeadline: '03:00 PM',
    availableUntil: '03:30 PM',
    expiresAtIso: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
    isLateWindow: false,
    safetyCertifications: {
      hygienicPrep: true,
      storedProperly: true,
      safeWindow: true,
      noContamination: true,
      accurateInfo: true,
    },
    status: 'partially_reserved',
    createdAt: '2026-09-26T13:30:00Z',
    specialInstructions: 'Food is packed in large insulated food grade stainless steel containers. Please bring recipient vessels or distribution trays.',
  },
  {
    id: 'don-2026-002',
    donorId: 'donor-royal-caterer',
    donorName: 'Royal Heritage Caterers',
    donorType: 'individual',
    institutionName: 'Royal Heritage Caterers & Hall',
    isDonorVerified: true,
    mealPeriod: 'evening',
    foodQuantity: 120,
    reservedPlates: 0,
    remainingPlates: 120,
    foodType: 'veg',
    menuItems: ['Vegetable Pulao', 'Sambar', 'Aloo Gobi Kurma', 'Sweet Kesari'],
    city: 'Narasaraopet',
    area: 'Station Road',
    pickupAddress: 'Royal Banquet Kitchen, Station Road, Opp Head Post Office',
    coordinates: { lat: 16.239, lng: 80.052 },
    announcementTime: '05:30 PM',
    normalDeadline: '08:00 PM',
    // CHANGED to 8:30 PM as explicitly requested
    availableUntil: '08:30 PM',
    expiresAtIso: new Date(Date.now() + 180 * 60 * 1000).toISOString(),
    isLateWindow: false,
    safetyCertifications: {
      hygienicPrep: true,
      storedProperly: true,
      safeWindow: true,
      noContamination: true,
      accurateInfo: true,
    },
    status: 'published',
    createdAt: '2026-09-26T17:30:00Z',
    specialInstructions: 'Prepared fresh for afternoon reception, untouched and kept warm at 65°C.',
  },
  {
    id: 'don-2026-003',
    donorId: 'donor-abc-inst',
    donorName: 'ABC Educational Institution',
    donorType: 'institutional',
    institutionName: 'ABC Educational Institution & Mess',
    isDonorVerified: true,
    mealPeriod: 'breakfast',
    foodQuantity: 150,
    reservedPlates: 150,
    remainingPlates: 0,
    foodType: 'veg',
    menuItems: ['Idli & Sambar', 'Upma', 'Coconut Chutney', 'Filter Coffee'],
    city: 'Narasaraopet',
    area: 'Kotappakonda Road',
    pickupAddress: 'Block C Campus Central Mess, ABC Institution',
    coordinates: { lat: 16.2359, lng: 80.0496 },
    announcementTime: '08:00 AM',
    normalDeadline: '10:00 AM',
    availableUntil: '10:30 AM',
    expiresAtIso: '2026-09-26T10:30:00Z',
    isLateWindow: false,
    safetyCertifications: {
      hygienicPrep: true,
      storedProperly: true,
      safeWindow: true,
      noContamination: true,
      accurateInfo: true,
    },
    status: 'completed',
    createdAt: '2026-09-26T08:00:00Z',
  },
];

// Initial Demo Requests
const INITIAL_REQUESTS: FoodRequest[] = [
  {
    id: 'FL-2026-000124',
    donationId: 'don-2026-001',
    consumerId: 'consumer-abc-oah',
    consumerName: 'ABC Old Age Home',
    consumerType: 'old_age_home',
    isConsumerVerified: true,
    donorId: 'donor-abc-inst',
    donorName: 'ABC Educational Institution',
    residentCount: 85,
    requestedPlates: 90, // 85 residents + 5 recommended buffer plates
    recommendedExtraPlates: 5,
    status: 'accepted',
    transportPreference: 'on_demand_courier',
    courierProvider: 'uber_parcel',
    deliveryDetails: {
      trackingCode: 'UB-PARCEL-88219',
      riderName: 'K. Venkatesh (Verified Courier)',
      riderPhone: '+91 98855 44332',
      vehicleType: 'Eco Three-Wheeler Cargo Electric',
      vehicleNumber: 'AP 07 TX 4590',
      estimatedDistanceKm: 2.4,
      estimatedCostInr: 65,
      currentProgressPercent: 55,
      currentStepIndex: 2, // Ready for pickup / Arriving at donor campus
    },
    requestedAt: '2026-09-26T13:45:00Z',
    acceptedAt: '2026-09-26T13:50:00Z',
    notes: 'For our 85 senior citizens. We requested 5 extra plates for evening care assistants. Thank you!',
  },
];

// Initial Chat Messages (Automatically initialized when request is ACCEPTED)
const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'chat-001',
    requestId: 'FL-2026-000124',
    donationId: 'don-2026-001',
    senderId: 'donor-abc-inst',
    senderName: 'ABC Institution Mess Office',
    senderRole: 'donor',
    text: 'Namaste! We have accepted your request for 90 plates. The food is sealed in insulated thermal canisters at Gate 3.',
    timestamp: '13:51 PM',
    read: true,
  },
  {
    id: 'chat-002',
    requestId: 'FL-2026-000124',
    donationId: 'don-2026-001',
    senderId: 'consumer-abc-oah',
    senderName: 'Srinivasa Rao (Superintendent, ABC Old Age Home)',
    senderRole: 'consumer',
    text: 'Thank you ABC Institution! We have booked on-demand cargo via Uber Parcel (Rider: Venkatesh, AP 07 TX 4590). He is arriving in 8 minutes.',
    timestamp: '13:53 PM',
    read: true,
  },
  {
    id: 'chat-003',
    requestId: 'FL-2026-000124',
    donationId: 'don-2026-001',
    senderId: 'donor-abc-inst',
    senderName: 'ABC Institution Mess Office',
    senderRole: 'donor',
    text: 'Understood. Security at Gate 3 has been notified. Handover will be swift and verified.',
    timestamp: '13:54 PM',
    read: true,
  },
];

// Initial Notifications (strictly separated per user)
const INITIAL_NOTIFICATIONS: AppNotification[] = [
  // Consumer Notifications (Only ABC Old Age Home can see)
  {
    id: 'notif-c-1',
    recipientId: 'consumer-abc-oah',
    recipientRole: 'consumer',
    type: 'request_accepted',
    title: '✓ Your Food Request Was Accepted',
    message: 'ABC Educational Institution approved 90 plates for lunch. Chat & tracking is now open.',
    donationId: 'don-2026-001',
    requestId: 'FL-2026-000124',
    isRead: false,
    createdAt: '13:50 PM',
  },
  {
    id: 'notif-c-2',
    recipientId: 'consumer-abc-oah',
    recipientRole: 'consumer',
    type: 'new_donation',
    title: '🍱 New Food Available Nearby (2.4 km)',
    message: '100 plates of fresh Lunch announced by ABC Institution on Kotappakonda Road.',
    donationId: 'don-2026-001',
    isRead: true,
    createdAt: '13:30 PM',
  },

  // Donor Notifications (Only ABC Institution can see)
  {
    id: 'notif-d-1',
    recipientId: 'donor-abc-inst',
    recipientRole: 'donor',
    type: 'request_received',
    title: '📩 New Food Request Received',
    message: 'ABC Old Age Home placed request FL-2026-000124 for 90 plates (85 residents).',
    donationId: 'don-2026-001',
    requestId: 'FL-2026-000124',
    isRead: false,
    createdAt: '13:45 PM',
  },
  {
    id: 'notif-d-2',
    recipientId: 'donor-abc-inst',
    recipientRole: 'donor',
    type: 'urgent_expiry',
    title: '⚠ Expiry Window Reminder',
    message: 'Donation #don-2026-001 has 10 unreserved plates remaining until 3:30 PM cut-off.',
    donationId: 'don-2026-001',
    isRead: true,
    createdAt: '13:35 PM',
    isUrgent: true,
  },

  // Admin Notification
  {
    id: 'notif-a-1',
    recipientId: 'admin-super',
    recipientRole: 'admin',
    type: 'verification_status',
    title: 'New Donor Document Submitted',
    message: 'Sravani Family Restaurant submitted FSSAI Trade License for verification.',
    isRead: false,
    createdAt: '11:15 AM',
  },
];

// Initial Audit Logs
const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    actorId: 'donor-abc-inst',
    actorName: 'ABC Educational Institution',
    actorRole: 'donor',
    action: 'DONATION_PUBLISHED',
    targetId: 'don-2026-001',
    details: 'Published 100 plates of Lunch (Steamed Rice, Dal, Curry, Curd)',
    timestamp: '2026-09-26 13:30:00',
  },
  {
    id: 'log-2',
    actorId: 'consumer-abc-oah',
    actorName: 'ABC Old Age Home',
    actorRole: 'consumer',
    action: 'REQUEST_SUBMITTED',
    targetId: 'FL-2026-000124',
    details: 'Submitted request for 90 plates for 85 residents',
    timestamp: '2026-09-26 13:45:00',
  },
  {
    id: 'log-3',
    actorId: 'donor-abc-inst',
    actorName: 'ABC Educational Institution',
    actorRole: 'donor',
    action: 'REQUEST_ACCEPTED',
    targetId: 'FL-2026-000124',
    details: 'Accepted request FL-2026-000124. Reserved 90 plates.',
    timestamp: '2026-09-26 13:50:00',
  },
  {
    id: 'log-4',
    actorId: 'admin-super',
    actorName: 'FoodLoop Admin',
    actorRole: 'admin',
    action: 'VERIFICATION_APPROVED',
    targetId: 'donor-abc-inst',
    details: 'Verified FSSAI license & University Mess Registration',
    timestamp: '2026-02-12 10:00:00',
  },
];

interface DatabaseSchema {
  users: User[];
  donations: FoodDonation[];
  requests: FoodRequest[];
  chatMessages: ChatMessage[];
  notifications: AppNotification[];
  auditLogs: AuditLog[];
}

/**
 * Room Database Singleton
 */
class RoomDatabase {
  private schema: DatabaseSchema;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.schema = this.loadFromStorage();
  }

  private loadFromStorage(): DatabaseSchema {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // ignore
    }
    return {
      users: INITIAL_USERS,
      donations: INITIAL_DONATIONS,
      requests: INITIAL_REQUESTS,
      chatMessages: INITIAL_CHAT_MESSAGES,
      notifications: INITIAL_NOTIFICATIONS,
      auditLogs: INITIAL_AUDIT_LOGS,
    };
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.schema));
    } catch {
      // storage quota or private mode
    }
    this.notifyListeners();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((fn) => fn());
  }

  // --- USER DAO ---
  public userDao = {
    getAll: (): User[] => [...this.schema.users],
    getById: (id: string): User | undefined => this.schema.users.find((u) => u.id === id),
    getByEmail: (email: string): User | undefined =>
      this.schema.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim()),
    getByRole: (role: UserRole): User[] => this.schema.users.filter((u) => u.role === role),
    getPendingVerifications: (): User[] =>
      this.schema.users.filter((u) => u.verificationStatus === 'pending'),
    insert: (user: User) => {
      this.schema.users.push(user);
      this.schema.auditLogs.unshift({
        id: `log-${Date.now()}`,
        actorId: user.id,
        actorName: user.name,
        actorRole: user.role,
        action: 'USER_REGISTERED',
        details: `New ${user.role} registered: ${user.name} (${user.email})`,
        timestamp: new Date().toLocaleString(),
      });
      this.saveToStorage();
      return user;
    },
    updateVerification: (userId: string, status: VerificationStatus, adminNotes?: string) => {
      const user = this.schema.users.find((u) => u.id === userId);
      if (user) {
        user.verificationStatus = status;
        if (user.documents.length > 0) {
          user.documents.forEach((d) => {
            if (status === 'verified') d.status = 'approved';
            if (status === 'rejected') d.status = 'rejected';
            if (adminNotes) d.adminNotes = adminNotes;
          });
        }
        // Send isolated notification to that user
        this.notificationDao.insert({
          id: `notif-v-${Date.now()}`,
          recipientId: user.id,
          recipientRole: user.role,
          type: 'verification_status',
          title: status === 'verified' ? '✓ Verification Approved!' : 'Verification Update',
          message:
            status === 'verified'
              ? 'Your account has been verified by the administrator. You can now publish or request food.'
              : `Your verification status has been updated to ${status}. ${adminNotes || ''}`,
          isRead: false,
          createdAt: 'Just now',
        });
        this.schema.auditLogs.unshift({
          id: `log-${Date.now()}`,
          actorId: 'admin-super',
          actorName: 'FoodLoop Admin',
          actorRole: 'admin',
          action: 'VERIFICATION_STATUS_CHANGED',
          targetId: userId,
          details: `Changed ${user.name} status to ${status}. Notes: ${adminNotes || 'None'}`,
          timestamp: new Date().toLocaleString(),
        });
        this.saveToStorage();
      }
    },
    updateProfile: (userId: string, partial: Partial<User>) => {
      const idx = this.schema.users.findIndex((u) => u.id === userId);
      if (idx !== -1) {
        this.schema.users[idx] = { ...this.schema.users[idx], ...partial };
        this.saveToStorage();
      }
    },
  };

  // --- DONATION DAO ---
  public donationDao = {
    getAll: (): FoodDonation[] => [...this.schema.donations],
    getById: (id: string): FoodDonation | undefined =>
      this.schema.donations.find((d) => d.id === id),
    getByDonorId: (donorId: string): FoodDonation[] =>
      this.schema.donations.filter((d) => d.donorId === donorId),
    getActiveAvailable: (): FoodDonation[] =>
      this.schema.donations.filter(
        (d) =>
          d.status !== 'completed' &&
          d.status !== 'cancelled' &&
          d.status !== 'expired' &&
          d.remainingPlates > 0
      ),
    insert: (donation: FoodDonation) => {
      this.schema.donations.unshift(donation);
      this.schema.auditLogs.unshift({
        id: `log-${Date.now()}`,
        actorId: donation.donorId,
        actorName: donation.donorName,
        actorRole: 'donor',
        action: 'DONATION_PUBLISHED',
        targetId: donation.id,
        details: `Published ${donation.foodQuantity} plates for ${donation.mealPeriod} in ${donation.city}`,
        timestamp: new Date().toLocaleString(),
      });
      // Notify nearby verified consumers
      const consumers = this.schema.users.filter(
        (u) => u.role === 'consumer' && u.verificationStatus === 'verified'
      );
      consumers.forEach((c) => {
        this.notificationDao.insert({
          id: `notif-new-${Date.now()}-${c.id}`,
          recipientId: c.id,
          recipientRole: 'consumer',
          type: 'new_donation',
          title: '🍱 New Food Donation Available Near You',
          message: `${donation.donorName} published ${donation.foodQuantity} plates of ${donation.mealPeriod} in ${donation.area}, ${donation.city}. Available until ${donation.availableUntil}.`,
          donationId: donation.id,
          isRead: false,
          createdAt: 'Just now',
        });
      });
      this.saveToStorage();
      return donation;
    },
    reservePlates: (donationId: string, count: number): boolean => {
      const d = this.schema.donations.find((item) => item.id === donationId);
      if (!d) return false;
      if (d.remainingPlates < count) return false; // Overbooking prevention!
      d.reservedPlates += count;
      d.remainingPlates = Math.max(0, d.foodQuantity - d.reservedPlates);
      if (d.remainingPlates === 0) {
        d.status = 'fully_reserved';
      } else {
        d.status = 'partially_reserved';
      }
      this.saveToStorage();
      return true;
    },
    updateStatus: (donationId: string, status: FoodDonation['status']) => {
      const d = this.schema.donations.find((item) => item.id === donationId);
      if (d) {
        d.status = status;
        this.saveToStorage();
      }
    },
  };

  // --- REQUEST DAO ---
  public requestDao = {
    getAll: (): FoodRequest[] => [...this.schema.requests],
    getById: (id: string): FoodRequest | undefined =>
      this.schema.requests.find((r) => r.id === id),
    getByConsumerId: (consumerId: string): FoodRequest[] =>
      this.schema.requests.filter((r) => r.consumerId === consumerId),
    getByDonorId: (donorId: string): FoodRequest[] =>
      this.schema.requests.filter((r) => r.donorId === donorId),
    getByDonationId: (donationId: string): FoodRequest[] =>
      this.schema.requests.filter((r) => r.donationId === donationId),
    insert: (request: FoodRequest): boolean => {
      // Overbooking check
      const donation = this.schema.donations.find((d) => d.id === request.donationId);
      if (!donation) return false;
      if (donation.remainingPlates < request.requestedPlates) {
        return false;
      }
      this.schema.requests.unshift(request);

      // Notify donor
      this.notificationDao.insert({
        id: `notif-req-${Date.now()}`,
        recipientId: request.donorId,
        recipientRole: 'donor',
        type: 'request_received',
        title: '📩 New Food Request Received',
        message: `${request.consumerName} (${request.residentCount} residents) requested ${request.requestedPlates} plates.`,
        donationId: request.donationId,
        requestId: request.id,
        isRead: false,
        createdAt: 'Just now',
      });

      this.schema.auditLogs.unshift({
        id: `log-${Date.now()}`,
        actorId: request.consumerId,
        actorName: request.consumerName,
        actorRole: 'consumer',
        action: 'REQUEST_CREATED',
        targetId: request.id,
        details: `Requested ${request.requestedPlates} plates from ${request.donorName}`,
        timestamp: new Date().toLocaleString(),
      });

      this.saveToStorage();
      return true;
    },
    acceptRequest: (requestId: string): boolean => {
      const req = this.schema.requests.find((r) => r.id === requestId);
      if (!req) return false;

      // Reserve the plates in the donation
      const reserved = this.donationDao.reservePlates(req.donationId, req.requestedPlates);
      if (!reserved) return false;

      req.status = 'accepted';
      req.acceptedAt = new Date().toISOString();

      // Automatically initiate real-time chat between donor and consumer!
      this.chatDao.insert({
        id: `chat-${Date.now()}`,
        requestId: req.id,
        donationId: req.donationId,
        senderId: req.donorId,
        senderName: req.donorName,
        senderRole: 'donor',
        text: `Hello ${req.consumerName}! Your request for ${req.requestedPlates} plates has been accepted. We are preparing packaging. Let us know your pickup/transport plan.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
      });

      // Notify consumer
      this.notificationDao.insert({
        id: `notif-acc-${Date.now()}`,
        recipientId: req.consumerId,
        recipientRole: 'consumer',
        type: 'request_accepted',
        title: '✓ Request Accepted by Donor!',
        message: `${req.donorName} accepted your request for ${req.requestedPlates} plates. Chat and logistics tracking is now live!`,
        donationId: req.donationId,
        requestId: req.id,
        isRead: false,
        createdAt: 'Just now',
      });

      this.schema.auditLogs.unshift({
        id: `log-${Date.now()}`,
        actorId: req.donorId,
        actorName: req.donorName,
        actorRole: 'donor',
        action: 'REQUEST_ACCEPTED',
        targetId: req.id,
        details: `Approved ${req.requestedPlates} plates for ${req.consumerName}`,
        timestamp: new Date().toLocaleString(),
      });

      this.saveToStorage();
      return true;
    },
    declineRequest: (requestId: string, reason?: string) => {
      const req = this.schema.requests.find((r) => r.id === requestId);
      if (req) {
        req.status = 'declined';
        this.notificationDao.insert({
          id: `notif-dec-${Date.now()}`,
          recipientId: req.consumerId,
          recipientRole: 'consumer',
          type: 'request_declined',
          title: 'Request Declined',
          message: `${req.donorName} was unable to fulfill request ${req.id}. ${reason || ''}`,
          donationId: req.donationId,
          requestId: req.id,
          isRead: false,
          createdAt: 'Just now',
        });
        this.saveToStorage();
      }
    },
    updateTrackingStep: (requestId: string, stepIndex: number) => {
      const req = this.schema.requests.find((r) => r.id === requestId);
      if (req && req.deliveryDetails) {
        req.deliveryDetails.currentStepIndex = stepIndex;
        if (stepIndex === 2) req.status = 'ready_for_pickup';
        if (stepIndex === 3) req.status = 'in_transit';
        if (stepIndex === 4) req.status = 'received';
        if (stepIndex === 5) req.status = 'completed';
        this.saveToStorage();
      }
    },
    confirmReceipt: (requestId: string) => {
      const req = this.schema.requests.find((r) => r.id === requestId);
      if (req) {
        req.status = 'completed';
        req.receivedAt = new Date().toISOString();
        req.completedAt = new Date().toISOString();

        if (req.deliveryDetails) {
          req.deliveryDetails.currentStepIndex = 5;
          req.deliveryDetails.currentProgressPercent = 100;
        }

        // Check if donation has 0 remaining plates, mark donation completed
        const don = this.schema.donations.find((d) => d.id === req.donationId);
        if (don && don.remainingPlates === 0) {
          don.status = 'completed';
        }

        // Notify donor of completion
        this.notificationDao.insert({
          id: `notif-rec-${Date.now()}`,
          recipientId: req.donorId,
          recipientRole: 'donor',
          type: 'food_received',
          title: '❤️ Food Received & Distributed Successfully!',
          message: `${req.consumerName} has confirmed receipt of ${req.requestedPlates} plates. Thank you for making a real impact!`,
          donationId: req.donationId,
          requestId: req.id,
          isRead: false,
          createdAt: 'Just now',
        });

        // Audit log
        this.schema.auditLogs.unshift({
          id: `log-${Date.now()}`,
          actorId: req.consumerId,
          actorName: req.consumerName,
          actorRole: 'consumer',
          action: 'RECEIPT_CONFIRMED',
          targetId: req.id,
          details: `Confirmed receipt of ${req.requestedPlates} plates from ${req.donorName}`,
          timestamp: new Date().toLocaleString(),
        });

        this.saveToStorage();
      }
    },
  };

  // --- CHAT DAO ---
  public chatDao = {
    getByRequestId: (requestId: string): ChatMessage[] =>
      this.schema.chatMessages.filter((m) => m.requestId === requestId),
    insert: (msg: ChatMessage) => {
      this.schema.chatMessages.push(msg);
      this.saveToStorage();
      return msg;
    },
  };

  // --- NOTIFICATION DAO (Strictly isolated by recipientId) ---
  public notificationDao = {
    getByRecipientId: (userId: string): AppNotification[] =>
      this.schema.notifications.filter((n) => n.recipientId === userId),
    insert: (notif: AppNotification) => {
      this.schema.notifications.unshift(notif);
      this.saveToStorage();
    },
    markAllAsRead: (userId: string) => {
      this.schema.notifications.forEach((n) => {
        if (n.recipientId === userId) n.isRead = true;
      });
      this.saveToStorage();
    },
  };

  // --- ADMIN DAO ---
  public adminDao = {
    getStats: () => {
      const donors = this.schema.users.filter((u) => u.role === 'donor');
      const consumers = this.schema.users.filter((u) => u.role === 'consumer');
      const verifiedDonors = donors.filter((u) => u.verificationStatus === 'verified');
      const verifiedConsumers = consumers.filter((u) => u.verificationStatus === 'verified');
      const pendingVerifications = this.schema.users.filter((u) => u.verificationStatus === 'pending');
      const totalPlatesRedistributed = this.schema.requests
        .filter((r) => r.status === 'completed' || r.status === 'accepted' || r.status === 'received')
        .reduce((acc, r) => acc + r.requestedPlates, 0);

      const totalDonations = this.schema.donations.length;
      const completedDonations = this.schema.donations.filter((d) => d.status === 'completed').length;
      const pendingRequests = this.schema.requests.filter((r) => r.status === 'pending').length;

      return {
        registeredDonors: donors.length,
        verifiedDonors: verifiedDonors.length,
        registeredConsumers: consumers.length,
        verifiedConsumers: verifiedConsumers.length,
        pendingVerifications: pendingVerifications.length,
        totalDonations,
        completedDonations,
        todayPlatesAvailable: this.schema.donations.reduce((acc, d) => acc + d.remainingPlates, 0),
        totalPlatesRedistributed: totalPlatesRedistributed + 3420, // includes historical prototype baseline
        pendingRequests,
      };
    },
    getAuditLogs: (): AuditLog[] => [...this.schema.auditLogs],
  };

  // Factory reset method for testing
  public resetToDemoSeed() {
    this.schema = {
      users: INITIAL_USERS,
      donations: INITIAL_DONATIONS,
      requests: INITIAL_REQUESTS,
      chatMessages: INITIAL_CHAT_MESSAGES,
      notifications: INITIAL_NOTIFICATIONS,
      auditLogs: INITIAL_AUDIT_LOGS,
    };
    this.saveToStorage();
  }
}

export const db = new RoomDatabase();
