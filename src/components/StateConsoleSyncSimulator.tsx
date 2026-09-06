import React, { useState } from 'react';
import { 
  Gauge, 
  ArrowRight, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  WifiOff, 
  HardDrive, 
  CloudUpload, 
  FileCheck2, 
  Terminal,
  Zap,
  Sliders,
  AlertCircle
} from 'lucide-react';
import { StateMachineStep, LatencyOption, ConsoleLogEntry, LanguageCode, PatientRecord } from '../types';
import { translations } from '../translations';

interface StateConsoleSyncSimulatorProps {
  currentLanguage: LanguageCode;
  currentStep: StateMachineStep;
  isOnline: boolean;
  onToggleOnline: () => void;
  latency: LatencyOption;
  onChangeLatency: (lat: LatencyOption) => void;
  pendingRecords: PatientRecord[];
  onTriggerSync: () => void;
  isSyncing: boolean;
  syncProgress: number; // 0 to 100
  consoleLogs: ConsoleLogEntry[];
  onClearLogs: () => void;
  onShowOfflineModal: () => void;
}

const STEPS: { key: StateMachineStep; label: string; icon: React.ReactNode; desc: string }[] = [
  { key: 'Idle', label: 'Idle', icon: <Clock className="w-4 h-4" />, desc: 'System standby' },
  { key: 'Capturing', label: 'Capturing', icon: <Zap className="w-4 h-4" />, desc: 'Sensor & voice ingest' },
  { key: 'Local Validating', label: 'Local Validating', icon: <FileCheck2 className="w-4 h-4" />, desc: 'Schema & bounds check' },
  { key: 'Queueing', label: 'Queueing', icon: <HardDrive className="w-4 h-4" />, desc: 'HTML5 LocalStorage write' },
  { key: 'Syncing', label: 'Syncing', icon: <CloudUpload className="w-4 h-4" />, desc: 'FHIR HTTP transmission' },
  { key: 'Completed', label: 'Completed', icon: <CheckCircle2 className="w-4 h-4" />, desc: 'Confirmed & stored' },
];

