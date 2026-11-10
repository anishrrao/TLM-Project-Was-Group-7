import React, { useState } from 'react';
import { DayForecast } from '../../types/lodge';
import { GENERATE_30_DAY_FORECAST } from '../../data/mockData';
import { calculateDemandForecast } from '../../utils/algorithms';
import {
  TrendingUp,
  Calendar,
  Sparkles,
  Users,
  BedDouble,
  Sliders,
  AlertCircle,
  Tag,
  CheckCircle2,
} from 'lucide-react';

export const DemandForecastingSection: React.FC = () => {
  const [timeHorizon, setTimeHorizon] = useState<7 | 14 | 30>(14);
  const [forecastDays] = useState<DayForecast[]>(() => GENERATE_30_DAY_FORECAST());

  // Interactive formula sensitivity tester
  const [hWeight, setHWeight] = useState(0.4);
  const [wWeight, setWWeight] = useState(0.25);
  const [bWeight, setBWeight] = useState(0.25);
  const [cWeight, setCWeight] = useState(0.1);

  // Active days according to time horizon
  const visibleDays = forecastDays.slice(0, timeHorizon);

  // Aggregates
  const avgOccupancy = Math.round(
    visibleDays.reduce((acc, d) => acc + d.forecastOccupancy, 0) / visibleDays.length
  );
  const avgOccupiedRooms = Math.round(
    visibleDays.reduce((acc, d) => acc + d.occupiedRooms, 0) / visibleDays.length
  );
  const totalExpectedGuests = visibleDays.reduce((acc, d) => acc + d.expectedGuests, 0);

  // Weekday slack detection (<40% occupancy)
  const lowOccupancyDays = visibleDays.filter((d) => d.forecastOccupancy < 40);

  return (
    <div className="space-y-6">
      {/* Header & Formula Explanation Strip */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-600" />
              <h2 className="text-base font-bold text-slate-900">
                Rule-Based Demand Forecasting Engine
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl">
              Forecast is mathematically modeled: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-800 font-semibold">Forecast = (0.40 × H) + (0.25 × W) + (0.25 × B) + (0.10 × C)</code> where H is Historical Occupancy, W is 8-week Weekday Avg, B is Booking Pace, and C is Festival/Calendar Demand.
            </p>
          </div>

          {/* Time Horizon Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
            {([7, 14, 30] as const).map((days) => (
              <button
                key={days}
                onClick={() => setTimeHorizon(days)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  timeHorizon === days
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Next {days} Days
              </button>
            ))}
          </div>
        </div>

        {/* 3 Metric Cards for Selected Horizon */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-[11px] text-slate-500">Average Expected Occupancy</div>
            <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {avgOccupancy}%
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Across next {timeHorizon} days ({avgOccupiedRooms} / 40 rooms avg)
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-[11px] text-slate-500">Total Expected Pilgrims</div>
            <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {totalExpectedGuests} Guests
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Based on 2.3 avg guests per occupied room
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-[11px] text-slate-500">Low Occupancy Slack Days</div>
            <div className="text-2xl font-bold font-mono text-amber-700 tabular-nums">
              {lowOccupancyDays.length} Days (&lt;40%)
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Requires weekday rate floor discount & packages
            </div>
          </div>
        </div>
      </div>

      {/* Forecast Visual Chart (SVG Bar & Trend) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {timeHorizon}-Day Projected Occupancy Trajectory
            </h3>
            <p className="text-xs text-slate-500">
              Note the spike during Karthika Deepotsava (Days 12–16) and midweek valleys
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
              <span>Forecast %</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-300" />
              <span>Historical H</span>
            </span>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="h-48 w-full flex items-end gap-1.5 sm:gap-2 pt-6 border-b border-slate-100 overflow-x-auto pb-2">
          {visibleDays.map((day, idx) => {
            const barHeightPct = Math.max(8, day.forecastOccupancy);
            const histHeightPct = Math.max(8, day.historicalOccupancy);
            const isFest = day.isFestival;
            const isLow = day.forecastOccupancy < 40;

            return (
              <div
                key={day.date}
                className="flex-1 min-w-[28px] max-w-[40px] flex flex-col items-center gap-1 group relative cursor-pointer"
              >
                {/* Tooltip on hover */}
                <div className="absolute -top-12 z-20 hidden group-hover:flex flex-col items-center bg-slate-900 text-white text-[10px] p-1.5 rounded shadow-lg whitespace-nowrap pointer-events-none">
                  <span>{day.date} ({day.dayOfWeek.slice(0, 3)})</span>
                  <span className="font-mono font-bold text-amber-400">
                    Forecast: {day.forecastOccupancy}% ({day.occupiedRooms} rms)
                  </span>
                  {day.festivalName && (
                    <span className="text-emerald-400 font-semibold">{day.festivalName}</span>
                  )}
                </div>

                {/* Bars comparison */}
                <div className="w-full flex items-end justify-center gap-0.5 h-36">
                  {/* Historical faint bar */}
                  <div
                    className="w-1.5 bg-slate-200 rounded-t-xs transition-all"
                    style={{ height: `${histHeightPct}%` }}
                    title={`Historical: ${day.historicalOccupancy}%`}
                  />
                  {/* Forecast main bar */}
                  <div
                    className={`w-3.5 rounded-t-xs transition-all ${
                      isFest
                        ? 'bg-amber-500 group-hover:bg-amber-600'
                        : isLow
                        ? 'bg-sky-400 group-hover:bg-sky-500'
                        : 'bg-slate-700 group-hover:bg-slate-900'
                    }`}
                    style={{ height: `${barHeightPct}%` }}
                  />
                </div>

                {/* Date label */}
                <span className="text-[10px] font-mono text-slate-500 truncate w-full text-center">
                  {day.date.slice(8)}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-[11px] text-slate-500">
          <span>{visibleDays[0]?.date}</span>
          <span>{visibleDays[Math.floor(visibleDays.length / 2)]?.date}</span>
          <span>{visibleDays[visibleDays.length - 1]?.date}</span>
        </div>
      </div>

      {/* Granular Forecast Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Granular Day-by-Day Forecast Breakdown
            </h3>
            <p className="text-xs text-slate-500">
              Inspect historical weights, booking pace multipliers, and room allocations
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-3 py-3">Weekday</th>
                <th className="px-3 py-3">Calendar / Festival</th>
                <th className="px-3 py-3 text-right">H (40%)</th>
                <th className="px-3 py-3 text-right">W (25%)</th>
                <th className="px-3 py-3 text-right">B (25%)</th>
                <th className="px-3 py-3 text-right">C (10%)</th>
                <th className="px-3 py-3 text-right font-bold text-slate-900">Forecast %</th>
                <th className="px-3 py-3 text-right">Occupied Rms</th>
                <th className="px-3 py-3 text-right">Available Rms</th>
                <th className="px-4 py-3 text-right">Guests</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleDays.map((d) => (
                <tr
                  key={d.date}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    d.isFestival ? 'bg-amber-50/40' : ''
                  }`}
                >
                  <td className="px-4 py-2.5 font-mono font-medium text-slate-800">{d.date}</td>
                  <td className="px-3 py-2.5 text-slate-600">{d.dayOfWeek}</td>
                  <td className="px-3 py-2.5">
                    {d.isFestival ? (
                      <span className="font-semibold text-amber-800 text-[11px]">
                        {d.festivalName}
                      </span>
                    ) : (
                      <span className="text-slate-400">Regular</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-slate-600 tabular-nums">
                    {d.historicalOccupancy}%
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-slate-600 tabular-nums">
                    {d.weekdayAvgOccupancy}%
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-slate-600 tabular-nums">
                    {d.bookingPaceEstimate}%
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-slate-600 tabular-nums">
                    {d.calendarDemandEstimate}%
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono font-bold text-slate-900 tabular-nums">
                    {d.forecastOccupancy}%
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-slate-800 tabular-nums font-semibold">
                    {d.occupiedRooms}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-slate-500 tabular-nums">
                    {d.availableRooms}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-slate-700 tabular-nums">
                    {d.expectedGuests}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Weekday Occupancy Improvement Strategies Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Weekday Occupancy Improvement Strategies (&lt;40% Occupancy Rules)
          </h3>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          When forecast occupancy drops below 40%, the system generates high-conversion promotional strategies to capture off-peak pilgrim traffic without violating our minimum profitable rate floor (₹1,400 Standard / ₹2,200 Deluxe).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="text-xs font-bold text-slate-900">1. Senior Devotee Midweek Serenity</div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Target retired devotees who prefer avoiding weekend temple crowds. Offer Standard rooms at ₹1,550 with satvik breakfast and guaranteed ground-floor access.
            </p>
            <div className="text-[11px] font-semibold text-emerald-700 font-mono">
              Est. Monthly Impact: +₹78,000 Room Rev
            </div>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="text-xs font-bold text-slate-900">2. Karnataka State RTC Tour Bundling</div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Partner with KSRTC pilgrim express buses originating from Bangalore/Mysore. Offer 10 block-rooms Mon–Wed at ₹1,600 with quick 6 AM darshan tea service.
            </p>
            <div className="text-[11px] font-semibold text-emerald-700 font-mono">
              Est. Monthly Impact: +₹64,000 Room Rev
            </div>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="text-xs font-bold text-slate-900">3. 3-Night Temple Circuit Package</div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Devotees visiting nearby sacred spots (Subramanya, Dharmasthala, Udupi) receive the 3rd night at 40% discount (effective ₹1,500/night).
            </p>
            <div className="text-[11px] font-semibold text-emerald-700 font-mono">
              Est. Monthly Impact: +₹52,000 Room Rev
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
