import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SUPPORTED_LANGUAGES } from '../i18n/translations';
import { LanguageCode } from '../types';
import {
  Bell,
  MessageSquare,
  LogOut,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  Menu,
  X,
  Compass,
  HeartHandshake,
  BarChart3,
  PlusCircle,
} from 'lucide-react';

interface NavbarProps {
  onOpenAssistant: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAssistant }) => {
  const {
    currentUser,
    currentRole,
    currentView,
    navigate,
    logout,
    language,
    setLanguage,
    t,
    unreadNotificationCount,
    showConfirm,
  } = useApp();

  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLanguageSelect = (code: LanguageCode) => {
    setLanguage(code);
    setLangMenuOpen(false);
  };

  const handleBrandClick = () => {
    if (currentUser) {
      if (currentUser.role === 'donor') navigate('donor_dashboard');
      else if (currentUser.role === 'consumer') navigate('consumer_dashboard');
      else if (currentUser.role === 'admin') navigate('admin_dashboard');
    } else {
      navigate('landing');
    }
  };

  const currentLangLabel =
    SUPPORTED_LANGUAGES.find((l) => l.code === language)?.label || 'English';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark adhering to Top Bar Contract */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleBrandClick}
              className="text-left group flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-1"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm font-bold text-lg">
                F
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                FoodLoop AI
              </span>
            </button>

            {currentUser && (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-500 pl-2 border-l border-slate-200">
                <span className="capitalize font-medium text-slate-700">
                  {currentUser.role === 'donor'
                    ? 'Donor Portal'
                    : currentUser.role === 'consumer'
                    ? 'Recipient Portal'
                    : 'Admin'}
                </span>
                {currentUser.verificationStatus === 'verified' && (
                  <span className="inline-flex items-center text-emerald-700 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mr-0.5" />
                    Verified
                  </span>
                )}
              </span>
            )}
          </div>

          {/* Zone 2: 4–6 Clean Text Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            {!currentUser && (
              <>
                <button
                  onClick={() => navigate('landing')}
                  className={`hover:text-slate-900 transition-colors ${
                    currentView === 'landing' ? 'text-emerald-700 font-semibold' : ''
                  }`}
                >
                  {t('nav_home')}
                </button>
                <button
                  onClick={() => navigate('how_it_works')}
                  className={`hover:text-slate-900 transition-colors ${
                    currentView === 'how_it_works' ? 'text-emerald-700 font-semibold' : ''
                  }`}
                >
                  {t('nav_how_it_works')}
                </button>
                <button
                  onClick={() => navigate('impact')}
                  className={`hover:text-slate-900 transition-colors ${
                    currentView === 'impact' ? 'text-emerald-700 font-semibold' : ''
                  }`}
                >
                  Impact
                </button>
              </>
            )}

            {currentUser?.role === 'donor' && (
              <>
                <button
                  onClick={() => navigate('donor_dashboard')}
                  className={`hover:text-slate-900 transition-colors ${
                    currentView === 'donor_dashboard' ? 'text-emerald-700 font-semibold' : ''
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate('donate_food')}
                  className={`inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-semibold transition-colors`}
                >
                  <PlusCircle className="w-4 h-4" />
                  Donate Food
                </button>
                <button
                  onClick={() => navigate('history')}
                  className={`hover:text-slate-900 transition-colors ${
                    currentView === 'history' ? 'text-emerald-700 font-semibold' : ''
                  }`}
                >
                  Donation History
                </button>
                <button
                  onClick={() => navigate('impact')}
                  className={`hover:text-slate-900 transition-colors ${
                    currentView === 'impact' ? 'text-emerald-700 font-semibold' : ''
                  }`}
                >
                  Impact
                </button>
              </>
            )}

            {currentUser?.role === 'consumer' && (
              <>
                <button
                  onClick={() => navigate('consumer_dashboard')}
                  className={`hover:text-slate-900 transition-colors ${
                    currentView === 'consumer_dashboard' ? 'text-emerald-700 font-semibold' : ''
                  }`}
                >
                  Available Food
                </button>
                <button
                  onClick={() => navigate('history')}
                  className={`hover:text-slate-900 transition-colors ${
                    currentView === 'history' ? 'text-emerald-700 font-semibold' : ''
                  }`}
                >
                  My Requests
                </button>
                <button
                  onClick={() => navigate('order_tracking')}
                  className={`hover:text-slate-900 transition-colors ${
                    currentView === 'order_tracking' ? 'text-emerald-700 font-semibold' : ''
                  }`}
                >
                  Live Tracking
                </button>
                <button
                  onClick={() => navigate('impact')}
                  className={`hover:text-slate-900 transition-colors ${
                    currentView === 'impact' ? 'text-emerald-700 font-semibold' : ''
                  }`}
                >
                  Impact
                </button>
              </>
            )}

            {currentUser?.role === 'admin' && (
              <>
                <button
                  onClick={() => navigate('admin_dashboard')}
                  className={`hover:text-slate-900 transition-colors ${
                    currentView === 'admin_dashboard' ? 'text-emerald-700 font-semibold' : ''
                  }`}
                >
                  Admin Overview
                </button>
                <button
                  onClick={() => navigate('admin_verifications')}
                  className={`hover:text-slate-900 transition-colors ${
                    currentView === 'admin_verifications' ? 'text-emerald-700 font-semibold' : ''
                  }`}
                >
                  Verifications
                </button>
                <button
                  onClick={() => navigate('admin_all_donations')}
                  className={`hover:text-slate-900 transition-colors ${
                    currentView === 'admin_all_donations' ? 'text-emerald-700 font-semibold' : ''
                  }`}
                >
                  All Donations
                </button>
                <button
                  onClick={() => navigate('impact')}
                  className={`hover:text-slate-900 transition-colors ${
                    currentView === 'impact' ? 'text-emerald-700 font-semibold' : ''
                  }`}
                >
                  System Analytics
                </button>
              </>
            )}

            {/* AI Assistant button */}
            <button
              onClick={onOpenAssistant}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 hover:bg-amber-100 transition-colors border border-amber-200/60"
              title="Open AI FoodLoop Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>AI Assistant</span>
            </button>
          </nav>

          {/* Zone 3: 1–2 Primary Actions + Controls */}
          <div className="flex items-center gap-2.5">
            {/* Multilingual Selector */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1.5 rounded-md transition-colors"
                title="Select Language"
              >
                <span>{currentLangLabel}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 z-50 text-xs">
                  <div className="px-3 py-1 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    Select Language
                  </div>
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => handleLanguageSelect(l.code)}
                      className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center justify-between ${
                        language === l.code ? 'font-bold text-emerald-700 bg-emerald-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>{l.label}</span>
                      <span className="text-slate-400 font-normal">{l.nativeName}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* If user logged in: Notifications & Profile & Sign Out */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('notifications')}
                  className="relative p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-white" />
                  )}
                </button>

                <button
                  onClick={() => navigate('profile')}
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md hover:bg-slate-100 text-slate-700 transition-colors"
                  title="My Profile"
                >
                  <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold uppercase">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="max-w-[120px] truncate">{currentUser.name}</span>
                </button>

                <button
                  onClick={() => {
                    showConfirm({
                      title: 'Confirm Sign Out',
                      message: 'Are you sure you want to sign out from FoodLoop AI?',
                      confirmLabel: 'Sign Out',
                      cancelLabel: 'Stay Logged In',
                      onConfirm: logout,
                    });
                  }}
                  className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-md text-rose-700 hover:bg-rose-50 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t('nav_sign_out')}</span>
                </button>
              </div>
            ) : (
              /* Public / Guest Actions: Distinct Donor & Consumer Entry Points */
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('login_consumer')}
                  className="text-xs font-medium text-slate-700 hover:text-slate-900 px-2.5 py-1.5 rounded-md hover:bg-slate-100 transition-colors"
                >
                  Recipient Login
                </button>
                <button
                  onClick={() => navigate('login_donor')}
                  className="text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-md shadow-sm transition-colors"
                >
                  Donor Login
                </button>
                <button
                  onClick={() => navigate('login_admin')}
                  className="text-xs text-slate-400 hover:text-slate-600 p-1"
                  title="Admin Access"
                >
                  Admin
                </button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-md"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2 text-sm">
          {!currentUser ? (
            <>
              <button
                onClick={() => {
                  navigate('landing');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 font-medium text-slate-700"
              >
                {t('nav_home')}
              </button>
              <button
                onClick={() => {
                  navigate('how_it_works');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 font-medium text-slate-700"
              >
                {t('nav_how_it_works')}
              </button>
              <button
                onClick={() => {
                  navigate('impact');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 font-medium text-slate-700"
              >
                Impact
              </button>
              <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    navigate('login_donor');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 text-xs font-semibold bg-emerald-600 text-white rounded-md"
                >
                  Donor Portal
                </button>
                <button
                  onClick={() => {
                    navigate('login_consumer');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 text-xs font-semibold bg-slate-100 text-slate-800 rounded-md"
                >
                  Recipient Portal
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="pb-2 mb-2 border-b border-slate-100 text-xs text-slate-500">
                Logged in as <strong className="text-slate-800">{currentUser.name}</strong> ({currentUser.role})
              </div>
              {currentUser.role === 'donor' && (
                <>
                  <button
                    onClick={() => {
                      navigate('donor_dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-1.5 font-medium text-slate-700"
                  >
                    Donor Dashboard
                  </button>
                  <button
                    onClick={() => {
                      navigate('donate_food');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-1.5 font-semibold text-emerald-700"
                  >
                    + Donate Food
                  </button>
                  <button
                    onClick={() => {
                      navigate('history');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-1.5 font-medium text-slate-700"
                  >
                    Donation History
                  </button>
                </>
              )}
              {currentUser.role === 'consumer' && (
                <>
                  <button
                    onClick={() => {
                      navigate('consumer_dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-1.5 font-medium text-slate-700"
                  >
                    Available Surplus Food
                  </button>
                  <button
                    onClick={() => {
                      navigate('history');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-1.5 font-medium text-slate-700"
                  >
                    My Food Requests
                  </button>
                  <button
                    onClick={() => {
                      navigate('order_tracking');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-1.5 font-medium text-slate-700"
                  >
                    Live Logistics & Tracking
                  </button>
                </>
              )}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    navigate('profile');
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-slate-600 font-medium"
                >
                  Profile & Verification
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-rose-700 font-semibold"
                >
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
};
