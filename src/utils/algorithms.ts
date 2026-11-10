import { DynamicPriceRecommendation, RoomCategory } from '../types/lodge';

/**
 * Demand Forecasting Algorithm
 * Forecast = (0.40 × H) + (0.25 × W) + (0.25 × B) + (0.10 × C)
 * Keeps final forecast bounded between 0% and 100%.
 */
export function calculateDemandForecast(
  hHistorical: number,
  wWeekday: number,
  bBookingPace: number,
  cCalendarDemand: number
): number {
  const raw = 0.40 * hHistorical + 0.25 * wWeekday + 0.25 * bBookingPace + 0.10 * cCalendarDemand;
  return Math.min(100, Math.max(0, Math.round(raw * 10) / 10));
}

/**
 * Dynamic Pricing Adjustment Tier lookup
 */
export function getBaseAdjustmentForOccupancy(forecastOccupancy: number): {
  pct: number;
  tierName: string;
} {
  if (forecastOccupancy < 35) {
    return { pct: -12, tierName: 'Low Demand (<35%): -12%' };
  } else if (forecastOccupancy <= 49) {
    return { pct: -6, tierName: 'Moderate Low (35-49%): -6%' };
  } else if (forecastOccupancy <= 64) {
    return { pct: 0, tierName: 'Stable Mid (50-64%): 0%' };
  } else if (forecastOccupancy <= 74) {
    return { pct: 5, tierName: 'Moderate High (65-74%): +5%' };
  } else if (forecastOccupancy <= 84) {
    return { pct: 10, tierName: 'High Demand (75-84%): +10%' };
  } else if (forecastOccupancy <= 91) {
    return { pct: 15, tierName: 'Surge Demand (85-91%): +15%' };
  } else if (forecastOccupancy <= 96) {
    return { pct: 20, tierName: 'Peak Surge (92-96%): +20%' };
  } else {
    return { pct: 25, tierName: 'Near Sellout (97-100%): +25%' };
  }
}

export interface PricingInput {
  category: RoomCategory;
  roomCount: number;
  currentPublishedPrice: number;
  basePrice: number;
  minPrice: number;
  maxPrice: number;
  forecastOccupancy: number;
  bookingPaceMultiplier: number; // 1.25 for +25%, 0.75 for -25%
  competitorMedian: number;
  isFestival: boolean;
}

/**
 * Dynamic Room Pricing Algorithm with all 10 business safety guardrails
 */
