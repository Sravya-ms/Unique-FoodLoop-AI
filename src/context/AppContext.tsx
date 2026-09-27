import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, FoodDonation, FoodRequest, LanguageCode, AppNotification } from '../types';
import { db } from '../db/roomDatabase';
import { TRANSLATIONS } from '../i18n/translations';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export type AppView =
  | 'landing'
  | 'how_it_works'
  | 'login_donor'
  | 'login_consumer'
  | 'login_admin'
  | 'register_donor'
  | 'register_consumer'
  | 'verification_pending'
  | 'donor_dashboard'
  | 'consumer_dashboard'
  | 'admin_dashboard'
  | 'donate_food'
  | 'donation_details'
  | 'order_tracking'
  | 'chat'
  | 'notifications'
  | 'history'
  | 'profile'
  | 'impact'
  | 'ai_analytics'
  | 'admin_verifications'
  | 'admin_all_donations'
  | 'admin_all_requests';

interface ToastState {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface ConfirmModalState {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
}

interface AppContextType {
  currentUser: User | null;
  currentRole: User['role'] | 'guest';
  currentView: AppView;
  selectedDonationId: string | null;
  selectedRequestId: string | null;
  language: LanguageCode;
  t: (key: string) => string;
  unreadNotificationCount: number;
  userNotifications: AppNotification[];
  loginAs: (user: User) => void;
  logout: () => void;
  navigate: (view: AppView, params?: { donationId?: string; requestId?: string }) => void;
  setLanguage: (lang: LanguageCode) => void;
  activeDonation: FoodDonation | undefined;
  activeRequest: FoodRequest | undefined;
  refreshDb: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  showConfirm: (modal: ConfirmModalState) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load saved user session or start as guest on landing
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedId = localStorage.getItem('foodloop_active_user_id');
      if (savedId) {
        return db.userDao.getById(savedId) || null;
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const savedLang = localStorage.getItem('foodloop_language') as LanguageCode;
      if (savedLang && TRANSLATIONS[savedLang]) return savedLang;
    } catch {
      // ignore
    }
    return 'en';
  });

  // Default view based on whether user is already logged in
  const [currentView, setCurrentView] = useState<AppView>(() => {
    try {
      const savedId = localStorage.getItem('foodloop_active_user_id');
      if (savedId) {
        const u = db.userDao.getById(savedId);
        if (u) {
          if (u.role === 'donor') return 'donor_dashboard';
          if (u.role === 'consumer') return 'consumer_dashboard';
          if (u.role === 'admin') return 'admin_dashboard';
        }
      }
    } catch {
      // ignore
    }
    return 'landing';
  });

  const [selectedDonationId, setSelectedDonationId] = useState<string | null>('don-2026-001');
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>('FL-2026-000124');
  const [, setDbVersion] = useState(0);

  // In-app Toasts & Modals (Safe for iframe without window.alert/window.confirm)
  const [toast, setToast] = useState<ToastState | null>(null);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 4500);
  };

  const showConfirm = (modal: ConfirmModalState) => {
    setConfirmModal(modal);
  };

  // Subscribe to reactive database changes
  useEffect(() => {
    const unsubscribe = db.subscribe(() => {
      setDbVersion((v) => v + 1);
      if (currentUser) {
        const updated = db.userDao.getById(currentUser.id);
        if (updated) setCurrentUser(updated);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [currentUser]);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('foodloop_language', lang);
    } catch {
      // ignore
    }
  };

  const t = (key: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    if (langDict[key]) return langDict[key];
    return TRANSLATIONS.en[key] || key;
  };

  const loginAs = (user: User) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('foodloop_active_user_id', user.id);
    } catch {
      // ignore
    }

    showToast(`Signed in successfully as ${user.name}`, 'success');

    if (user.verificationStatus === 'pending') {
      setCurrentView('verification_pending');
      return;
    }

    if (user.role === 'donor') {
      setCurrentView('donor_dashboard');
    } else if (user.role === 'consumer') {
      setCurrentView('consumer_dashboard');
    } else if (user.role === 'admin') {
      setCurrentView('admin_dashboard');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('foodloop_active_user_id');
    } catch {
      // ignore
    }
    showToast('Signed out successfully. Returned to public portal.', 'info');
    setCurrentView('landing');
  };

  /**
   * Strict Navigation Guard:
   * "If we once sign in into the donor account until logging out we should not go to consumer sign in.
   * Only by signing out it should open the other accounts.
   * Only by signing out it can go back to home. If it does not log out then it cannot go to home"
   */
  const navigate = (view: AppView, params?: { donationId?: string; requestId?: string }) => {
    if (params?.donationId) setSelectedDonationId(params.donationId);
    if (params?.requestId) setSelectedRequestId(params.requestId);

    // If logged in, block cross-portal login or public landing without signing out first!
    if (currentUser) {
      if (view === 'landing' || view === 'login_donor' || view === 'login_consumer' || view === 'login_admin') {
        showConfirm({
          title: 'Sign Out Required',
          message: `You are currently logged in as "${currentUser.name}" (${currentUser.role.toUpperCase()}).\nTo switch accounts or return to the public landing page, you must sign out first.`,
          confirmLabel: 'Sign Out Now',
          cancelLabel: 'Stay in Portal',
          onConfirm: () => {
            logout();
          },
        });
        return;
      }

      // Check role boundary
      if (currentUser.role === 'donor' && view === 'consumer_dashboard') {
        showToast('Access Restricted: This view is strictly for verified Food Consumers (Orphanages and Old Age Homes).', 'warning');
        return;
      }
      if (currentUser.role === 'consumer' && (view === 'donor_dashboard' || view === 'donate_food')) {
        showToast('Access Restricted: This view is strictly for Food Donors.', 'warning');
        return;
      }
    }

    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Strictly isolated notifications: Consumers only see their notifications, Donors only see theirs
  const userNotifications = currentUser ? db.notificationDao.getByRecipientId(currentUser.id) : [];
  const unreadNotificationCount = userNotifications.filter((n) => !n.isRead).length;

  const activeDonation = selectedDonationId ? db.donationDao.getById(selectedDonationId) : undefined;
  const activeRequest = selectedRequestId ? db.requestDao.getById(selectedRequestId) : undefined;

  const refreshDb = () => setDbVersion((v) => v + 1);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole: currentUser?.role || 'guest',
        currentView,
        selectedDonationId,
        selectedRequestId,
        language,
        t,
        unreadNotificationCount,
        userNotifications,
        loginAs,
        logout,
        navigate,
        setLanguage,
        activeDonation,
        activeRequest,
        refreshDb,
        showToast,
        showConfirm,
      }}
    >
      {children}

      {/* In-app Toast Banner */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fadeIn max-w-sm">
          <div
            className={`p-4 rounded-xl shadow-lg border flex items-start gap-3 text-xs leading-relaxed ${
              toast.type === 'success'
                ? 'bg-emerald-900 text-white border-emerald-700'
                : toast.type === 'error'
                ? 'bg-rose-900 text-white border-rose-700'
                : toast.type === 'warning'
                ? 'bg-amber-900 text-white border-amber-700'
                : 'bg-slate-900 text-white border-slate-700'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />}
            {toast.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-blue-300 shrink-0 mt-0.5" />}
            <span className="flex-1">{toast.message}</span>
            <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white p-0.5">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* In-app Confirmation Dialog (100% iframe-safe, zero window.confirm) */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">{confirmModal.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
              {confirmModal.message}
            </p>
            <div className="pt-2 flex items-center justify-end gap-2.5 text-xs">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-semibold transition-colors"
              >
                {confirmModal.cancelLabel || 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  const cb = confirmModal.onConfirm;
                  setConfirmModal(null);
                  cb();
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold uppercase tracking-wider transition-colors shadow-xs"
              >
                {confirmModal.confirmLabel || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