export const StateConsoleSyncSimulator: React.FC<StateConsoleSyncSimulatorProps> = ({
  currentLanguage,
  currentStep,
  isOnline,
  onToggleOnline,
  latency,
  onChangeLatency,
  pendingRecords,
  onTriggerSync,
  isSyncing,
  syncProgress,
  consoleLogs,
  onClearLogs,
  onShowOfflineModal
}) => {
  const t = translations[currentLanguage];

  const handleSyncClick = () => {
    if (!isOnline) {
      onShowOfflineModal();
    } else {
      onTriggerSync();
    }
  };

  const getStepIndex = (step: StateMachineStep) => {
    return STEPS.findIndex((s) => s.key === step);
  };

  const currentStepIndex = getStepIndex(currentStep);

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-slate-800/90 border border-slate-700 p-5 sm:p-6 rounded-2xl">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            {t.stateMachineTitle}
          </h2>
          <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
            View B
          </span>
        </div>
        <p className="text-sm text-slate-300 mt-1">
          {t.stateMachineDesc}
        </p>
      </div>

      {/* 1. Live State Tracker Horizontal Stepper */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
          <div className="flex items-center gap-2 text-teal-400">
            <Gauge className="w-5 h-5" />
            <h3 className="font-bold text-base text-white">
              Triage Intake State Machine Progression
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <span>Status:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-950 border border-teal-500/50 text-teal-300 font-bold uppercase">
              {currentStep}
            </span>
          </div>
        </div>

        {/* Stepper Flow */}
        <div className="overflow-x-auto py-3">
          <div className="flex items-center justify-between min-w-[720px] gap-2">
            {STEPS.map((step, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <React.Fragment key={step.key}>
                  {/* Step Node */}
                  <div className="flex-1 flex flex-col items-center text-center">
                    <div
                      id={`state-step-${step.key.toLowerCase().replace(/\s+/g, '-')}`}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-300 border shadow-md ${
                        isCurrent
                          ? 'bg-teal-600 text-white border-teal-300 scale-110 shadow-[0_0_20px_rgba(13,148,136,0.6)] ring-4 ring-teal-500/20'
                          : isPast
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-500/60'
                          : 'bg-slate-900 text-slate-500 border-slate-700'
                      }`}
                    >
                      {isCurrent ? (
                        <div className="animate-spin">{step.icon}</div>
                      ) : isPast ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        step.icon
                      )}
                    </div>
                    <span
                      className={`mt-2 text-xs font-extrabold uppercase tracking-wider ${
                        isCurrent
                          ? 'text-teal-300'
                          : isPast
                          ? 'text-slate-200'
                          : 'text-slate-500'
                      }`}
                    >
                      [{step.label}]
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      {step.desc}
                    </span>
                  </div>

                  {/* Connecting Arrow */}
                  {idx < STEPS.length - 1 && (
                    <div className="w-8 flex items-center justify-center -mt-6">
                      <div
                        className={`h-0.5 w-full transition-all duration-300 ${
                          idx < currentStepIndex ? 'bg-teal-500' : 'bg-slate-700'
                        }`}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Controls Grid: Latency Slider & Manual Trigger Sync */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Network Latency Controller */}
        <div className="lg:col-span-6 bg-slate-800 border border-slate-700 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
            <div className="flex items-center gap-2 text-teal-400">
              <Sliders className="w-5 h-5" />
              <h3 className="font-bold text-base text-white">
                {t.latencyControllerTitle}
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-teal-300 px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
              {latency === '0.1'
                ? '0.1s (Instant)'
                : latency === '1.2'
                ? '1.2s (3G)'
                : latency === '4.0'
                ? '4.0s (2G Edge)'
                : 'Blocked (Off-Grid)'}
            </span>
          </div>

          <p className="text-xs text-slate-300">
            {t.latencyDesc}
          </p>

          {/* Preset Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            {[
              { id: '0.1', label: t.instantLatency, desc: 'Urban Fiber' },
              { id: '1.2', label: t.normalLatency, desc: 'Rural 3G' },
              { id: '4.0', label: t.slow2gLatency, desc: 'Fringe 2G' },
              { id: 'blocked', label: t.offgridLatency, desc: 'No Signal' }
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                id={`latency-preset-${item.id}`}
                onClick={() => onChangeLatency(item.id as LatencyOption)}
                className={`tactile-btn p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer min-h-[56px] ${
                  latency === item.id
                    ? 'bg-teal-600 text-white border-teal-400 shadow-md'
                    : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-700/50'
                }`}
              >
                <span className="font-bold text-xs">{item.label}</span>
                <span className="text-[10px] opacity-80">{item.desc}</span>
              </button>
            ))}
          </div>

          {/* Visual Network Status Notice */}
          <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-red-500'}`} />
              <span className="font-medium text-slate-200">
                Radio Link: {isOnline ? 'Connected to Tower' : 'Grid Disconnected (Dead Zone)'}
              </span>
            </div>
            <button
              onClick={onToggleOnline}
              className="text-teal-400 hover:text-teal-300 font-bold underline cursor-pointer"
            >
              Toggle Mode
            </button>
          </div>
        </div>

        {/* Manual Trigger Sync Controller */}
        <div className="lg:col-span-6 bg-slate-800 border border-slate-700 rounded-2xl p-5 sm:p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
              <div className="flex items-center gap-2 text-teal-400">
                <CloudUpload className="w-5 h-5" />
                <h3 className="font-bold text-base text-white">
                  Manual Sync Controller
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-300 px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700">
                Queue: {pendingRecords.length} records
              </span>
            </div>

            <p className="text-xs text-slate-300 mt-3">
              Initiates transmission of locally validated records to the national FHIR observation repository.
            </p>

            {/* Sync Progress Bar if syncing */}
            {isSyncing && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs font-mono font-bold text-teal-300">
                  <span>{t.syncingAction}</span>
                  <span>{syncProgress}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden border border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-300 ease-out"
                    style={{ width: `${syncProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="pt-4">
            <button
              type="button"
              id="trigger-sync-controller-btn"
              onClick={handleSyncClick}
              disabled={isSyncing || pendingRecords.length === 0}
              className={`tactile-btn w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-3 transition-all cursor-pointer shadow-lg min-h-[52px] ${
                isSyncing
                  ? 'bg-teal-900 text-teal-300 cursor-wait'
                  : pendingRecords.length === 0
                  ? 'bg-slate-700 text-slate-400 border-slate-600 cursor-not-allowed'
                  : isOnline
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/60 border border-emerald-400/40'
                  : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-950/60 border border-amber-400/40'
              }`}
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Transmitting {pendingRecords.length} Records...</span>
                </>
              ) : (
                <>
                  <CloudUpload className="w-5 h-5" />
                  <span>
                    {pendingRecords.length === 0
                      ? 'All Records In Sync (0 Pending)'
                      : `${t.triggerSyncBtn} (${pendingRecords.length} Queued)`}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Live Audited Console Event Logs */}
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2 text-teal-400 font-bold">
            <Terminal className="w-4 h-4" />
            <span>State Machine & Network Audit Stream</span>
          </div>
          <button
            type="button"
            onClick={onClearLogs}
            className="text-slate-400 hover:text-white text-[11px] underline cursor-pointer"
          >
            Clear Log
          </button>
        </div>

        <div className="h-44 overflow-y-auto space-y-1.5 pr-2 scrollbar-thin">
          {consoleLogs.length === 0 ? (
            <p className="text-slate-500 italic py-4 text-center">
              Awaiting state actions... Submit a triage entry or trigger a sync cycle to view events.
            </p>
          ) : (
            consoleLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-2 py-0.5 border-b border-slate-800/40"
              >
                <span className="text-slate-500 select-none">[{log.time}]</span>
                <span
                  className={`font-bold uppercase ${
                    log.type === 'error'
                      ? 'text-red-400'
                      : log.type === 'warning'
                      ? 'text-amber-400'
                      : log.type === 'success'
                      ? 'text-emerald-400'
                      : log.type === 'sync'
                      ? 'text-teal-400'
                      : 'text-sky-300'
                  }`}
                >
                  [{log.type}]
                </span>
                <span className="text-slate-200">{log.message}</span>
                {log.detail && (
                  <span className="text-slate-400 text-[10px]">({log.detail})</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