export function calculateDynamicPrice(input: PricingInput): DynamicPriceRecommendation {
  const {
    category,
    roomCount,
    currentPublishedPrice,
    basePrice,
    minPrice,
    maxPrice,
    forecastOccupancy,
    bookingPaceMultiplier,
    competitorMedian,
  } = input;

  const guardrailsApplied: string[] = [];
  const tier = getBaseAdjustmentForOccupancy(forecastOccupancy);
  let totalAdjustmentPct = tier.pct;
  const reasons: string[] = [tier.tierName];

  // Rule 1 & 2: Booking pace adjustment (>= 20% faster -> +5%, <= 20% slower -> -5%)
  let paceStatus: 'Fast' | 'Normal' | 'Slow' = 'Normal';
  if (bookingPaceMultiplier >= 1.20) {
    totalAdjustmentPct += 5;
    paceStatus = 'Fast';
    reasons.push('Fast booking pace (+20% vs historical): +5% surge');
  } else if (bookingPaceMultiplier <= 0.80) {
    totalAdjustmentPct -= 5;
    paceStatus = 'Slow';
    reasons.push('Slow booking pace (-20% vs historical): -5% incentive');
  }

  // Calculate unconstrained proposed price
  let candidatePrice = Math.round(currentPublishedPrice * (1 + totalAdjustmentPct / 100));

  // Rule 4: If more than 10% higher than competitor median -> flag and adjust down
  const maxAllowedVsCompetitor = competitorMedian * 1.10;
  if (candidatePrice > maxAllowedVsCompetitor) {
    guardrailsApplied.push(`Competitor Flag: Capped to avoid exceeding competitor median ₹${competitorMedian} by >10%`);
    candidatePrice = Math.min(candidatePrice, Math.round(maxAllowedVsCompetitor));
  }

  // Rule 5: If > 10% cheaper than competitors and occupancy > 75%, consider +5%
  if (candidatePrice < competitorMedian * 0.90 && forecastOccupancy > 75) {
    candidatePrice = Math.round(candidatePrice * 1.05);
    reasons.push('Opportunity: >10% below competitor median with >75% occupancy: +5% adjustment');
  }

  // Rule 9: Limit any single daily adjustment to 10% of currently published price
  const maxDailyUp = currentPublishedPrice * 1.10;
  const maxDailyDown = currentPublishedPrice * 0.90;
  if (candidatePrice > maxDailyUp) {
    guardrailsApplied.push(`Daily Volatility Cap: Single day increase capped at +10% of published price`);
    candidatePrice = Math.round(maxDailyUp);
  } else if (candidatePrice < maxDailyDown) {
    guardrailsApplied.push(`Daily Volatility Floor: Single day drop capped at -10% of published price`);
    candidatePrice = Math.round(maxDailyDown);
  }

  // Rule 10: Limit total deviation from reference base price to ±25%
  const referenceCeiling = Math.round(basePrice * 1.25);
  const referenceFloor = Math.round(basePrice * 0.75);
  if (candidatePrice > referenceCeiling) {
    guardrailsApplied.push(`Base Deviation Cap: Price held within +25% of baseline tariff (₹${basePrice})`);
    candidatePrice = referenceCeiling;
  } else if (candidatePrice < referenceFloor) {
    guardrailsApplied.push(`Base Deviation Floor: Price held within -25% of baseline tariff (₹${basePrice})`);
    candidatePrice = referenceFloor;
  }

  // Rule 7: Never price below configured minimum profitable price
  if (candidatePrice < minPrice) {
    guardrailsApplied.push(`Profitable Floor: Guaranteed above minimum operational cost (₹${minPrice})`);
    candidatePrice = minPrice;
  }

  // Rule 8: Never exceed configured maximum price
  if (candidatePrice > maxPrice) {
    guardrailsApplied.push(`Lodge Ceiling: Capped at maximum tariff limit (₹${maxPrice})`);
    candidatePrice = maxPrice;
  }

  // Round to nearest 50 for clean hospitality pricing in INR
  candidatePrice = Math.round(candidatePrice / 50) * 50;
  const finalAdjustmentPct = Math.round(((candidatePrice - currentPublishedPrice) / currentPublishedPrice) * 100);

  return {
    category,
    roomCount,
    currentPublishedPrice,
    basePrice,
    minPrice,
    maxPrice,
    competitorMedian,
    forecastOccupancy,
    recommendedPrice: candidatePrice,
    adjustmentPercentage: finalAdjustmentPct,
    bookingPaceStatus: paceStatus,
    reason: reasons.join('; '),
    guardrailsApplied,
    status: 'Pending',
  };
}

/**
 * Workforce Planning Calculations
 */
export function calculateStaffNeeds(
  checkoutRooms: number,
  stayoverRooms: number,
  occupiedRooms: number,
  expectedMealsPerShift: number,
  expectedCheckins: number,
  availableStaff: {
    housekeeping: number;
    kitchen: number;
    frontDesk: number;
    maintenance: number;
  }
) {
  // Housekeeping: 1 per 12 checkouts + 1 per 20 stayovers
  const housekeepingRequired = Math.ceil(checkoutRooms / 12 + stayoverRooms / 20);
  
  // Kitchen: 1 per 40 expected meals per shift
  const kitchenRequired = Math.max(2, Math.ceil(expectedMealsPerShift / 40));
  
  // Front desk: 1 per 20 expected check-ins per shift (minimum 1)
  const frontDeskRequired = Math.max(1, Math.ceil(expectedCheckins / 20));
  
  // Maintenance: 1 per 40 occupied rooms
  const maintenanceRequired = Math.max(1, Math.ceil(occupiedRooms / 40));

  return {
    housekeeping: {
      required: housekeepingRequired,
      available: availableStaff.housekeeping,
      shortage: Math.max(0, housekeepingRequired - availableStaff.housekeeping),
      costEstimate: Math.max(0, housekeepingRequired - availableStaff.housekeeping) * 650, // ₹650 / temp shift
    },
    kitchen: {
      required: kitchenRequired,
      available: availableStaff.kitchen,
      shortage: Math.max(0, kitchenRequired - availableStaff.kitchen),
      costEstimate: Math.max(0, kitchenRequired - availableStaff.kitchen) * 800, // ₹800 / temp assistant
    },
    frontDesk: {
      required: frontDeskRequired,
      available: availableStaff.frontDesk,
      shortage: Math.max(0, frontDeskRequired - availableStaff.frontDesk),
      costEstimate: Math.max(0, frontDeskRequired - availableStaff.frontDesk) * 850,
    },
    maintenance: {
      required: maintenanceRequired,
      available: availableStaff.maintenance,
      shortage: Math.max(0, maintenanceRequired - availableStaff.maintenance),
      costEstimate: Math.max(0, maintenanceRequired - availableStaff.maintenance) * 750,
    },
  };
}

