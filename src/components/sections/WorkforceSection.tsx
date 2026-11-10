import React, { useState } from 'react';
import { STAFF_MEMBERS } from '../../data/mockData';
import { calculateStaffNeeds } from '../../utils/algorithms';
import { ApprovalAction } from '../../types/lodge';
import {
  Users,
  Briefcase,
  AlertTriangle,
  Clock,
  CircleDollarSign,
  CheckCircle2,
  Sliders,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface WorkforceSectionProps {
  onAddApprovalAction: (action: Omit<ApprovalAction, 'id' | 'createdAt' | 'status'>) => void;
  onNavigateToApprovals: () => void;
}

export const WorkforceSection: React.FC<WorkforceSectionProps> = ({
  onAddApprovalAction,
  onNavigateToApprovals,
}) => {
  // Operational parameters (defaulting to Karthika Festival peak day simulation)
  const [checkoutRooms, setCheckoutRooms] = useState<number>(22);
  const [stayoverRooms, setStayoverRooms] = useState<number>(14);
  const [occupiedRooms, setOccupiedRooms] = useState<number>(36);
  const [expectedMeals, setExpectedMeals] = useState<number>(85);
  const [expectedCheckins, setExpectedCheckins] = useState<number>(24);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Available staff counts from directory
  const availableStaff = {
    housekeeping: STAFF_MEMBERS.filter((s) => s.department === 'Housekeeping' && s.available).length, // 5
    kitchen: STAFF_MEMBERS.filter((s) => s.department === 'Kitchen' && s.available).length, // 5
    frontDesk: STAFF_MEMBERS.filter((s) => s.department === 'Front Desk' && s.available).length, // 3
    maintenance: STAFF_MEMBERS.filter((s) => s.department === 'Maintenance' && s.available).length, // 2
  };

  const needs = calculateStaffNeeds(
    checkoutRooms,
    stayoverRooms,
    occupiedRooms,
    expectedMeals,
    expectedCheckins,
    availableStaff
  );

  const totalShortage =
    needs.housekeeping.shortage +
    needs.kitchen.shortage +
    needs.frontDesk.shortage +
    needs.maintenance.shortage;

  const totalExtraCost =
    needs.housekeeping.costEstimate +
    needs.kitchen.costEstimate +
    needs.frontDesk.costEstimate +
    needs.maintenance.costEstimate;

  const handleProposeStaffing = () => {
    onAddApprovalAction({
      title: `Festival Temporary Roster Reinforcement (${totalShortage} Extra Staff)`,
      department: 'Workforce',
      currentSituation: `Simulated surge: ${checkoutRooms} checkouts, ${expectedMeals} meals, ${expectedCheckins} check-ins. Total staff shortage of ${totalShortage} across departments.`,
      aiRecommendation: `Engage temporary personnel from Udupi Guild: Housekeeping (${needs.housekeeping.shortage}), Kitchen (${needs.kitchen.shortage}), Front Desk (${needs.frontDesk.shortage}).`,
      financialImpact: {
        type: 'Cost',
        amount: totalExtraCost,
        description: `Estimated daily temporary staff compensation: ₹${totalExtraCost.toLocaleString('en-IN')}.`,
      },
      reason: 'Workforce formula: 1 hk / 12 checkouts, 1 kitchen / 40 meals, 1 desk / 20 checkins. Eliminates turnover and food delays.',
      riskLevel: 'Medium',
    });

    setToastMessage(`Temporary staffing proposal for ₹${totalExtraCost} submitted to AI Approval Centre!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">
                Workforce Planning & Workload Calculator
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl">
              Calculates staff requirements from operational demand metrics: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">Staff Shortage = Required Staff - Available Staff</code>. Prevents turnover delays without excessive overtime.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleProposeStaffing}
              disabled={totalShortage === 0}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>Submit Roster Proposal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Operational Guardrail Note */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              <strong>Safeguard:</strong> LODGEMATE AI never alters actual schedules or hires employees autonomously. All allocations require manager authorization.
            </span>
          </div>
          <span className="font-mono text-[11px] text-slate-500">16 Permanent Staff on Roll</span>
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
            Go to Approval Centre →
          </button>
        </div>
      )}

      {/* Interactive Demand Inputs for Staff Simulation */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
          <Sliders className="w-4 h-4 text-indigo-600" />
          <span>Operational Demand Inputs (Adjust to Simulate Workload)</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-1">
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-slate-600">Checkout Rooms:</label>
            <input
              type="number"
              min="0"
              max="40"
              value={checkoutRooms}
              onChange={(e) => setCheckoutRooms(Math.max(0, Number(e.target.value)))}
              className="w-full text-xs font-mono font-bold px-3 py-1.5 border border-slate-300 rounded-md bg-slate-50"
            />
            <span className="text-[10px] text-slate-400">1 attendant / 12 checkouts</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-slate-600">Stayover Rooms:</label>
            <input
              type="number"
              min="0"
              max="40"
              value={stayoverRooms}
              onChange={(e) => setStayoverRooms(Math.max(0, Number(e.target.value)))}
              className="w-full text-xs font-mono font-bold px-3 py-1.5 border border-slate-300 rounded-md bg-slate-50"
            />
            <span className="text-[10px] text-slate-400">1 attendant / 20 stayovers</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-slate-600">Expected Check-ins:</label>
            <input
              type="number"
              min="0"
              max="40"
              value={expectedCheckins}
              onChange={(e) => setExpectedCheckins(Math.max(0, Number(e.target.value)))}
              className="w-full text-xs font-mono font-bold px-3 py-1.5 border border-slate-300 rounded-md bg-slate-50"
            />
            <span className="text-[10px] text-slate-400">1 receptionist / 20 check-ins</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-slate-600">Expected Meals / Shift:</label>
            <input
              type="number"
              min="0"
              max="200"
              value={expectedMeals}
              onChange={(e) => setExpectedMeals(Math.max(0, Number(e.target.value)))}
              className="w-full text-xs font-mono font-bold px-3 py-1.5 border border-slate-300 rounded-md bg-slate-50"
            />
            <span className="text-[10px] text-slate-400">1 cook-helper / 40 meals</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-slate-600">Total Occupied Rooms:</label>
            <input
              type="number"
              min="0"
              max="40"
              value={occupiedRooms}
              onChange={(e) => setOccupiedRooms(Math.max(0, Number(e.target.value)))}
              className="w-full text-xs font-mono font-bold px-3 py-1.5 border border-slate-300 rounded-md bg-slate-50"
            />
            <span className="text-[10px] text-slate-400">1 tech / 40 occupied</span>
          </div>
        </div>
      </div>

      {/* Department-Wise Workload Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Department-Wise Staff Requirements & Shortages
            </h3>
            <p className="text-xs text-slate-500">
              Summary based on current operational inputs above
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-slate-900">
              Total Extra Labor Cost: <span className="font-mono text-rose-600">₹{totalExtraCost.toLocaleString('en-IN')}</span>
            </div>
            <div className="text-[10px] text-slate-500">
              {totalShortage > 0 ? `${totalShortage} additional temporary staff needed` : 'Adequately staffed'}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
              <tr>
                <th className="px-4 py-3">Department</th>
                <th className="px-3 py-3">Operational Workload</th>
                <th className="px-3 py-3">Ratio Standard</th>
                <th className="px-3 py-3 text-center">Required</th>
                <th className="px-3 py-3 text-center">Available</th>
                <th className="px-3 py-3 text-center font-bold">Staff Shortage</th>
                <th className="px-3 py-3 text-right">Est. Additional Cost</th>
                <th className="px-4 py-3">Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Housekeeping */}
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="px-4 py-3 font-semibold text-slate-900">Housekeeping</td>
                <td className="px-3 py-3 text-slate-600">
                  {checkoutRooms} checkouts + {stayoverRooms} stayovers
                </td>
                <td className="px-3 py-3 text-slate-500 text-[11px]">1 : 12 out / 1 : 20 stay</td>
                <td className="px-3 py-3 text-center font-mono font-bold text-slate-900">
                  {needs.housekeeping.required}
                </td>
                <td className="px-3 py-3 text-center font-mono text-slate-600">
                  {needs.housekeeping.available}
                </td>
                <td className="px-3 py-3 text-center font-mono font-bold">
                  {needs.housekeeping.shortage > 0 ? (
                    <span className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded text-[11px]">
                      +{needs.housekeeping.shortage} Shortage
                    </span>
                  ) : (
                    <span className="text-emerald-600">Sufficient</span>
                  )}
                </td>
                <td className="px-3 py-3 text-right font-mono text-slate-800 tabular-nums font-semibold">
                  ₹{needs.housekeeping.costEstimate}
                </td>
                <td className="px-4 py-3 text-[11px] text-slate-700">
                  {needs.housekeeping.shortage > 0
                    ? `Engage ${needs.housekeeping.shortage} guild temp staff at ₹650/day to ensure 25m turnaround.`
                    : 'Current attendants cover expected turnover.'}
                </td>
              </tr>

              {/* Kitchen */}
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="px-4 py-3 font-semibold text-slate-900">Kitchen & Dining</td>
                <td className="px-3 py-3 text-slate-600">{expectedMeals} meals expected</td>
                <td className="px-3 py-3 text-slate-500 text-[11px]">1 employee : 40 meals</td>
                <td className="px-3 py-3 text-center font-mono font-bold text-slate-900">
                  {needs.kitchen.required}
                </td>
                <td className="px-3 py-3 text-center font-mono text-slate-600">
                  {needs.kitchen.available}
                </td>
                <td className="px-3 py-3 text-center font-mono font-bold">
                  {needs.kitchen.shortage > 0 ? (
                    <span className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded text-[11px]">
                      +{needs.kitchen.shortage} Shortage
                    </span>
                  ) : (
                    <span className="text-emerald-600">Sufficient</span>
                  )}
                </td>
                <td className="px-3 py-3 text-right font-mono text-slate-800 tabular-nums font-semibold">
                  ₹{needs.kitchen.costEstimate}
                </td>
                <td className="px-4 py-3 text-[11px] text-slate-700">
                  {needs.kitchen.shortage > 0
                    ? `Assign Assistant Maharaj Parameshwara overtime or call temp dish helper at ₹800.`
                    : 'Kitchen crew adequate for planned banana leaf covers.'}
                </td>
              </tr>

              {/* Front Desk */}
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="px-4 py-3 font-semibold text-slate-900">Front Desk & Billing</td>
                <td className="px-3 py-3 text-slate-600">{expectedCheckins} check-ins</td>
                <td className="px-3 py-3 text-slate-500 text-[11px]">1 receptionist : 20 checkins (min 1)</td>
                <td className="px-3 py-3 text-center font-mono font-bold text-slate-900">
                  {needs.frontDesk.required}
                </td>
                <td className="px-3 py-3 text-center font-mono text-slate-600">
                  {needs.frontDesk.available}
                </td>
                <td className="px-3 py-3 text-center font-mono font-bold">
                  {needs.frontDesk.shortage > 0 ? (
                    <span className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded text-[11px]">
                      +{needs.frontDesk.shortage} Shortage
                    </span>
                  ) : (
                    <span className="text-emerald-600">Sufficient</span>
                  )}
                </td>
                <td className="px-3 py-3 text-right font-mono text-slate-800 tabular-nums font-semibold">
                  ₹{needs.frontDesk.costEstimate}
                </td>
                <td className="px-4 py-3 text-[11px] text-slate-700">
                  {needs.frontDesk.shortage > 0
                    ? 'Shift Deepa Nayak from evening billing to morning peak check-in window.'
                    : 'Prashanth and Karthik provide full 24h reception coverage.'}
                </td>
              </tr>

              {/* Maintenance */}
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="px-4 py-3 font-semibold text-slate-900">Maintenance & Power</td>
                <td className="px-3 py-3 text-slate-600">{occupiedRooms} occupied rooms</td>
                <td className="px-3 py-3 text-slate-500 text-[11px]">1 tech : 40 rooms (min 1)</td>
                <td className="px-3 py-3 text-center font-mono font-bold text-slate-900">
                  {needs.maintenance.required}
                </td>
                <td className="px-3 py-3 text-center font-mono text-slate-600">
                  {needs.maintenance.available}
                </td>
                <td className="px-3 py-3 text-center font-mono font-bold">
                  {needs.maintenance.shortage > 0 ? (
                    <span className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded text-[11px]">
                      +{needs.maintenance.shortage} Shortage
                    </span>
                  ) : (
                    <span className="text-emerald-600">Sufficient</span>
                  )}
                </td>
                <td className="px-3 py-3 text-right font-mono text-slate-800 tabular-nums font-semibold">
                  ₹{needs.maintenance.costEstimate}
                </td>
                <td className="px-4 py-3 text-[11px] text-slate-700">
                  Kumaraswamy on morning hot water pumps, Somappa on night diesel generator.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Directory Reference */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Staff Directory & Daily Wage Register
          </h3>
          <span className="text-xs text-slate-500">16 Active Records</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {STAFF_MEMBERS.map((staff) => (
            <div
              key={staff.id}
              className={`p-3 rounded-lg border ${
                staff.available ? 'bg-slate-50 border-slate-200' : 'bg-rose-50 border-rose-200'
              } text-xs space-y-1`}
            >
              <div className="flex justify-between items-start">
                <span className="font-bold text-slate-900">{staff.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                    staff.available
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-200 text-rose-900'
                  }`}
                >
                  {staff.available ? staff.shift : 'On Leave'}
                </span>
              </div>
              <div className="text-[11px] text-slate-500">{staff.role}</div>
              <div className="flex justify-between pt-1 border-t border-slate-200/60 text-[11px]">
                <span className="text-slate-400">{staff.department}</span>
                <span className="font-mono font-semibold text-slate-800">₹{staff.dailyWage}/day</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
