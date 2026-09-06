import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  FileCode2, 
  Heart, 
  Wind, 
  Thermometer, 
  Activity, 
  X, 
  Check, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  Database,
  PlusCircle,
  RefreshCw
} from 'lucide-react';
import { PatientRecord, TriagePriority, SyncStatus, LanguageCode, Vitals } from '../types';
import { translations } from '../translations';
import { calculateTriagePriority } from '../utils/clinicalRules';

interface ClinicalCommandCenterProps {
  currentLanguage: LanguageCode;
  records: PatientRecord[];
  onUpdateRecord: (record: PatientRecord) => void;
  onDeleteRecord: (id: string) => void;
  onSelectForFhir: (record: PatientRecord) => void;
  onResetSeedData: () => void;
  onNavigateToNewEntry: () => void;
}

export const ClinicalCommandCenter: React.FC<ClinicalCommandCenterProps> = ({
  currentLanguage,
  records,
  onUpdateRecord,
  onDeleteRecord,
  onSelectForFhir,
  onResetSeedData,
  onNavigateToNewEntry
}) => {
  const t = translations[currentLanguage];

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'All' | TriagePriority>('All');
  const [syncFilter, setSyncFilter] = useState<'All' | SyncStatus>('All');

  // Edit Drawer State
  const [editingRecord, setEditingRecord] = useState<PatientRecord | null>(null);

  // Delete Confirmation State
  const [recordToDelete, setRecordToDelete] = useState<PatientRecord | null>(null);

  // Edit form states
  const [editName, setEditName] = useState('');
  const [editAge, setEditAge] = useState<number>(0);
  const [editSystolic, setEditSystolic] = useState<number>(120);
  const [editDiastolic, setEditDiastolic] = useState<number>(80);
  const [editHeartRate, setEditHeartRate] = useState<number>(75);
  const [editOxygen, setEditOxygen] = useState<number>(98);
  const [editTemp, setEditTemp] = useState<number>(98.6);
  const [editNotes, setEditNotes] = useState('');
  const [editPriority, setEditPriority] = useState<TriagePriority>('Green');

  const openEditDrawer = (rec: PatientRecord) => {
    setEditingRecord(rec);
    setEditName(rec.patientName);
    setEditAge(rec.age);
    setEditSystolic(rec.vitals.bpSystolic);
    setEditDiastolic(rec.vitals.bpDiastolic);
    setEditHeartRate(rec.vitals.heartRate);
    setEditOxygen(rec.vitals.oxygenSat);
    setEditTemp(rec.vitals.temperature);
    setEditNotes(rec.voiceNoteText);
    setEditPriority(rec.triagePriority);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;

    // Recalculate or keep priority
    const updatedVitals: Vitals = {
      bpSystolic: Number(editSystolic),
      bpDiastolic: Number(editDiastolic),
      heartRate: Number(editHeartRate),
      oxygenSat: Number(editOxygen),
      temperature: Number(editTemp)
    };

    const calculated = calculateTriagePriority(updatedVitals);

    const updated: PatientRecord = {
      ...editingRecord,
      patientName: editName.trim(),
      age: Number(editAge),
      vitals: updatedVitals,
      voiceNoteText: editNotes.trim(),
      triagePriority: editPriority || calculated.priority,
      // If vitals changed, mark as Pending so it resyncs
      syncStatus: 'Pending',
      timestamp: new Date().toISOString()
    };

    onUpdateRecord(updated);
    setEditingRecord(null);
  };

  // KPIs
  const totalCount = records.length;
  const redCount = records.filter((r) => r.triagePriority === 'Red').length;
  const yellowCount = records.filter((r) => r.triagePriority === 'Yellow').length;
  const greenCount = records.filter((r) => r.triagePriority === 'Green').length;
  const syncedCount = records.filter((r) => r.syncStatus === 'Synced').length;
  const pendingCount = records.filter((r) => r.syncStatus === 'Pending').length;

  const redRatio = totalCount > 0 ? Math.round((redCount / totalCount) * 100) : 0;
  const syncHealth = totalCount > 0 ? Math.round((syncedCount / totalCount) * 100) : 0;

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchesSearch =
        searchTerm.trim() === '' ||
        r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.voiceNoteText.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPriority =
        priorityFilter === 'All' || r.triagePriority === priorityFilter;

      const matchesSync =
        syncFilter === 'All' || r.syncStatus === syncFilter;

      return matchesSearch && matchesPriority && matchesSync;
    });
  }, [records, searchTerm, priorityFilter, syncFilter]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/90 border border-slate-700 p-5 sm:p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              {t.commandCenterTitle}
            </h2>
            <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
              View C
            </span>
          </div>
          <p className="text-sm text-slate-300 mt-1">
            {t.commandCenterDesc}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onNavigateToNewEntry}
            className="tactile-btn flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm cursor-pointer shadow-md min-h-[44px]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Patient Intake</span>
          </button>
        </div>
      </div>

      {/* Analytics KPIs Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Patients */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-400">
            <span>{t.kpiTotalTriaged}</span>
            <Database className="w-4 h-4 text-teal-400" />
          </div>
          <p className="text-3xl font-black text-white mt-2">
            {totalCount}
          </p>
          <div className="mt-2 flex items-center gap-2 text-xs font-medium text-slate-400">
            <span>Active in LocalStorage</span>
          </div>
        </div>

        {/* Emergency Cases (Red Ratio) */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-400">
            <span>{t.kpiEmergencyRatio}</span>
            <AlertCircle className="w-4 h-4 text-red-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-3xl font-black text-red-400">
              {redCount}
            </p>
            <span className="text-sm font-bold text-slate-400">
              ({redRatio}% of total)
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-red-300 font-semibold">Immediate evacuation urgency</span>
          </div>
        </div>

        {/* Sync Health % */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-400">
            <span>{t.kpiSyncHealth}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-3xl font-black text-emerald-400">
              {syncHealth}%
            </p>
            <span className="text-xs text-slate-400 font-bold">
              ({syncedCount}/{totalCount})
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
            <span>Synced to cloud registry</span>
          </div>
        </div>

        {/* Local Queue */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-400">
            <span>{t.kpiLocalQueue}</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-3xl font-black text-amber-400">
              {pendingCount}
            </p>
            <span className="text-xs text-slate-400 font-bold">
              awaiting sync
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs">
            {pendingCount > 0 ? (
              <span className="text-amber-300 font-semibold">Safe in offline cache</span>
            ) : (
              <span className="text-emerald-400 font-semibold">Zero pending records</span>
            )}
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Field */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              id="patient-log-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-teal-500 placeholder:text-slate-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 p-1 rounded-xl">
            {(['All', 'Red', 'Yellow', 'Green'] as ('All' | TriagePriority)[]).map((p) => (
              <button
                key={p}
                type="button"
                id={`filter-priority-${p.toLowerCase()}`}
                onClick={() => setPriorityFilter(p)}
                className={`tactile-btn px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  priorityFilter === p
                    ? p === 'Red'
                      ? 'bg-red-600 text-white'
                      : p === 'Yellow'
                      ? 'bg-amber-500 text-slate-950'
                      : p === 'Green'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-teal-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Sync Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 p-1 rounded-xl">
            {(['All', 'Pending', 'Synced'] as ('All' | SyncStatus)[]).map((s) => (
              <button
                key={s}
                type="button"
                id={`filter-sync-${s.toLowerCase()}`}
                onClick={() => setSyncFilter(s)}
                className={`tactile-btn px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  syncFilter === s
                    ? 'bg-teal-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s === 'All' ? t.filterAll : s === 'Pending' ? t.filterPending : t.filterSynced}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Patients Data Grid / Table */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
        {filteredRecords.length === 0 ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center mx-auto text-slate-500">
              <Layers className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                {t.emptyRecordsTitle}
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                {t.emptyRecordsDesc}
              </p>
            </div>
            <button
              type="button"
              id="seed-demo-data-btn"
              onClick={onResetSeedData}
              className="tactile-btn inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow cursor-pointer min-h-[44px]"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{t.seedDemoDataBtn}</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-900/80 text-xs font-bold uppercase text-slate-400">
                  <th className="py-3.5 px-4">Patient / ID</th>
                  <th className="py-3.5 px-4">Demographics</th>
                  <th className="py-3.5 px-4">Vitals Summary</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Sync Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {filteredRecords.map((record) => {
                  const isHypoxic = record.vitals.oxygenSat < 90;

                  return (
                    <tr
                      key={record.id}
                      className="hover:bg-slate-700/40 transition-colors group"
                    >
                      {/* Name & ID */}
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-white text-sm">
                          {record.patientName}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">
                          {record.id}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs mt-0.5">
                          "{record.voiceNoteText}"
                        </div>
                      </td>

                      {/* Demographics */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-bold text-slate-200">
                          {record.age} yrs
                        </span>
                        <span className="text-slate-400 text-xs ml-1.5">
                          • {record.gender}
                        </span>
                      </td>

                      {/* Vitals Summary with icons */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center flex-wrap gap-2 text-xs">
                          {/* SpO2 */}
                          <span
                            className={`px-2 py-0.5 rounded font-black flex items-center gap-1 ${
                              isHypoxic
                                ? 'bg-red-950 text-red-300 border border-red-500'
                                : 'bg-slate-900 text-teal-300 border border-slate-700'
                            }`}
                          >
                            <Wind className="w-3 h-3" />
                            {record.vitals.oxygenSat}%
                          </span>

                          {/* BP */}
                          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono font-bold flex items-center gap-1">
                            <Heart className="w-3 h-3 text-rose-400" />
                            {record.vitals.bpSystolic}/{record.vitals.bpDiastolic}
                          </span>

                          {/* HR */}
                          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono font-bold flex items-center gap-1">
                            <Activity className="w-3 h-3 text-teal-400" />
                            {record.vitals.heartRate} bpm
                          </span>

                          {/* Temp */}
                          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono font-bold flex items-center gap-1">
                            <Thermometer className="w-3 h-3 text-amber-400" />
                            {record.vitals.temperature}°F
                          </span>
                        </div>
                      </td>

                      {/* Priority Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                            record.triagePriority === 'Red'
                              ? 'bg-red-950 text-red-300 border border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]'
                              : record.triagePriority === 'Yellow'
                              ? 'bg-amber-950 text-amber-300 border border-amber-500'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-500'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              record.triagePriority === 'Red'
                                ? 'bg-red-500 animate-ping'
                                : record.triagePriority === 'Yellow'
                                ? 'bg-amber-400'
                                : 'bg-emerald-400'
                            }`}
                          />
                          {record.triagePriority}
                        </span>
                      </td>

                      {/* Sync Status Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            record.syncStatus === 'Synced'
                              ? 'bg-emerald-950/70 border border-emerald-500/50 text-emerald-300'
                              : 'bg-amber-950/70 border border-amber-500/50 text-amber-300'
                          }`}
                        >
                          {record.syncStatus === 'Synced' ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>Synced</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 text-amber-400 animate-pulse" />
                              <span>Pending</span>
                            </>
                          )}
                        </span>
                      </td>

                      {/* Actions: Edit, FHIR, Delete */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {/* Inspect in FHIR */}
                          <button
                            type="button"
                            onClick={() => onSelectForFhir(record)}
                            id={`action-fhir-${record.id}`}
                            className="tactile-btn p-2 rounded-lg text-slate-300 hover:text-teal-300 hover:bg-slate-700/80 cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
                            title="Inspect HL7 FHIR Observation Payload"
                          >
                            <FileCode2 className="w-4 h-4" />
                          </button>

                          {/* Edit Vitals */}
                          <button
                            type="button"
                            onClick={() => openEditDrawer(record)}
                            id={`action-edit-${record.id}`}
                            className="tactile-btn p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/80 cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
                            title="Edit Vitals and Notes"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Delete with Confirmation */}
                          <button
                            type="button"
                            onClick={() => setRecordToDelete(record)}
                            id={`action-delete-${record.id}`}
                            className="tactile-btn p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/50 cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Editable Inline Drawer / Modal */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <div className="flex items-center gap-2 text-teal-400">
                <Edit3 className="w-5 h-5" />
                <h3 className="font-extrabold text-lg text-white">
                  {t.editVitals}
                </h3>
              </div>
              <button
                onClick={() => setEditingRecord(null)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase">
                    {t.patientName}
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase">
                    {t.age}
                  </label>
                  <input
                    type="number"
                    value={editAge}
                    onChange={(e) => setEditAge(Number(e.target.value))}
                    className="w-full h-11 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Vitals Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase">
                    SpO₂ (%)
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="100"
                    value={editOxygen}
                    onChange={(e) => setEditOxygen(Number(e.target.value))}
                    className="w-full h-11 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-teal-500 focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase">
                    Systolic BP
                  </label>
                  <input
                    type="number"
                    value={editSystolic}
                    onChange={(e) => setEditSystolic(Number(e.target.value))}
                    className="w-full h-11 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-teal-500 focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase">
                    Diastolic BP
                  </label>
                  <input
                    type="number"
                    value={editDiastolic}
                    onChange={(e) => setEditDiastolic(Number(e.target.value))}
                    className="w-full h-11 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-teal-500 focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase">
                    Pulse (bpm)
                  </label>
                  <input
                    type="number"
                    value={editHeartRate}
                    onChange={(e) => setEditHeartRate(Number(e.target.value))}
                    className="w-full h-11 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-teal-500 focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase">
                    Body Temp (°F)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editTemp}
                    onChange={(e) => setEditTemp(Number(e.target.value))}
                    className="w-full h-11 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-teal-500 focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase">
                    Triage Priority
                  </label>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value as TriagePriority)}
                    className="w-full h-11 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-teal-500 focus:outline-none"
                  >
                    <option value="Red">Red (Emergency)</option>
                    <option value="Yellow">Yellow (Urgent)</option>
                    <option value="Green">Green (Stable)</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase">
                  {t.symptomsNotes}
                </label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setEditingRecord(null)}
                  className="tactile-btn px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white font-bold text-sm cursor-pointer min-h-[44px]"
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="submit"
                  id="save-edit-record-btn"
                  className="tactile-btn px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow cursor-pointer min-h-[44px]"
                >
                  {t.saveChangesBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {recordToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border-2 border-red-500/80 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="font-extrabold text-lg text-white">
                {t.deleteConfirmTitle}
              </h3>
            </div>
            <p className="text-sm text-slate-300">
              {t.deleteConfirmMessage}
            </p>
            <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs space-y-1">
              <div className="font-bold text-white">
                Patient: {recordToDelete.patientName}
              </div>
              <div className="text-slate-400">
                Record ID: {recordToDelete.id}
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRecordToDelete(null)}
                className="tactile-btn px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white font-bold text-sm cursor-pointer min-h-[44px]"
              >
                {t.cancelBtn}
              </button>
              <button
                type="button"
                id="confirm-delete-button"
                onClick={() => {
                  onDeleteRecord(recordToDelete.id);
                  setRecordToDelete(null);
                }}
                className="tactile-btn px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-950/60 cursor-pointer min-h-[44px]"
              >
                {t.confirmDeleteBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
