import React, { useState } from 'react';
import { Room, RoomCategory } from '../../types/lodge';
import { SectionId } from '../Sidebar';
import {
  BedDouble,
  CircleDollarSign,
  TrendingDown,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
} from 'lucide-react';

interface OverviewSectionProps {
  rooms: Room[];
  onNavigate: (section: SectionId) => void;
  pendingApprovalsCount: number;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({
  rooms,
  onNavigate,
  pendingApprovalsCount,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<'All' | RoomCategory>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Real calculations on 40 rooms
  const occupiedCount = rooms.filter((r) => r.status === 'Occupied').length;
  const availableCount = rooms.filter((r) => r.status === 'Available').length;
  const cleaningCount = rooms.filter((r) => r.status === 'Cleaning').length;
  const reservedCount = rooms.filter((r) => r.status === 'Reserved').length;
  const occupancyPct = Math.round((occupiedCount / rooms.length) * 100);

  // Revenue metrics
  const todayRoomRevenue = rooms
    .filter((r) => r.status === 'Occupied')
    .reduce((sum, r) => sum + r.currentPrice, 0);
  const currentAdr = occupiedCount > 0 ? Math.round(todayRoomRevenue / occupiedCount) : 0;
  const currentRevPar = Math.round(todayRoomRevenue / rooms.length);

  // Filtered rooms
  const filteredRooms = rooms.filter((r) => {
    const matchCat = categoryFilter === 'All' || r.category === categoryFilter;
    const matchStat = statusFilter === 'All' || r.status === statusFilter;
    return matchCat && matchStat;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner: Core Business Context Notification */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-5 text-amber-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>2026 Festival Booking Lag Alert · Karthika Deepotsava in 12 Days</span>
          </div>
          <p className="text-xs text-amber-900/80 max-w-3xl leading-relaxed">
            Karthika Deepotsava festival pace is trailing at <strong>66% projected occupancy</strong> (down 24.5% vs 2024). Competitors have aggressively cut prices by 18%, and direct marketing was reduced. AI has prepared 5 corrective interventions.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigate('approvals')}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span>Review Actions ({pendingApprovalsCount})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigate('reports')}
            className="px-3.5 py-2 bg-white hover:bg-amber-100/50 border border-amber-300 text-amber-900 text-xs font-medium rounded-lg transition-colors"
          >
            Investigate 2026 Decline
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Occupancy Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Today's Occupancy</span>
            <BedDouble className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {occupancyPct}%
            </span>
            <span className="text-xs text-slate-500">({occupiedCount}/40 rooms)</span>
          </div>
          <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
            <span>Ordinary Weekday Baseline</span>
            <span className="text-amber-700 font-medium">Low Demand (30-40%)</span>
          </div>
        </div>

        {/* Room Revenue Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Estimated Daily Revenue</span>
            <CircleDollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              ₹{todayRoomRevenue.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
            <span>ADR: ₹{currentAdr.toLocaleString('en-IN')}</span>
            <span>RevPAR: ₹{currentRevPar.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* 2026 YoY Comparison Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>2026 Festival Trajectory</span>
            <TrendingDown className="w-4 h-4 text-rose-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-rose-600">
              -24.5%
            </span>
            <span className="text-xs text-slate-500">vs 2024 peak</span>
          </div>
          <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
            <span>Root Cause:</span>
            <span className="text-slate-700 font-medium truncate max-w-[140px]">Competitors & Ad Cuts</span>
          </div>
        </div>

        {/* Festival Readiness Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Festival Readiness Score</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-amber-600">
              64 / 100
            </span>
            <span className="text-xs text-amber-700 font-medium">Attention Required</span>
          </div>
          <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
            <span>Next Festival:</span>
            <span className="font-medium text-slate-800">Karthika Deepotsava</span>
          </div>
        </div>
      </div>

      {/* 40-Room Visual Matrix */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900">40-Room Operational State</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live status across Standard (15), Deluxe (15), Premium (7), and Family Suites (3)
            </p>
          </div>

          {/* Room Matrix Status Legend & Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Status counts */}
            <div className="flex items-center gap-3 text-xs text-slate-600 font-medium mr-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
                <span>Occupied ({occupiedCount})</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                <span>Available ({availableCount})</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-400" />
                <span>Cleaning ({cleaningCount})</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-sky-500" />
                <span>Reserved ({reservedCount})</span>
              </span>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg">
              {(['All', 'Standard', 'Deluxe', 'Premium', 'Family Suite'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors whitespace-nowrap ${
                    categoryFilter === cat
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 lg:grid-cols-10 gap-2.5">
          {filteredRooms.map((room) => {
            const statusBg =
              room.status === 'Occupied'
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : room.status === 'Available'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900 hover:border-emerald-400'
                : room.status === 'Cleaning'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-sky-50 border-sky-200 text-sky-900';

            const statusDot =
              room.status === 'Occupied'
                ? 'bg-rose-500'
                : room.status === 'Available'
                ? 'bg-emerald-500'
                : room.status === 'Cleaning'
                ? 'bg-amber-500'
                : 'bg-sky-500';

            return (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className={`p-2.5 rounded-lg border text-left transition-all ${statusBg} flex flex-col justify-between h-20 hover:shadow-xs`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-xs font-mono">{room.roomNumber}</span>
                  <span className={`w-2 h-2 rounded-full ${statusDot}`} />
                </div>
                <div>
                  <div className="text-[10px] font-medium truncate opacity-80">{room.category}</div>
                  <div className="text-[11px] font-semibold font-mono tabular-nums">
                    ₹{room.currentPrice}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Room Details Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold font-mono">Room {selectedRoom.roomNumber}</span>
                  <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium">
                    Floor {selectedRoom.floor}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{selectedRoom.category} Category</div>
              </div>
              <button
                onClick={() => setSelectedRoom(null)}
                className="text-slate-400 hover:text-slate-600 text-xs px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Current Status:</span>
                <span className="font-semibold text-slate-900">{selectedRoom.status}</span>
              </div>
              {selectedRoom.guestName && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Guest Name:</span>
                  <span className="font-semibold text-slate-900">{selectedRoom.guestName}</span>
                </div>
              )}
              {selectedRoom.checkIn && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Check-in:</span>
                  <span className="font-mono text-slate-700">{selectedRoom.checkIn}</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Current Rate:</span>
                <span className="font-bold font-mono text-slate-900">₹{selectedRoom.currentPrice}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Base Reference Rate:</span>
                <span className="font-mono text-slate-600">₹{selectedRoom.basePrice}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Profitable Floor / Ceiling:</span>
                <span className="font-mono text-slate-600">
                  ₹{selectedRoom.minPrice} – ₹{selectedRoom.maxPrice}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedRoom(null)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedRoom(null);
                  onNavigate('dynamic-pricing');
                }}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-medium"
              >
                Adjust Category Pricing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lower Row: Weekday vs Festival Gap & Fast Action Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demand Gap Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">The Twin Operational Challenge</h2>
            <span className="text-xs text-slate-500">Temple Town Dynamic</span>
          </div>

          <div className="space-y-4">
            {/* Weekday Slack Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Ordinary Weekdays (Mon – Thu)</span>
                <span className="font-mono text-slate-900 font-semibold">33.1% Occupancy (~27 Rooms Empty)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className="bg-sky-500 h-full rounded-full" style={{ width: '33%' }} />
              </div>
              <div className="text-[11px] text-slate-500 flex justify-between">
                <span>Revenue Lost: ~₹2,10,000 / month</span>
                <button
                  onClick={() => onNavigate('dynamic-pricing')}
                  className="text-amber-700 hover:underline font-medium"
                >
                  View Weekday Strategy →
                </button>
              </div>
            </div>

            {/* Festival Surge Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Major Festival Surge (Rathotsava, Shivaratri)</span>
                <span className="font-mono text-slate-900 font-semibold">68.5% in 2026 (was 93.4% in 2024)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex">
                <div className="bg-emerald-500 h-full" style={{ width: '68.5%' }} />
                <div className="bg-rose-300 h-full" style={{ width: '24.9%' }} title="Lost Demand in 2026" />
              </div>
              <div className="text-[11px] text-slate-500 flex justify-between">
                <span className="text-rose-600 font-medium">-24.9% 2026 Decline Gap</span>
                <button
                  onClick={() => onNavigate('reports')}
                  className="text-amber-700 hover:underline font-medium"
                >
                  Forensic Root Cause →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* AI Recommendations & Quick Interventions */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-bold text-slate-900">Central AI Recommendations for Today</h2>
            </div>
            <span className="text-xs text-slate-400">Human Approval Required</span>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-semibold text-slate-900">
                  Recalibrate Standard Room rate to ₹2,100 for Karthika Deepotsava
                </div>
                <div className="text-[11px] text-slate-500 leading-relaxed">
                  Neutralizes Shree Gokula Residency undercutting (-18%) while preserving 35% margin.
                </div>
              </div>
              <button
                onClick={() => onNavigate('approvals')}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-medium shrink-0"
              >
                Approve
              </button>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-semibold text-slate-900">
                  Order 38L Milk & 65 Coconuts before 8:00 PM cutoff
                </div>
                <div className="text-[11px] text-slate-500 leading-relaxed">
                  Avoids breakfast tiffin stockout tomorrow morning (6:00 AM darshan departure rush).
                </div>
              </div>
              <button
                onClick={() => onNavigate('inventory')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded text-[11px] font-medium shrink-0"
              >
                Review PO
              </button>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-semibold text-slate-900">
                  Reserve 6 on-call taxis with Sri Manjunatha Tourist Cabs
                </div>
                <div className="text-[11px] text-slate-500 leading-relaxed">
                  Closes the 16-trip transport capacity gap for pilgrim temple circuits.
                </div>
              </div>
              <button
                onClick={() => onNavigate('local-partners')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded text-[11px] font-medium shrink-0"
              >
                Dispatch
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
