export type RoomCategory = 'Standard' | 'Deluxe' | 'Premium' | 'Family Suite';

export interface Room {
  id: string;
  roomNumber: string;
  category: RoomCategory;
  floor: number;
  status: 'Occupied' | 'Available' | 'Cleaning' | 'Maintenance' | 'Reserved';
  currentPrice: number;
  basePrice: number;
  minPrice: number;
  maxPrice: number;
  guestName?: string;
  checkIn?: string;
  checkOut?: string;
}

export interface DayForecast {
  date: string;
  dayOfWeek: string;
  isFestival: boolean;
  festivalName?: string;
  historicalOccupancy: number; // H (0-100)
  weekdayAvgOccupancy: number; // W (0-100)
  bookingPaceEstimate: number; // B (0-100)
  calendarDemandEstimate: number; // C (0-100)
  forecastOccupancy: number; // calculated %
  occupiedRooms: number;
  availableRooms: number;
  expectedGuests: number;
  bookingPaceMultiplier: number; // e.g. 1.25 (+25% faster) or 0.75 (-25% slower)
  status: 'Normal' | 'Surge' | 'Low';
}

export interface DynamicPriceRecommendation {
  category: RoomCategory;
  roomCount: number;
  currentPublishedPrice: number;
  basePrice: number;
  minPrice: number;
  maxPrice: number;
  competitorMedian: number;
  forecastOccupancy: number;
  recommendedPrice: number;
  adjustmentPercentage: number;
  bookingPaceStatus: 'Fast' | 'Normal' | 'Slow';
  reason: string;
  guardrailsApplied: string[];
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface Competitor {
  id: string;
  name: string;
  distanceKm: number;
  starRating: number;
  reviewCount: number;
  averageRate: number;
  pricingStrategy: string;
  roomsByCategory: Record<RoomCategory, number>;
  amenities: string[];
  recentPriceChange: string;
}

export interface StaffMember {
  id: string;
  name: string;
  department: 'Housekeeping' | 'Kitchen' | 'Front Desk' | 'Maintenance';
  role: string;
  phone: string;
  shift: 'Morning' | 'Evening' | 'Night' | 'Off';
  dailyWage: number;
  available: boolean;
}

export interface DepartmentWorkload {
  department: 'Housekeeping' | 'Kitchen' | 'Front Desk' | 'Maintenance';
  metricLabel: string;
  metricValue: number;
  ratioStandard: string;
  requiredStaff: number;
  availableStaff: number;
  shortage: number;
  estimatedLaborCostExtra: number;
  recommendation: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Fresh Vegetables' | 'Dry Groceries' | 'Dairy' | 'Pooja & Housekeeping';
  unit: string;
  currentStock: number;
  confirmedIncoming: number;
  reservedStock: number;
  availableStock: number;
  avgDailyConsumption: number;
  leadTimeDays: number;
  safetyStock: number;
  reorderPoint: number;
  targetStockDays: number;
  targetStock: number;
  suggestedOrderQuantity: number;
  unitCost: number;
  stockoutRisk: 'Critical' | 'Warning' | 'Healthy';
  expiryWarning?: string;
  supplier: string;
}

export interface MealPlan {
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Temple Prasadam Packs';
  forecastGuests: number;
  mealsPerGuest: number;
  totalMealsExpected: number;
  kitchenCapacity: number;
  capacityStatus: 'Normal' | 'Tight' | 'Bottleneck';
  highlightDish: string;
  batchPrepKg: number;
  estimatedCost: number;
  overflowPartnerNeeded: boolean;
}

export interface TransportPartner {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  vehicleType: 'Sedan (Dzire)' | 'SUV (Innova)' | 'Tempo Traveler' | 'Auto-Rickshaw Cluster';
  availableVehicles: number;
  standardFareTempleRun: number;
  rating: number;
  status: 'Active' | 'Busy' | 'On-Call';
}

export interface FoodPartner {
  id: string;
  name: string;
  cuisine: string;
  contactPerson: string;
  phone: string;
  mealCapacity: number;
  avgCostPerThali: number;
  rating: number;
  serviceType: 'Buffet Catering' | 'Packed Temple Thali' | 'Guest Overflow Dining';
}

export interface FestivalEvent {
  id: string;
  name: string;
  kannadaName: string;
  dates: string;
  month: string;
  expectedDemandTier: 'High' | 'Very High' | 'Peak Surge';
  historicalOccupancy2024: number;
  historicalOccupancy2025: number;
  historicalOccupancy2026: number;
  occupancyDropPercent2026: number;
  readinessScore: number;
  primaryDeclineFactor: string;
  actionChecklist: { id: string; label: string; completed: boolean }[];
}

export interface ApprovalAction {
  id: string;
  title: string;
  department: 'Pricing' | 'Workforce' | 'Inventory' | 'Transport' | 'Food & Catering' | 'Marketing';
  currentSituation: string;
  aiRecommendation: string;
  financialImpact: {
    type: 'Cost' | 'Revenue Gain' | 'Savings';
    amount: number;
    description: string;
  };
  reason: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface RagDocument {
  id: string;
  title: string;
  category: 'Lodge Policy' | 'Temple Calendar & Protocol' | 'Supplier Terms' | 'Staff By-Laws';
  snippet: string;
  sourceFile: string;
  lastUpdated: string;
}

export interface McpToolConnection {
  id: string;
  name: string;
  system: string;
  status: 'Connected' | 'Simulated' | 'Needs Auth';
  protocol: 'Model Context Protocol (MCP)';
  description: string;
  lastSync: string;
  capabilities: string[];
}
