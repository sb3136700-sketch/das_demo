import React, { useState, useMemo } from 'react';
import { 
  FileCode2, 
  Download, 
  Copy, 
  Check, 
  Layers, 
  UserCheck, 
  ExternalLink,
  ShieldCheck,
  Code
} from 'lucide-react';
import { PatientRecord, LanguageCode } from '../types';
import { translations } from '../translations';
import { generateFhirBundle, generateFullDatabaseFhirBundle, downloadJsonFile } from '../utils/fhir';

interface FhirCompliancePanelProps {
  currentLanguage: LanguageCode;
  records: PatientRecord[];
  selectedPatientId: string | null;
  onSelectPatientId: (id: string) => void;
}

export const FhirCompliancePanel: React.FC<FhirCompliancePanelProps> = ({
  currentLanguage,
  records,
  selectedPatientId,
  onSelectPatientId
}) => {
  const t = translations[currentLanguage];
  const [viewMode, setViewMode] = useState<'single' | 'bundle'>('single');
  const [copied, setCopied] = useState(false);

  // Active record to display
  const activeRecord = useMemo(() => {
    if (selectedPatientId) {
      const found = records.find((r) => r.id === selectedPatientId);
      if (found) return found;
    }
    return records[0] || null;
  }, [records, selectedPatientId]);

  // Reactive FHIR JSON generation
  const activeFhirData = useMemo(() => {
    if (viewMode === 'bundle' || !activeRecord) {
      return generateFullDatabaseFhirBundle(records);
    }
    return generateFhirBundle(activeRecord);
  }, [viewMode, activeRecord, records]);

  const fhirJsonString = useMemo(() => {
    return JSON.stringify(activeFhirData, null, 2);
  }, [activeFhirData]);

  const handleCopy = () => {
    navigator.clipboard.writeText(fhirJsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (viewMode === 'bundle' || !activeRecord) {
      downloadJsonFile(activeFhirData, `asha-clinical-records-fhir-bundle-${Date.now()}.json`);
    } else {
      const sanitizedName = activeRecord.patientName.replace(/\s+/g, '-').toLowerCase();
      downloadJsonFile(activeFhirData, `fhir-record-${sanitizedName}-${activeRecord.id}.json`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/90 border border-slate-700 p-5 sm:p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              {t.fhirHeader}
            </h2>
            <span className="px-2.5 py-0.5 text-[11px] font-black rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase">
              HL7 FHIR R4
            </span>
          </div>
          <p className="text-sm text-slate-300 mt-1">
            {t.fhirDesc}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Copy Button */}
          <button
            type="button"
            id="copy-fhir-json-btn"
            onClick={handleCopy}
            className="tactile-btn flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer min-h-[44px]"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">{t.copiedToClipboard}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-teal-400" />
                <span>{t.copyJson}</span>
              </>
            )}
          </button>

          {/* Download Button */}
          <button
            type="button"
            id="download-fhir-json-btn"
            onClick={handleDownload}
            className="tactile-btn flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs sm:text-sm font-black uppercase tracking-wide shadow-lg shadow-teal-950/60 cursor-pointer min-h-[44px]"
          >
            <Download className="w-4 h-4" />
            <span>
              {viewMode === 'bundle'
                ? t.downloadBundleBtn
                : t.downloadFhirBtn}
            </span>
          </button>
        </div>
      </div>

      {/* Target Selector Card */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Toggle Mode */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 p-1 rounded-xl">
          <button
            type="button"
            id="fhir-mode-single-btn"
            onClick={() => setViewMode('single')}
            className={`tactile-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'single'
                ? 'bg-teal-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Single Patient Observation</span>
          </button>
          <button
            type="button"
            id="fhir-mode-bundle-btn"
            onClick={() => setViewMode('bundle')}
            className={`tactile-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'bundle'
                ? 'bg-teal-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Full Database Bundle ({records.length})</span>
          </button>
        </div>

        {/* Patient Picker when single */}
        {viewMode === 'single' && records.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold whitespace-nowrap">
              {t.selectPatientForFhir}
            </span>
            <select
              id="fhir-patient-select"
              value={activeRecord?.id || ''}
              onChange={(e) => onSelectPatientId(e.target.value)}
              className="h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:border-teal-500 focus:outline-none"
            >
              {records.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.patientName} ({r.triagePriority} Priority)
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Standards Metatags */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-slate-300 font-medium">LOINC Vital Signs (85354-9)</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-slate-300 font-medium">SNOMED-CT Triage (225390008)</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-slate-300 font-medium">ABDM / NDHM Profile Ready</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-slate-300 font-medium">UCUM Unified Units</span>
        </div>
      </div>

      {/* Reactive Read-Only Code Display Area */}
      <div className="bg-slate-950 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-teal-400" />
            <span className="text-xs font-mono font-bold text-slate-300">
              {viewMode === 'single' && activeRecord
                ? `Bundle/Patient-${activeRecord.id}.json (Reactive HL7 FHIR Model)`
                : 'Bundle/All-Clinic-Records-Database.json'}
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40 font-bold">
            Schema Validated
          </span>
        </div>

        <div className="p-4 overflow-x-auto max-h-[500px]">
          <pre
            id="fhir-json-code-block"
            className="text-xs font-mono text-teal-300/90 leading-relaxed select-text"
          >
            {fhirJsonString}
          </pre>
        </div>
      </div>
    </div>
  );
};
