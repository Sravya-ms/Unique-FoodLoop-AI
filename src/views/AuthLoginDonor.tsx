import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../db/roomDatabase';
import { Building2, ArrowRight, ShieldCheck, UserCheck, KeyRound, AlertCircle } from 'lucide-react';

export const AuthLoginDonor: React.FC = () => {
  const { loginAs, navigate, showToast } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = db.userDao.getByEmail(email);
    if (!user) {
      setError('No donor account found with this email. Please check or register.');
      return;
    }
    if (user.role !== 'donor') {
      setError('This email is registered under a different role. Donors must use their specific portal.');
      return;
    }

    loginAs(user);
  };

  const handleQuickDemo = (donorId: string) => {
    const user = db.userDao.getById(donorId);
    if (user) {
      loginAs(user);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Building2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Food Donor Portal</h2>
          <p className="text-xs text-slate-500">
            Institutional messes, canteens, catering companies, and individual donors.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Donor Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. catering@abcinstitution.edu.in"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-semibold text-slate-700">Password</label>
              <button
                type="button"
                onClick={() => showToast('Password reset link dispatched to your registered email.', 'info')}
                className="text-emerald-700 hover:text-emerald-800 text-[11px]"
              >
                Forgot password?
              </button>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs transition-colors shadow-xs"
          >
            Sign In to Donor Portal
          </button>
        </form>

        {/* Quick Demo Shortcuts for Evaluators */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 text-center">
            Instant Demo Logins (For SIH Presentation)
          </div>
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => handleQuickDemo('donor-abc-inst')}
              className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/70 text-left text-xs transition-colors flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-slate-900 flex items-center gap-1">
                  <span>ABC Educational Institution</span>
                  <span className="text-[10px] text-emerald-700">✓ Verified</span>
                </div>
                <div className="text-[10px] text-slate-500">Institutional Mess (100 plates Lunch active)</div>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-700" />
            </button>

            <button
              onClick={() => handleQuickDemo('donor-royal-caterer')}
              className="p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-left text-xs transition-colors flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-slate-900 flex items-center gap-1">
                  <span>Royal Heritage Caterers</span>
                  <span className="text-[10px] text-emerald-700">✓ Verified</span>
                </div>
                <div className="text-[10px] text-slate-500">Commoner / Banquets (120 plates Evening)</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 pt-2">
          New donor institution or commoner?{' '}
          <button
            onClick={() => navigate('register_donor')}
            className="text-emerald-700 font-semibold hover:underline"
          >
            Register here
          </button>
        </div>
      </div>
    </div>
  );
};
