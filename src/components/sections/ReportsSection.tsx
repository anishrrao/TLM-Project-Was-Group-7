import React, { useState } from 'react';
import { DECLINE_FACTORS_EVIDENCE, FINANCIAL_HISTORY } from '../../data/mockData';
import {
  FileBarChart,
  Search,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Filter,
  Download,
  Calendar,
  Layers,
  CheckCircle2,
  PieChart,
} from 'lucide-react';

export const ReportsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'deep-dive' | 'trends' | 'cancellations' | 'departments'>('deep-dive');
  const [selectedDeclineFactor, setSelectedDeclineFactor] = useState<number>(0);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const handleExportCsv = () => {
    setExportNotice('Simulated Report: "LodgeMate_2026_Decline_Forensics.csv" generated and downloaded.');
    setTimeout(() => setExportNotice(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileBarChart className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">
                Reports & Forensic Performance Analytics
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl">
              Cross-departmental reporting engine with multi-factor forensic models. Investigate the 2026 festival booking decline, review cancellation surges, and export auditable datasets.
            </p>
          </div>

          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Report CSV</span>
          </button>
        </div>

        {exportNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-lg text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{exportNotice}</span>
          </div>
        )}
      </div>

      {/* Report Module Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg max-w-fit">
        <button
          onClick={() => setActiveTab('deep-dive')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'deep-dive'
              ? 'bg-white text-slate-900 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          2026 Festival Decline Forensics (Core Investigation)
        </button>
        <button
          onClick={() => setActiveTab('trends')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'trends'
              ? 'bg-white text-slate-900 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          3-Year Occupancy & Pace Trends
        </button>
        <button
          onClick={() => setActiveTab('cancellations')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'cancellations'
              ? 'bg-white text-slate-900 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Cancellation Patterns & Lead Time
        </button>
        <button
          onClick={() => setActiveTab('departments')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'departments'
              ? 'bg-white text-slate-900 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Department Expenses Breakdown
        </button>
      </div>

      {/* Tab 1: Deep Dive Investigation */}
      {activeTab === 'deep-dive' && (
        <div className="space-y-6">
          {/* Executive Forensic Summary Card */}
          <div className="bg-amber-50/70 border border-amber-300 rounded-xl p-5 space-y-3 text-amber-950">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
              <h3 className="text-sm font-bold">
                Forensic Investigation: Why Did Festival Bookings Decline by 24.5% in 2026?
              </h3>
            </div>
            <p className="text-xs leading-relaxed max-w-4xl text-amber-900">
              Across 2024 and 2025, Temple Trails achieved <strong>93.4% and 89.2%</strong> festival occupancy. In 2026, demand dropped sharply to <strong>68.5%</strong>. AI forensic analysis examined room reservations, competitor web traffic, road closures, and channel analytics to quantify the 5 contributing factors below.
            </p>
          </div>

          {/* 5 Factors Interactive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {DECLINE_FACTORS_EVIDENCE.map((factor, index) => {
              const isSelected = selectedDeclineFactor === index;
              return (
                <button
                  key={index}
                  onClick={() => setSelectedDeclineFactor(index)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-[10px] font-mono opacity-60">Factor #{index + 1}</div>
                  <div className="text-xs font-bold mt-1 line-clamp-2 leading-snug">
                    {factor.factor}
                  </div>
                  <div
                    className={`mt-2 text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold inline-block ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {factor.severity.split(' ')[0]} {factor.severity.split(' ')[1]}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Factor Forensic Evidence Deep View */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                  Evidence File #{selectedDeclineFactor + 1}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {DECLINE_FACTORS_EVIDENCE[selectedDeclineFactor].factor}
                </h3>
              </div>
              <span className="text-xs font-bold font-mono px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-md">
                {DECLINE_FACTORS_EVIDENCE[selectedDeclineFactor].severity}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-lg space-y-1.5 border border-slate-100">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                  Quantified Data Point
                </span>
                <p className="font-mono text-slate-900 font-semibold text-xs sm:text-sm">
                  {DECLINE_FACTORS_EVIDENCE[selectedDeclineFactor].dataPoint}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg space-y-1.5 border border-slate-100">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                  Forensic Root Cause Analysis
                </span>
                <p className="text-slate-700 leading-relaxed">
                  {DECLINE_FACTORS_EVIDENCE[selectedDeclineFactor].evidence}
                </p>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-lg space-y-1.5 text-xs">
              <div className="flex items-center gap-2 font-bold text-emerald-950">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>AI Recommended Corrective Action Plan:</span>
              </div>
              <p className="text-emerald-900 leading-relaxed font-medium">
                {DECLINE_FACTORS_EVIDENCE[selectedDeclineFactor].recoveryAction}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Trends */}
      {activeTab === 'trends' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            3-Year Multi-Year Occupancy Comparison
          </h3>
          <p className="text-xs text-slate-500">
            Monthly progression showing 2024 peak, 2025 stability, and 2026 festival slump
          </p>

          <div className="h-64 flex items-end gap-3 pt-8 pb-4 border-b border-slate-100 px-2">
            {[
              { m: 'Jan', y24: 78, y25: 75, y26: 58 },
              { m: 'Feb (Rathotsava)', y24: 98, y25: 94, y26: 71 },
              { m: 'Mar (Shivaratri)', y24: 96, y25: 91, y26: 68 },
              { m: 'Apr (Ugadi)', y24: 88, y25: 84, y26: 64 },
              { m: 'May', y24: 55, y25: 52, y26: 44 },
              { m: 'Jun', y24: 42, y25: 40, y26: 35 },
              { m: 'Jul', y24: 38, y25: 36, y26: 31 },
              { m: 'Aug (Gokulashtami)', y24: 86, y25: 82, y26: 62 },
              { m: 'Sep', y24: 45, y25: 42, y26: 34 },
              { m: 'Oct (Navratri)', y24: 94, y25: 89, y26: 70 },
              { m: 'Nov (Deepotsava)', y24: 95, y25: 90, y26: 66 },
              { m: 'Dec', y24: 65, y25: 62, y26: 50 },
            ].map((col) => (
              <div key={col.m} className="flex-1 flex flex-col items-center gap-1 group relative">
                <div className="w-full flex items-end justify-center gap-1 h-44">
                  <div
                    className="w-2 bg-emerald-600 rounded-t-xs"
                    style={{ height: `${col.y24}%` }}
                    title={`2024: ${col.y24}%`}
                  />
                  <div
                    className="w-2 bg-slate-400 rounded-t-xs"
                    style={{ height: `${col.y25}%` }}
                    title={`2025: ${col.y25}%`}
                  />
                  <div
                    className="w-2.5 bg-rose-500 rounded-t-xs"
                    style={{ height: `${col.y26}%` }}
                    title={`2026: ${col.y26}%`}
                  />
                </div>
                <span className="text-[10px] font-mono text-slate-500 truncate text-center">
                  {col.m.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 text-xs pt-2">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <span className="w-3 h-3 rounded-xs bg-emerald-600" />
              <span>2024 Actual</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <span className="w-3 h-3 rounded-xs bg-slate-400" />
              <span>2025 Actual</span>
            </span>
            <span className="flex items-center gap-1.5 font-bold text-rose-700">
              <span className="w-3 h-3 rounded-xs bg-rose-500" />
              <span>2026 Trajectory (-24% Drop)</span>
            </span>
          </div>
        </div>
      )}

      {/* Tab 3: Cancellations */}
      {activeTab === 'cancellations' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Cancellation Analysis & Advance Booking Windows
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg space-y-1">
              <div className="text-slate-500 text-xs">2024 Cancellation Rate</div>
              <div className="text-2xl font-bold font-mono text-slate-900">7.2%</div>
              <div className="text-[11px] text-slate-400">Advance booking lead: 26 days</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg space-y-1">
              <div className="text-slate-500 text-xs">2025 Cancellation Rate</div>
              <div className="text-2xl font-bold font-mono text-slate-900">11.8%</div>
              <div className="text-[11px] text-slate-400">Advance booking lead: 18 days</div>
            </div>
            <div className="p-4 bg-rose-50 rounded-lg space-y-1 border border-rose-200">
              <div className="text-rose-900 text-xs font-semibold">2026 Cancellation Rate</div>
              <div className="text-2xl font-bold font-mono text-rose-700">14.5%</div>
              <div className="text-[11px] text-rose-900 font-semibold">
                Advance booking lead: 8 days (Late collapse)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Departments */}
      {activeTab === 'departments' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            2026 Department-Wise Operational Cost Distribution
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="text-xs text-slate-500">Staff Salaries & Wages</div>
              <div className="text-xl font-bold font-mono text-slate-900 mt-1">₹22,00,000</div>
              <div className="text-[10px] text-slate-400 mt-0.5">43.0% of total OPEX</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="text-xs text-slate-500">Food & Supply Procurement</div>
              <div className="text-xl font-bold font-mono text-slate-900 mt-1">₹18,40,000</div>
              <div className="text-[10px] text-slate-400 mt-0.5">35.9% of total OPEX</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="text-xs text-slate-500">Electricity & Hot Water Diesel</div>
              <div className="text-xl font-bold font-mono text-slate-900 mt-1">₹6,80,000</div>
              <div className="text-[10px] text-slate-400 mt-0.5">13.3% of total OPEX</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="text-xs text-slate-500">OTA Commission & Marketing</div>
              <div className="text-xl font-bold font-mono text-slate-900 mt-1">₹4,00,000</div>
              <div className="text-[10px] text-slate-400 mt-0.5">7.8% of total OPEX</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
