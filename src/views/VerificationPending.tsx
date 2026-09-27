import React from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../db/roomDatabase';
import { Clock, ShieldAlert, FileText, CheckCircle2, ArrowRight } from 'lucide-react';

export const VerificationPending: React.FC = () => {
  const { currentUser, logout, navigate } = useApp();

  if (!currentUser) return null;

  // Demo shortcut for evaluators to instantly approve their own test account
  const handleInstantApprove = () => {
    db.userDao.updateVerification(currentUser.id, 'verified', 'Fast-track verification approved for SIH prototype demo.');
    if (currentUser.role === 'donor') {
      navigate('donor_dashboard');
    } else if (currentUser.role === 'consumer') {
      navigate('consumer_dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
          <Clock className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Verification Pending
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Administrative Review in Progress
          </h2>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            Thank you, <strong>{currentUser.name}</strong>. To ensure food safety and protect recipient orphanages and elder care homes, our welfare administration audits every registered profile.
          </p>
        </div>

        {/* Uploaded Documents List */}
        <div className="bg-slate-50 rounded-xl p-4 text-left border border-slate-200 space-y-2">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Submitted Documentation
          </div>
          {currentUser.documents.length === 0 ? (
            <div className="text-xs text-slate-400">No documents attached.</div>
          ) : (
            currentUser.documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-200 text-xs"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-800">{doc.title}</div>
                    <div className="text-[10px] text-slate-400">{doc.fileName} · {doc.fileSize}</div>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  Under Audit
                </span>
              </div>
            ))
          )}
        </div>

        {/* Demo Fast-Track Button */}
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-2">
          <div className="font-bold flex items-center justify-center gap-1.5 text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Prototype Fast-Track Review</span>
          </div>
          <p className="text-[11px] text-emerald-700">
            In evaluation mode, you can immediately simulate administrative approval to test the donation or request workflow.
          </p>
          <button
            onClick={handleInstantApprove}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Simulate Admin Approval (Instant ✓ Verified)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="pt-2 flex items-center justify-center gap-4 text-xs">
          <button
            onClick={() => navigate('profile')}
            className="text-slate-600 hover:text-slate-900 font-medium"
          >
            Review Profile
          </button>
          <span>·</span>
          <button
            onClick={logout}
            className="text-rose-700 hover:text-rose-800 font-medium"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
