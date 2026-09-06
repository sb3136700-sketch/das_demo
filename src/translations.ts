import { LanguageCode } from './types';

export interface AppDictionary {
  appTitle: string;
  appSubtitle: string;
  onlineStatus: string;
  offlineStatus: string;
  onlineSubtitle: string;
  offlineSubtitle: string;
  localQueueBadge: string;
  fontScale: string;
  highContrast: string;
  highContrastOn: string;
  highContrastOff: string;
  
  // Navigation Tabs
  tabTriage: string;
  tabSimulator: string;
  tabDashboard: string;
  tabFhir: string;
  tabReport: string;

  // View A: Rapid Triage
  rapidTriageHeader: string;
  rapidTriageDesc: string;
  patientName: string;
  patientNamePlaceholder: string;
  age: string;
  years: string;
  gender: string;
  male: string;
  female: string;
  other: string;
  vitalsSectionTitle: string;
  vitalsSectionDesc: string;
  systolicBp: string;
  diastolicBp: string;
  heartRate: string;
  oxygenSaturation: string;
  temperature: string;
  
  // Alert warnings
  hypoxiaAlert: string;
  hypertensionAlert: string;
  hypotensionAlert: string;
  tachycardiaAlert: string;
  feverAlert: string;

  // Audio Memo
  audioMemoTitle: string;
  audioMemoDesc: string;
  recordAudio: string;
  stopRecording: string;
  recordingInProgress: string;
  symptomsNotes: string;
  symptomsPlaceholder: string;
  triagePriority: string;
  autoCalculated: string;
  priorityRedDesc: string;
  priorityYellowDesc: string;
  priorityGreenDesc: string;
  quickSubmit: string;
  submittingState: string;

  // View B: State Console & Simulator
  stateMachineTitle: string;
  stateMachineDesc: string;
  latencyControllerTitle: string;
  latencyDesc: string;
  instantLatency: string;
  normalLatency: string;
  slow2gLatency: string;
  offgridLatency: string;
  triggerSyncBtn: string;
  syncingAction: string;
  networkBlockedModalTitle: string;
  networkBlockedModalBody: string;
  modalClose: string;
  switchOnline: string;

  // View C: Command Center
  commandCenterTitle: string;
  commandCenterDesc: string;
  kpiTotalTriaged: string;
  kpiEmergencyRatio: string;
  kpiSyncHealth: string;
  kpiLocalQueue: string;
  searchPlaceholder: string;
  filterAll: string;
  filterPending: string;
  filterSynced: string;
  editVitals: string;
  deleteRecord: string;
  deleteConfirmTitle: string;
  deleteConfirmMessage: string;
  confirmDeleteBtn: string;
  cancelBtn: string;
  saveChangesBtn: string;
  emptyRecordsTitle: string;
  emptyRecordsDesc: string;
  seedDemoDataBtn: string;

  // FHIR
  fhirHeader: string;
  fhirDesc: string;
  downloadFhirBtn: string;
  downloadBundleBtn: string;
  selectPatientForFhir: string;
  allRecordsBundle: string;
  copiedToClipboard: string;
  copyJson: string;
}

