import { ApprovalAction, Room } from '../types/lodge';
import { INITIAL_APPROVALS, INITIAL_ROOMS } from '../data/mockData';

const STORAGE_KEYS = {
  APPROVALS: 'lodgemate_approvals_v1',
  ROOMS: 'lodgemate_rooms_v1',
  SETTINGS: 'lodgemate_settings_v1',
  CHAT_HISTORY: 'lodgemate_chat_history_v1',
  AUDIT_LOG: 'lodgemate_audit_log_v1',
};

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  actionType: 'Price Update' | 'Staff Allocation' | 'Purchase Order' | 'Partner Dispatch' | 'Approval Decision';
  details: string;
  status: 'Approved' | 'Rejected' | 'System Flagged';
}

export const StorageService = {
  getApprovals(): ApprovalAction[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APPROVALS);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return INITIAL_APPROVALS;
  },

  saveApprovals(approvals: ApprovalAction[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.APPROVALS, JSON.stringify(approvals));
    } catch {
      // ignore
    }
  },

  getRooms(): Room[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ROOMS);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return INITIAL_ROOMS;
  },

  saveRooms(rooms: Room[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
    } catch {
      // ignore
    }
  },

  getAuditLog(): AuditLogEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOG);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return [
      {
        id: 'aud-1',
        timestamp: '2026-11-08 16:30',
        user: 'General Manager (K. Ramanathan)',
        actionType: 'Approval Decision',
        details: 'Approved Midweek Temple Pilgrimage Package with ₹1,550 Standard room floor tariff.',
        status: 'Approved',
      },
      {
        id: 'aud-2',
        timestamp: '2026-11-08 11:15',
        user: 'System Guardrail',
        actionType: 'Price Update',
        details: 'Blocked attempted price increase to ₹3,600 on Standard Room: exceeded competitor cap (+10%).',
        status: 'System Flagged',
      },
      {
        id: 'aud-3',
        timestamp: '2026-11-07 09:20',
        user: 'Assistant Manager (G. Hegde)',
        actionType: 'Purchase Order',
        details: 'Approved purchase order for 2 tins Nandini Desi Ghee from Hubli depot.',
        status: 'Approved',
      },
    ];
  },

  addAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) {
    const list = this.getAuditLog();
    const newEntry: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      ...entry,
    };
    list.unshift(newEntry);
    try {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOG, JSON.stringify(list.slice(0, 50)));
    } catch {
      // ignore
    }
    return newEntry;
  },
};
