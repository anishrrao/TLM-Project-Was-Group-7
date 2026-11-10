import React, { useState } from 'react';
import { TRANSPORT_PARTNERS, FOOD_PARTNERS } from '../../data/mockData';
import { calculateTransportGap } from '../../utils/algorithms';
import { ApprovalAction, TransportPartner, FoodPartner } from '../../types/lodge';
import {
  Car,
  UtensilsCrossed,
  Phone,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  ArrowRight,
  ShieldCheck,
  Star,
} from 'lucide-react';

interface LocalPartnersSectionProps {
  onAddApprovalAction: (action: Omit<ApprovalAction, 'id' | 'createdAt' | 'status'>) => void;
  onNavigateToApprovals: () => void;
}

export const LocalPartnersSection: React.FC<LocalPartnersSectionProps> = ({
  onAddApprovalAction,
  onNavigateToApprovals,
}) => {
  // Operational simulation state (defaults to Karthika Deepotsava weekend)
  const [checkins, setCheckins] = useState<number>(24);
  const [checkouts, setCheckouts] = useState<number>(20);
  const [guestCount, setGuestCount] = useState<number>(85);
  const [isFestival, setIsFestival] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Available fleet vehicles across active partners
  const availableFleetCapacity = TRANSPORT_PARTNERS.filter((t) => t.status === 'Active').reduce(
    (sum, t) => sum + t.availableVehicles,
    0
  );

  const transportStats = calculateTransportGap(
    checkins,
    checkouts,
    guestCount,
    isFestival,
    availableFleetCapacity
  );

  const handleProposeTaxiReserve = (partner: TransportPartner) => {
    onAddApprovalAction({
      title: `Reserve Dedicated Fleet: ${partner.name} (${partner.availableVehicles} Vehicles)`,
      department: 'Transport',
      currentSituation: `Expected taxi requests are ${transportStats.expectedRequests} against active partner capacity of ${transportStats.availableCapacity} (Gap: +${transportStats.capacityGap} trips).`,
      aiRecommendation: `Sign priority standby arrangement with ${partner.name} (${partner.contactPerson}) at ₹${partner.standardFareTempleRun}/trip.`,
      financialImpact: {
        type: 'Savings',
        amount: 8500,
        description: 'Protects guests from uncoordinated surge tariffs (₹750/trip) and preserves temple darshan timings.',
      },
      reason: 'Local transport gap formula indicates driver shortage during festival evening Rathotsava rush.',
      riskLevel: 'Low',
    });

    setToastMessage(`Fleet reservation proposal for ${partner.name} sent to AI Approval Centre!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handlePartnerDiningContract = (partner: FoodPartner) => {
    onAddApprovalAction({
      title: `Dining Partnership Agreement: ${partner.name}`,
      department: 'Food & Catering',
      currentSituation: 'Kitchen peak evening covers nearing capacity threshold during festival week.',
      aiRecommendation: `Issue 40 dining vouchers to guests for ${partner.name} at ₹${partner.avgCostPerThali}/thali.`,
      financialImpact: {
        type: 'Cost',
        amount: partner.avgCostPerThali * 40,
        description: 'Direct partner settlement voucher package.',
      },
      reason: 'Prevents dining delays and expands guest dining choice to authentic local temple mess.',
      riskLevel: 'Low',
    });

    setToastMessage(`Dining voucher proposal for ${partner.name} sent to AI Approval Centre!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Car className="w-5 h-5 text-amber-600" />
              <h2 className="text-base font-bold text-slate-900">
                Local Partner Coordination & Transport Gap Calculator
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl">
              Calculates transport bottlenecks: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">Transport Capacity Gap = Expected Taxi Requests - Available Fleet Capacity</code>. Connects the lodge with trusted local drivers and satvik dining halls.
            </p>
          </div>
        </div>

        {/* Prototype Integrity Notice */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              <strong>Prototype Disclaimer:</strong> Partner directory details and contacts are realistic fictional records. Clicking reserve triggers an AI proposal inside the Approval Centre; no real driver or restaurant receives an external dispatch.
            </span>
          </div>
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

      {/* Transport Gap Simulator Box */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <Sliders className="w-4 h-4 text-amber-600" />
            <span>Transport Demand Simulator (Temple Transit & Station Pickups)</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2.5 py-1 rounded-md font-bold font-mono ${
                transportStats.capacityGap > 0
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {transportStats.capacityGap > 0
                ? `Shortage Gap: +${transportStats.capacityGap} Requests`
                : 'Fleet Capacity Sufficient'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-600">Expected Check-ins:</label>
            <input
              type="number"
              min="0"
              max="40"
              value={checkins}
              onChange={(e) => setCheckins(Number(e.target.value))}
              className="w-full text-xs font-mono font-bold px-3 py-1.5 border border-slate-300 rounded-md bg-slate-50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-600">Expected Checkouts:</label>
            <input
              type="number"
              min="0"
              max="40"
              value={checkouts}
              onChange={(e) => setCheckouts(Number(e.target.value))}
              className="w-full text-xs font-mono font-bold px-3 py-1.5 border border-slate-300 rounded-md bg-slate-50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-600">Total Staying Guests:</label>
            <input
              type="number"
              min="10"
              max="110"
              value={guestCount}
              onChange={(e) => setGuestCount(Number(e.target.value))}
              className="w-full text-xs font-mono font-bold px-3 py-1.5 border border-slate-300 rounded-md bg-slate-50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-600">Festival Demand Multiplier:</label>
            <button
              onClick={() => setIsFestival(!isFestival)}
              className={`w-full py-1.5 px-3 rounded-md text-xs font-semibold border transition-colors ${
                isFestival
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-slate-100 text-slate-700 border-slate-300'
              }`}
            >
              {isFestival ? '1.6x Festival Surge' : '1.0x Normal Day'}
            </button>
          </div>
        </div>

        {/* Live Calculation KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="text-slate-500 text-[11px]">Expected Taxi Requests</div>
            <div className="text-xl font-bold font-mono text-slate-900">
              {transportStats.expectedRequests} Trips / Day
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Temple drops, railway station, darshan return
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="text-slate-500 text-[11px]">Active Fleet Partner Capacity</div>
            <div className="text-xl font-bold font-mono text-slate-900">
              {transportStats.availableCapacity} Vehicles
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Dzire sedans, Innovas & registered auto-rickshaws
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="text-slate-500 text-[11px]">Capacity Gap</div>
            <div
              className={`text-xl font-bold font-mono ${
                transportStats.capacityGap > 0 ? 'text-rose-600' : 'text-emerald-600'
              }`}
            >
              {transportStats.capacityGap > 0 ? `+${transportStats.capacityGap} Requests` : '0 Gap'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {transportStats.capacityGap > 0
                ? 'Requires on-call standby reservation'
                : 'Current fleet sufficient'}
            </div>
          </div>
        </div>
      </div>

      {/* Taxi Partners Directory */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900">
            Registered Local Transport Partners
          </h3>
          <p className="text-xs text-slate-500">
            Verified local tourist drivers and auto-rickshaw union operators
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
              <tr>
                <th className="px-4 py-3">Partner Name</th>
                <th className="px-3 py-3">Contact Person & Phone</th>
                <th className="px-3 py-3">Vehicle Type</th>
                <th className="px-3 py-3 text-center">Fleet Capacity</th>
                <th className="px-3 py-3 text-right">Agreed Temple Circuit Fare</th>
                <th className="px-3 py-3 text-center">Rating</th>
                <th className="px-3 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {TRANSPORT_PARTNERS.map((tp) => (
                <tr key={tp.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-900">{tp.name}</td>
                  <td className="px-3 py-3 text-slate-600">
                    <div>{tp.contactPerson}</div>
                    <div className="font-mono text-[10px] text-slate-400">{tp.phone}</div>
                  </td>
                  <td className="px-3 py-3 text-slate-700">{tp.vehicleType}</td>
                  <td className="px-3 py-3 text-center font-mono font-bold text-slate-900">
                    {tp.availableVehicles} units
                  </td>
                  <td className="px-3 py-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                    ₹{tp.standardFareTempleRun}
                  </td>
                  <td className="px-3 py-3 text-center font-mono">
                    <span className="flex items-center justify-center gap-1 text-slate-800">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                      <span>{tp.rating}</span>
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        tp.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : tp.status === 'On-Call'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {tp.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleProposeTaxiReserve(tp)}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-semibold whitespace-nowrap transition-colors"
                    >
                      Reserve Fleet
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Local Restaurant & Satvik Mess Partners */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900">
            Local Temple Dining & Overflow Catering Partners
          </h3>
          <p className="text-xs text-slate-500">
            Pre-negotiated pure satvik vegetarian dining partners for overflow banquet meals
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
              <tr>
                <th className="px-4 py-3">Restaurant / Mess Name</th>
                <th className="px-3 py-3">Cuisine Specialty</th>
                <th className="px-3 py-3">Contact & Phone</th>
                <th className="px-3 py-3 text-center">Capacity</th>
                <th className="px-3 py-3 text-right">Agreed Thali Rate</th>
                <th className="px-3 py-3 text-center">Service Model</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {FOOD_PARTNERS.map((fp) => (
                <tr key={fp.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-900">{fp.name}</td>
                  <td className="px-3 py-3 text-slate-600 text-[11px] max-w-xs">{fp.cuisine}</td>
                  <td className="px-3 py-3 text-slate-600">
                    <div>{fp.contactPerson}</div>
                    <div className="font-mono text-[10px] text-slate-400">{fp.phone}</div>
                  </td>
                  <td className="px-3 py-3 text-center font-mono font-bold text-slate-900">
                    {fp.mealCapacity} covers
                  </td>
                  <td className="px-3 py-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                    ₹{fp.avgCostPerThali}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-800">
                      {fp.serviceType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handlePartnerDiningContract(fp)}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-semibold whitespace-nowrap transition-colors"
                    >
                      Issue Vouchers
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
