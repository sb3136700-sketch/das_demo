export type TriagePriority = 'Red' | 'Yellow' | 'Green';
export type SyncStatus = 'Pending' | 'Synced';
export type Gender = 'Male' | 'Female' | 'Other';

export interface Vitals {
  bpSystolic: number;
  bpDiastolic: number;
  heartRate: number;
  oxygenSat: number;
  temperature: number; // in Fahrenheit
}

export interface PatientRecord {
  id: string;
  patientName: string;
  age: number;
  gender: Gender;
  vitals: Vitals;
  voiceNoteText: string;
  triagePriority: TriagePriority;
  syncStatus: SyncStatus;
  timestamp: string;
}

export type StateMachineStep =
  | 'Idle'
  | 'Capturing'
  | 'Local Validating'
  | 'Queueing'
  | 'Syncing'
  | 'Completed';

export type LanguageCode = 'en' | 'hi' | 'ta';

export type LatencyOption = '0.1' | '1.2' | '4.0' | 'blocked';

export interface ConsoleLogEntry {
  id: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'sync';
  message: string;
  detail?: string;
}
