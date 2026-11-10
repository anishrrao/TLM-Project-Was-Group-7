import React, { useState } from 'react';
import { RoomCategory, ApprovalAction } from '../../types/lodge';
import { ROOM_CATEGORIES_CONFIG } from '../../data/mockData';
import { calculateDynamicPrice } from '../../utils/algorithms';
import {
  Tag,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Sliders,
  ArrowRight,
  Info,
} from 'lucide-react';

interface DynamicPricingSectionProps {
  onAddApprovalAction: (action: Omit<ApprovalAction, 'id' | 'createdAt' | 'status'>) => void;
  onNavigateToApprovals: () => void;
}

export const DynamicPricingSection: React.FC<DynamicPricingSectionProps> = ({
  onAddApprovalAction,
  onNavigateToApprovals,
}) => {
  // Interactive Simulation Controls
  const [simulatedOccupancy, setSimulatedOccupancy] = useState<number>(66); // Current Karthika Deepotsava baseline
  const [bookingPace, setBookingPace] = useState<'Normal' | 'Fast' | 'Slow'>('Slow'); // 2026 is lagging
  const [isFestival, setIsFestival] = useState<boolean>(true);
  const [actionSuccessToast, setActionSuccessToast] = useState<string | null>(null);

  const paceMultiplier = bookingPace === 'Fast' ? 1.25 : bookingPace === 'Slow' ? 0.78 : 1.0;

  // Compute recommendations for each category
  const categories: RoomCategory[] = ['Standard', 'Deluxe', 'Premium', 'Family Suite'];

  const recommendations = categories.map((cat) => {
    const config = ROOM_CATEGORIES_CONFIG[cat];
    return calculateDynamicPrice({
      category: cat,
      roomCount: config.count,
      currentPublishedPrice:
        cat === 'Standard' ? 2200 : cat === 'Deluxe' ? 3200 : cat === 'Premium' ? 4500 : 6800,
      basePrice: config.basePrice,
      minPrice: config.minPrice,
      maxPrice: config.maxPrice,
      forecastOccupancy: simulatedOccupancy,
      bookingPaceMultiplier: paceMultiplier,
      competitorMedian: config.competitorMedian,
      isFestival,
    });
  });

  const handlePushAllToApprovals = () => {
    const summary = recommendations
      .map((r) => `${r.category}: ₹${r.currentPublishedPrice} → ₹${r.recommendedPrice} (${r.adjustmentPercentage > 0 ? '+' : ''}${r.adjustmentPercentage}%)`)
      .join(', ');

    onAddApprovalAction({
      title: `Dynamic Pricing Recalibration (${simulatedOccupancy}% Occupancy / ${bookingPace} Pace)`,
      department: 'Pricing',
      currentSituation: `Current published rates face competitor resistance. Forecast occupancy at ${simulatedOccupancy}% with ${bookingPace} booking velocity.`,
      aiRecommendation: `Publish new tariffs: ${summary}`,
      financialImpact: {
        type: 'Revenue Gain',
        amount: 112000,
        description: 'Estimated net yield improvement over 7-day window by matching demand elasticity.',
      },
      reason: 'Algorithmic dynamic pricing matrix with 10 safety guardrails and competitor median constraints.',
      riskLevel: 'Low',
    });

    setActionSuccessToast('All proposed room prices have been submitted to the AI Approval Centre!');
    setTimeout(() => setActionSuccessToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Compulsory Human Approval Notice */}
      <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold tracking-tight">
              Rule-Based Dynamic Room Pricing Engine
            </h2>
            <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Human Approval Compulsory
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            The algorithm adjusts rates based on forecast occupancy tiers, booking pace velocity, competitor medians, daily volatility limits (max ±10%/day), and minimum profitable price floors. <strong>No price change is published automatically.</strong>
          </p>
        </div>
        <button
          onClick={handlePushAllToApprovals}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-2 shrink-0 shadow-sm"
        >
          <span>Push All to Approval Centre</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {actionSuccessToast && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-lg text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionSuccessToast}</span>
          </div>
          <button
            onClick={onNavigateToApprovals}
            className="text-emerald-800 font-bold underline hover:text-emerald-950"
          >
            Review in Approval Centre →
          </button>
        </div>
      )}

      {/* Interactive Simulation Controls Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
          <Sliders className="w-4 h-4 text-amber-600" />
          <span>Interactive Pricing Simulator (Test Scenarios)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1">
          {/* Slider 1: Forecast Occupancy */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700">Simulated Forecast Occupancy:</span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {simulatedOccupancy}%
              </span>
            </div>
            <input
              type="range"
              min="15"
              max="100"
              value={simulatedOccupancy}
              onChange={(e) => setSimulatedOccupancy(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>Low (&lt;35%)</span>
              <span>Mid (50-64%)</span>
              <span>Peak (97-100%)</span>
            </div>
          </div>

          {/* Selector 2: Booking Pace Velocity */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700">Booking Pace Velocity:</span>
              <span className="font-semibold text-slate-900">
                {bookingPace === 'Fast'
                  ? '+20% vs Hist (+5% surge)'
                  : bookingPace === 'Slow'
                  ? '-20% vs Hist (-5% incentive)'
                  : 'Normal Pace (0%)'}
              </span>
            </div>
            <div className="flex gap-1.5 p-1 bg-slate-100 rounded-lg">
              {(['Slow', 'Normal', 'Fast'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setBookingPace(p)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    bookingPace === p
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle 3: Calendar Festival Mode */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700">Calendar Context:</span>
              <span className="font-semibold text-slate-900">
                {isFestival ? 'Karthika Deepotsava / Festival' : 'Regular Weekday'}
              </span>
            </div>
            <div className="flex gap-1.5 p-1 bg-slate-100 rounded-lg">
              <button
                onClick={() => setIsFestival(true)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  isFestival ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600'
                }`}
              >
                Festival Active
              </button>
              <button
                onClick={() => setIsFestival(false)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  !isFestival ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600'
                }`}
              >
                Regular Days
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Pricing Recommendations Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Active Dynamic Price Recommendations
            </h3>
            <p className="text-xs text-slate-500">
              Computed for all 4 room categories under current simulator settings
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
              <tr>
                <th className="px-4 py-3">Category</th>
                <th className="px-3 py-3">Keys</th>
                <th className="px-3 py-3 text-right">Published Tariff</th>
                <th className="px-3 py-3 text-right">Competitor Median</th>
                <th className="px-3 py-3 text-right font-bold text-slate-900">Recommended Price</th>
                <th className="px-3 py-3 text-center">Change %</th>
                <th className="px-4 py-3">Reason & Algorithmic Triggers</th>
                <th className="px-4 py-3">Guardrails Applied</th>
                <th className="px-3 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recommendations.map((rec) => {
                const isPriceDrop = rec.recommendedPrice < rec.currentPublishedPrice;
                const isPriceUp = rec.recommendedPrice > rec.currentPublishedPrice;

                return (
                  <tr key={rec.category} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-semibold text-slate-900">
                      {rec.category}
                    </td>
                    <td className="px-3 py-3.5 text-slate-600 font-mono">{rec.roomCount} rms</td>
                    <td className="px-3 py-3.5 text-right font-mono text-slate-600 tabular-nums">
                      ₹{rec.currentPublishedPrice.toLocaleString('en-IN')}
                    </td>
                    <td className="px-3 py-3.5 text-right font-mono text-slate-500 tabular-nums">
                      ₹{rec.competitorMedian.toLocaleString('en-IN')}
                    </td>
                    <td className="px-3 py-3.5 text-right font-mono font-bold text-base text-slate-900 tabular-nums">
                      ₹{rec.recommendedPrice.toLocaleString('en-IN')}
                    </td>
                    <td className="px-3 py-3.5 text-center font-mono font-semibold tabular-nums">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] ${
                          isPriceDrop
                            ? 'bg-rose-50 text-rose-700 font-bold'
                            : isPriceUp
                            ? 'bg-emerald-50 text-emerald-700 font-bold'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {rec.adjustmentPercentage > 0 ? `+${rec.adjustmentPercentage}%` : `${rec.adjustmentPercentage}%`}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-700 text-[11px] max-w-xs leading-relaxed">
                      {rec.reason}
                    </td>
                    <td className="px-4 py-3.5 text-[11px] max-w-xs">
                      {rec.guardrailsApplied.length > 0 ? (
                        <ul className="space-y-1 text-amber-800">
                          {rec.guardrailsApplied.map((g, idx) => (
                            <li key={idx} className="flex items-start gap-1">
                              <span className="font-bold">·</span>
                              <span>{g}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-slate-400">Standard bounds</span>
                      )}
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      <button
                        onClick={() =>
                          onAddApprovalAction({
                            title: `${rec.category} Tariff Adjustment to ₹${rec.recommendedPrice}`,
                            department: 'Pricing',
                            currentSituation: `Published price: ₹${rec.currentPublishedPrice}. Occupancy: ${simulatedOccupancy}%.`,
                            aiRecommendation: `Update published tariff to ₹${rec.recommendedPrice} (${rec.adjustmentPercentage > 0 ? '+' : ''}${rec.adjustmentPercentage}%).`,
                            financialImpact: {
                              type: rec.adjustmentPercentage > 0 ? 'Revenue Gain' : 'Revenue Gain',
                              amount: 45000,
                              description: 'Estimated net contribution after elastic booking lift.',
                            },
                            reason: rec.reason,
                            riskLevel: 'Low',
                          })
                        }
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-semibold whitespace-nowrap transition-colors"
                      >
                        Propose
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ten Safety Guardrails Explainer Grid */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-slate-600" />
          <h3 className="text-sm font-bold text-slate-900">
            The 10 Non-Negotiable Algorithmic Pricing Guardrails
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1 text-[11px]">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
            <div className="font-bold text-slate-800">1. Pace Acceleration</div>
            <p className="text-slate-600">If booking pace is &ge;20% faster than historical, add +5% surge.</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
            <div className="font-bold text-slate-800">2. Pace Deceleration</div>
            <p className="text-slate-600">If booking pace is &le;20% slower than historical, apply -5% incentive.</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
            <div className="font-bold text-slate-800">3. Competitor Review Flag</div>
            <p className="text-slate-600">Never price &gt;10% above competitor median without high occupancy justification.</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
            <div className="font-bold text-slate-800">4. Under-pricing Capture</div>
            <p className="text-slate-600">If &gt;10% below competitors and occupancy &gt;75%, take modest +5% gain.</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
            <div className="font-bold text-slate-800">5. Historical Demand Backing</div>
            <p className="text-slate-600">Festival pricing must be backed by real booking trends, never pure speculation.</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
            <div className="font-bold text-slate-800">6. Profitable Floor</div>
            <p className="text-slate-600">Guaranteed strictly above marginal operating costs (Standard ₹1,400).</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
            <div className="font-bold text-slate-800">7. Maximum Ceiling</div>
            <p className="text-slate-600">Hard cap preventing gouging (Standard ₹3,200 / Suites ₹10,500).</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
            <div className="font-bold text-slate-800">8. Daily Volatility Limit</div>
            <p className="text-slate-600">Single daily adjustments capped at max 10% of published price.</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
            <div className="font-bold text-slate-800">9. Reference Deviation</div>
            <p className="text-slate-600">Total tariff deviation held within ±25% of baseline reference.</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
            <div className="font-bold text-slate-800">10. Mandatory Sign-off</div>
            <p className="text-slate-600">Human approval compulsory before channel manager publishes rates.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
