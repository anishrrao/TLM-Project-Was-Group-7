import React from 'react';
import { Menu, Bell, CheckCircle2, Calendar, UserCheck } from 'lucide-react';
import { SectionId } from './Sidebar';

interface HeaderProps {
  activeSection: SectionId;
  onOpenMobile: () => void;
  pendingApprovalsCount: number;
  onNavigateToApprovals: () => void;
}

const SECTION_TITLES: Record<SectionId, { title: string; category: string }> = {
  overview: { title: 'Executive Lodge Overview', category: 'Core Management' },
  'command-centre': { title: 'AI Command Centre', category: 'Core Management' },
  approvals: { title: 'AI Approval Centre', category: 'Core Management' },
  'demand-forecasting': { title: 'Demand Forecasting', category: 'Revenue & Market' },
  'dynamic-pricing': { title: 'Dynamic Room Pricing', category: 'Revenue & Market' },
  'competitor-intel': { title: 'Competitor Intelligence', category: 'Revenue & Market' },
  financials: { title: 'Financial Analytics', category: 'Revenue & Market' },
  workforce: { title: 'Workforce Management', category: 'Lodge Operations' },
  inventory: { title: 'Inventory & Procurement', category: 'Lodge Operations' },
  kitchen: { title: 'Food & Kitchen Planning', category: 'Lodge Operations' },
  'local-partners': { title: 'Local Partner Coordination', category: 'Lodge Operations' },
  festivals: { title: 'Festival Management', category: 'Lodge Operations' },
  reports: { title: 'Reports & 2026 Decline Deep Dive', category: 'Analytics & Governance' },
  settings: { title: 'Settings & AI Architecture (RAG / MCP)', category: 'Analytics & Governance' },
};

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onOpenMobile,
  pendingApprovalsCount,
  onNavigateToApprovals,
}) => {
  const meta = SECTION_TITLES[activeSection] || {
    title: 'Dashboard',
    category: 'Management',
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-4 sm:px-8 py-3.5 bg-white border-b border-slate-200">
      {/* Zone 1: Mobile toggle + Breadcrumb trail */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobile}
          className="p-1.5 -ml-1 text-slate-600 hover:text-slate-900 lg:hidden rounded-md"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium truncate">
          <span className="hidden sm:inline">Temple Trails Lodge</span>
          <span className="hidden sm:inline" aria-hidden="true">/</span>
          <span className="text-slate-400 hidden md:inline">{meta.category}</span>
          <span className="hidden md:inline" aria-hidden="true">/</span>
          <span className="text-slate-900 font-semibold truncate">{meta.title}</span>
        </div>
      </div>

      {/* Zone 2: Simulation timeline + Prototype Indicator */}
      <div className="hidden lg:flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5 text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-medium">Simulation Timeline:</span>
          <span className="font-semibold text-slate-800">Nov 9, 2026 (Karthika Prep)</span>
        </div>
        <div className="text-slate-500 text-[11px] flex items-center gap-1.5 border border-slate-200 px-2 py-0.5 rounded-md">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <span>Rule-Based Simulated AI</span>
        </div>
      </div>

      {/* Zone 3: Pending Approvals CTA & Manager Profile */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onNavigateToApprovals}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
            pendingApprovalsCount > 0
              ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-3.5 h-3.5 text-amber-700" />
          <span className="hidden sm:inline">Approvals Queue</span>
          {pendingApprovalsCount > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-600 text-white rounded text-[11px] font-bold tabular-nums">
              {pendingApprovalsCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-semibold flex items-center justify-center">
            KR
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-semibold text-slate-800 leading-none">K. Ramanathan</div>
            <div className="text-[10px] text-slate-500 leading-tight mt-0.5">General Manager</div>
          </div>
        </div>
      </div>
    </header>
  );
};
