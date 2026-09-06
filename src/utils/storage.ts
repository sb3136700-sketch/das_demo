import { PatientRecord } from '../types';
import { INITIAL_FIELD_RECORDS } from './clinicalRules';

const STORAGE_KEY = 's1_speed_demon_triage_records_v1';

export function getStoredRecords(): PatientRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // First boot: Seed with realistic field data
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_FIELD_RECORDS));
      return INITIAL_FIELD_RECORDS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return INITIAL_FIELD_RECORDS;
  } catch (e) {
    console.error('Failed to read from localStorage, using fallback', e);
    return INITIAL_FIELD_RECORDS;
  }
}

export function saveStoredRecord(record: PatientRecord): PatientRecord[] {
  const current = getStoredRecords();
  const updated = [record, ...current.filter((r) => r.id !== record.id)];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function updateStoredRecord(record: PatientRecord): PatientRecord[] {
  const current = getStoredRecords();
  const updated = current.map((r) => (r.id === record.id ? record : r));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function deleteStoredRecord(id: string): PatientRecord[] {
  const current = getStoredRecords();
  const updated = current.filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function batchMarkSynced(ids: string[]): PatientRecord[] {
  const idSet = new Set(ids);
  const current = getStoredRecords();
  const updated = current.map((r) =>
    idSet.has(r.id) ? { ...r, syncStatus: 'Synced' as const } : r
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function resetStoredRecords(): PatientRecord[] {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_FIELD_RECORDS));
  return INITIAL_FIELD_RECORDS;
}

export function clearAllStoredRecords(): PatientRecord[] {
  const empty: PatientRecord[] = [];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(empty));
  return empty;
}
