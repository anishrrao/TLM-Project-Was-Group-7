import React, { useState } from 'react';
import { INVENTORY_ITEMS } from '../../data/mockData';
import { InventoryItem, ApprovalAction } from '../../types/lodge';
import {
  Boxes,
  AlertTriangle,
  ShoppingCart,
  Clock,
  ShieldCheck,
  CheckCircle2,
  FileText,
  ArrowRight,
} from 'lucide-react';

interface InventorySectionProps {
  onAddApprovalAction: (action: Omit<ApprovalAction, 'id' | 'createdAt' | 'status'>) => void;
  onNavigateToApprovals: () => void;
}

export const InventorySection: React.FC<InventorySectionProps> = ({
  onAddApprovalAction,
  onNavigateToApprovals,
}) => {
  const [items, setItems] = useState<InventoryItem[]>(INVENTORY_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Critical stockouts (available <= safety stock)
  const criticalItems = items.filter((i) => i.stockoutRisk === 'Critical');
  const warningItems = items.filter((i) => i.stockoutRisk === 'Warning');

  // Filtered list
  const filteredItems = items.filter(
    (i) => selectedCategory === 'All' || i.category === selectedCategory
  );

  // Total procurement order cost for suggested quantities
  const totalSuggestedPoCost = filteredItems.reduce(
    (sum, i) => sum + i.suggestedOrderQuantity * i.unitCost,
    0
  );

  const handleCreatePo = (item: InventoryItem) => {
    const cost = item.suggestedOrderQuantity * item.unitCost;
    onAddApprovalAction({
      title: `Procurement PO: ${item.name} (${item.suggestedOrderQuantity} ${item.unit})`,
      department: 'Inventory',
      currentSituation: `Available stock is ${item.availableStock} ${item.unit} (reorder point: ${item.reorderPoint}). Lead time is ${item.leadTimeDays} days.`,
      aiRecommendation: `Issue formal Purchase Order to ${item.supplier} for ${item.suggestedOrderQuantity} ${item.unit}.`,
      financialImpact: {
        type: 'Cost',
        amount: cost,
        description: `Vendor invoice payable to ${item.supplier} on delivery.`,
      },
      reason: `Inventory formula: Available (${item.availableStock}) < Reorder Point (${item.reorderPoint}). Safety stock protection.`,
      riskLevel: item.stockoutRisk === 'Critical' ? 'High' : 'Low',
    });

    setToastMessage(`Purchase order for ${item.name} (₹${cost.toLocaleString('en-IN')}) sent to AI Approval Centre!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleOrderAllCritical = () => {
    const criticalCost = criticalItems.reduce(
      (sum, i) => sum + i.suggestedOrderQuantity * i.unitCost,
      0
    );
    const names = criticalItems.map((i) => `${i.name} (${i.suggestedOrderQuantity} ${i.unit})`).join(', ');

    onAddApprovalAction({
      title: `Emergency Batch PO: Critical Kitchen & Dairy Restock (${criticalItems.length} Items)`,
      department: 'Inventory',
      currentSituation: `${criticalItems.length} items have breached safety buffers: ${names}. Stockout imminent within 24-36h.`,
      aiRecommendation: `Authorize emergency dispatch from KMF Depot, Kudla Mandi, and APMC Market before 8:00 PM cutoff.`,
      financialImpact: {
        type: 'Cost',
        amount: criticalCost,
        description: `Total emergency procurement outlay across ${criticalItems.length} suppliers.`,
      },
      reason: 'Critical stockout prevention rule: Tomorrow morning 6:00 AM breakfast and temple tiffin require these items.',
      riskLevel: 'Low',
    });

    setToastMessage(`Emergency batch order for ${criticalItems.length} critical items submitted to AI Approval Centre!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Boxes className="w-5 h-5 text-amber-600" />
              <h2 className="text-base font-bold text-slate-900">
                Inventory & Procurement Optimization
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl">
              Implements <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">Reorder Point = (Daily Burn × Lead Time) + Safety Stock</code> and <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">Suggested Order = Max(0, Target Stock - Available Stock)</code>. Prevents temple festival stockouts without spoilage.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOrderAllCritical}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Order All Critical ({criticalItems.length})</span>
            </button>
          </div>
        </div>

        {/* Critical Stockout Warning Card */}
        {criticalItems.length > 0 && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-3 text-xs text-rose-950">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed flex-1">
              <strong>Stockout Danger Alert:</strong> {criticalItems.map((c) => c.name).join(', ')} are currently below their mandatory safety thresholds. Tomorrow morning temple pilgrims departure at 6:00 AM will face coffee and tiffin shortages without dispatch before 8:00 PM today.
            </div>
          </div>
        )}
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

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg max-w-fit">
        {(['All', 'Dairy', 'Fresh Vegetables', 'Dry Groceries', 'Pooja & Housekeeping'] as const).map(
          (cat) => (
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
          )
        )}
      </div>

      {/* Inventory Master Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Procurement & Reorder Schedule
            </h3>
            <p className="text-xs text-slate-500">
              Showing {filteredItems.length} items · Total suggested order value: <strong className="text-slate-900 font-mono">₹{totalSuggestedPoCost.toLocaleString('en-IN')}</strong>
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
              <tr>
                <th className="px-4 py-3">Item Name</th>
                <th className="px-3 py-3">Category</th>
                <th className="px-3 py-3 text-right">Available Stock</th>
                <th className="px-3 py-3 text-right">Daily Burn</th>
                <th className="px-3 py-3 text-right">Lead Time</th>
                <th className="px-3 py-3 text-right">Safety Stock</th>
                <th className="px-3 py-3 text-right">Reorder Point</th>
                <th className="px-3 py-3 text-center">Stockout Risk</th>
                <th className="px-3 py-3 text-right font-bold text-slate-900">Suggested PO</th>
                <th className="px-3 py-3 text-right">Est. Cost</th>
                <th className="px-4 py-3">Supplier & Expiry Rules</th>
                <th className="px-3 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => {
                const poCost = item.suggestedOrderQuantity * item.unitCost;
                const isCritical = item.stockoutRisk === 'Critical';
                const isWarning = item.stockoutRisk === 'Warning';

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isCritical ? 'bg-rose-50/30' : isWarning ? 'bg-amber-50/20' : ''
                    }`}
                  >
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      <div>{item.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{item.unit}</div>
                    </td>
                    <td className="px-3 py-3 text-slate-600 text-[11px]">{item.category}</td>
                    <td className="px-3 py-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {item.availableStock}
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-slate-600 tabular-nums">
                      {item.avgDailyConsumption}
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-slate-600 tabular-nums">
                      {item.leadTimeDays}d
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-slate-500 tabular-nums">
                      {item.safetyStock}
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-slate-800 font-semibold tabular-nums">
                      {item.reorderPoint}
                    </td>
                    <td className="px-3 py-3 text-center font-mono">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isCritical
                            ? 'bg-rose-100 text-rose-800'
                            : isWarning
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.stockoutRisk}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {item.suggestedOrderQuantity} {item.unit.split(' ')[0]}
                    </td>
                    <td className="px-3 py-3 text-right font-mono font-semibold text-slate-800 tabular-nums">
                      ₹{poCost.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-[11px] text-slate-600 max-w-xs">
                      <div className="font-medium text-slate-800 truncate">{item.supplier}</div>
                      {item.expiryWarning && (
                        <div className="text-[10px] text-amber-800 mt-0.5 font-sans">
                          {item.expiryWarning}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <button
                        onClick={() => handleCreatePo(item)}
                        disabled={item.suggestedOrderQuantity === 0}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded text-[11px] font-semibold whitespace-nowrap transition-colors"
                      >
                        Create PO
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
