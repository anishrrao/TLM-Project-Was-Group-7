import React, { useState } from 'react';
import { FINANCIAL_HISTORY } from '../../data/mockData';
import { CircleDollarSign, TrendingUp, TrendingDown, ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react';

export const FinancialAnalyticsSection: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<'2024' | '2025' | '2026'>('2026');
  const activeFinancials = FINANCIAL_HISTORY[selectedYear];

  // Projected impact of applying AI recommendations for 2026
  const aiImpact2026 = {
    incrementalRoomRevenue: 485000, // from dynamic price adjustments + weekday packages
    incrementalFoodRevenue: 120000, // from satvik thali packaging & overflow vouchers
    incrementalStaffCost: 65000, // temp guild staff during festival peaks
    incrementalProcurementCost: 85000, // food ingredients for extra meals
    netProfitImprovement: 455000,
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CircleDollarSign className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">
                Lodge Financial Analytics & Historical Ledger
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl">
              Industry standard formulas: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">ADR = Room Revenue / Rooms Sold</code>, <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">RevPAR = Room Revenue / Available Room Nights</code>, <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">Occupancy % = Rooms Sold / Available Room Nights × 100</code>.
            </p>
          </div>

          {/* Year Selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
            {(['2024', '2025', '2026'] as const).map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  selectedYear === yr
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {yr} {yr === '2026' ? '(YTD/Proj)' : 'Actual'}
              </button>
            ))}
          </div>
        </div>

        {/* Historical vs Projected Marker */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                selectedYear === '2026' ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
            />
            <span>
              <strong>Current View:</strong>{' '}
              {selectedYear === '2026'
                ? '2026 Year-to-Date Actuals + AI 4th Quarter Projections'
                : `Audited Fictional Historical Figures for FY ${selectedYear}`}
            </span>
          </div>
          <span className="font-mono text-[11px] text-slate-500">40 Room Keys Base</span>
        </div>
      </div>

      {/* Primary Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 space-y-2">
          <div className="text-xs text-slate-500 font-medium">Total Revenue (FY {selectedYear})</div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            ₹{activeFinancials.totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex justify-between">
            <span>Room: ₹{activeFinancials.roomRevenue.toLocaleString('en-IN')}</span>
            <span>Food: ₹{activeFinancials.foodRevenue.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* ADR & RevPAR */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 space-y-2">
          <div className="text-xs text-slate-500 font-medium">Average Daily Rate (ADR)</div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            ₹{activeFinancials.adr.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex justify-between">
            <span>RevPAR:</span>
            <span className="font-mono font-semibold text-slate-800">
              ₹{activeFinancials.revpar.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Net Profit & Margin */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 space-y-2">
          <div className="text-xs text-slate-500 font-medium">Estimated Net Profit</div>
          <div className="text-2xl font-bold font-mono text-emerald-700 tabular-nums">
            ₹{activeFinancials.estimatedProfit.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex justify-between">
            <span>Profit Margin:</span>
            <span className="font-mono font-semibold text-emerald-800">
              {activeFinancials.profitMargin}%
            </span>
          </div>
        </div>

        {/* Annual Occupancy */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 space-y-2">
          <div className="text-xs text-slate-500 font-medium">Annual Average Occupancy</div>
          <div
            className={`text-2xl font-bold font-mono tabular-nums ${
              activeFinancials.annualOccupancy < 55 ? 'text-rose-600' : 'text-slate-900'
            }`}
          >
            {activeFinancials.annualOccupancy}%
          </div>
          <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex justify-between">
            <span>Festival Avg: {activeFinancials.festivalAvgOccupancy}%</span>
            <span>Weekday: {activeFinancials.weekdayAvgOccupancy}%</span>
          </div>
        </div>
      </div>

      {/* 3-Year YoY Financial Comparison Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900">
            3-Year Year-on-Year Financial Comparison (2024 vs 2025 vs 2026)
          </h3>
          <p className="text-xs text-slate-500">
            Clear distinction between actual historical performance and 2026 decline
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
              <tr>
                <th className="px-4 py-3">Financial Metric</th>
                <th className="px-4 py-3 text-right">2024 (Peak Year)</th>
                <th className="px-4 py-3 text-right">2025 (Friction Year)</th>
                <th className="px-4 py-3 text-right font-bold text-slate-900">
                  2026 (Decline Year)
                </th>
                <th className="px-4 py-3 text-right">YoY Variance (2026 vs 2024)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              <tr className="hover:bg-slate-50/80">
                <td className="px-4 py-3 font-sans font-medium text-slate-900">Total Revenue</td>
                <td className="px-4 py-3 text-right text-slate-700">₹1,04,50,000</td>
                <td className="px-4 py-3 text-right text-slate-700">₹1,08,20,000</td>
                <td className="px-4 py-3 text-right font-bold text-rose-700">₹81,20,000</td>
                <td className="px-4 py-3 text-right text-rose-600 font-bold">-22.3%</td>
              </tr>
              <tr className="hover:bg-slate-50/80">
                <td className="px-4 py-3 font-sans font-medium text-slate-900">Room Revenue</td>
                <td className="px-4 py-3 text-right text-slate-700">₹86,40,000</td>
                <td className="px-4 py-3 text-right text-slate-700">₹89,10,000</td>
                <td className="px-4 py-3 text-right font-bold text-rose-700">₹66,80,000</td>
                <td className="px-4 py-3 text-right text-rose-600 font-bold">-22.7%</td>
              </tr>
              <tr className="hover:bg-slate-50/80">
                <td className="px-4 py-3 font-sans font-medium text-slate-900">Food & Dining Revenue</td>
                <td className="px-4 py-3 text-right text-slate-700">₹18,10,000</td>
                <td className="px-4 py-3 text-right text-slate-700">₹19,10,000</td>
                <td className="px-4 py-3 text-right font-bold text-rose-700">₹14,40,000</td>
                <td className="px-4 py-3 text-right text-rose-600 font-bold">-20.4%</td>
              </tr>
              <tr className="hover:bg-slate-50/80">
                <td className="px-4 py-3 font-sans font-medium text-slate-900">Operating Expenses</td>
                <td className="px-4 py-3 text-right text-slate-700">₹54,80,000</td>
                <td className="px-4 py-3 text-right text-slate-700">₹62,40,000</td>
                <td className="px-4 py-3 text-right font-bold text-slate-900">₹51,20,000</td>
                <td className="px-4 py-3 text-right text-emerald-600">-6.5%</td>
              </tr>
              <tr className="hover:bg-slate-50/80">
                <td className="px-4 py-3 font-sans font-medium text-slate-900">Marketing & OTA Ad Spend</td>
                <td className="px-4 py-3 text-right text-slate-700">₹3,20,000</td>
                <td className="px-4 py-3 text-right text-slate-700">₹3,40,000</td>
                <td className="px-4 py-3 text-right font-bold text-rose-700">₹1,75,000</td>
                <td className="px-4 py-3 text-right text-rose-600 font-bold">-45.3% (Cut)</td>
              </tr>
              <tr className="hover:bg-slate-50/80">
                <td className="px-4 py-3 font-sans font-medium text-slate-900">Estimated Net Profit</td>
                <td className="px-4 py-3 text-right text-emerald-700 font-bold">₹49,70,000</td>
                <td className="px-4 py-3 text-right text-emerald-700 font-bold">₹45,80,000</td>
                <td className="px-4 py-3 text-right font-bold text-rose-700">₹30,00,000</td>
                <td className="px-4 py-3 text-right text-rose-600 font-bold">-39.6%</td>
              </tr>
              <tr className="hover:bg-slate-50/80">
                <td className="px-4 py-3 font-sans font-medium text-slate-900">ADR (Average Daily Rate)</td>
                <td className="px-4 py-3 text-right text-slate-700">₹2,840</td>
                <td className="px-4 py-3 text-right text-slate-700">₹3,050</td>
                <td className="px-4 py-3 text-right font-bold text-slate-800">₹2,680</td>
                <td className="px-4 py-3 text-right text-slate-600">-5.6%</td>
              </tr>
              <tr className="hover:bg-slate-50/80">
                <td className="px-4 py-3 font-sans font-medium text-slate-900">RevPAR (Rev Per Avail Room)</td>
                <td className="px-4 py-3 text-right text-slate-700">₹1,780</td>
                <td className="px-4 py-3 text-right text-slate-700">₹1,835</td>
                <td className="px-4 py-3 text-right font-bold text-rose-700">₹1,372</td>
                <td className="px-4 py-3 text-right text-rose-600 font-bold">-22.9%</td>
              </tr>
              <tr className="hover:bg-slate-50/80">
                <td className="px-4 py-3 font-sans font-medium text-slate-900">Festival Occupancy Avg</td>
                <td className="px-4 py-3 text-right text-emerald-700 font-bold">93.4%</td>
                <td className="px-4 py-3 text-right text-emerald-700 font-bold">89.2%</td>
                <td className="px-4 py-3 text-right font-bold text-rose-700">68.5%</td>
                <td className="px-4 py-3 text-right text-rose-600 font-bold">-24.9% pts</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Recommendation Financial Impact Projection */}
      <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-700" />
          <h3 className="text-sm font-bold text-emerald-950">
            Projected Financial Recovery via LODGEMATE AI Interventions
          </h3>
        </div>
        <p className="text-xs text-emerald-900 leading-relaxed max-w-3xl">
          By executing the proposed AI actions (Dynamic Pricing, WhatsApp Pilgrim Retargeting, Weekday Floor Packages, and Staff Safety Roster), Temple Trails can recover significant lost demand for Q4 2026.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <div className="p-3 bg-white rounded-lg border border-emerald-200 text-xs">
            <div className="text-slate-500 text-[11px]">Extra Room Revenue</div>
            <div className="text-lg font-bold font-mono text-emerald-800">
              +₹{aiImpact2026.incrementalRoomRevenue.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Via dynamic pace recalibration</div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-emerald-200 text-xs">
            <div className="text-slate-500 text-[11px]">Extra Dining Revenue</div>
            <div className="text-lg font-bold font-mono text-emerald-800">
              +₹{aiImpact2026.incrementalFoodRevenue.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Packed satvik prasadam meals</div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-emerald-200 text-xs">
            <div className="text-slate-500 text-[11px]">Incremental Labor & Procurement</div>
            <div className="text-lg font-bold font-mono text-slate-800">
              -₹{(aiImpact2026.incrementalStaffCost + aiImpact2026.incrementalProcurementCost).toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Guild temp staff + food raw</div>
          </div>

          <div className="p-3 bg-emerald-700 text-white rounded-lg text-xs shadow-xs">
            <div className="text-emerald-100 text-[11px]">Net Projected Profit Lift</div>
            <div className="text-xl font-bold font-mono text-white">
              +₹{aiImpact2026.netProfitImprovement.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-emerald-200 mt-0.5">+15.1% margin recovery</div>
          </div>
        </div>
      </div>
    </div>
  );
};
