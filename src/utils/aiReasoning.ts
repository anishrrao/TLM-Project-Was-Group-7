import { ApprovalAction } from '../types/lodge';

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  structuredAnswer?: {
    directAnswer: string;
    supportingFigures: { label: string; value: string; context?: string }[];
    rootCauseAnalysis?: string[];
    reasoning: string;
    recommendedAction: string;
    managerApprovalRequired: boolean;
    proposedApprovalPayload?: Partial<ApprovalAction>;
  };
}

export function processAiQuery(query: string, pendingApprovalsCount: number): AiChatMessage['structuredAnswer'] {
  const q = query.toLowerCase().trim();

  // 1. Why are festival bookings declining?
  if (q.includes('declin') || q.includes('why') || q.includes('drop') || q.includes('fall') || q.includes('festival bookings declining')) {
    return {
      directAnswer:
        'LODGEMATE AI forensic analysis shows our 2026 festival occupancy has declined by 24.5% compared to 2024 (down from 93.4% to 68.5%). This decline is driven by 5 identifiable factors, led by a 48% reduction in marketing spend and aggressive competitor price-cutting.',
      supportingFigures: [
        { label: '2024 Festival Occupancy', value: '93.4%', context: 'Peak healthy baseline' },
        { label: '2026 Festival Occupancy', value: '68.5%', context: 'Decline of -24.9 percentage points' },
        { label: 'Marketing Budget Cut', value: '-48.5%', context: 'From ₹3.4L to ₹1.75L in 2026' },
        { label: 'Direct Booking Share', value: '19%', context: 'Down from 44% in 2024' },
        { label: 'New Supply Pressure', value: '+45 rooms', context: 'Shree Gokula opened at ₹1,800/night' },
      ],
      rootCauseAnalysis: [
        'Marketing Visibility Collapse: Search ad pause dropped lodge from Page 1 to Page 3 on OTAs; direct WhatsApp re-engagement to 1,420 repeat pilgrim families was omitted.',
        'New Competitor Undercut: Shree Gokula Residency opened late 2025 at ₹1,800 (-18% vs our ₹2,200) with free temple battery-car drop.',
        'NH-66 Ghat Roadwork: 2.5-hour detours between Feb and Oct 2026 caused tour buses to route south (now resolved).',
        'Shrinking Booking Window: Advance booking contracted from 26 days to 8 days; rigid pricing scared off early bookers.',
      ],
      reasoning:
        'The decline is NOT due to a lack of pilgrims visiting the town, but rather traffic diversion to new local competitors who launched lower tariffs and direct booking outreach while our lodge cut marketing and kept rigid pricing.',
      recommendedAction:
        '1. Approve Dynamic Price adjustment on Standard rooms to ₹2,100 for Karthika Deepotsava.\n2. Broadcast WhatsApp re-engagement campaign to our database of 1,420 previous devotee families.\n3. Bundle free temple shuttle via Sri Manjunatha Tourist Cabs.',
      managerApprovalRequired: true,
      proposedApprovalPayload: {
        title: 'Karthika Deepotsava Dynamic Tariff & WhatsApp Retargeting Bundle',
        department: 'Pricing',
        currentSituation: 'Festival occupancy lagging at 66% due to competitor undercutting and reduced direct marketing outreach.',
        aiRecommendation: 'Recalibrate Standard tariff to ₹2,100 and launch WhatsApp priority devotee campaign.',
        riskLevel: 'Low',
      },
    };
  }

  // 2. Expected occupancy next week
  if (q.includes('occupancy next week') || q.includes('forecast') || q.includes('next week') || q.includes('expected occupancy')) {
    return {
      directAnswer:
        'Average forecast occupancy for next week (Nov 10 – Nov 16) is 42.6%, corresponding to approximately 17 occupied rooms per day. Weekday demand remains subdued (34–38%), while the weekend peaks at 62% on Saturday.',
      supportingFigures: [
        { label: 'Average Weekly Occupancy', value: '42.6%', context: 'Forecasted via Demand Formula' },
        { label: 'Projected Occupied Rooms', value: '17 / 40', context: '23 rooms available daily' },
        { label: 'Expected Weekly Guests', value: '~270 Devotees', context: 'Based on 2.3 guests/room' },
        { label: 'Estimated Room Revenue', value: '₹3,24,000', context: 'At current published tariffs' },
      ],
      reasoning:
        'Our algorithm blends historical occupancy (40%), weekday baseline (25%), current pace (25%), and calendar events (10%). With no major religious procession scheduled until Karthika Deepotsava (Nov 21), midweek demand remains in the low-occupancy bracket (<40%).',
      recommendedAction:
        'Activate the approved "Midweek Senior Devotee Package" (₹1,550 Standard room floor) to lift Tuesday–Thursday occupancy by 15–20 percentage points.',
      managerApprovalRequired: false,
    };
  }

  // 3. Which rooms should have a price increase?
  if (q.includes('price increase') || q.includes('raise price') || q.includes('which rooms should have a price increase')) {
    return {
      directAnswer:
        'Family Suites (3 units) and Premium Rooms (7 units) should receive a +10% to +15% price increase for Friday & Saturday nights, as family pilgrimage suites are pacing at 92% occupancy with zero competitor stock.',
      supportingFigures: [
        { label: 'Family Suite Current Price', value: '₹6,800', context: 'Only 3 suites in property' },
        { label: 'Recommended Weekend Tariff', value: '₹7,500 (+10%)', context: 'Bounded within +25% limit' },
        { label: 'Family Suite Weekend Pace', value: '+35% faster', context: 'High demand from Bangalore families' },
        { label: 'Competitor Median for Suites', value: '₹6,500', context: 'Temple Trails suites are superior with pooja alcove' },
      ],
      reasoning:
        'Dynamic Pricing Rule: When occupancy exceeds 85% and booking pace is >20% faster than historical, an additional surge is justified. Standard rooms, however, should NOT be increased; they face aggressive competition from Shree Gokula.',
      recommendedAction:
        'Submit a price increase proposal for Family Suites to ₹7,500 and Premium Rooms to ₹4,950 for weekend dates in the AI Approval Centre.',
      managerApprovalRequired: true,
      proposedApprovalPayload: {
        title: 'Weekend Tariff Surge: Family Suites & Premium Rooms',
        department: 'Pricing',
        currentSituation: 'Family suites running at near 100% weekend demand with brisk 2-week lead time.',
        aiRecommendation: 'Increase Family Suite to ₹7,500 and Premium to ₹4,950 for Friday/Saturday.',
        riskLevel: 'Low',
      },
    };
  }

  // 4. Which supplies will run out first?
  if (q.includes('supplies') || q.includes('run out') || q.includes('inventory') || q.includes('stockout') || q.includes('which supplies will run out first')) {
    return {
      directAnswer:
        'Fresh Nandini Cow Milk and Coastal Coconuts will run out first within the next 24 to 36 hours. Current available stock of milk is only 10 Liters against a daily consumption of 24 Liters, and coconuts are at 25 pieces against a reorder point of 85.',
      supportingFigures: [
        { label: 'Cow Milk Available', value: '10 Liters', context: 'Critical (< safety stock 12L)' },
        { label: 'Daily Milk Consumption', value: '24 Liters', context: 'Coffee, tea, and morning payasa' },
        { label: 'Coastal Coconuts Available', value: '25 Pcs', context: 'Breaches reorder point of 85' },
        { label: 'Suggested Milk PO', value: '38 Liters', context: 'To achieve 2-day target stock' },
      ],
      reasoning:
        'Applying Reorder Point formula: Milk lead time is 1 day, safety stock is 12L. Available stock (10L) is below safety stock. Urgent purchase order PO-2026-1109 is currently awaiting manager authorization in the Approval Centre.',
      recommendedAction:
        'Approve pending Purchase Order PO-2026-1109 in the Approval Centre before 8:00 PM today so KMF depot can dispatch for the 5:30 AM delivery.',
      managerApprovalRequired: true,
      proposedApprovalPayload: {
        title: 'Emergency Dairy & Coconut Restock Order',
        department: 'Inventory',
        currentSituation: 'Milk available stock 10L vs daily burn 24L. Urgent restock required for tomorrow morning.',
        aiRecommendation: 'Approve PO-2026-1109 to KMF Depot and Kudla Agro.',
        riskLevel: 'Low',
      },
    };
  }

  // 5. How many additional housekeeping employees do we need?
  if (q.includes('housekeeping') || q.includes('staff') || q.includes('employees do we need') || q.includes('how many additional housekeeping')) {
    return {
      directAnswer:
        'We need 2 additional housekeeping attendants for the evening shift today, and 3 temporary attendants per day for the upcoming Karthika Deepotsava festival (Nov 21–25).',
      supportingFigures: [
        { label: 'Attendant per Checkout Standard', value: '1 : 12 rooms', context: 'Clean turnover target 25 mins' },
        { label: 'Attendant per Stayover Standard', value: '1 : 20 rooms', context: 'Daily refresh' },
        { label: 'Current Available Housekeeping', value: '4 on duty', context: '1 staff on medical leave' },
        { label: 'Peak Festival Shortage', value: '3 Attendants/day', context: 'Estimated extra labor: ₹9,750 total' },
      ],
      reasoning:
        'Staff Shortage = Required Staff - Available Staff. With 22 room checkouts expected on peak festival mornings, required housekeeping is 4 morning + 2 evening. Available evening staff is only 1 due to staff absence, creating an operational bottleneck.',
      recommendedAction:
        'Approve the temporary staffing requisition in the AI Approval Centre to engage 3 vetted attendants from Udupi Hospitality Guild at ₹650/day.',
      managerApprovalRequired: true,
      proposedApprovalPayload: {
        title: 'Temporary Housekeeping Roster for Festival Surge',
        department: 'Workforce',
        currentSituation: 'Evening shift short by 2 attendants; peak checkout of 22 rooms requires reinforcement.',
        aiRecommendation: 'Hire 3 temporary attendants from guild at ₹650/shift.',
        riskLevel: 'Medium',
      },
    };
  }

  // 6. Are we prepared for the next festival?
  if (q.includes('prepared') || q.includes('readiness') || q.includes('next festival') || q.includes('are we prepared for the next festival')) {
    return {
      directAnswer:
        'Temple Trails Lodge has a Festival Readiness Score of 64/100 for Karthika Deepotsava (Nov 21–26). While temple pooja items and generator diesel are secured, room bookings, staffing roster, and taxi capacity remain critical bottlenecks.',
      supportingFigures: [
        { label: 'Overall Readiness Score', value: '64 / 100', context: 'Requires immediate action' },
        { label: 'Current Festival Occupancy', value: '66%', context: 'Pacing 22% behind target' },
        { label: 'Taxi Capacity Gap', value: '16 trips/day', context: 'Expected 38 vs Partner 22' },
        { label: 'Pending Approvals for Festival', value: `${pendingApprovalsCount} Items`, context: 'Pricing, staff, POs, taxis' },
      ],
      reasoning:
        'The readiness score is computed across 5 pillars: Booking Pace (58%), Staff Availability (65%), Inventory Buffer (70%), Transport Capacity (55%), and Checklist Completion (75%). Without approving the pending proposals, the lodge risks repeating 2025 delays.',
      recommendedAction:
        '1. Clear the 4 festival-related pending items in the AI Approval Centre.\n2. Recalibrate room tariffs.\n3. Sign on-call fleet agreement with Sri Manjunatha Tourist Cabs.',
      managerApprovalRequired: true,
    };
  }

  // 7. How much revenue are we losing on weekdays?
  if (q.includes('losing on weekdays') || q.includes('weekday revenue') || q.includes('weekday loss') || q.includes('how much revenue are we losing on weekdays')) {
    return {
      directAnswer:
        'The lodge is losing approximately ₹1,85,000 to ₹2,10,000 per month in unrealized gross room revenue during ordinary weekdays due to average occupancy hovering at only 33.1% (leaving ~27 rooms empty Monday through Thursday).',
      supportingFigures: [
        { label: 'Average Weekday Occupancy', value: '33.1%', context: '13 rooms occupied, 27 empty' },
        { label: 'Empty Room Nights / Month', value: '432 nights', context: '16 weekday nights × 27 rooms' },
        { label: 'Unrealized Gross Revenue', value: '₹8,64,000/mo', context: 'At base tariff of ₹2,000' },
        { label: 'Net Achievable Gain', value: '₹1,95,000/mo', context: 'At ₹1,550 floor with 50% target' },
      ],
      reasoning:
        'Fixed overheads (staff salaries, building depreciation, Wi-Fi, property tax) are already incurred. Each unsold room night represents perishable inventory that cannot be recovered. Pricing above marginal cost (linen + soap + electricity = ~₹320) yields positive contribution.',
      recommendedAction:
        'Promote the approved "Midweek Senior Devotee Package" (₹1,550 Standard room) through local Karnataka temple bus operators and senior citizen associations in Bangalore.',
      managerApprovalRequired: false,
    };
  }

  // 8. Which competitors are offering lower prices?
  if (q.includes('competitors') || q.includes('lower prices') || q.includes('which competitors are offering lower prices')) {
    return {
      directAnswer:
        'Two competitors are currently offering lower prices: Shree Gokula Residency (0.8 km away) is undercutting us at ₹1,800 for Standard rooms (-₹200 vs our ₹2,000 base), and Mahalakshmi Guest House (0.4 km) lists at ₹1,500.',
      supportingFigures: [
        { label: 'Shree Gokula Residency', value: '₹1,800 (-10%)', context: 'Includes free temple battery-car drop' },
        { label: 'Mahalakshmi Guest House', value: '₹1,500 (-25%)', context: 'Dharmashala style, basic amenities' },
        { label: 'Temple View Suites', value: '₹2,100 (+5%)', context: 'Boutique competitor, rooftop view' },
        { label: 'Temple Trails Current Rate', value: '₹2,000 (Std)', context: 'Competitor median is ₹1,950' },
      ],
      reasoning:
        'Shree Gokula Residency is our primary threat because their amenities match ours (clean AC rooms, South breakfast) while bundling a battery-car temple shuttle. Mahalakshmi targets low-budget pilgrims with cold water.',
      recommendedAction:
        'Maintain our Standard room at ₹2,000 on weekdays, but bundle a temple transit voucher with Sri Manjunatha Tourist Cabs to neutralize Shree Gokula\'s advantage without an aggressive price war.',
      managerApprovalRequired: true,
      proposedApprovalPayload: {
        title: 'Bundle Free Temple Transit Voucher with Standard Rooms',
        department: 'Marketing',
        currentSituation: 'Shree Gokula Residency is winning bookings via free battery car shuttle to temple gate.',
        aiRecommendation: 'Partner with Sri Manjunatha Tourist Cabs to provide complimentary 10-min temple drops.',
        riskLevel: 'Low',
      },
    };
  }

  // 9. What should I do today?
  if (q.includes('today') || q.includes('what should i do') || q.includes('daily priority') || q.includes('action today')) {
    return {
      directAnswer:
        'Here is your executive action plan for today (Nov 9, 2026): You have 5 urgent items requiring manager sign-off to avert supply stockouts tomorrow morning and recover lost festival bookings.',
      supportingFigures: [
        { label: 'Pending Approvals', value: `${pendingApprovalsCount} Actions`, context: 'In AI Approval Centre' },
        { label: 'Urgent Inventory Order', value: 'PO-2026-1109', context: 'Milk & Coconuts before 8 PM' },
        { label: 'Festival Tariff Action', value: 'Karthika Deepotsava', context: 'Recalibrate Standard to ₹2,100' },
        { label: 'Current Lodge Occupancy', value: '14 / 40 Rooms', context: '35% (Monday baseline)' },
      ],
      reasoning:
        'Operations cannot proceed autonomously under LODGEMATE AI responsible guardrails. Human authorization is strictly mandatory before prices update on channels or purchase orders are transmitted to suppliers.',
      recommendedAction:
        '1. Go to AI Approval Centre and approve PO-2026-1109 for morning milk.\n2. Approve the Karthika Deepotsava dynamic tariff recalibration.\n3. Authorize the temporary housekeeping roster reinforcement.',
      managerApprovalRequired: true,
    };
  }

  // Generic fallback with intelligent parsing
  return {
    directAnswer: `LODGEMATE AI evaluated your query regarding "${query}". Based on current data for Temple Trails Family Lodge (40 rooms, Nov 2026 baseline), all operations are aligned with safety guardrails and rule-based models.`,
    supportingFigures: [
      { label: 'Active Total Rooms', value: '40 Rooms', context: '15 Std, 15 Dlx, 7 Prm, 3 Ste' },
      { label: 'Current Published Standard Rate', value: '₹2,000', context: 'Min ₹1,400 | Max ₹3,200' },
      { label: 'Forecast Occupancy (7-day)', value: '42.6%', context: 'Weekday baseline' },
      { label: 'Pending Action Proposals', value: `${pendingApprovalsCount} Items`, context: 'In Approval Centre' },
    ],
    reasoning:
      'LODGEMATE AI runs automated continuous evaluations across Demand, Pricing, Staffing, Inventory, and Transport. When thresholds are breached, structured proposals are submitted to the AI Approval Centre for manager review.',
    recommendedAction:
      'Review the dedicated dashboard sections (Demand Forecasting, Dynamic Pricing, Inventory, Approval Centre) or ask specific questions about declining bookings, supplies, or staffing.',
    managerApprovalRequired: false,
  };
}
