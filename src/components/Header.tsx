import React from 'react';
import { 
  Wifi, 
  WifiOff, 
  Database, 
  SunMedium, 
  Layers, 
  Activity, 
  FileCode2, 
  Gauge, 
  ShieldAlert,
  Type,
  FileText
} from 'lucide-react';
import { LanguageCode } from '../types';
import { translations } from '../translations';

interface HeaderProps {
  isOnline: boolean;
  onToggleOnline: () => void;
  pendingCount: number;
  currentLanguage: LanguageCode;
  onChangeLanguage: (lang: LanguageCode) => void;
  fontScale: number;
  onChangeFontScale: (scale: number) => void;
  isHighContrast: boolean;
  onToggleHighContrast: () => void;
  activeTab: 'triage' | 'simulator' | 'dashboard' | 'fhir' | 'report';
  onSelectTab: (tab: 'triage' | 'simulator' | 'dashboard' | 'fhir' | 'report') => void;
}

export const Header: React.FC<HeaderProps> = ({
  isOnline,
  onToggleOnline,
  pendingCount,
  currentLanguage,
  onChangeLanguage,
  fontScale,
  onChangeFontScale,
  isHighContrast,
  onToggleHighContrast,
  activeTab,
  onSelectTab,
}) => {
  const t = translations[currentLanguage];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-700 bg-slate-900/95 backdrop-blur-md">
      {/* Offline Warning Banner when offline */}
      {!isOnline && (
        <div className="bg-red-600 px-4 py-2 text-white flex items-center justify-between text-xs sm:text-sm font-semibold tracking-wide animate-pulse">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>
              {t.offlineStatus.toUpperCase()} — {t.offlineSubtitle}. LocalStorage cache active.
            </span>
          </div>
          <button
            onClick={onToggleOnline}
            className="underline hover:text-red-100 font-bold ml-2 text-xs uppercase cursor-pointer"
          >
            {t.switchOnline}
          </button>
        </div>
      )}

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand / Title */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-teal-600/20 border border-teal-500/40 flex items-center justify-center text-teal-400 font-black shadow-inner">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                {t.appTitle}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-teal-300 border border-teal-500/30">
                S1 MVP
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Status Indicators & Controls */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
          {/* Network Connectivity Toggle */}
          <button
            onClick={onToggleOnline}
            id="network-toggle-button"
            className={`tactile-btn flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer min-h-[44px] ${
              isOnline
                ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300 hover:bg-emerald-900/80 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                : 'bg-red-950/80 border-red-500/70 text-red-300 hover:bg-red-900/90 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
            }`}
            title="Toggle simulated network connectivity (Online 3G/4G vs Offline)"
          >
            {isOnline ? (
              <>
                <div className="relative">
                  <Wifi className="w-4 h-4 text-emerald-400" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <span>{t.onlineStatus}</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-red-400" />
                <span>{t.offlineStatus}</span>
              </>
            )}
          </button>

          {/* Local Sync Queue Counter Badge */}
          <div
            id="sync-queue-badge"
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm font-medium text-slate-200 min-h-[44px]"
            title="Local records awaiting synchronization with cloud FHIR registry"
          >
            <Database className="w-4 h-4 text-teal-400 shrink-0" />
            <span>
              {t.localQueueBadge.replace('{count}', pendingCount.toString())}
            </span>
            {pendingCount > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
            )}
          </div>

          {/* Accessibility Controls: Font Scaler */}
          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl p-1 min-h-[44px]">
            <span className="px-2 text-slate-400 text-xs hidden md:flex items-center gap-1">
              <Type className="w-3.5 h-3.5" />
            </span>
            {[1, 1.2, 1.5].map((scale) => (
              <button
                key={scale}
                id={`font-scale-${scale}x`}
                onClick={() => onChangeFontScale(scale)}
                className={`tactile-btn px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  fontScale === scale
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                {scale}x
              </button>
            ))}
          </div>

          {/* High Contrast Toggle */}
          <button
            onClick={onToggleHighContrast}
            id="high-contrast-toggle"
            className={`tactile-btn flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer min-h-[44px] ${
              isHighContrast
                ? 'bg-yellow-400 text-black border-yellow-300 shadow-[0_0_12px_rgba(250,204,21,0.5)]'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700'
            }`}
            title="Toggle High-Contrast Field Glare Mode"
          >
            <SunMedium className="w-4 h-4" />
            <span className="hidden lg:inline">{t.highContrast}</span>
          </button>

          {/* Multi-language Selector */}
          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl p-1 min-h-[44px]">
            {(['en', 'hi', 'ta'] as LanguageCode[]).map((lang) => (
              <button
                key={lang}
                id={`lang-button-${lang}`}
                onClick={() => onChangeLanguage(lang)}
                className={`tactile-btn px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer uppercase ${
                  currentLanguage === lang
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                }`}
              >
                {lang === 'en' ? 'EN' : lang === 'hi' ? 'हिंदी' : 'தமிழ்'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2 overflow-x-auto py-2 border-t border-slate-800/80 scrollbar-none">
        <button
          onClick={() => onSelectTab('triage')}
          id="nav-tab-triage"
          className={`tactile-btn flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer min-h-[44px] ${
            activeTab === 'triage'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-900/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>{t.tabTriage}</span>
        </button>

        <button
          onClick={() => onSelectTab('simulator')}
          id="nav-tab-simulator"
          className={`tactile-btn flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer min-h-[44px] ${
            activeTab === 'simulator'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-900/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Gauge className="w-4 h-4" />
          <span>{t.tabSimulator}</span>
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500 text-slate-950 font-black">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onSelectTab('dashboard')}
          id="nav-tab-dashboard"
          className={`tactile-btn flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer min-h-[44px] ${
            activeTab === 'dashboard'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-900/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{t.tabDashboard}</span>
        </button>

        <button
          onClick={() => onSelectTab('fhir')}
          id="nav-tab-fhir"
          className={`tactile-btn flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer min-h-[44px] ${
            activeTab === 'fhir'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-900/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FileCode2 className="w-4 h-4" />
          <span>{t.tabFhir}</span>
        </button>

        <button
          onClick={() => onSelectTab('report')}
          id="nav-tab-report"
          className={`tactile-btn flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer min-h-[44px] ${
            activeTab === 'report'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-900/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{t.tabReport}</span>
        </button>
      </div>
    </header>
  );
};
