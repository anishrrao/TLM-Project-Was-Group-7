import React from 'react';
import {
  LayoutDashboard,
  Bot,
  CheckCircle2,
  TrendingUp,
  Tag,
  Binoculars,
  Users,
  Boxes,
  UtensilsCrossed,
  Car,
  CalendarDays,
  CircleDollarSign,
  FileBarChart,
  Settings,
  ChevronRight,
  ShieldCheck,
  Building2,
  X,
} from 'lucide-react';

export type SectionId =
  | 'overview'
  | 'command-centre'
  | 'approvals'
  | 'demand-forecasting'
  | 'dynamic-pricing'
  | 'competitor-intel'
  | 'financials'
  | 'workforce'
  | 'inventory'
  | 'kitchen'
  | 'local-partners'
  | 'festivals'
  | 'reports'
  | 'settings';

interface SidebarProps {
  activeSection: SectionId;
  onSelectSection: (id: SectionId) => void;
  pendingApprovalsCount: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSelectSection,
  pendingApprovalsCount,
  mobileOpen,
  onCloseMobile,
}) => {
  const navGroups = [
    {
      group: 'Core Management',
      items: [
        { id: 'overview' as SectionId, label: 'Overview', icon: LayoutDashboard },
        { id: 'command-centre' as SectionId, label: 'AI Command Centre', icon: Bot, highlight: true },
        {
          id: 'approvals' as SectionId,
          label: 'AI Approval Centre',
          icon: CheckCircle2,
          badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount} Pending` : undefined,
          badgeColor: 'bg-amber-500 text-slate-950 font-bold',
        },
      ],
    },
    {
      group: 'Revenue & Market',
      items: [
        { id: 'demand-forecasting' as SectionId, label: 'Demand Forecasting', icon: TrendingUp },
        { id: 'dynamic-pricing' as SectionId, label: 'Dynamic Room Pricing', icon: Tag },
        { id: 'competitor-intel' as SectionId, label: 'Competitor Intelligence', icon: Binoculars },
        { id: 'financials' as SectionId, label: 'Financial Analytics', icon: CircleDollarSign },
      ],
    },
    {
      group: 'Lodge Operations',
      items: [
        { id: 'workforce' as SectionId, label: 'Workforce Management', icon: Users },
        { id: 'inventory' as SectionId, label: 'Inventory & Procurement', icon: Boxes },
        { id: 'kitchen' as SectionId, label: 'Food & Kitchen Planning', icon: UtensilsCrossed },
        { id: 'local-partners' as SectionId, label: 'Local Partner Coordination', icon: Car },
        { id: 'festivals' as SectionId, label: 'Festival Management', icon: CalendarDays },
      ],
    },
    {
      group: 'Analytics & Governance',
      items: [
        { id: 'reports' as SectionId, label: 'Reports & 2026 Deep Dive', icon: FileBarChart },
        { id: 'settings' as SectionId, label: 'Settings & AI Architecture', icon: Settings },
      ],
    },
  ];

  const handleItemClick = (id: SectionId) => {
    onSelectSection(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-base shadow-sm">
                LM
              </div>
              <h1 className="text-lg font-bold tracking-tight text-white">LODGEMATE AI</h1>
            </div>
            <p className="mt-1 text-xs text-slate-400 font-normal">
              Your lodge. One intelligent management system.
            </p>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded text-slate-400 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Property Metadata Card */}
        <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
            <Building2 className="w-3.5 h-3.5" />
            <span>Temple Trails Family Lodge</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400 flex items-center gap-2">
            <span>40 Keys</span>
            <span aria-hidden="true">·</span>
            <span>Karnataka Temple Belt</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">INR (₹)</span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navGroups.map((group) => (
            <div key={group.group}>
              <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {group.group}
              </div>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => handleItemClick(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left ${
                          isActive
                            ? 'bg-amber-500/15 text-amber-300 font-semibold'
                            : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            className={`w-4 h-4 shrink-0 ${
                              isActive ? 'text-amber-400' : 'text-slate-400'
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge ? (
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-sm font-semibold tabular-nums shrink-0 ${item.badgeColor}`}
                          >
                            {item.badge}
                          </span>
                        ) : isActive ? (
                          <ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Bottom Responsible AI Guardrail Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Human-in-the-Loop Active</span>
          </div>
          <p className="mt-1 text-[10px] text-slate-400 leading-tight">
            All AI recommendations require manager sign-off prior to publishing.
          </p>
        </div>
      </aside>
    </>
  );
};