export const translations: Record<LanguageCode, AppDictionary> = {
  en: {
    appTitle: "S1: Healthcare Speed Demon",
    appSubtitle: "Frontline Triage & Offline Sync Engine (ASHA / ANM)",
    onlineStatus: "ONLINE (3G/4G)",
    offlineStatus: "OFFLINE (Grid Disconnected)",
    onlineSubtitle: "Cloud connectivity active",
    offlineSubtitle: "Safe offline caching enabled",
    localQueueBadge: "Queue: {count} records locally cached",
    fontScale: "Text Scale",
    highContrast: "High Contrast",
    highContrastOn: "Active (High-Vis)",
    highContrastOff: "Standard Dark",

    tabTriage: "Rapid Triage Entry",
    tabSimulator: "Sync & State Console",
    tabDashboard: "Clinical Command Center",
    tabFhir: "FHIR Compliance Export",
    tabReport: "Technical Report",

    rapidTriageHeader: "Frontline Rapid Triage Entry",
    rapidTriageDesc: "Ultra-tactile, high-contrast entry for off-grid field clinics.",
    patientName: "Patient Name",
    patientNamePlaceholder: "e.g., Sunita Devi / Ramesh Kumar",
    age: "Age (Years)",
    years: "yrs",
    gender: "Gender",
    male: "Male",
    female: "Female",
    other: "Other",
    vitalsSectionTitle: "Vital Signs Assessment",
    vitalsSectionDesc: "Real-time clinical range validation with instant sensory alerts.",
    systolicBp: "Systolic BP (mmHg)",
    diastolicBp: "Diastolic BP (mmHg)",
    heartRate: "Pulse / HR (bpm)",
    oxygenSaturation: "Oxygen Saturation SpO₂ (%)",
    temperature: "Body Temp (°F)",

    hypoxiaAlert: "CRITICAL: Severe Hypoxia (<90% SpO₂)! Oxygen required immediately.",
    hypertensionAlert: "WARNING: High Blood Pressure (>140 mmHg) detected.",
    hypotensionAlert: "WARNING: Low Blood Pressure (<90 mmHg) detected.",
    tachycardiaAlert: "WARNING: Tachycardia (>110 bpm) detected.",
    feverAlert: "WARNING: Pyrexia / High Fever (>100.4°F) detected.",

    audioMemoTitle: "Simulated Voice Notes & Clinical Transcript",
    audioMemoDesc: "Tap to record verbal triage notes with real-time waveform animation.",
    recordAudio: "Record Patient Audio Memo",
    stopRecording: "Stop Recording (Generate Notes)",
    recordingInProgress: "Listening & capturing field acoustics...",
    symptomsNotes: "Clinical Symptoms & Voice Transcript",
    symptomsPlaceholder: "Patient symptoms or auto-generated field audio transcript...",
    triagePriority: "Calculated Triage Priority",
    autoCalculated: "Live Clinical Rule Engine",
    priorityRedDesc: "Immediate Emergency (Red) - Evacuation or urgent intervention",
    priorityYellowDesc: "Urgent (Yellow) - Needs medical officer review",
    priorityGreenDesc: "Stable (Green) - Routine primary management",
    quickSubmit: "⚡ Quick-Submit Triage Record",
    submittingState: "Processing State Machine...",

    stateMachineTitle: "Visual State Machine & Local Sync Engine",
    stateMachineDesc: "Live observability of the offline data processing lifecycle.",
    latencyControllerTitle: "Simulated Network Speed",
    latencyDesc: "Adjust artificial field latency to verify resilient offline behavior.",
    instantLatency: "Instant (0.1s)",
    normalLatency: "3G Standard (1.2s)",
    slow2gLatency: "Intermittent 2G (4.0s)",
    offgridLatency: "Complete Off-Grid (Blocked)",
    triggerSyncBtn: "Trigger Cloud Sync Cycle",
    syncingAction: "Syncing records to FHIR Gateway...",
    networkBlockedModalTitle: "Network Unavailable",
    networkBlockedModalBody: "Records are securely stored in HTML5 LocalStorage. Switch status to 'Online' in the top header to test the sync cycle.",
    modalClose: "Understood",
    switchOnline: "Switch to Online Now",

    commandCenterTitle: "Clinical Command Center & Patient Register",
    commandCenterDesc: "Locally persisted patient records, inline editing, and live triage ratios.",
    kpiTotalTriaged: "Total Triaged",
    kpiEmergencyRatio: "Emergency Ratio (Red)",
    kpiSyncHealth: "Sync Health",
    kpiLocalQueue: "Pending Cloud Sync",
    searchPlaceholder: "Search by patient name, ID, or symptoms...",
    filterAll: "All Records",
    filterPending: "Pending Sync",
    filterSynced: "Synced to Cloud",
    editVitals: "Edit Record",
    deleteRecord: "Delete",
    deleteConfirmTitle: "Confirm Record Deletion",
    deleteConfirmMessage: "Are you sure you want to delete this patient record? This action will remove it permanently from local device storage.",
    confirmDeleteBtn: "Yes, Delete Record",
    cancelBtn: "Cancel",
    saveChangesBtn: "Save & Persist Changes",
    emptyRecordsTitle: "No Patient Records Stored",
    emptyRecordsDesc: "Submit a new patient triage record or load pre-seeded field samples.",
    seedDemoDataBtn: "Load Realistic Field Demo Data",

    fhirHeader: "FHIR R4 Interoperability & Export Engine",
    fhirDesc: "Standardized HL7 FHIR Bundle and Observation resources ready for National Health Stack.",
    downloadFhirBtn: "Download Patient FHIR JSON",
    downloadBundleBtn: "Download All Records (FHIR Bundle)",
    selectPatientForFhir: "Select Patient Record to Inspect:",
    allRecordsBundle: "Full Database Bundle",
    copiedToClipboard: "Copied FHIR JSON to clipboard!",
    copyJson: "Copy JSON"
  },
  hi: {
    appTitle: "S1: हेल्थकेयर स्पीड डेमन",
    appSubtitle: "फ्रंटलाइन ट्राइएज एवं ऑफलाइन सिंक इंजन (आशा / एएनएम)",
    onlineStatus: "ऑनलाइन (3G/4G)",
    offlineStatus: "ऑफलाइन (नेटवर्क डिस्कनेक्ट)",
    onlineSubtitle: "क्लाउड कनेक्टिविटी सक्रिय है",
    offlineSubtitle: "सुरक्षित ऑफलाइन लोकल स्टोरेज चालू है",
    localQueueBadge: "कतार: {count} रिकॉर्ड स्थानीय रूप से सहेजे गए",
    fontScale: "टेक्स्ट आकार",
    highContrast: "उच्च कंट्रास्ट",
    highContrastOn: "सक्रिय (हाई-विज़िबिलिटी)",
    highContrastOff: "सामान्य डार्क",

    tabTriage: "त्वरित ट्राइएज प्रविष्टि",
    tabSimulator: "सिंक एवं स्टेट कंसोल",
    tabDashboard: "क्लिनिकल कमांड सेंटर",
    tabFhir: "FHIR निर्यात इंजन",
    tabReport: "तकनीकी रिपोर्ट",

    rapidTriageHeader: "फ्रंटलाइन त्वरित ट्राइएज प्रविष्टि",
    rapidTriageDesc: "ग्रामीण स्वास्थ्य कार्यकर्ताओं के लिए उच्च कंट्रास्ट एवं सुगम इंटरफेस।",
    patientName: "रोगी का नाम",
    patientNamePlaceholder: "उदा. सुनीता देवी / रमेश कुमार",
    age: "आयु (वर्ष)",
    years: "वर्ष",
    gender: "लिंग",
    male: "पुरुष",
    female: "महिला",
    other: "अन्य",
    vitalsSectionTitle: "महत्वपूर्ण शारीरिक संकेत (Vitals)",
    vitalsSectionDesc: "सटीक चिकित्सीय जांच और तुरंत चेतावनी संकेत।",
    systolicBp: "सिस्टोलिक बीपी (mmHg)",
    diastolicBp: "डायस्टोलिक बीपी (mmHg)",
    heartRate: "नाड़ी / पल्स (bpm)",
    oxygenSaturation: "ऑक्सीजन स्तर SpO₂ (%)",
    temperature: "तापमान (°F)",

    hypoxiaAlert: "गंभीर चेतावनी: ऑक्सीजन की कमी (<90%)! तत्काल ऑक्सीजन आवश्यक।",
    hypertensionAlert: "चेतावनी: उच्च रक्तचाप (>140 mmHg) पाया गया।",
    hypotensionAlert: "चेतावनी: निम्न रक्तचाप (<90 mmHg) पाया गया।",
    tachycardiaAlert: "चेतावनी: तेज हृदय गति (>110 bpm) पाई गई।",
    feverAlert: "चेतावनी: तेज बुखार (>100.4°F) दर्ज किया गया।",

    audioMemoTitle: "वॉयस नोट एवं स्वचालित क्लिनिकल सारांश",
    audioMemoDesc: "मरीज की समस्या बोलने के लिए माइक बटन दबाएं।",
    recordAudio: "मरीज का ऑडियो मेमो रिकॉर्ड करें",
    stopRecording: "रिकॉर्डिंग रोकें (नोट्स बनाएं)",
    recordingInProgress: "आवाज सुनी जा रही है...",
    symptomsNotes: "लक्षण एवं वॉयस ट्रांसक्रिप्ट",
    symptomsPlaceholder: "मरीज के लक्षण या स्वचालित रूप से निर्मित नोट्स...",
    triagePriority: "ट्राइएज प्राथमिकता",
    autoCalculated: "स्वचालित चिकित्सीय नियम",
    priorityRedDesc: "आपातकालीन (लाल) - तत्काल रेफरल व उपचार आवश्यक",
    priorityYellowDesc: "गंभीर (पीला) - डॉक्टर की तत्काल समीक्षा आवश्यक",
    priorityGreenDesc: "सामान्य (हरा) - प्राथमिक उपचार उपयुक्त",
    quickSubmit: "⚡ तुरंत ट्राइएज रिकॉर्ड सहेजें",
    submittingState: "प्रोसेसिंग चालू है...",

    stateMachineTitle: "विजुअल स्टेट मशीन एवं लोकल सिंक",
    stateMachineDesc: "ऑफलाइन डेटा लाइफसाइकिल का वास्तविक समय दृश्य।",
    latencyControllerTitle: "अनुकरण नेटवर्क गति",
    latencyDesc: "ऑफलाइन कार्यक्षमता परखने के लिए नेटवर्क गति चुनें।",
    instantLatency: "तुरंत (0.1s)",
    normalLatency: "3G सामान्य (1.2s)",
    slow2gLatency: "धीमा 2G (4.0s)",
    offgridLatency: "पूर्ण ऑफलाइन (ब्लॉक)",
    triggerSyncBtn: "क्लाउड सिंक शुरू करें",
    syncingAction: "क्लाउड पर रिकॉर्ड भेजे जा रहे हैं...",
    networkBlockedModalTitle: "नेटवर्क अनुपलब्ध है",
    networkBlockedModalBody: "रिकॉर्ड सुरक्षित रूप से डिवाइस के लोकल स्टोरेज में सहेजे गए हैं। सिंक का परीक्षण करने के लिए ऊपर 'ऑनलाइन' चुनें।",
    modalClose: "समझ गया",
    switchOnline: "अभी ऑनलाइन करें",

    commandCenterTitle: "क्लिनिकल कमांड सेंटर एवं रोगी रजिस्टर",
    commandCenterDesc: "सहेजे गए रिकॉर्ड, त्वरित संपादन और वास्तविक समय ट्राइएज अनुपात।",
    kpiTotalTriaged: "कुल मरीज",
    kpiEmergencyRatio: "आपातकालीन अनुपात (लाल)",
    kpiSyncHealth: "सिंक स्वास्थ्य",
    kpiLocalQueue: "कतार में लंबित",
    searchPlaceholder: "मरीज के नाम, आईडी या लक्षण से खोजें...",
    filterAll: "सभी रिकॉर्ड",
    filterPending: "सिंक लंबित",
    filterSynced: "सिंक पूर्ण",
    editVitals: "संशोधित करें",
    deleteRecord: "हटाएं",
    deleteConfirmTitle: "रिकॉर्ड हटाने की पुष्टि",
    deleteConfirmMessage: "क्या आप वाकई इस रोगी का रिकॉर्ड हटाना चाहते हैं? यह डेटा डिवाइस से स्थायी रूप से मिट जाएगा।",
    confirmDeleteBtn: "हाँ, रिकॉर्ड हटाएं",
    cancelBtn: "रद्द करें",
    saveChangesBtn: "परिवर्तन सहेजें",
    emptyRecordsTitle: "कोई रिकॉर्ड मौजूद नहीं है",
    emptyRecordsDesc: "नया मरीज जोड़ें या डेमो डेटा लोड करें।",
    seedDemoDataBtn: "फ़ील्ड डेमो डेटा लोड करें",

    fhirHeader: "FHIR R4 मानक निर्यात",
    fhirDesc: "राष्ट्रीय डिजिटल स्वास्थ्य मिशन अनुरूप HL7 FHIR JSON।",
    downloadFhirBtn: "रोगी का FHIR JSON डाउनलोड करें",
    downloadBundleBtn: "पूरा डेटाबेस डाउनलोड करें (FHIR Bundle)",
    selectPatientForFhir: "निरीक्षण के लिए मरीज चुनें:",
    allRecordsBundle: "संपूर्ण डेटाबेस बंडल",
    copiedToClipboard: "JSON क्लिपबोर्ड पर कॉपी हो गया!",
    copyJson: "JSON कॉपी करें"
  },
  ta: {
    appTitle: "S1: ஹெல்த்கேர் ஸ்பீட் டெமான்",
    appSubtitle: "முன்னணி ட்ரையேஜ் & ஆஃப்லைன் ஒத்திசைவு இயந்திரம் (ஆஷா / ANM)",
    onlineStatus: "ஆன்லைன் (3G/4G)",
    offlineStatus: "ஆஃப்லைன் (வலையமைப்பு துண்டிக்கப்பட்டது)",
    onlineSubtitle: "கிளவுட் இணைப்பு செயலில் உள்ளது",
    offlineSubtitle: "பாதுகாப்பான ஆஃப்லைன் சேமிப்பு இயங்குகிறது",
    localQueueBadge: "வரிசை: {count} பதிவுகள் உள்ளூரில் சேமிக்கப்பட்டுள்ளன",
    fontScale: "எழுத்து அளவு",
    highContrast: "அதிக மாறுபாடு",
    highContrastOn: "செயலில் (அதிக பார்வை)",
    highContrastOff: "நிலையான டார்க்",

    tabTriage: "விரைவு ட்ரையேஜ் பதிவு",
    tabSimulator: "ஒத்திசைவு & நிலை கன்சோல்",
    tabDashboard: "மருத்துவ கட்டுப்பாட்டு மையம்",
    tabFhir: "FHIR ஏற்றுமதி மையம்",
    tabReport: "தொழில்நுட்ப அறிக்கை",

    rapidTriageHeader: "முன்னணி விரைவு ட்ரையேஜ் பதிவு",
    rapidTriageDesc: "கிராமப்புற களப்பணியாளர்களுக்கான தொடு-நட்பு, உயர் மாறுபாடு இடைமுகம்.",
    patientName: "நோயாளி பெயர்",
    patientNamePlaceholder: "உ.ம். சுனிதா தேவி / ரமேஷ் குமார்",
    age: "வயது (ஆண்டுகள்)",
    years: "ஆண்டுகள்",
    gender: "பாலினம்",
    male: "ஆண்",
    female: "பெண்",
    other: "மற்றவை",
    vitalsSectionTitle: "முக்கிய உடல் அறிகுறிகள் (Vitals)",
    vitalsSectionDesc: "நிகழ்நேர மருத்துவ மதிப்பீடு மற்றும் உடனடி எச்சரிக்கைகள்.",
    systolicBp: "சிஸ்டாலிக் பிபி (mmHg)",
    diastolicBp: "டயஸ்டாலிக் பிபி (mmHg)",
    heartRate: "நாடித்துடிப்பு (bpm)",
    oxygenSaturation: "ஆக்சிஜன் செறிவு SpO₂ (%)",
    temperature: "உடல் வெப்பநிலை (°F)",

    hypoxiaAlert: "அவசர எச்சரிக்கை: கடுமையான ஆக்சிஜன் பற்றாக்குறை (<90%)! உடனடியாக ஆக்சிஜன் தேவை.",
    hypertensionAlert: "எச்சரிக்கை: உயர் இரத்த அழுத்தம் (>140 mmHg) கண்டறியப்பட்டது.",
    hypotensionAlert: "எச்சரிக்கை: குறைந்த இரத்த அழுத்தம் (<90 mmHg) கண்டறியப்பட்டது.",
    tachycardiaAlert: "எச்சரிக்கை: வேகமான இதயத் துடிப்பு (>110 bpm) பதிவாகியுள்ளது.",
    feverAlert: "எச்சரிக்கை: தீவிர காய்ச்சல் (>100.4°F) கண்டறியப்பட்டது.",

    audioMemoTitle: "குரல் பதிவு & தானியங்கி மருத்துவ சுருக்கம்",
    audioMemoDesc: "நோயாளியின் நிலையை குரல் பதிவாக பதிவு செய்ய தட்டவும்.",
    recordAudio: "ஆடியோ மெமோ பதிவு செய்க",
    stopRecording: "பதிவை நிறுத்து (குறிப்பு உருவாக்கு)",
    recordingInProgress: "ஒலியை உணர்கிறது...",
    symptomsNotes: "அறிகுறிகள் & குரல் குறிப்பு",
    symptomsPlaceholder: "நோயாளியின் அறிகுறிகள் அல்லது உருவாக்கப்பட்ட குறிப்புகள்...",
    triagePriority: "கணக்கிடப்பட்ட முன்னுரிமை",
    autoCalculated: "தானியங்கி மருத்துவ விதி",
    priorityRedDesc: "அவசரம் (சிவப்பு) - உடனடி சிகிச்சை & உயர் மருத்துவமனைக்கு மாற்றம்",
    priorityYellowDesc: "தீவிரம் (மஞ்சள்) - மருத்துவரின் உடனடி பார்வை தேவை",
    priorityGreenDesc: "வழக்கமானது (பச்சை) - முதலுதவி & வழக்கமான சிகிச்சை",
    quickSubmit: "⚡ விரைவு-பதிவு செய்க",
    submittingState: "செயலாக்கப்படுகிறது...",

    stateMachineTitle: "நிலை இயந்திரம் & ஒத்திசைவு மாதிரி",
    stateMachineDesc: "ஆஃப்லைன் தரவு சுழற்சியின் நேரடி பார்வை.",
    latencyControllerTitle: "நெட்வொர்க் வேக மாதிரி",
    latencyDesc: "ஆஃப்லைன் நிலையை சோதிக்க நெட்வொர்க் வேகத்தை மாற்றவும்.",
    instantLatency: "உடனடி (0.1 நொடி)",
    normalLatency: "3G இயல்பானது (1.2 நொடி)",
    slow2gLatency: "மெதுவான 2G (4.0 நொடி)",
    offgridLatency: "முழு ஆஃப்லைன் (தடைப்பட்டது)",
    triggerSyncBtn: "கிளவுட் ஒத்திசைவை தொடங்கு",
    syncingAction: "கிளவுடில் ஒத்திசைக்கப்படுகிறது...",
    networkBlockedModalTitle: "வலையமைப்பு கிடைக்கவில்லை",
    networkBlockedModalBody: "பதிவுகள் சாதனத்தின் உள்ளூர் நினைவகத்தில் பாதுகாப்பாக உள்ளன. ஒத்திசைக்க மேலே 'ஆன்லைன்' நிலைக்கு மாறவும்.",
    modalClose: "புரிந்தது",
    switchOnline: "இப்போதே ஆன்லைனுக்கு மாறு",

    commandCenterTitle: "மருத்துவ கட்டுப்பாட்டு மையம் & நோயாளி பட்டியல்",
    commandCenterDesc: "உள்ளூர் சேமிக்கப்பட்ட பதிவுகள் மற்றும் நிகழ்நேர ட்ரையேஜ் விபரம்.",
    kpiTotalTriaged: "மொத்த நோயாளிகள்",
    kpiEmergencyRatio: "அவசர சிகிச்சை விகிதம் (சிவப்பு)",
    kpiSyncHealth: "ஒத்திசைவு நலம்",
    kpiLocalQueue: "நிலுவையில் உள்ளவை",
    searchPlaceholder: "பெயர், எண் அல்லது அறிகுறிகள் கொண்டு தேடுங்கள்...",
    filterAll: "அனைத்தும்",
    filterPending: "நிலுவையில் உள்ளவை",
    filterSynced: "ஒத்திசைக்கப்பட்டவை",
    editVitals: "திருத்து",
    deleteRecord: "நீக்கு",
    deleteConfirmTitle: "பதிவை நீக்குவதை உறுதிசெய்க",
    deleteConfirmMessage: "இந்த நோயாளி பதிவை நிச்சயமாக நீக்க விரும்புகிறீர்களா? சாதன நினைவகத்திலிருந்து இது நிரந்தரமாக நீக்கப்படும்.",
    confirmDeleteBtn: "ஆம், நீக்குக",
    cancelBtn: "ரத்து செய்",
    saveChangesBtn: "மாற்றங்களைச் சேமி",
    emptyRecordsTitle: "பதிவுகள் எதுவும் இல்லை",
    emptyRecordsDesc: "புதிய ட்ரையேஜ் பதிவு செய்க அல்லது மாதிரித் தரவை ஏற்றுங்கள்.",
    seedDemoDataBtn: "மாதிரி களத் தரவை ஏற்று",

    fhirHeader: "FHIR R4 இணக்க ஏற்றுமதி",
    fhirDesc: "தேசிய சுகாதார தரவுக்கான HL7 FHIR Bundle & Observation தரவு வடிவம்.",
    downloadFhirBtn: "நோயாளியின் FHIR JSON பதிவிறக்கு",
    downloadBundleBtn: "முழு தரவையும் பதிவிறக்கு (FHIR Bundle)",
    selectPatientForFhir: "ஆய்வு செய்ய நோயாளியைத் தேர்ந்தெடுக்கவும்:",
    allRecordsBundle: "முழுமையான தரவுத்தளம்",
    copiedToClipboard: "JSON நகலெடுக்கப்பட்டது!",
    copyJson: "JSON நகலெடு"
  }
};
