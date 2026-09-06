import { TriagePriority, Vitals, PatientRecord } from '../types';

export function calculateTriagePriority(vitals: Vitals): {
  priority: TriagePriority;
  reason: string;
} {
  // Red Priority Rules (Emergent)
  if (vitals.oxygenSat > 0 && vitals.oxygenSat < 90) {
    return {
      priority: 'Red',
      reason: `Critical Hypoxia: SpO₂ is ${vitals.oxygenSat}% (<90%). Immediate oxygenation needed.`
    };
  }
  if (vitals.bpSystolic >= 180 || vitals.bpDiastolic >= 120) {
    return {
      priority: 'Red',
      reason: `Hypertensive Crisis: BP ${vitals.bpSystolic}/${vitals.bpDiastolic} mmHg.`
    };
  }
  if (vitals.heartRate > 130 || (vitals.heartRate > 0 && vitals.heartRate < 45)) {
    return {
      priority: 'Red',
      reason: `Severe Dysrhythmia: Pulse rate is ${vitals.heartRate} bpm.`
    };
  }
  if (vitals.temperature >= 103.5) {
    return {
      priority: 'Red',
      reason: `Severe Hyperpyrexia: Temp ${vitals.temperature}°F.`
    };
  }

  // Yellow Priority Rules (Urgent)
  if (vitals.oxygenSat >= 90 && vitals.oxygenSat <= 94) {
    return {
      priority: 'Yellow',
      reason: `Moderate Hypoxia: SpO₂ is ${vitals.oxygenSat}%. Requires close observation.`
    };
  }
  if (vitals.bpSystolic >= 140 || vitals.bpDiastolic >= 90) {
    return {
      priority: 'Yellow',
      reason: `Elevated Blood Pressure: ${vitals.bpSystolic}/${vitals.bpDiastolic} mmHg.`
    };
  }
  if (vitals.heartRate >= 105 && vitals.heartRate <= 130) {
    return {
      priority: 'Yellow',
      reason: `Tachycardia: Pulse rate is ${vitals.heartRate} bpm.`
    };
  }
  if (vitals.temperature >= 100.4 && vitals.temperature < 103.5) {
    return {
      priority: 'Yellow',
      reason: `Fever / Pyrexia: Temp ${vitals.temperature}°F.`
    };
  }

  // Green Priority
  return {
    priority: 'Green',
    reason: 'Vitals are within clinically acceptable ambulatory parameters.'
  };
}

export const SAMPLE_VOICE_TRANSCRIPTS = [
  "Patient complains of dry cough and shortness of breath for 3 days, no fever history, denies chest pain. Ambulatory but visibly fatigued.",
  "Acute onset high fever since yesterday evening with body chills, severe headache, and joint pain. No rash, oral fluids tolerated.",
  "Elderly patient with dizziness upon standing, bilateral pedal edema for 1 week, and irregular pulse. Taking anti-hypertensive medication intermittently.",
  "Young mother presenting with mild wheezing, nocturnal coughing bouts, and seasonal dust exposure. Alert, oriented, mild intercostal retraction.",
  "Severe sharp epigastric pain radiating to back for 6 hours, accompanied by nausea and sweating. Denies vomiting, BP elevated.",
  "Follow-up antenatal checkup at 28 weeks gestation. Mild bilateral ankle swelling, normal fetal movement felt, BP slightly borderline."
];

export const INITIAL_FIELD_RECORDS: PatientRecord[] = [
  {
    id: "rec-8821-red",
    patientName: "Kamla Bai",
    age: 62,
    gender: "Female",
    vitals: {
      bpSystolic: 155,
      bpDiastolic: 94,
      heartRate: 118,
      oxygenSat: 87, // Severe Hypoxia -> RED
      temperature: 101.8
    },
    voiceNoteText: "Patient breathless at rest, severe audible wheezing, peripheral cyanosis noted on finger beds. Urgent oxygen concentrator referral initiated.",
    triagePriority: "Red",
    syncStatus: "Pending",
    timestamp: new Date(Date.now() - 1000 * 60 * 22).toISOString()
  },
  {
    id: "rec-8822-yellow",
    patientName: "Ramchandra Patel",
    age: 48,
    gender: "Male",
    vitals: {
      bpSystolic: 168,
      bpDiastolic: 102,
      heartRate: 92,
      oxygenSat: 96,
      temperature: 98.6
    },
    voiceNoteText: "History of untreated hypertension for 2 years. Occasional occipital morning headache, no neurological deficit. Prescribed sodium reduction advice.",
    triagePriority: "Yellow",
    syncStatus: "Pending",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  },
  {
    id: "rec-8823-green",
    patientName: "Meena Kumari",
    age: 24,
    gender: "Female",
    vitals: {
      bpSystolic: 116,
      bpDiastolic: 74,
      heartRate: 76,
      oxygenSat: 99,
      temperature: 98.4
    },
    voiceNoteText: "Routine post-partum community health worker check. Infant breast-feeding normally. Vitals completely stable, iron and folic acid provided.",
    triagePriority: "Green",
    syncStatus: "Synced",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString()
  },
  {
    id: "rec-8824-yellow",
    patientName: "Vijay Kumar",
    age: 35,
    gender: "Male",
    vitals: {
      bpSystolic: 124,
      bpDiastolic: 80,
      heartRate: 104,
      oxygenSat: 95,
      temperature: 102.4 // Fever
    },
    voiceNoteText: "Three-day acute fever with myalgia and loss of appetite. Rapid diagnostic malaria strip negative, ORS packet provided, advised fluids.",
    triagePriority: "Yellow",
    syncStatus: "Synced",
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString()
  }
];
