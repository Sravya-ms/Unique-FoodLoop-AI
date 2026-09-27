import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, MapPin, Calendar, FileText, Phone, Mail, Users, Building2, CheckCircle2 } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { currentUser, navigate, logout } = useApp();

  if (!currentUser) return null;

  const isDonor = currentUser.role === 'donor';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-2xl shadow-sm">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">{currentUser.name}</h1>
                {currentUser.verificationStatus === 'verified' && (
                  <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    Verified Organization
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {currentUser.city}, {currentUser.district}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Joined {currentUser.joinedYear}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isDonor ? (
              <>
                <button
                  onClick={() => navigate('donate_food')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Donate Food
                </button>
                <button
                  onClick={() => navigate('history')}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Donation History
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('consumer_dashboard')}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Find Food
                </button>
                <button
                  onClick={() => navigate('history')}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Request History
                </button>
              </>
            )}
          </div>
        </div>

        {/* Statistical Records (Exact metrics from prompt) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {isDonor ? (
            <>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-500">Food Donations</div>
                <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
                  {currentUser.stats?.totalDonations || 27}
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-500">Total Plates Donated</div>
                <div className="text-2xl font-bold text-emerald-700 mt-1 tabular-nums">
                  {(currentUser.stats?.totalPlates || 3420).toLocaleString()}
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-500">Successful Redistributions</div>
                <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
                  {currentUser.stats?.successfulRedistributions || 25}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-500">Permanent Residents</div>
                <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
                  {currentUser.residentCount || 85}
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-500">Food Requests Placed</div>
                <div className="text-2xl font-bold text-blue-700 mt-1 tabular-nums">
                  {currentUser.stats?.foodRequests || 42}
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-500">Successful Receipts</div>
                <div className="text-2xl font-bold text-emerald-700 mt-1 tabular-nums">
                  {currentUser.stats?.foodReceived || 39}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Verification Credentials & Documents */}
        <div className="space-y-3 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Verified Compliance Documents
            </h3>
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Audited by Social Welfare Admin
            </span>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 text-xs">
            {currentUser.documents.length === 0 ? (
              <div className="p-4 text-slate-400">No documents on file.</div>
            ) : (
              currentUser.documents.map((doc) => (
                <div key={doc.id} className="p-3.5 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <div>
                      <div className="font-semibold text-slate-800">{doc.title}</div>
                      <div className="text-[11px] text-slate-400">
                        {doc.fileName} · {doc.fileSize} · Uploaded {doc.uploadedAt}
                      </div>
                    </div>
                  </div>
                  <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                    ✓ Approved
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-2 pt-4 border-t border-slate-200 text-xs text-slate-600">
          <h3 className="font-bold text-slate-900 text-sm mb-2">Registered Contact Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>Email: <strong className="text-slate-800">{currentUser.email}</strong></div>
            <div>Phone: <strong className="text-slate-800">{currentUser.phone}</strong></div>
            <div>Full Address: <strong className="text-slate-800">{currentUser.address}</strong></div>
            <div>State: <strong className="text-slate-800">{currentUser.state}</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};
