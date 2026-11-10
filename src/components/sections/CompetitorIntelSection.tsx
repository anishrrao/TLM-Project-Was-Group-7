import React, { useState } from 'react';
import { COMPETITORS } from '../../data/mockData';
import { RoomCategory } from '../../types/lodge';
import { Binoculars, Star, AlertTriangle, ArrowUpDown, ShieldAlert, Check } from 'lucide-react';

export const CompetitorIntelSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<RoomCategory>('Standard');

  // Temple Trails prices for comparison
  const templeTrailsPrices: Record<RoomCategory, number> = {
    Standard: 2000,
    Deluxe: 3200,
    Premium: 4500,
    'Family Suite': 6800,
  };

  const ourCurrentPrice = templeTrailsPrices[selectedCategory];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Binoculars className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">
                Competitor Intelligence & Rate Benchmarking
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Live tracking of 5 key pilgrimage lodges in the temple radius. Highlights undercutting threats and market shifts.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {(['Standard', 'Deluxe', 'Premium', 'Family Suite'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  selectedCategory === cat
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Comparison Alert Banner */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3 text-xs text-amber-950">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Key Market Threat:</strong> Shree Gokula Residency (0.8 km) opened in December 2025 and is pricing Standard rooms at <strong>₹1,800</strong> (₹200 cheaper than Temple Trails' ₹2,000 base) while bundling a complimentary battery-car temple shuttle. This is identified as factor #2 behind our 2026 festival booking drop.
          </div>
        </div>
      </div>

      {/* Competitors Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Benchmark Table ({selectedCategory} Rooms)
            </h3>
            <p className="text-xs text-slate-500">
              Temple Trails published rate: <strong className="text-slate-900 font-mono">₹{ourCurrentPrice}</strong>
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
              <tr>
                <th className="px-4 py-3">Property Name</th>
                <th className="px-3 py-3">Distance</th>
                <th className="px-3 py-3">Rating</th>
                <th className="px-3 py-3 text-right">Published {selectedCategory} Rate</th>
                <th className="px-3 py-3 text-center">Variance vs Temple Trails</th>
                <th className="px-4 py-3">Amenities & Inclusions</th>
                <th className="px-4 py-3">Recent Pricing Move</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Temple Trails Row (Self) */}
              <tr className="bg-amber-50/50 font-medium">
                <td className="px-4 py-3 text-slate-900 font-bold flex items-center gap-2">
                  <span>Temple Trails Family Lodge</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-amber-600 text-white rounded font-bold">
                    OUR PROPERTY
                  </span>
                </td>
                <td className="px-3 py-3 text-slate-600 font-mono">0.6 km</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1 font-semibold text-slate-900 font-mono">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>4.3</span>
                    <span className="text-[10px] text-slate-400">(620)</span>
                  </div>
                </td>
                <td className="px-3 py-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                  ₹{ourCurrentPrice}
                </td>
                <td className="px-3 py-3 text-center font-mono text-slate-500 font-semibold">
                  Baseline (0%)
                </td>
                <td className="px-4 py-3 text-[11px] text-slate-600">
                  Pure Veg Kitchen, 24h Hot Water, Temple View (Top floors), Generator Backup
                </td>
                <td className="px-4 py-3 text-[11px] text-slate-500 font-mono">
                  Current published rate
                </td>
              </tr>

              {/* Other Competitors */}
              {COMPETITORS.map((comp) => {
                const compPrice = comp.roomsByCategory[selectedCategory];
                const varianceDiff = compPrice - ourCurrentPrice;
                const variancePct = Math.round((varianceDiff / ourCurrentPrice) * 100);
                const isCheaper = compPrice < ourCurrentPrice;

                return (
                  <tr key={comp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 text-slate-900 font-semibold">
                      {comp.name}
                    </td>
                    <td className="px-3 py-3 text-slate-600 font-mono">{comp.distanceKm} km</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1 font-mono text-slate-700">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        <span className="font-semibold">{comp.starRating}</span>
                        <span className="text-[10px] text-slate-400">({comp.reviewCount})</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                      ₹{compPrice}
                    </td>
                    <td className="px-3 py-3 text-center font-mono font-semibold tabular-nums">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] ${
                          isCheaper
                            ? 'bg-rose-50 text-rose-700 font-bold'
                            : 'bg-emerald-50 text-emerald-700 font-bold'
                        }`}
                      >
                        {variancePct > 0 ? `+${variancePct}%` : `${variancePct}%`}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[11px] text-slate-600">
                      <div className="flex flex-wrap gap-1">
                        {comp.amenities.map((a, i) => (
                          <span key={i} className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                            {a}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[11px] text-slate-700">
                      {comp.recentPriceChange}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strategic Market Shift Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-900">
            Competitor Positioning Analysis
          </h3>
          <div className="space-y-2.5 text-xs text-slate-600">
            <p className="leading-relaxed">
              <strong>Budget Segment (₹1,500 – ₹1,900):</strong> Dominated by Mahalakshmi Guest House and Shree Gokula Residency. Pilgrims on strict budgets are choosing Shree Gokula due to modern construction and air conditioning.
            </p>
            <p className="leading-relaxed">
              <strong>Mid-Premium Segment (₹2,200 – ₹3,500):</strong> Where Temple Trails sits alongside Temple View Suites and Annapoorna Grand. Devotees value pure satvik meals, clean linens, and proximity to temple.
            </p>
            <p className="leading-relaxed">
              <strong>Leisure Retreat (₹4,500+):</strong> Coastal Pilgrims Retreat captures wealthy coastal holidaymakers, but is 3.5 km away and less suitable for early 5:30 AM temple Nirmalya darshan.
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-900">
            AI Recommended Counter-Measures
          </h3>
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">Do Not Enter a Race to the Bottom:</strong> Dropping to ₹1,800 lowers margins and strains housekeeping. Instead, price at ₹2,100 and bundle temple battery-car transit.
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">Leverage Family Suite Monopoly:</strong> No competitor offers 6-person interconnecting suites with private pooja corners. Increase suite weekend rates to ₹7,500.
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">Emphasize Satvik Heritage:</strong> Our in-house Maharaj Chef Narayana Bhat prepares pure satvik meals without garlic/onion on request—a major selling point for orthodox pilgrims.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
