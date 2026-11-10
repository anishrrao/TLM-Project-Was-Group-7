import React, { useState, useEffect } from 'react';
import { Sidebar, SectionId } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewSection } from './components/sections/OverviewSection';
import { CommandCentreSection } from './components/sections/CommandCentreSection';
import { ApprovalCentreSection } from './components/sections/ApprovalCentreSection';
import { DemandForecastingSection } from './components/sections/DemandForecastingSection';
import { DynamicPricingSection } from './components/sections/DynamicPricingSection';
import { CompetitorIntelSection } from './components/sections/CompetitorIntelSection';
import { WorkforceSection } from './components/sections/WorkforceSection';
import { InventorySection } from './components/sections/InventorySection';
import { KitchenPlanningSection } from './components/sections/KitchenPlanningSection';
import { LocalPartnersSection } from './components/sections/LocalPartnersSection';
import { FestivalManagementSection } from './components/sections/FestivalManagementSection';
import { FinancialAnalyticsSection } from './components/sections/FinancialAnalyticsSection';
import { ReportsSection } from './components/sections/ReportsSection';
import { SettingsSection } from './components/sections/SettingsSection';
import { ApprovalAction, Room } from './types/lodge';
import { StorageService } from './utils/storage';

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionId>('overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [rooms, setRooms] = useState<Room[]>(() => StorageService.getRooms());
  const [approvals, setApprovals] = useState<ApprovalAction[]>(() =>
    StorageService.getApprovals()
  );

  // Sync rooms & approvals to storage on state changes
  useEffect(() => {
    StorageService.saveApprovals(approvals);
  }, [approvals]);

  useEffect(() => {
    StorageService.saveRooms(rooms);
  }, [rooms]);

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'Pending').length;

  const handleApproveAction = (id: string) => {
    setApprovals((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        // If it's a pricing action, update the room tariff in state as well
        if (item.department === 'Pricing' && item.title.includes('Tariff Adjustment to ₹')) {
          const match = item.title.match(/(Standard|Deluxe|Premium|Family Suite).*?₹(\d+)/);
          if (match) {
            const cat = match[1];
            const newPrice = Number(match[2]);
            setRooms((currentRooms) =>
              currentRooms.map((r) => (r.category === cat ? { ...r, currentPrice: newPrice } : r))
            );
          }
        }

        const approvedItem: ApprovalAction = {
          ...item,
          status: 'Approved',
          reviewedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          reviewedBy: 'General Manager (K. Ramanathan)',
        };

        StorageService.addAuditLog({
          user: 'General Manager (K. Ramanathan)',
          actionType: 'Approval Decision',
          details: `Approved proposal: "${item.title}". Status updated to Approved.`,
          status: 'Approved',
        });

        return approvedItem;
      })
    );
  };

  const handleRejectAction = (id: string, reason: string) => {
    setApprovals((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const rejectedItem: ApprovalAction = {
          ...item,
          status: 'Rejected',
          rejectionReason: reason,
          reviewedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          reviewedBy: 'General Manager (K. Ramanathan)',
        };

        StorageService.addAuditLog({
          user: 'General Manager (K. Ramanathan)',
          actionType: 'Approval Decision',
          details: `Rejected proposal: "${item.title}". Reason: ${reason}`,
          status: 'Rejected',
        });

        return rejectedItem;
      })
    );
  };

  const handleAddApprovalAction = (
    action: Omit<ApprovalAction, 'id' | 'createdAt' | 'status'>
  ) => {
    const newAction: ApprovalAction = {
      id: `appr-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'Pending',
      ...action,
    };

    setApprovals((prev) => [newAction, ...prev]);

    StorageService.addAuditLog({
      user: 'LODGEMATE AI Engine',
      actionType: 'Approval Decision',
      details: `New proposal generated: "${newAction.title}" for ${newAction.department}.`,
      status: 'System Flagged',
    });
  };

  const handleNavigate = (section: SectionId) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* 1. Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onSelectSection={handleNavigate}
        pendingApprovalsCount={pendingApprovalsCount}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* 2. Main Content Canvas */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          activeSection={activeSection}
          onOpenMobile={() => setMobileOpen(true)}
          pendingApprovalsCount={pendingApprovalsCount}
          onNavigateToApprovals={() => handleNavigate('approvals')}
        />

        {/* Section Viewport Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeSection === 'overview' && (
            <OverviewSection
              rooms={rooms}
              onNavigate={handleNavigate}
              pendingApprovalsCount={pendingApprovalsCount}
            />
          )}

          {activeSection === 'command-centre' && (
            <CommandCentreSection
              pendingApprovalsCount={pendingApprovalsCount}
              onAddApprovalAction={handleAddApprovalAction}
              onNavigateToApprovals={() => handleNavigate('approvals')}
            />
          )}

          {activeSection === 'approvals' && (
            <ApprovalCentreSection
              approvals={approvals}
              onApproveAction={handleApproveAction}
              onRejectAction={handleRejectAction}
            />
          )}

          {activeSection === 'demand-forecasting' && <DemandForecastingSection />}

          {activeSection === 'dynamic-pricing' && (
            <DynamicPricingSection
              onAddApprovalAction={handleAddApprovalAction}
              onNavigateToApprovals={() => handleNavigate('approvals')}
            />
          )}

          {activeSection === 'competitor-intel' && <CompetitorIntelSection />}

          {activeSection === 'financials' && <FinancialAnalyticsSection />}

          {activeSection === 'workforce' && (
            <WorkforceSection
              onAddApprovalAction={handleAddApprovalAction}
              onNavigateToApprovals={() => handleNavigate('approvals')}
            />
          )}

          {activeSection === 'inventory' && (
            <InventorySection
              onAddApprovalAction={handleAddApprovalAction}
              onNavigateToApprovals={() => handleNavigate('approvals')}
            />
          )}

          {activeSection === 'kitchen' && (
            <KitchenPlanningSection
              onAddApprovalAction={handleAddApprovalAction}
              onNavigateToApprovals={() => handleNavigate('approvals')}
            />
          )}

          {activeSection === 'local-partners' && (
            <LocalPartnersSection
              onAddApprovalAction={handleAddApprovalAction}
              onNavigateToApprovals={() => handleNavigate('approvals')}
            />
          )}

          {activeSection === 'festivals' && <FestivalManagementSection />}

          {activeSection === 'reports' && <ReportsSection />}

          {activeSection === 'settings' && <SettingsSection />}
        </main>
      </div>
    </div>
  );
}