/**
 * Inventory Calculations:
 * Reorder Point = Avg Daily Consumption × Lead Time + Safety Stock
 * Available Stock = Current + Confirmed Incoming - Reserved
 * Suggested Order = Max(0, Target Stock - Available Stock)
 */
export function calculateInventoryNeeds(
  currentStock: number,
  confirmedIncoming: number,
  reservedStock: number,
  avgDailyConsumption: number,
  leadTimeDays: number,
  safetyStock: number,
  targetDays: number
) {
  const reorderPoint = Math.round(avgDailyConsumption * leadTimeDays + safetyStock);
  const availableStock = currentStock + confirmedIncoming - reservedStock;
  const targetStock = Math.round(avgDailyConsumption * targetDays);
  const suggestedOrder = Math.max(0, targetStock - availableStock);

  let stockoutRisk: 'Critical' | 'Warning' | 'Healthy' = 'Healthy';
  if (availableStock <= safetyStock) {
    stockoutRisk = 'Critical';
  } else if (availableStock <= reorderPoint) {
    stockoutRisk = 'Warning';
  }

  return {
    reorderPoint,
    availableStock,
    targetStock,
    suggestedOrder,
    stockoutRisk,
  };
}

/**
 * Transport Capacity Gap:
 * Transport Capacity Gap = Expected Taxi Requests - Available Partner Capacity
 */
export function calculateTransportGap(
  expectedCheckins: number,
  expectedCheckouts: number,
  guestCount: number,
  isFestival: boolean,
  availableFleetCapacity: number
) {
  // Base historical demand: ~35% of arriving/departing groups request taxi or auto-shuttle to temple/railway
  const travelActivity = expectedCheckins + expectedCheckouts;
  const festivalMultiplier = isFestival ? 1.6 : 1.0;
  const expectedRequests = Math.round((travelActivity * 0.45 + (guestCount / 4) * 0.25) * festivalMultiplier);
  const capacityGap = Math.max(0, expectedRequests - availableFleetCapacity);

  return {
    expectedRequests,
    availableCapacity: availableFleetCapacity,
    capacityGap,
    status: capacityGap > 0 ? 'Shortage Alert' : 'Sufficient',
  };
}

/**
 * Financial metrics
 */
export function calculateFinancialKpis(
  roomRevenue: number,
  foodRevenue: number,
  roomsSold: number,
  availableRoomNights: number,
  operatingExpenses: number
) {
  const totalRevenue = roomRevenue + foodRevenue;
  const adr = roomsSold > 0 ? Math.round(roomRevenue / roomsSold) : 0;
  const revpar = availableRoomNights > 0 ? Math.round(roomRevenue / availableRoomNights) : 0;
  const occupancyRate = availableRoomNights > 0 ? Math.round((roomsSold / availableRoomNights) * 1000) / 10 : 0;
  const estimatedProfit = totalRevenue - operatingExpenses;
  const profitMargin = totalRevenue > 0 ? Math.round((estimatedProfit / totalRevenue) * 1000) / 10 : 0;

  return {
    totalRevenue,
    roomRevenue,
    foodRevenue,
    adr,
    revpar,
    occupancyRate,
    operatingExpenses,
    estimatedProfit,
    profitMargin,
  };
}
