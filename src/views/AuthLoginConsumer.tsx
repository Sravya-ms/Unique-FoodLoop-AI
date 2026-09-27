import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../db/roomDatabase';
import { Users, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export const AuthLoginConsumer: React.FC = () => {
  const { loginAs, navigate, showToast } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = db.userDao.getByEmail(email);
    if (!user) {
      setError('No recipient organization account found with this email.');
      return;
    }
    if (user.role !== 'consumer') {
      setError('This email is not registered as a food recipient organization.');
      return;
    }

    loginAs(user);
  };

  const handleQuickDemo = (consumerId: string) => {
    const user = db.userDao.getById(consumerId);
    if (user) {
      loginAs(user);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Users className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Recipient Portal</h2>
          <p className="text-xs text-slate-500">
            For verified Orphanages, Children Shelters & Old-Age Homes.
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
            <label className="block font-semibold text-slate-700 mb-1">Organization Official Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. care@abcoldagehome.org"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-semibold text-slate-700">Password</label>
              <button
                type="button"
                onClick={() => showToast('Password reset instructions dispatched to your official care email.', 'info')}
                className="text-blue-700 hover:text-blue-800 text-[11px]"
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
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-xs transition-colors shadow-xs"
          >
            Sign In to Recipient Portal
          </button>
        </form>

        {/* Quick Demo Logins */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 text-center">
            Instant Demo Logins (For SIH Presentation)
          </div>
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => handleQuickDemo('consumer-abc-oah')}
              className="p-2.5 rounded-lg border border-blue-200 bg-blue-50/50 hover:bg-blue-100/70 text-left text-xs transition-colors flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-slate-900 flex items-center gap-1">
                  <span>ABC Old Age Home</span>
                  <span className="text-[10px] text-emerald-700">✓ Verified</span>
                </div>
                <div className="text-[10px] text-slate-500">85 Senior Residents · Active Request FL-2026-000124</div>
              </div>
              <ArrowRight className="w-4 h-4 text-blue-700" />
            </button>

            <button
              onClick={() => handleQuickDemo('consumer-xyz-orphanage')}
              className="p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-left text-xs transition-colors flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-slate-900 flex items-center gap-1">
                  <span>Karuna Children Orphanage</span>
                  <span className="text-[10px] text-emerald-700">✓ Verified</span>
                </div>
                <div className="text-[10px] text-slate-500">62 Children Residents · Vinukonda Road</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 pt-2">
          Need food for your shelter or elder care home?{' '}
          <button
            onClick={() => navigate('register_consumer')}
            className="text-blue-700 font-semibold hover:underline"
          >
            Register Organization
          </button>
        </div>
      </div>
    </div>
  );
};
