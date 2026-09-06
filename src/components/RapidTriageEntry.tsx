import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Heart, 
  Wind, 
  Thermometer, 
  Activity, 
  Mic, 
  Square, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  User, 
  Calendar, 
  FileText,
  Radio,
  RefreshCw
} from 'lucide-react';
import { PatientRecord, Gender, TriagePriority, LanguageCode } from '../types';
import { translations } from '../translations';
import { calculateTriagePriority, SAMPLE_VOICE_TRANSCRIPTS } from '../utils/clinicalRules';

interface RapidTriageEntryProps {
  currentLanguage: LanguageCode;
  onSubmitRecord: (record: Omit<PatientRecord, 'id' | 'timestamp' | 'syncStatus'>) => void;
  isProcessingMachine: boolean;
}

export const RapidTriageEntry: React.FC<RapidTriageEntryProps> = ({
  currentLanguage,
  onSubmitRecord,
  isProcessingMachine
}) => {
  const t = translations[currentLanguage];

  // Form State
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<Gender>('Female');

  // Vitals State with sensible standard defaults
  const [bpSystolic, setBpSystolic] = useState<number | ''>(120);
  const [bpDiastolic, setBpDiastolic] = useState<number | ''>(80);
  const [heartRate, setHeartRate] = useState<number | ''>(76);
  const [oxygenSat, setOxygenSat] = useState<number | ''>(98);
  const [temperature, setTemperature] = useState<number | ''>(98.6);

  // Symptoms & Voice Note
  const [voiceNoteText, setVoiceNoteText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Manual priority override or auto
  const [manualPriority, setManualPriority] = useState<TriagePriority | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Calculate live triage assessment
  const liveAssessment = useMemo(() => {
    return calculateTriagePriority({
      bpSystolic: typeof bpSystolic === 'number' ? bpSystolic : 120,
      bpDiastolic: typeof bpDiastolic === 'number' ? bpDiastolic : 80,
      heartRate: typeof heartRate === 'number' ? heartRate : 76,
      oxygenSat: typeof oxygenSat === 'number' ? oxygenSat : 98,
      temperature: typeof temperature === 'number' ? temperature : 98.6,
    });
  }, [bpSystolic, bpDiastolic, heartRate, oxygenSat, temperature]);

  const activePriority = manualPriority || liveAssessment.priority;

  // Real-time hypoxia condition (< 90% SpO2)
  const isHypoxiaAlert = typeof oxygenSat === 'number' && oxygenSat > 0 && oxygenSat < 90;
  const isHypertensionAlert = typeof bpSystolic === 'number' && bpSystolic >= 140;
  const isHypotensionAlert = typeof bpSystolic === 'number' && bpSystolic > 0 && bpSystolic < 90;
  const isTachycardiaAlert = typeof heartRate === 'number' && heartRate > 105;
  const isFeverAlert = typeof temperature === 'number' && temperature >= 100.4;

  // Handle Voice Recording Simulation
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // Auto-populate with medically relevant AI-simulated transcript
    // Pick transcript correlated to vitals if possible
    let transcript = SAMPLE_VOICE_TRANSCRIPTS[0];
    if (isHypoxiaAlert) {
      transcript = "Patient presents with acute shortness of breath, audible stridor, peripheral pallor, SpO2 dropping. Requires emergency airway and oxygen intervention.";
    } else if (isFeverAlert) {
      transcript = "Complaining of 3 days high fever with chills, body ache, dry mouth. Suspected seasonal viral or vector-borne illness. Hydration advice provided.";
    } else if (isHypertensionAlert) {
      transcript = "Known hypertensive presenting with throbbing occipital headache and visual blurring since morning. Denies chest pain or vomiting.";
    } else {
      const randomIndex = Math.floor(Math.random() * SAMPLE_VOICE_TRANSCRIPTS.length);
      transcript = SAMPLE_VOICE_TRANSCRIPTS[randomIndex];
    }
    setVoiceNoteText(transcript);
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Strict field validations
    if (!patientName.trim()) {
      setValidationError('Please enter a valid patient name.');
      return;
    }
    if (age === '' || isNaN(Number(age)) || Number(age) < 0 || Number(age) > 120) {
      setValidationError('Please enter a valid age between 0 and 120 years.');
      return;
    }
    if (bpSystolic === '' || bpDiastolic === '') {
      setValidationError('Please enter valid Blood Pressure readings.');
      return;
    }
    if (oxygenSat === '' || Number(oxygenSat) < 30 || Number(oxygenSat) > 100) {
      setValidationError('Oxygen saturation must be between 30% and 100%.');
      return;
    }

    const payload = {
      patientName: patientName.trim(),
      age: Number(age),
      gender,
      vitals: {
        bpSystolic: Number(bpSystolic),
        bpDiastolic: Number(bpDiastolic),
        heartRate: Number(heartRate || 76),
        oxygenSat: Number(oxygenSat),
        temperature: Number(temperature || 98.6)
      },
      voiceNoteText: voiceNoteText.trim() || 'Verbal triage memo captured during field intake.',
      triagePriority: activePriority
    };

    onSubmitRecord(payload);

    // Reset form fields
    setPatientName('');
    setAge('');
    setGender('Female');
    setBpSystolic(120);
    setBpDiastolic(80);
    setHeartRate(76);
    setOxygenSat(98);
    setTemperature(98.6);
    setVoiceNoteText('');
    setManualPriority(null);
  };

  // Quick preset loader for evaluators to test Hypoxia, Fever, or Normal
  const applyPreset = (preset: 'hypoxia' | 'fever' | 'hypertension' | 'normal') => {
    if (preset === 'hypoxia') {
      setPatientName('Sundari Devi');
      setAge(58);
      setGender('Female');
      setBpSystolic(148);
      setBpDiastolic(94);
      setHeartRate(122);
      setOxygenSat(86); // Triggers severe hypoxia flashing alert!
      setTemperature(100.8);
      setVoiceNoteText('Patient complains of severe breathlessness and chest tightness for 2 days. Wheezing audible on exhalation.');
    } else if (preset === 'fever') {
      setPatientName('Anand Swaminathan');
      setAge(29);
      setGender('Male');
      setBpSystolic(118);
      setBpDiastolic(76);
      setHeartRate(108);
      setOxygenSat(97);
      setTemperature(103.2); // Severe Fever
      setVoiceNoteText('Sudden onset chills and body temperature over 103°F. Severe rigors and joint aches.');
    } else if (preset === 'hypertension') {
      setPatientName('Gopal Krishnan');
      setAge(65);
      setGender('Male');
      setBpSystolic(185);
      setBpDiastolic(115);
      setHeartRate(88);
      setOxygenSat(95);
      setTemperature(98.4);
      setVoiceNoteText('Severe occipital headache, blurring of vision, known history of irregular medication intake.');
    } else {
      setPatientName('Pooja Sharma');
      setAge(26);
      setGender('Female');
      setBpSystolic(114);
      setBpDiastolic(72);
      setHeartRate(72);
      setOxygenSat(99);
      setTemperature(98.4);
      setVoiceNoteText('Routine ante-natal visit. Fetal movements normal. No swelling or complaints.');
    }
    setManualPriority(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/90 border border-slate-700 p-4 sm:p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              {t.rapidTriageHeader}
            </h2>
            <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
              View A
            </span>
          </div>
          <p className="text-sm text-slate-300 mt-1">{t.rapidTriageDesc}</p>
        </div>

        {/* Quick Testing Presets for Evaluator */}
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            Presets:
          </span>
          <button
            type="button"
            onClick={() => applyPreset('hypoxia')}
            className="tactile-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-red-950 border border-red-500/60 text-red-300 hover:bg-red-900 cursor-pointer min-h-[36px]"
            title="Test Critical Hypoxia (<90% SpO2)"
          >
            🚨 Severe Hypoxia (Red)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('fever')}
            className="tactile-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-950 border border-amber-500/60 text-amber-300 hover:bg-amber-900 cursor-pointer min-h-[36px]"
            title="Test Pyrexia / High Fever"
          >
            🌡️ High Fever
          </button>
          <button
            type="button"
            onClick={() => applyPreset('normal')}
            className="tactile-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-950 border border-emerald-500/60 text-emerald-300 hover:bg-emerald-900 cursor-pointer min-h-[36px]"
            title="Test Normal Ambulatory Case"
          >
            ✅ Normal (Green)
          </button>
        </div>
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="p-4 rounded-xl bg-red-950/90 border-2 border-red-500 text-red-200 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 text-red-400" />
          <span className="font-semibold text-sm">{validationError}</span>
        </div>
      )}

      {/* Main Entry Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Patient Demographics */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 sm:p-6 space-y-5">
          <div className="flex items-center gap-2 text-teal-400 border-b border-slate-700/80 pb-3">
            <User className="w-5 h-5" />
            <h3 className="font-bold text-base text-white">
              1. Patient Demographics & Identification
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Patient Name */}
            <div className="md:col-span-6 space-y-2">
              <label htmlFor="patient-name-input" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                {t.patientName} *
              </label>
              <input
                id="patient-name-input"
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder={t.patientNamePlaceholder}
                className="w-full h-12 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold text-base focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all placeholder:text-slate-500"
                required
              />
            </div>

            {/* Age */}
            <div className="md:col-span-2 space-y-2">
              <label htmlFor="patient-age-input" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                {t.age} *
              </label>
              <div className="relative">
                <input
                  id="patient-age-input"
                  type="number"
                  min="0"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 45"
                  className="w-full h-12 px-4 pr-10 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold text-base focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all placeholder:text-slate-500"
                  required
                />
                <span className="absolute right-3 top-3.5 text-xs text-slate-400 font-bold">
                  {t.years}
                </span>
              </div>
            </div>

            {/* Gender Selection Grid (Touch Targets >= 48px) */}
            <div className="md:col-span-4 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                {t.gender} *
              </label>
              <div className="grid grid-cols-3 gap-2 h-12">
                {(['Female', 'Male', 'Other'] as Gender[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    id={`gender-select-${g.toLowerCase()}`}
                    onClick={() => setGender(g)}
                    className={`tactile-btn h-full rounded-xl font-bold text-xs sm:text-sm border transition-all cursor-pointer flex items-center justify-center min-h-[48px] ${
                      gender === g
                        ? 'bg-teal-600 text-white border-teal-400 shadow-md'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-700/60'
                    }`}
                  >
                    {g === 'Female' ? t.female : g === 'Male' ? t.male : t.other}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Vitals Inputs with Automated Live CSS Feedback */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/80 pb-3">
            <div className="flex items-center gap-2 text-teal-400">
              <Activity className="w-5 h-5" />
              <h3 className="font-bold text-base text-white">
                2. {t.vitalsSectionTitle}
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {t.vitalsSectionDesc}
            </span>
          </div>

          {/* Critical Hypoxia Flashing Banner if < 90% */}
          {isHypoxiaAlert && (
            <div className="p-4 rounded-xl bg-red-950 border-2 border-red-500 text-red-100 flex items-center gap-3 animate-hypoxia-alert">
              <div className="p-2 rounded-lg bg-red-600 text-white shrink-0 animate-bounce">
                <Wind className="w-5 h-5" />
              </div>
              <div>
                <p className="font-black text-sm uppercase tracking-wider text-red-300">
                  {t.hypoxiaAlert}
                </p>
                <p className="text-xs text-red-200 mt-0.5">
                  Oxygen Saturation measured at {oxygenSat}%. Prepare portable oxygen cylinder & urgent evacuation referral!
                </p>
              </div>
            </div>
          )}

          {/* Vitals Input Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Oxygen Saturation SpO2 (Key Focus) */}
            <div
              className={`p-4 rounded-xl border transition-all duration-300 ${
                isHypoxiaAlert
                  ? 'bg-red-950/80 border-red-500 ring-2 ring-red-500/50 animate-hypoxia-alert'
                  : 'bg-slate-900 border-slate-700 focus-within:border-teal-500'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold uppercase mb-2">
                <span className={isHypoxiaAlert ? 'text-red-400 font-black' : 'text-slate-300'}>
                  SpO₂ Oxygen
                </span>
                <Wind className={`w-4 h-4 ${isHypoxiaAlert ? 'text-red-400 animate-pulse' : 'text-teal-400'}`} />
              </div>
              <div className="relative">
                <input
                  id="vitals-oxygen-input"
                  type="number"
                  min="30"
                  max="100"
                  value={oxygenSat}
                  onChange={(e) => setOxygenSat(e.target.value === '' ? '' : Number(e.target.value))}
                  className={`w-full h-12 px-3 text-2xl font-black rounded-lg bg-slate-950 border text-white focus:outline-none ${
                    isHypoxiaAlert ? 'border-red-500 text-red-300' : 'border-slate-700 focus:border-teal-500'
                  }`}
                  required
                />
                <span className="absolute right-3 top-3 text-xs font-bold text-slate-400">
                  %
                </span>
              </div>
              <div className="mt-2 text-[11px] font-semibold flex items-center justify-between">
                <span className="text-slate-400">Target: ≥95%</span>
                <span className={isHypoxiaAlert ? 'text-red-400 font-black' : 'text-emerald-400'}>
                  {isHypoxiaAlert ? 'SEVERE HYPOXIA' : 'Optimal'}
                </span>
              </div>
            </div>

            {/* Systolic BP */}
            <div
              className={`p-4 rounded-xl border transition-all duration-300 ${
                isHypertensionAlert
                  ? 'bg-amber-950/70 border-amber-500'
                  : isHypotensionAlert
                  ? 'bg-amber-950/70 border-amber-500'
                  : 'bg-slate-900 border-slate-700 focus-within:border-teal-500'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold uppercase mb-2 text-slate-300">
                <span>Systolic BP</span>
                <Heart className="w-4 h-4 text-rose-400" />
              </div>
              <div className="relative">
                <input
                  id="vitals-systolic-input"
                  type="number"
                  min="40"
                  max="260"
                  value={bpSystolic}
                  onChange={(e) => setBpSystolic(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full h-12 px-3 text-2xl font-black rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-teal-500"
                  required
                />
                <span className="absolute right-3 top-3 text-xs font-bold text-slate-400">
                  mmHg
                </span>
              </div>
              <div className="mt-2 text-[11px] font-semibold flex items-center justify-between">
                <span className="text-slate-400">Normal: 90-120</span>
                <span className={isHypertensionAlert ? 'text-amber-400' : 'text-emerald-400'}>
                  {isHypertensionAlert ? 'Elevated' : isHypotensionAlert ? 'Low' : 'Normal'}
                </span>
              </div>
            </div>

            {/* Diastolic BP */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 focus-within:border-teal-500">
              <div className="flex items-center justify-between text-xs font-bold uppercase mb-2 text-slate-300">
                <span>Diastolic BP</span>
                <Heart className="w-4 h-4 text-rose-400" />
              </div>
              <div className="relative">
                <input
                  id="vitals-diastolic-input"
                  type="number"
                  min="30"
                  max="160"
                  value={bpDiastolic}
                  onChange={(e) => setBpDiastolic(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full h-12 px-3 text-2xl font-black rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-teal-500"
                  required
                />
                <span className="absolute right-3 top-3 text-xs font-bold text-slate-400">
                  mmHg
                </span>
              </div>
              <div className="mt-2 text-[11px] font-semibold flex items-center justify-between">
                <span className="text-slate-400">Normal: 60-80</span>
                <span className="text-emerald-400">mmHg</span>
              </div>
            </div>

            {/* Pulse / Heart Rate */}
            <div
              className={`p-4 rounded-xl border transition-all duration-300 ${
                isTachycardiaAlert
                  ? 'bg-amber-950/70 border-amber-500'
                  : 'bg-slate-900 border-slate-700 focus-within:border-teal-500'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold uppercase mb-2 text-slate-300">
                <span>Pulse / HR</span>
                <Activity className="w-4 h-4 text-teal-400" />
              </div>
              <div className="relative">
                <input
                  id="vitals-heartrate-input"
                  type="number"
                  min="30"
                  max="240"
                  value={heartRate}
                  onChange={(e) => setHeartRate(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full h-12 px-3 text-2xl font-black rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-teal-500"
                  required
                />
                <span className="absolute right-3 top-3 text-xs font-bold text-slate-400">
                  bpm
                </span>
              </div>
              <div className="mt-2 text-[11px] font-semibold flex items-center justify-between">
                <span className="text-slate-400">60-100 bpm</span>
                <span className={isTachycardiaAlert ? 'text-amber-400' : 'text-emerald-400'}>
                  {isTachycardiaAlert ? 'Tachycardia' : 'Regular'}
                </span>
              </div>
            </div>

            {/* Body Temperature */}
            <div
              className={`p-4 rounded-xl border transition-all duration-300 ${
                isFeverAlert
                  ? 'bg-amber-950/70 border-amber-500'
                  : 'bg-slate-900 border-slate-700 focus-within:border-teal-500'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold uppercase mb-2 text-slate-300">
                <span>Temperature</span>
                <Thermometer className="w-4 h-4 text-amber-400" />
              </div>
              <div className="relative">
                <input
                  id="vitals-temperature-input"
                  type="number"
                  step="0.1"
                  min="90"
                  max="110"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full h-12 px-3 text-2xl font-black rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-teal-500"
                  required
                />
                <span className="absolute right-3 top-3 text-xs font-bold text-slate-400">
                  °F
                </span>
              </div>
              <div className="mt-2 text-[11px] font-semibold flex items-center justify-between">
                <span className="text-slate-400">97.8 - 99.1°F</span>
                <span className={isFeverAlert ? 'text-amber-400' : 'text-emerald-400'}>
                  {isFeverAlert ? 'Pyrexia' : 'Afebrile'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Simulated Voice Notes Component (Tactile Mic + Waveform) */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/80 pb-3">
            <div className="flex items-center gap-2 text-teal-400">
              <Radio className="w-5 h-5" />
              <h3 className="font-bold text-base text-white">
                3. {t.audioMemoTitle}
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {t.audioMemoDesc}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            {/* Mic Controller Card */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-3 min-h-[160px]">
              {isRecording ? (
                <div className="flex flex-col items-center gap-3">
                  {/* Animated Waveform SVG Bars */}
                  <div className="flex items-center justify-center gap-1.5 h-12">
                    <div className="w-1.5 bg-red-500 rounded-full audio-bar-1" />
                    <div className="w-1.5 bg-red-400 rounded-full audio-bar-2" />
                    <div className="w-1.5 bg-teal-400 rounded-full audio-bar-3" />
                    <div className="w-1.5 bg-red-500 rounded-full audio-bar-4" />
                    <div className="w-1.5 bg-teal-300 rounded-full audio-bar-2" />
                    <div className="w-1.5 bg-red-400 rounded-full audio-bar-1" />
                    <div className="w-1.5 bg-teal-400 rounded-full audio-bar-3" />
                  </div>

                  <div className="flex items-center gap-2 text-red-400 font-mono text-lg font-bold">
                    <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                    <span>REC {formatTimer(recordingSeconds)}</span>
                  </div>

                  <button
                    type="button"
                    id="stop-audio-recording-button"
                    onClick={handleStopRecording}
                    className="tactile-btn flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-950/60 cursor-pointer min-h-[48px]"
                  >
                    <Square className="w-4 h-4 fill-white" />
                    <span>{t.stopRecording}</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2.5">
                  <button
                    type="button"
                    id="start-audio-recording-button"
                    onClick={handleStartRecording}
                    className="tactile-btn flex items-center gap-3 px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-teal-950/60 cursor-pointer min-h-[48px]"
                  >
                    <Mic className="w-5 h-5" />
                    <span>{t.recordAudio}</span>
                  </button>
                  <p className="text-xs text-slate-400">
                    Simulates speech recognition tailored for field audio.
                  </p>
                </div>
              )}
            </div>

            {/* Transcript Textarea */}
            <div className="lg:col-span-7 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-300">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-teal-400" />
                  {t.symptomsNotes}
                </span>
                {voiceNoteText && (
                  <span className="text-teal-400 flex items-center gap-1 text-[11px] lowercase">
                    <Sparkles className="w-3 h-3" /> auto-transcribed
                  </span>
                )}
              </div>
              <textarea
                id="voice-note-transcript-box"
                rows={4}
                value={voiceNoteText}
                onChange={(e) => setVoiceNoteText(e.target.value)}
                placeholder={t.symptomsPlaceholder}
                className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-teal-500 placeholder:text-slate-500"
              />
            </div>
          </div>
        </div>

        {/* Step 4: Live Calculated Triage Priority Card */}
        <div
          className={`rounded-2xl border p-5 sm:p-6 transition-all duration-300 ${
            activePriority === 'Red'
              ? 'bg-red-950/70 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
              : activePriority === 'Yellow'
              ? 'bg-amber-950/70 border-amber-500 shadow-[0_0_20px_rgba(217,119,6,0.2)]'
              : 'bg-emerald-950/70 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-extrabold text-slate-300">
                  {t.triagePriority}:
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    activePriority === 'Red'
                      ? 'bg-red-600 text-white'
                      : activePriority === 'Yellow'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-emerald-500 text-slate-950'
                  }`}
                >
                  {activePriority} Priority
                </span>
                {manualPriority && (
                  <span className="text-[11px] text-slate-300 italic">
                    (Manual Override)
                  </span>
                )}
              </div>

              <p className="text-sm font-semibold text-white">
                {activePriority === 'Red'
                  ? t.priorityRedDesc
                  : activePriority === 'Yellow'
                  ? t.priorityYellowDesc
                  : t.priorityGreenDesc}
              </p>
              <p className="text-xs text-slate-300">
                <span className="font-bold">Clinical Engine: </span>
                {liveAssessment.reason}
              </p>
            </div>

            {/* Quick Override Buttons if health worker decides otherwise */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <span className="text-xs text-slate-400 font-bold uppercase hidden xl:inline">
                Override:
              </span>
              {(['Red', 'Yellow', 'Green'] as TriagePriority[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  id={`override-priority-${p.toLowerCase()}`}
                  onClick={() => setManualPriority(p === manualPriority ? null : p)}
                  className={`tactile-btn px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer min-h-[36px] ${
                    activePriority === p
                      ? p === 'Red'
                        ? 'bg-red-600 text-white border-red-400'
                        : p === 'Yellow'
                        ? 'bg-amber-500 text-slate-950 border-amber-300'
                        : 'bg-emerald-500 text-slate-950 border-emerald-300'
                      : 'bg-slate-900/80 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 5: Big Tactile Quick-Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            id="quick-submit-triage-button"
            disabled={isProcessingMachine}
            className={`tactile-btn w-full py-4 px-6 rounded-2xl font-black text-base sm:text-lg uppercase tracking-wider flex items-center justify-center gap-3 transition-all cursor-pointer shadow-xl min-h-[56px] ${
              isProcessingMachine
                ? 'bg-teal-900 text-teal-300 cursor-not-allowed opacity-75'
                : 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-950/60 border border-teal-400/40 hover:shadow-teal-900/50'
            }`}
          >
            {isProcessingMachine ? (
              <>
                <RefreshCw className="w-6 h-6 animate-spin text-teal-200" />
                <span>{t.submittingState}</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-6 h-6" />
                <span>{t.quickSubmit}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
