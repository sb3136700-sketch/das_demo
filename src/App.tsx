/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  PatientRecord, 
  StateMachineStep, 
  LanguageCode, 
  LatencyOption, 
  ConsoleLogEntry 
} from './types';
import { translations } from './translations';
import { 
  getStoredRecords, 
  saveStoredRecord, 
  updateStoredRecord, 
  deleteStoredRecord, 
  batchMarkSynced, 
  resetStoredRecords 
} from './utils/storage';
import { Header } from './components/Header';
import { RapidTriageEntry } from './components/RapidTriageEntry';
import { StateConsoleSyncSimulator } from './components/StateConsoleSyncSimulator';
import { ClinicalCommandCenter } from './components/ClinicalCommandCenter';
import { FhirCompliancePanel } from './components/FhirCompliancePanel';
import { TechnicalReportPanel } from './components/TechnicalReportPanel';
import { WifiOff, CheckCircle2, AlertTriangle, ShieldCheck, X, RefreshCw } from 'lucide-react';

export default function App() {
  // App-level State
  const [records, setRecords] = useState<PatientRecord[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(false); // Start offline to showcase off-grid capability
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  const [fontScale, setFontScale] = useState<number>(1);
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'triage' | 'simulator' | 'dashboard' | 'fhir' | 'report'>('triage');

  // State Machine & Simulator State
  const [currentStep, setCurrentStep] = useState<StateMachineStep>('Idle');
  const [isProcessingMachine, setIsProcessingMachine] = useState<boolean>(false);
  const [latency, setLatency] = useState<LatencyOption>('1.2');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncProgress, setSyncProgress] = useState<number>(0);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLogEntry[]>([]);

  // Selected Patient for FHIR Inspection
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  // Offline Warning Modal State
  const [showOfflineModal, setShowOfflineModal] = useState<boolean>(false);
  const [isRetryingInModal, setIsRetryingInModal] = useState<boolean>(false);

  // Success Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const t = translations[currentLanguage];

  // Helper to append logs
  const addLog = useCallback((type: ConsoleLogEntry['type'], message: string, detail?: string) => {
    const newEntry: ConsoleLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      time: new Date().toLocaleTimeString(),
      type,
      message,
      detail
    };
    setConsoleLogs((prev) => [newEntry, ...prev.slice(0, 49)]);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Initialize records from LocalStorage on mount
  useEffect(() => {
    const loaded = getStoredRecords();
    setRecords(loaded);
    addLog('info', 'HTML5 LocalStorage initialized', `${loaded.length} triage records loaded`);
  }, [addLog]);

  // Apply Font Scale & High Contrast to document root
  useEffect(() => {
    document.documentElement.style.setProperty('--app-font-scale', fontScale.toString());
    if (isHighContrast) {
      document.body.classList.add('high-contrast-mode');
    } else {
      document.body.classList.remove('high-contrast-mode');
    }
  }, [fontScale, isHighContrast]);

  // Unsynced / Pending Records
  const pendingRecords = records.filter((r) => r.syncStatus === 'Pending');

  // Helper to calculate latency ms
  const getLatencyMs = useCallback(() => {
    if (latency === '0.1') return 100;
    if (latency === '1.2') return 1200;
    if (latency === '4.0') return 4000;
    return 6000; // blocked or long
  }, [latency]);

  // Execute Core State Machine on New Record Intake
  const handleSubmitRecord = async (newRecordData: Omit<PatientRecord, 'id' | 'timestamp' | 'syncStatus'>) => {
    setIsProcessingMachine(true);
    const recordId = `rec-${Date.now().toString().slice(-4)}-${newRecordData.triagePriority.toLowerCase()}`;
    const timestamp = new Date().toISOString();

    // Step 1: Capturing
    setCurrentStep('Capturing');
    addLog('info', `[Capturing] Ingesting telemetry for ${newRecordData.patientName}`, `SpO2: ${newRecordData.vitals.oxygenSat}%, Priority: ${newRecordData.triagePriority}`);
    await new Promise((res) => setTimeout(res, 400));

    // Step 2: Local Validating
    setCurrentStep('Local Validating');
    addLog('info', `[Local Validating] Running clinical range & FHIR schema checks...`, 'All bounds passed');
    await new Promise((res) => setTimeout(res, 500));

    // Step 3: Queueing
    setCurrentStep('Queueing');
    const newRecord: PatientRecord = {
      ...newRecordData,
      id: recordId,
      timestamp,
      syncStatus: 'Pending'
    };

    const updatedList = saveStoredRecord(newRecord);
    setRecords(updatedList);
    addLog('success', `[Queueing] Securely written to HTML5 LocalStorage`, `Record: ${recordId}`);
    await new Promise((res) => setTimeout(res, 500));

    // Step 4: Syncing (if online and not blocked)
    if (isOnline && latency !== 'blocked') {
      setCurrentStep('Syncing');
      addLog('sync', `[Syncing] Transmitting HL7 FHIR Observation to cloud server...`, `Latency: ${latency}s`);
      const delay = getLatencyMs();
      await new Promise((res) => setTimeout(res, delay));

      const syncedList = batchMarkSynced([recordId]);
      setRecords(syncedList);
      addLog('success', `[Completed] Cloud FHIR bundle confirmed (HTTP 201 Created)`, `Record: ${recordId}`);
      setCurrentStep('Completed');
      triggerToast(`Patient ${newRecord.patientName} triaged & synced to cloud!`);
    } else {
      // Stored offline
      addLog('warning', `[Completed] Offline Mode: Stored in LocalStorage queue`, `Pending network link`);
      setCurrentStep('Completed');
      triggerToast(`Patient ${newRecord.patientName} triaged & saved to local device!`);
    }

    setTimeout(() => {
      setCurrentStep('Idle');
      setIsProcessingMachine(false);
    }, 1200);
  };

  // Manual Trigger Sync Cycle
  const handleTriggerSync = async () => {
    if (!isOnline) {
      setShowOfflineModal(true);
      return;
    }

    if (latency === 'blocked') {
      addLog('error', 'Sync aborted: Simulated link is in Dead Zone / Blocked mode');
      triggerToast('Simulated link blocked! Adjust latency slider to 3G or Instant.');
      return;
    }

    const pending = records.filter((r) => r.syncStatus === 'Pending');
    if (pending.length === 0) return;

    setIsSyncing(true);
    setSyncProgress(10);
    setCurrentStep('Syncing');
    addLog('sync', `Batch sync initiated for ${pending.length} pending records...`);

    const latencyMs = getLatencyMs();
    const intervalTime = Math.max(50, Math.floor(latencyMs / 10));

    let progress = 10;
    const progressTimer = setInterval(() => {
      progress += 10;
      setSyncProgress(Math.min(progress, 90));
      if (progress >= 90) clearInterval(progressTimer);
    }, intervalTime);

    await new Promise((res) => setTimeout(res, latencyMs));
    clearInterval(progressTimer);
    setSyncProgress(100);

    const pendingIds = pending.map((p) => p.id);
    const updated = batchMarkSynced(pendingIds);
    setRecords(updated);
    addLog('success', `Batch sync completed! ${pending.length} records marked as Synced`, 'FHIR Registry Updated');

    setCurrentStep('Completed');
    setTimeout(() => {
      setIsSyncing(false);
      setSyncProgress(0);
      setCurrentStep('Idle');
      triggerToast(`Successfully synced ${pending.length} records to cloud registry!`);
    }, 600);
  };

  // Retry in modal
  const handleRetryInModal = async () => {
    setIsRetryingInModal(true);
    addLog('warning', 'Sync retry attempted while grid disconnected...');
    await new Promise((res) => setTimeout(res, 900));
    setIsRetryingInModal(false);
  };

  // Switch to online from modal
  const handleSwitchOnlineFromModal = () => {
    setIsOnline(true);
    setShowOfflineModal(false);
    addLog('info', 'Network state switched to ONLINE (3G/4G)');
    triggerToast('Network Online! You can now trigger the sync cycle.');
  };

  // Update Record
  const handleUpdateRecord = (updated: PatientRecord) => {
    const newList = updateStoredRecord(updated);
    setRecords(newList);
    addLog('info', `Record ${updated.id} updated in LocalStorage`, `Patient: ${updated.patientName}`);
    triggerToast(`Record for ${updated.patientName} updated successfully.`);
  };

  // Delete Record
  const handleDeleteRecord = (id: string) => {
    const newList = deleteStoredRecord(id);
    setRecords(newList);
    addLog('warning', `Record ${id} deleted from LocalStorage`);
    triggerToast(`Record deleted from local storage.`);
  };

  // Reset Seed Data
  const handleResetSeedData = () => {
    const seeded = resetStoredRecords();
    setRecords(seeded);
    addLog('info', 'Demo field data reset to default seed');
    triggerToast('Loaded realistic field triage demo records.');
  };

  // Select for FHIR Inspection
  const handleSelectForFhir = (rec: PatientRecord) => {
    setSelectedPatientId(rec.id);
    setActiveTab('fhir');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Unified App Shell Header */}
      <Header
        isOnline={isOnline}
        onToggleOnline={() => {
          setIsOnline((prev) => {
            const next = !prev;
            addLog(next ? 'info' : 'warning', `Network link toggled to ${next ? 'ONLINE' : 'OFFLINE'}`);
            return next;
          });
        }}
        pendingCount={pendingRecords.length}
        currentLanguage={currentLanguage}
        onChangeLanguage={setCurrentLanguage}
        fontScale={fontScale}
        onChangeFontScale={setFontScale}
        isHighContrast={isHighContrast}
        onToggleHighContrast={() => setIsHighContrast((prev) => !prev)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Success Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-teal-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-teal-400/50 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-white" />
            <span className="font-bold text-sm">{toastMessage}</span>
          </div>
        )}

        {/* View Switcher */}
        {activeTab === 'triage' && (
          <RapidTriageEntry
            currentLanguage={currentLanguage}
            onSubmitRecord={handleSubmitRecord}
            isProcessingMachine={isProcessingMachine}
          />
        )}

        {activeTab === 'simulator' && (
          <StateConsoleSyncSimulator
            currentLanguage={currentLanguage}
            currentStep={currentStep}
            isOnline={isOnline}
            onToggleOnline={() => setIsOnline((prev) => !prev)}
            latency={latency}
            onChangeLatency={(newLat) => {
              setLatency(newLat);
              addLog('info', `Simulated network speed changed to ${newLat}s`);
            }}
            pendingRecords={pendingRecords}
            onTriggerSync={handleTriggerSync}
            isSyncing={isSyncing}
            syncProgress={syncProgress}
            consoleLogs={consoleLogs}
            onClearLogs={() => setConsoleLogs([])}
            onShowOfflineModal={() => setShowOfflineModal(true)}
          />
        )}

        {activeTab === 'dashboard' && (
          <ClinicalCommandCenter
            currentLanguage={currentLanguage}
            records={records}
            onUpdateRecord={handleUpdateRecord}
            onDeleteRecord={handleDeleteRecord}
            onSelectForFhir={handleSelectForFhir}
            onResetSeedData={handleResetSeedData}
            onNavigateToNewEntry={() => setActiveTab('triage')}
          />
        )}

        {activeTab === 'fhir' && (
          <FhirCompliancePanel
            currentLanguage={currentLanguage}
            records={records}
            selectedPatientId={selectedPatientId}
            onSelectPatientId={setSelectedPatientId}
          />
        )}

        {activeTab === 'report' && (
          <TechnicalReportPanel
            currentLanguage={currentLanguage}
          />
        )}
      </main>

      {/* Offline Modal (Network Unavailable Prompt) */}
      {showOfflineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border-2 border-red-500/80 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <div className="flex items-center gap-2 text-red-400">
                <WifiOff className="w-6 h-6 shrink-0" />
                <h3 className="font-black text-lg text-white">
                  {t.networkBlockedModalTitle}
                </h3>
              </div>
              <button
                onClick={() => setShowOfflineModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm text-slate-300">
              <p className="leading-relaxed">
                {t.networkBlockedModalBody}
              </p>

              <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0" />
                <span className="text-xs text-slate-300 font-medium">
                  {pendingRecords.length} records safely preserved in browser HTML5 LocalStorage with zero data loss risk.
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <button
                type="button"
                id="modal-retry-sync-btn"
                onClick={handleRetryInModal}
                disabled={isRetryingInModal}
                className="tactile-btn w-full sm:w-1/2 py-3 px-4 rounded-xl border border-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
              >
                {isRetryingInModal ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Pinging Radio...</span>
                  </>
                ) : (
                  <span>Retry Connection</span>
                )}
              </button>

              <button
                type="button"
                id="modal-switch-online-btn"
                onClick={handleSwitchOnlineFromModal}
                className="tactile-btn w-full sm:w-1/2 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow cursor-pointer min-h-[48px]"
              >
                <span>{t.switchOnline}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Minimal Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-4 px-6 text-center text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2 max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-400" />
          <span className="font-semibold text-slate-300">
            S1: The Core Process Speed Demon (Minimalist MVP)
          </span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Off-Grid Rural Health Tool</span>
          <span>•</span>
          <span>HL7 FHIR R4 Compliant</span>
          <span>•</span>
          <span>HTML5 LocalStorage Engine</span>
        </div>
      </footer>
    </div>
  );
}
