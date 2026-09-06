import { PatientRecord } from '../types';

/**
 * Converts an internal PatientRecord into HL7 FHIR Release 4 compliant JSON Bundle
 */
export function generateFhirBundle(record: PatientRecord): Record<string, unknown> {
  const patientId = `patient-${record.id}`;
  const now = new Date(record.timestamp).toISOString();

  // Estimate birth year from age
  const currentYear = new Date().getFullYear();
  const birthYear = currentYear - record.age;
  const estimatedBirthDate = `${birthYear}-01-01`;

  const patientResource = {
    resourceType: 'Patient',
    id: patientId,
    meta: {
      profile: ['http://hl7.org/fhir/StructureDefinition/Patient'],
      lastUpdated: now
    },
    identifier: [
      {
        use: 'usual',
        system: 'https://healthid.ndhm.gov.in/rural-asha-system',
        value: record.id
      }
    ],
    active: true,
    name: [
      {
        use: 'official',
        text: record.patientName
      }
    ],
    gender: record.gender.toLowerCase(),
    birthDate: estimatedBirthDate
  };

  const bloodPressureObservation = {
    resourceType: 'Observation',
    id: `obs-bp-${record.id}`,
    status: 'final',
    category: [
      {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/observation-category',
            code: 'vital-signs',
            display: 'Vital Signs'
          }
        ]
      }
    ],
    code: {
      coding: [
        {
          system: 'http://loinc.org',
          code: '85354-9',
          display: 'Blood pressure panel with all children optional'
        }
      ],
      text: 'Blood pressure'
    },
    subject: {
      reference: `Patient/${patientId}`,
      display: record.patientName
    },
    effectiveDateTime: now,
    component: [
      {
        code: {
          coding: [
            {
              system: 'http://loinc.org',
              code: '8480-6',
              display: 'Systolic blood pressure'
            }
          ],
          text: 'Systolic blood pressure'
        },
        valueQuantity: {
          value: record.vitals.bpSystolic,
          unit: 'mmHg',
          system: 'http://unitsofmeasure.org',
          code: 'mm[Hg]'
        }
      },
      {
        code: {
          coding: [
            {
              system: 'http://loinc.org',
              code: '8462-4',
              display: 'Diastolic blood pressure'
            }
          ],
          text: 'Diastolic blood pressure'
        },
        valueQuantity: {
          value: record.vitals.bpDiastolic,
          unit: 'mmHg',
          system: 'http://unitsofmeasure.org',
          code: 'mm[Hg]'
        }
      }
    ]
  };

  const heartRateObservation = {
    resourceType: 'Observation',
    id: `obs-hr-${record.id}`,
    status: 'final',
    category: [
      {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/observation-category',
            code: 'vital-signs',
            display: 'Vital Signs'
          }
        ]
      }
    ],
    code: {
      coding: [
        {
          system: 'http://loinc.org',
          code: '8867-4',
          display: 'Heart rate'
        }
      ],
      text: 'Heart rate'
    },
    subject: {
      reference: `Patient/${patientId}`,
      display: record.patientName
    },
    effectiveDateTime: now,
    valueQuantity: {
      value: record.vitals.heartRate,
      unit: 'beats/minute',
      system: 'http://unitsofmeasure.org',
      code: '/min'
    }
  };

  const oxygenSatObservation = {
    resourceType: 'Observation',
    id: `obs-spo2-${record.id}`,
    status: 'final',
    category: [
      {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/observation-category',
            code: 'vital-signs',
            display: 'Vital Signs'
          }
        ]
      }
    ],
    code: {
      coding: [
        {
          system: 'http://loinc.org',
          code: '2708-6',
          display: 'Oxygen saturation in Arterial blood'
        },
        {
          system: 'http://loinc.org',
          code: '59408-5',
          display: 'Oxygen saturation in Arterial blood by Pulse oximetry'
        }
      ],
      text: 'Oxygen saturation SpO2'
    },
    subject: {
      reference: `Patient/${patientId}`,
      display: record.patientName
    },
    effectiveDateTime: now,
    valueQuantity: {
      value: record.vitals.oxygenSat,
      unit: '%',
      system: 'http://unitsofmeasure.org',
      code: '%'
    },
    interpretation: [
      {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation',
            code: record.vitals.oxygenSat < 90 ? 'LL' : record.vitals.oxygenSat < 95 ? 'L' : 'N',
            display: record.vitals.oxygenSat < 90 ? 'Critically low' : record.vitals.oxygenSat < 95 ? 'Low' : 'Normal'
          }
        ]
      }
    ]
  };

  const temperatureObservation = {
    resourceType: 'Observation',
    id: `obs-temp-${record.id}`,
    status: 'final',
    category: [
      {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/observation-category',
            code: 'vital-signs',
            display: 'Vital Signs'
          }
        ]
      }
    ],
    code: {
      coding: [
        {
          system: 'http://loinc.org',
          code: '8310-5',
          display: 'Body temperature'
        }
      ],
      text: 'Body temperature'
    },
    subject: {
      reference: `Patient/${patientId}`,
      display: record.patientName
    },
    effectiveDateTime: now,
    valueQuantity: {
      value: record.vitals.temperature,
      unit: 'degF',
      system: 'http://unitsofmeasure.org',
      code: '[degF]'
    }
  };

  const triagePriorityObservation = {
    resourceType: 'Observation',
    id: `obs-triage-${record.id}`,
    status: 'final',
    code: {
      coding: [
        {
          system: 'http://snomed.info/sct',
          code: '225390008',
          display: 'Triage assessment (procedure)'
        }
      ],
      text: 'Field Triage Priority'
    },
    subject: {
      reference: `Patient/${patientId}`,
      display: record.patientName
    },
    effectiveDateTime: now,
    valueCodeableConcept: {
      coding: [
        {
          system: 'https://health.gov.in/emergency-triage-scale',
          code: record.triagePriority,
          display: `${record.triagePriority} Priority Category`
        }
      ],
      text: record.triagePriority
    },
    note: [
      {
        text: record.voiceNoteText || 'No additional verbal memo provided.'
      }
    ]
  };

  return {
    resourceType: 'Bundle',
    id: `bundle-${record.id}`,
    meta: {
      lastUpdated: now
    },
    type: 'collection',
    entry: [
      { fullUrl: `urn:uuid:${patientId}`, resource: patientResource },
      { fullUrl: `urn:uuid:obs-bp-${record.id}`, resource: bloodPressureObservation },
      { fullUrl: `urn:uuid:obs-hr-${record.id}`, resource: heartRateObservation },
      { fullUrl: `urn:uuid:obs-spo2-${record.id}`, resource: oxygenSatObservation },
      { fullUrl: `urn:uuid:obs-temp-${record.id}`, resource: temperatureObservation },
      { fullUrl: `urn:uuid:obs-triage-${record.id}`, resource: triagePriorityObservation }
    ]
  };
}

/**
 * Generates an aggregated FHIR Bundle containing all patients in local storage
 */
export function generateFullDatabaseFhirBundle(records: PatientRecord[]): Record<string, unknown> {
  const allEntries: unknown[] = [];
  records.forEach((record) => {
    const singleBundle = generateFhirBundle(record) as { entry: unknown[] };
    allEntries.push(...singleBundle.entry);
  });

  return {
    resourceType: 'Bundle',
    id: `asha-field-records-database-export`,
    meta: {
      lastUpdated: new Date().toISOString()
    },
    type: 'transaction',
    total: allEntries.length,
    entry: allEntries
  };
}

/**
 * Downloads clinical JSON file
 */
export function downloadJsonFile(data: unknown, filename: string): void {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
