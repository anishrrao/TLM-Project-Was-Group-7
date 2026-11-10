import React, { useState } from 'react';
import { RAG_DOCUMENTS, MCP_CONNECTIONS } from '../../data/mockData';
import { StorageService, AuditLogEntry } from '../../utils/storage';
import {
  Settings,
  ShieldCheck,
  Cpu,
  Database,
  Search,
  BookOpen,
  Radio,
  FileText,
  Lock,
  Layers,
  CheckCircle2,
  Workflow,
  ArrowRight,
} from 'lucide-react';

export const SettingsSection: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'architecture' | 'safeguards' | 'audit' | 'config'>('architecture');
  const [ragSearchQuery, setRagSearchQuery] = useState('');
  const [selectedRagDoc, setSelectedRagDoc] = useState(RAG_DOCUMENTS[0]);
  const [auditLogs] = useState<AuditLogEntry[]>(() => StorageService.getAuditLog());

  const filteredRagDocs = RAG_DOCUMENTS.filter(
    (doc) =>
      doc.title.toLowerCase().includes(ragSearchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(ragSearchQuery.toLowerCase()) ||
      doc.snippet.toLowerCase().includes(ragSearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-slate-800" />
              <h2 className="text-base font-bold text-slate-900">
                AI Architecture, Safeguards & System Settings
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl">
              Architecture demonstration of Retrieval-Augmented Generation (RAG) and Model Context Protocol (MCP), ethical governance safeguards, and full decision audit logs.
            </p>
          </div>
        </div>
      </div>

      {/* Sub-navigation tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg max-w-fit">
        <button
          onClick={() => setActiveSubTab('architecture')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeSubTab === 'architecture'
              ? 'bg-white text-slate-900 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          AI Architecture (RAG & MCP Models)
        </button>
        <button
          onClick={() => setActiveSubTab('safeguards')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeSubTab === 'safeguards'
              ? 'bg-white text-slate-900 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Responsible AI & Safeguards
        </button>
        <button
          onClick={() => setActiveSubTab('audit')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeSubTab === 'audit'
              ? 'bg-white text-slate-900 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Manager Audit Ledger ({auditLogs.length})
        </button>
        <button
          onClick={() => setActiveSubTab('config')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeSubTab === 'config'
              ? 'bg-white text-slate-900 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Lodge Tariffs & Bounds
        </button>
      </div>

      {/* SubTab 1: AI Architecture (RAG & MCP) */}
      {activeSubTab === 'architecture' && (
        <div className="space-y-6">
          {/* Visual Architecture Flow Diagram */}
          <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Workflow className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold tracking-tight">
                  System Architecture: RAG & MCP Pipeline Flow
                </h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded font-mono">
                Interactive Model Architecture
              </span>
            </div>

            {/* Architecture Node Diagram */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2 text-xs">
              <div className="p-3.5 bg-slate-800/80 rounded-lg border border-slate-700 space-y-1">
                <div className="text-[10px] text-amber-400 font-mono uppercase">1. Ingestion / Query</div>
                <div className="font-bold text-white">Lodge Manager</div>
                <div className="text-[11px] text-slate-300 leading-snug">
                  Natural language inquiries or automated festival forecast triggers.
                </div>
              </div>

              <div className="p-3.5 bg-slate-800/80 rounded-lg border border-slate-700 space-y-1">
                <div className="text-[10px] text-sky-400 font-mono uppercase">2. Central Agent</div>
                <div className="font-bold text-white">LODGEMATE AI Core</div>
                <div className="text-[11px] text-slate-300 leading-snug">
                  Rules engine, math models, pace evaluation, and safeguard checks.
                </div>
              </div>

              <div className="p-3.5 bg-slate-800/80 rounded-lg border border-amber-500/40 bg-amber-950/20 space-y-1">
                <div className="text-[10px] text-amber-300 font-mono uppercase">3. Grounding Layer</div>
                <div className="font-bold text-white">RAG Knowledge + MCP</div>
                <div className="text-[11px] text-slate-300 leading-snug">
                  Retrieves SOPs & polls PMS, OTA feeds, POS, and local taxi fleets.
                </div>
              </div>

              <div className="p-3.5 bg-slate-800/80 rounded-lg border border-emerald-500/40 bg-emerald-950/20 space-y-1">
                <div className="text-[10px] text-emerald-400 font-mono uppercase">4. Ethical Gate</div>
                <div className="font-bold text-white">AI Approval Centre</div>
                <div className="text-[11px] text-slate-300 leading-snug">
                  Mandatory human authorization prior to publishing or purchase.
                </div>
              </div>

              <div className="p-3.5 bg-slate-800/80 rounded-lg border border-slate-700 space-y-1">
                <div className="text-[10px] text-slate-400 font-mono uppercase">5. Action Dispatch</div>
                <div className="font-bold text-white">Operational Execution</div>
                <div className="text-[11px] text-slate-300 leading-snug">
                  PMS update, supplier WhatsApp order, and fleet standby booking.
                </div>
              </div>
            </div>

            {/* Prototype vs Production Callout */}
            <div className="p-3.5 bg-slate-950/70 rounded-lg border border-slate-800 text-[11px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-300">
              <div>
                <strong>Prototype Implementation Note:</strong> Algorithms, formulas, datasets, and approval state machines are 100% active in this client-side prototype. External PMS, OTA sync, and WhatsApp gateways are modeled via simulated MCP tools.
              </div>
            </div>
          </div>

          {/* RAG Knowledge Explorer */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    RAG Knowledge Base Demonstration (Simulated Vector Store)
                  </h3>
                </div>
                <p className="text-xs text-slate-500">
                  How LODGEMATE AI grounds decisions in lodge manuals, temple protocols, and vendor contracts
                </p>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search lodge policy, pooja timings..."
                  value={ragSearchQuery}
                  onChange={(e) => setRagSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 w-64 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Document List */}
              <div className="space-y-2">
                {filteredRagDocs.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedRagDoc(doc)}
                    className={`w-full p-3 rounded-lg border text-left text-xs transition-colors ${
                      selectedRagDoc.id === doc.id
                        ? 'bg-amber-50 border-amber-300 text-amber-950'
                        : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">
                      {doc.category}
                    </div>
                    <div className="font-bold text-slate-900 mt-0.5 line-clamp-1">{doc.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-1">
                      {doc.sourceFile}
                    </div>
                  </button>
                ))}
              </div>

              {/* Document Viewer */}
              <div className="md:col-span-2 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-start pb-2 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] px-2 py-0.5 bg-slate-200 text-slate-700 rounded font-semibold uppercase">
                      {selectedRagDoc.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">
                      {selectedRagDoc.title}
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    Updated: {selectedRagDoc.lastUpdated}
                  </span>
                </div>

                <div className="text-xs text-slate-700 leading-relaxed font-sans bg-white p-3.5 rounded-lg border border-slate-200">
                  {selectedRagDoc.snippet}
                </div>

                <div className="text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Source: <code className="font-mono text-slate-700">{selectedRagDoc.sourceFile}</code></span>
                  <span className="text-emerald-700 font-semibold">RAG Retrieval Validated</span>
                </div>
              </div>
            </div>
          </div>

          {/* MCP Integrations Hub */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-sky-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Model Context Protocol (MCP) Connector Registry
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Standardized tool connectors linking the LLM agent to property PMS, OTAs, POS, and local transport networks
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {MCP_CONNECTIONS.map((mcp) => (
                <div
                  key={mcp.id}
                  className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-900">{mcp.name}</span>
                    <span className="px-1.5 py-0.5 bg-sky-100 text-sky-800 rounded text-[10px] font-mono font-semibold">
                      {mcp.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">{mcp.description}</p>
                  <div className="pt-2 border-t border-slate-200/60 text-[10px] font-mono text-slate-500">
                    Tool Functions: {mcp.capabilities.slice(0, 3).join(', ')}...
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SubTab 2: Responsible AI & Safeguards */}
      {activeSubTab === 'safeguards' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Ethical Governance & Safety Constitution
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Guiding constraints enforced in code to ensure trust, privacy, and non-discriminatory operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>1. Zero Autonomous Action Without Authorization</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Prices are never published to OTAs, orders are never transmitted to suppliers, and shifts are never altered without human review and explicit manager approval in the AI Approval Centre.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>2. Algorithmic Guardrails & Anti-Gouging</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Dynamic pricing strictly limits any daily price movement to ±10% of currently published rates, caps maximum deviations at ±25% of baseline, and guarantees rates never fall below the configured profitable floor (₹1,400).
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>3. Non-Discriminatory & Fair Pilgrim Pricing</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Pricing is determined solely by overall room occupancy, booking velocity, and competitor medians. The system strictly prohibits differential pricing based on guest nationality, state of origin, or personal attributes.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>4. Data Privacy & Sovereign Storage</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Guest names, phone numbers, and reservation history remain strictly contained within the lodge’s local data store. No guest PII is transmitted to third-party public LLMs.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 3: Audit Ledger */}
      {activeSubTab === 'audit' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">
              Permanent Management Audit Ledger
            </h3>
            <p className="text-xs text-slate-500">
              Chronological log of all simulated AI recommendations, manager approvals, and guardrail enforcements
            </p>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{log.actionType}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold font-mono bg-slate-100 text-slate-700">
                      {log.status}
                    </span>
                  </div>
                  <p className="text-slate-600">{log.details}</p>
                </div>
                <div className="text-right sm:text-right text-[11px] font-mono text-slate-500 shrink-0">
                  <div>{log.user}</div>
                  <div className="text-[10px] text-slate-400">{log.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SubTab 4: Lodge Configuration */}
      {activeSubTab === 'config' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Lodge Property Configuration
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Baseline parameters for Temple Trails Family Lodge
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-lg space-y-1">
              <span className="text-slate-500">Standard Rooms (15 Keys)</span>
              <div className="font-bold font-mono text-slate-900 text-base">₹2,000 Base</div>
              <div className="text-[10px] text-slate-400">Min: ₹1,400 | Max: ₹3,200</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg space-y-1">
              <span className="text-slate-500">Deluxe Rooms (15 Keys)</span>
              <div className="font-bold font-mono text-slate-900 text-base">₹3,200 Base</div>
              <div className="text-[10px] text-slate-400">Min: ₹2,200 | Max: ₹4,800</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg space-y-1">
              <span className="text-slate-500">Premium Rooms (7 Keys)</span>
              <div className="font-bold font-mono text-slate-900 text-base">₹4,500 Base</div>
              <div className="text-[10px] text-slate-400">Min: ₹3,200 | Max: ₹6,800</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg space-y-1">
              <span className="text-slate-500">Family Suites (3 Keys)</span>
              <div className="font-bold font-mono text-slate-900 text-base">₹6,800 Base</div>
              <div className="text-[10px] text-slate-400">Min: ₹4,800 | Max: ₹10,500</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
