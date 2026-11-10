import React, { useState } from 'react';
import { FESTIVALS_DATA } from '../../data/mockData';
import { FestivalEvent } from '../../types/lodge';
import {
  CalendarDays,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingDown,
  ArrowRight,
} from 'lucide-react';

export const FestivalManagementSection: React.FC = () => {
  const [festivals, setFestivals] = useState<FestivalEvent[]>(FESTIVALS_DATA);
  const [selectedFestivalId, setSelectedFestivalId] = useState<string>('fst-6'); // Default Karthika Deepotsava (Upcoming Nov 2026)

  const activeFestival =
    festivals.find((f) => f.id === selectedFestivalId) || festivals[0];

  const handleToggleTask = (festivalId: string, taskId: string) => {
    setFestivals((prev) =>
      prev.map((fest) => {
        if (fest.id !== festivalId) return fest;

        const updatedChecklist = fest.actionChecklist.map((item) =>
          item.id === taskId ? { ...item, completed: !item.completed } : item
        );

        // Recalculate readiness score based on tasks completed
        const completedCount = updatedChecklist.filter((c) => c.completed).length;
        const totalCount = updatedChecklist.length;
        const baseScore = fest.readinessScore;
        const newScore = Math.min(100, Math.round(50 + (completedCount / totalCount) * 50));

        return {
          ...fest,
          actionChecklist: updatedChecklist,
          readinessScore: newScore,
        };
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-amber-600" />
              <h2 className="text-base font-bold text-slate-900">
                Festival Management & Readiness Operations
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl">
              Temple town religious calendar tracker. Compares 3-year performance (2024 vs 2025 vs 2026), measures the Festival Readiness Score across operations, and manages critical pre-festival prep checklists.
            </p>
          </div>
        </div>
      </div>

      {/* Festival Selector Carousel / Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {festivals.map((fest) => {
          const isSelected = fest.id === selectedFestivalId;
          const dropIsSevere = fest.occupancyDropPercent2026 < -20;

          return (
            <button
              key={fest.id}
              onClick={() => setSelectedFestivalId(fest.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-amber-50/70 border-amber-400 ring-1 ring-amber-400 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-800">
                  {fest.month}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    fest.readinessScore >= 80
                      ? 'bg-emerald-100 text-emerald-800'
                      : fest.readinessScore >= 70
                      ? 'bg-sky-100 text-sky-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  Readiness: {fest.readinessScore}/100
                </span>
              </div>

              <div className="mt-2">
                <div className="text-sm font-bold text-slate-900 leading-snug">{fest.name}</div>
                <div className="text-[11px] text-slate-500 font-sans">{fest.kannadaName}</div>
                <div className="text-xs font-mono text-slate-600 mt-1">{fest.dates}</div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-slate-400 text-[10px] block">2026 vs 2024</span>
                  <span className="font-bold text-slate-800">{fest.historicalOccupancy2026}%</span>
                  <span className="text-slate-400 text-[11px]"> (was {fest.historicalOccupancy2024}%)</span>
                </div>
                <span
                  className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                    dropIsSevere ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {fest.occupancyDropPercent2026}%
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Festival Deep Dive Panel */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-slate-900">{activeFestival.name}</span>
              <span className="text-xs font-medium text-slate-500">({activeFestival.kannadaName})</span>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded text-[11px] font-semibold">
                {activeFestival.expectedDemandTier}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Event window: <span className="font-mono font-semibold text-slate-800">{activeFestival.dates}, 2026</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Readiness Score</div>
              <div className="text-2xl font-bold font-mono text-amber-600">
                {activeFestival.readinessScore} / 100
              </div>
            </div>
          </div>
        </div>

        {/* 3-Year Occupancy Comparison Bar */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            3-Year Historical Demand Comparison (Evidence of 2026 Drop)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
              <div className="text-slate-500 text-[11px]">2024 Festival Actual</div>
              <div className="text-2xl font-bold font-mono text-emerald-700">
                {activeFestival.historicalOccupancy2024}%
              </div>
              <div className="text-[10px] text-slate-400">Peak demand, healthy margins</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
              <div className="text-slate-500 text-[11px]">2025 Festival Actual</div>
              <div className="text-2xl font-bold font-mono text-slate-800">
                {activeFestival.historicalOccupancy2025}%
              </div>
              <div className="text-[10px] text-slate-400">Good volume, operational friction</div>
            </div>

            <div className="p-3 bg-rose-50/70 rounded-lg border border-rose-200 space-y-1">
              <div className="text-rose-900 text-[11px] font-semibold">2026 Performance (Lagging)</div>
              <div className="text-2xl font-bold font-mono text-rose-700">
                {activeFestival.historicalOccupancy2026}%
              </div>
              <div className="text-[10px] text-rose-800 font-semibold">
                Drop of {activeFestival.occupancyDropPercent2026}% vs 2024
              </div>
            </div>
          </div>

          {/* Primary Cause Note */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Primary 2026 Decline Factor for this Festival:</strong>{' '}
              {activeFestival.primaryDeclineFactor}
            </div>
          </div>
        </div>

        {/* Interactive Readiness Checklist */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Operational Readiness Checklist (Click tasks to mark complete & raise readiness score)
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              {activeFestival.actionChecklist.filter((c) => c.completed).length} /{' '}
              {activeFestival.actionChecklist.length} Complete
            </span>
          </div>

          <div className="space-y-2">
            {activeFestival.actionChecklist.map((task) => (
              <div
                key={task.id}
                onClick={() => handleToggleTask(activeFestival.id, task.id)}
                className={`p-3 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                  task.completed
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                    : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      task.completed
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300'
                    }`}
                  >
                    {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <span className={task.completed ? 'line-through text-slate-500' : 'font-medium'}>
                    {task.label}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {task.completed ? 'COMPLETED' : 'PENDING'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
