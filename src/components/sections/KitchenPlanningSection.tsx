import React, { useState } from 'react';
import { MEAL_PLANS } from '../../data/mockData';
import { MealPlan, ApprovalAction } from '../../types/lodge';
import {
  UtensilsCrossed,
  ChefHat,
  Sliders,
  AlertCircle,
  TrendingDown,
  Sparkles,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

interface KitchenPlanningSectionProps {
  onAddApprovalAction: (action: Omit<ApprovalAction, 'id' | 'createdAt' | 'status'>) => void;
  onNavigateToApprovals: () => void;
}

export const KitchenPlanningSection: React.FC<KitchenPlanningSectionProps> = ({
  onAddApprovalAction,
  onNavigateToApprovals,
}) => {
  const [guestCount, setGuestCount] = useState<number>(65); // Current simulation baseline
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Recalculate meal plans based on guestCount
  const recalculatedMeals: MealPlan[] = [
    {
      mealType: 'Breakfast',
      forecastGuests: guestCount,
      mealsPerGuest: 1.0,
      totalMealsExpected: Math.round(guestCount * 1.0),
      kitchenCapacity: 90,
      capacityStatus: Math.round(guestCount * 1.0) > 90 ? 'Bottleneck' : Math.round(guestCount * 1.0) > 75 ? 'Tight' : 'Normal',
      highlightDish: 'Steamed Thatte Idli, Medu Vada, Coconut Chutney & Udupi Sambar',
      batchPrepKg: Math.round(guestCount * 0.28),
      estimatedCost: Math.round(guestCount * 50),
      overflowPartnerNeeded: Math.round(guestCount * 1.0) > 90,
    },
    {
      mealType: 'Lunch',
      forecastGuests: guestCount,
      mealsPerGuest: 0.65, // Many eat temple Annadana prasad at the temple hall
      totalMealsExpected: Math.round(guestCount * 0.65),
      kitchenCapacity: 60,
      capacityStatus: Math.round(guestCount * 0.65) > 60 ? 'Bottleneck' : 'Normal',
      highlightDish: 'Satvik Banana Leaf Thali (Bisi Bele Bath, Kosambari, Rasam, Payasa)',
      batchPrepKg: Math.round(guestCount * 0.36),
      estimatedCost: Math.round(guestCount * 0.65 * 90),
      overflowPartnerNeeded: Math.round(guestCount * 0.65) > 60,
    },
    {
      mealType: 'Dinner',
      forecastGuests: guestCount,
      mealsPerGuest: 0.85,
      totalMealsExpected: Math.round(guestCount * 0.85),
      kitchenCapacity: 65,
      capacityStatus: Math.round(guestCount * 0.85) > 65 ? 'Bottleneck' : Math.round(guestCount * 0.85) > 55 ? 'Tight' : 'Normal',
      highlightDish: 'Akki Rotti, Jolada Rotti, Ennegai Brinjal Curry & Curd Rice',
      batchPrepKg: Math.round(guestCount * 0.34),
      estimatedCost: Math.round(guestCount * 0.85 * 80),
      overflowPartnerNeeded: Math.round(guestCount * 0.85) > 65,
    },
    {
      mealType: 'Temple Prasadam Packs',
      forecastGuests: guestCount,
      mealsPerGuest: 0.5,
      totalMealsExpected: Math.round(guestCount * 0.5),
      kitchenCapacity: 50,
      capacityStatus: 'Normal',
      highlightDish: 'Puliogare (Tamarind Rice) & Dry Fruit Halwa in Arecanut boxes',
      batchPrepKg: Math.round(guestCount * 0.18),
      estimatedCost: Math.round(guestCount * 0.5 * 60),
      overflowPartnerNeeded: false,
    },
  ];

  const totalDailyMeals = recalculatedMeals.reduce((acc, m) => acc + m.totalMealsExpected, 0);
  const totalDailyFoodCost = recalculatedMeals.reduce((acc, m) => acc + m.estimatedCost, 0);

  const handleCateringOverflowRequest = () => {
    onAddApprovalAction({
      title: 'Partner Catering Arrangement: Sri Krishna Vilas (50 Overflow Thalis)',
      department: 'Food & Catering',
      currentSituation: `Guest count projected at ${guestCount} devotees. Dinner kitchen capacity of 65 covers is at bottleneck risk.`,
      aiRecommendation: 'Engage Sri Krishna Vilas Pure Veg for 50 packed satvik thalis at ₹110/thali as safety buffer.',
      financialImpact: {
        type: 'Cost',
        amount: 5500,
        description: '50 thalis × ₹110 agreed partner rate.',
      },
      reason: 'Prevents 2025 review criticism where kitchen ran out of food at 9:15 PM during festival evening rush.',
      riskLevel: 'Low',
    });

    setToastMessage('Overflow catering arrangement sent to AI Approval Centre!');
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-amber-600" />
              <h2 className="text-base font-bold text-slate-900">
                Food & Kitchen Production Planning
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl">
              Calculates batch cooking quantities via <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">Expected Meals = Forecast Guests × Meals/Guest Ratio</code>. Accounts for temple Annadana patterns to prevent food wastage while eliminating stockouts.
            </p>
          </div>

          <button
            onClick={handleCateringOverflowRequest}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Engage Overflow Catering Partner</span>
          </button>
        </div>

        {/* Satvik Temple Notice */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between text-xs text-amber-950">
          <span>
            <strong>Kitchen Protocol:</strong> 100% Pure Satvik Udupi Vegetarian (Zero Onion/Garlic available for orthodox devotee vows). Head Cook Maharaj Narayana Bhat supervises morning 5:00 AM boiling.
          </span>
          <span className="font-mono text-slate-600 text-[11px] shrink-0">Kitchen Cap: 90 Covers/shift</span>
        </div>
      </div>

      {toastMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-lg text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={onNavigateToApprovals}
            className="text-emerald-800 font-bold underline hover:text-emerald-950"
          >
            Review in Approval Centre →
          </button>
        </div>
      )}

      {/* Guest Count Interactive Slider */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <Sliders className="w-4 h-4 text-amber-600" />
            <span>Simulate Expected In-House Guests (Adjust to Recalculate Batches)</span>
          </div>
          <span className="font-mono font-bold text-base text-slate-900">
            {guestCount} Guests
          </span>
        </div>

        <input
          type="range"
          min="20"
          max="110"
          value={guestCount}
          onChange={(e) => setGuestCount(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
        />
        <div className="flex justify-between text-[11px] text-slate-400 font-mono">
          <span>Weekday Slack (25 guests)</span>
          <span>Weekend (65 guests)</span>
          <span>Festival Capacity (105 guests)</span>
        </div>
      </div>

      {/* Meal Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {recalculatedMeals.map((meal) => {
          const isBottleneck = meal.capacityStatus === 'Bottleneck';
          const isTight = meal.capacityStatus === 'Tight';

          return (
            <div
              key={meal.mealType}
              className={`p-4 rounded-xl border ${
                isBottleneck
                  ? 'bg-rose-50/60 border-rose-300'
                  : isTight
                  ? 'bg-amber-50/60 border-amber-300'
                  : 'bg-white border-slate-200'
              } space-y-3 shadow-xs`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{meal.mealType}</h4>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Ratio: {meal.mealsPerGuest}x guests
                  </div>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                    isBottleneck
                      ? 'bg-rose-600 text-white'
                      : isTight
                      ? 'bg-amber-600 text-white'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {meal.capacityStatus}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Expected Covers:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {meal.totalMealsExpected} Meals
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kitchen Cap:</span>
                  <span className="font-mono text-slate-700">{meal.kitchenCapacity} Covers</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Batch Prep Raw:</span>
                  <span className="font-mono font-semibold text-slate-800">
                    {meal.batchPrepKg} kg
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimated Cost:</span>
                  <span className="font-mono font-bold text-emerald-800">
                    ₹{meal.estimatedCost.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80 text-[11px]">
                <div className="text-slate-400 uppercase text-[9px] font-semibold tracking-wider">
                  Traditional Menu
                </div>
                <div className="text-slate-800 font-medium mt-0.5 leading-snug">
                  {meal.highlightDish}
                </div>
              </div>

              {isBottleneck && (
                <div className="p-2 bg-rose-100/70 rounded text-[10px] text-rose-950 font-medium">
                  Exceeds in-house stove capacity. Tap "Engage Overflow Partner" above to source 40 thalis.
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Food Wastage & Stockout Prevention Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Food Wastage Minimization Principles
            </h3>
          </div>
          <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
            <p>
              <strong>1. The Annadana Offset:</strong> Between 11:30 AM and 2:00 PM, ~35% of staying devotees eat free Mahaprasadam at the temple dining hall. Preparing 100% full lunch capacity causes massive sambar & rice waste. Our algorithm dampens lunch meals/guest to 0.65.
            </p>
            <p>
              <strong>2. Dynamic Breakfast Batching:</strong> Idli batter is prepared in two batches: 6:00 AM (40 covers) and 7:45 AM (remaining covers based on actual key drop).
            </p>
            <p>
              <strong>3. Prasadam Packaging:</strong> Surplus evening rice dishes are converted to non-perishable temple travel packets (Puliogare with tamarind preservative) for devotees checking out before sunrise.
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Daily Kitchen Financial Summary
            </h3>
          </div>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Total Projected Covers:</span>
              <span className="font-mono font-bold text-slate-900">{totalDailyMeals} Meals</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Estimated Raw Ingredient Outlay:</span>
              <span className="font-mono font-bold text-slate-900">
                ₹{totalDailyFoodCost.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Projected Dining Revenue:</span>
              <span className="font-mono font-bold text-emerald-700">
                ₹{Math.round(totalDailyFoodCost * 1.55).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Gross Kitchen Profit Margin:</span>
              <span className="font-mono font-bold text-emerald-800">~35.5% Satvik Margin</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
