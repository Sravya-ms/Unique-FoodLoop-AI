import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../db/roomDatabase';
import { ShieldAlert, ArrowRight, Lock } from 'lucide-react';

export const AuthLoginAdmin: React.FC = () => {
  const { loginAs, navigate, showToast } = useApp();
  const [email, setEmail] = useState('admin@foodloop.org');
  const [password, setPassword] = useState('admin2026');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const adminUser = db.userDao.getByEmail(email);
    if (adminUser && adminUser.role === 'admin') {
      loginAs(adminUser);
    } else {
      showToast('Invalid admin credentials. Use demo: admin@foodloop.org / admin2026', 'error');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-100">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center mx-auto mb-2">
            <ShieldAlert className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Platform Admin Portal</h2>
          <p className="text-xs text-slate-500">
            For Civil Supplies & Welfare verification review and audit compliance.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Administrative Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Access Security Key</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Enter Administrator Console</span>
          </button>
        </form>

        <div className="text-center text-[11px] text-slate-400 pt-2">
          Demo Admin Credentials: <code className="bg-slate-100 px-1 py-0.5 rounded">admin@foodloop.org</code> / <code className="bg-slate-100 px-1 py-0.5 rounded">admin2026</code>
        </div>
      </div>
    </div>
  );
};
