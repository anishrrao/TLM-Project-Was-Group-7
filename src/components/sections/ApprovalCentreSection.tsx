import React, { useState } from 'react';
import { ApprovalAction } from '../../types/lodge';
import {
  CheckCircle2,
  XCircle,
  Eye,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Filter,
  Check,
  X,
  Sparkles,
} from 'lucide-react';

interface ApprovalCentreSectionProps {
  approvals: ApprovalAction[];
  onApproveAction: (id: string) => void;
  onRejectAction: (id: string, reason: string) => void;
}

export const ApprovalCentreSection: React.FC<ApprovalCentreSectionProps> = ({
  approvals,
  onApproveAction,
  onRejectAction,
}) => {
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');
  const [selectedAction, setSelectedAction] = useState<ApprovalAction | null>(null);
  const [rejectionModalAction, setRejectionModalAction] = useState<ApprovalAction | null>(null);
  const [rejectionReasonText, setRejectionReasonText] = useState('');

  const filteredApprovals = approvals.filter((a) => {
    const matchStatus = statusFilter === 'All' || a.status === statusFilter;
    const matchDept = departmentFilter === 'All' || a.department === departmentFilter;
    return matchStatus && matchDept;
  });

  const pendingCount = approvals.filter((a) => a.status === 'Pending').length;
  const approvedCount = approvals.filter((a) => a.status === 'Approved').length;
  const rejectedCount = approvals.filter((a) => a.status === 'Rejected').length;

  const handleConfirmReject = () => {
    if (rejectionModalAction) {
      onRejectAction(rejectionModalAction.id, rejectionReasonText || 'Declined by manager.');
      setRejectionModalAction(null);
      setRejectionReasonText('');
      if (selectedAction?.id === rejectionModalAction.id) {
        setSelectedAction(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold tracking-tight">
              AI Approval Centre · Central Human-in-the-Loop Hub
            </h2>
            <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded font-semibold">
              Manager Authorization Mandatory
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            Every dynamic tariff shift, supplier purchase order, temporary staff shift, and transport reserve must be verified here. Approving an action simulates internal confirmation without triggering irreversible external commitments.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        {/* Status Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((st) => {
            const count =
              st === 'All'
                ? approvals.length
                : st === 'Pending'
                ? pendingCount
                : st === 'Approved'
                ? approvedCount
                : rejectedCount;

            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                  statusFilter === st
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{st}</span>
                <span className="text-[10px] font-mono px-1 py-0.2 bg-slate-200/80 rounded">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Department Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Department:</span>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 font-medium focus:outline-none"
          >
            <option value="All">All Departments</option>
            <option value="Pricing">Pricing</option>
            <option value="Workforce">Workforce</option>
            <option value="Inventory">Inventory</option>
            <option value="Transport">Transport</option>
            <option value="Food & Catering">Food & Catering</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>
      </div>

      {/* Approvals Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Pending & Executed Management Decisions
            </h3>
            <p className="text-xs text-slate-500">
              Showing {filteredApprovals.length} actionable records
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
              <tr>
                <th className="px-4 py-3">Action Proposal</th>
                <th className="px-3 py-3">Dept</th>
                <th className="px-3 py-3">Current Situation</th>
                <th className="px-3 py-3">AI Recommendation</th>
                <th className="px-3 py-3 text-right">Financial Impact</th>
                <th className="px-3 py-3 text-center">Risk Level</th>
                <th className="px-3 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApprovals.map((item) => {
                const isPending = item.status === 'Pending';
                const isApproved = item.status === 'Approved';
                const isRejected = item.status === 'Rejected';

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isPending ? 'bg-amber-50/20' : ''
                    }`}
                  >
                    <td className="px-4 py-3.5 font-semibold text-slate-900 max-w-[200px]">
                      <div>{item.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {item.createdAt}
                      </div>
                    </td>
                    <td className="px-3 py-3.5">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-semibold">
                        {item.department}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 text-slate-600 text-[11px] max-w-xs leading-relaxed">
                      {item.currentSituation}
                    </td>
                    <td className="px-3 py-3.5 text-slate-900 text-[11px] font-medium max-w-xs leading-relaxed">
                      {item.aiRecommendation}
                    </td>
                    <td className="px-3 py-3.5 text-right font-mono font-bold text-slate-900 tabular-nums">
                      <div>
                        {item.financialImpact.type === 'Cost' ? '-' : '+'}₹
                        {item.financialImpact.amount.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] font-sans font-normal text-slate-400">
                        {item.financialImpact.type}
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.riskLevel === 'High'
                            ? 'bg-rose-100 text-rose-800'
                            : item.riskLevel === 'Medium'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.riskLevel}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isApproved
                            ? 'bg-emerald-100 text-emerald-800'
                            : isRejected
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedAction(item)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 rounded bg-slate-100 hover:bg-slate-200 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {isPending && (
                          <>
                            <button
                              onClick={() => onApproveAction(item.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold transition-colors flex items-center gap-1 shadow-2xs"
                            >
                              <Check className="w-3 h-3" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => setRejectionModalAction(item)}
                              className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-[11px] font-semibold transition-colors flex items-center gap-1"
                            >
                              <X className="w-3 h-3" />
                              <span>Reject</span>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Details Modal */}
      {selectedAction && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 sm:p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  {selectedAction.department} Action #{selectedAction.id}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {selectedAction.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAction(null)}
                className="text-slate-400 hover:text-slate-600 text-xs px-2 py-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                <span className="font-bold text-slate-700">Current Situation:</span>
                <p className="text-slate-600">{selectedAction.currentSituation}</p>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg space-y-1">
                <span className="font-bold text-emerald-900">AI Proposed Intervention:</span>
                <p className="text-emerald-950 font-medium">{selectedAction.aiRecommendation}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                  <div className="text-[10px] text-slate-400">Financial Impact</div>
                  <div className="font-bold font-mono text-slate-900">
                    {selectedAction.financialImpact.type === 'Cost' ? '-' : '+'}₹
                    {selectedAction.financialImpact.amount.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {selectedAction.financialImpact.description}
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                  <div className="text-[10px] text-slate-400">Risk Assessment</div>
                  <div className="font-bold text-slate-900">{selectedAction.riskLevel} Risk</div>
                  <div className="text-[10px] text-slate-500">Standard operational bounds</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                <span className="font-bold text-slate-700">Reasoning & Algorithmic Basis:</span>
                <p className="text-slate-600">{selectedAction.reason}</p>
              </div>

              {selectedAction.reviewedBy && (
                <div className="text-[11px] text-slate-500 font-mono">
                  Decision recorded by: {selectedAction.reviewedBy} at {selectedAction.reviewedAt}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setSelectedAction(null)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium"
              >
                Close
              </button>
              {selectedAction.status === 'Pending' && (
                <>
                  <button
                    onClick={() => {
                      setRejectionModalAction(selectedAction);
                    }}
                    className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      onApproveAction(selectedAction.id);
                      setSelectedAction(null);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                  >
                    Approve Decision
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Prompt Modal */}
      {rejectionModalAction && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 border border-slate-200 shadow-2xl space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Reject Action: {rejectionModalAction.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Please state the reason for rejecting this AI recommendation for our audit trail.
              </p>
            </div>

            <textarea
              value={rejectionReasonText}
              onChange={(e) => setRejectionReasonText(e.target.value)}
              placeholder="e.g. Rate floor too aggressive / Prefer existing staff overtime..."
              className="w-full h-24 p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectionModalAction(null)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-semibold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
