import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../db/roomDatabase';
import { User, FoodDonation, FoodRequest, AuditLog } from '../types';
import {
  ShieldAlert,
  ShieldCheck,
  Building2,
  Users,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  Search,
  Eye,
  AlertCircle,
  Activity,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { navigate, showToast, showConfirm } = useApp();
  const [activeTab, setActiveTab] = useState<'verifications' | 'donations' | 'requests' | 'audit_logs'>('verifications');
  const [selectedUserForModal, setSelectedUserForModal] = useState<User | null>(null);

  const stats = db.adminDao.getStats();
  const allUsers = db.userDao.getAll();
  const pendingUsers = db.userDao.getPendingVerifications();
  const allDonations = db.donationDao.getAll();
  const allRequests = db.requestDao.getAll();
  const auditLogs = db.adminDao.getAuditLogs();

  const handleApprove = (userId: string) => {
    db.userDao.updateVerification(userId, 'verified', 'Approved by State Welfare Administration.');
    showToast('Organization verified successfully! Green ✓ badge issued.', 'success');
    setSelectedUserForModal(null);
  };

  const handleReject = (userId: string) => {
    showConfirm({
      title: 'Reject Organization Application',
      message: 'Reject this application? The applicant will be informed to re-submit valid official documents.',
      confirmLabel: 'Reject Application',
      cancelLabel: 'Cancel',
      onConfirm: () => {
        db.userDao.updateVerification(userId, 'rejected', 'Verification failed due to documentation discrepancy.');
        showToast('Application marked as Rejected.', 'info');
        setSelectedUserForModal(null);
      },
    });
  };

  const handleClarification = (userId: string) => {
    db.userDao.updateVerification(userId, 'pending', 'Clarification requested: Please provide updated affiliation certificate or renewal.');
    showToast('Clarification request dispatched to applicant.', 'info');
    setSelectedUserForModal(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Civil Supplies & Social Welfare Oversight
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            FoodLoop AI Administrator Console
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Regional Hub: Narasaraopet & Palnadu District · Real-time verification audit
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">System Status:</span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            All Services Active
          </span>
        </div>
      </div>

      {/* Top Cards Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-[11px] text-slate-500">Donors (Reg / Verified)</div>
          <div className="text-xl font-bold text-slate-900 mt-1 tabular-nums">
            {stats.registeredDonors} / <span className="text-emerald-700">{stats.verifiedDonors}</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Campus & caterers</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-[11px] text-slate-500">Care Homes (Reg / Verified)</div>
          <div className="text-xl font-bold text-slate-900 mt-1 tabular-nums">
            {stats.registeredConsumers} / <span className="text-blue-700">{stats.verifiedConsumers}</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Orphanages & elder care</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-[11px] text-slate-500">Pending Verifications</div>
          <div className="text-xl font-bold text-amber-600 mt-1 tabular-nums">
            {stats.pendingVerifications}
          </div>
          <div className="text-[10px] text-amber-700 mt-0.5">Awaiting audit review</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-[11px] text-slate-500">Today's Available Plates</div>
          <div className="text-xl font-bold text-slate-900 mt-1 tabular-nums">
            {stats.todayPlatesAvailable}
          </div>
          <div className="text-[10px] text-emerald-700 mt-0.5">Surplus in safe window</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-[11px] text-slate-500">Pending Food Requests</div>
          <div className="text-xl font-bold text-slate-900 mt-1 tabular-nums">
            {stats.pendingRequests}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Awaiting donor acceptance</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-semibold gap-6">
        <button
          onClick={() => setActiveTab('verifications')}
          className={`pb-3 transition-colors flex items-center gap-1.5 ${
            activeTab === 'verifications'
              ? 'border-b-2 border-emerald-600 text-emerald-800'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Pending Verifications</span>
          {pendingUsers.length > 0 && (
            <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[10px]">
              {pendingUsers.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('donations')}
          className={`pb-3 transition-colors ${
            activeTab === 'donations'
              ? 'border-b-2 border-emerald-600 text-emerald-800'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          All Food Donations ({allDonations.length})
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`pb-3 transition-colors ${
            activeTab === 'requests'
              ? 'border-b-2 border-emerald-600 text-emerald-800'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Consignment Requests ({allRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('audit_logs')}
          className={`pb-3 transition-colors ${
            activeTab === 'audit_logs'
              ? 'border-b-2 border-emerald-600 text-emerald-800'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          System Audit Trail ({auditLogs.length})
        </button>
      </div>

      {/* TAB 1: Verification Queue */}
      {activeTab === 'verifications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Pending Organization Verification Queue
            </h2>
            <span className="text-xs text-slate-500">
              {pendingUsers.length} applicants awaiting review
            </span>
          </div>

          {pendingUsers.length === 0 ? (
            <div className="bg-white p-12 rounded-xl border border-slate-200 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">All Verifications Cleared</h3>
              <p className="text-xs text-slate-500">
                There are no pending donor or consumer registration audits in the queue.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingUsers.map((u) => (
                <div
                  key={u.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 hover:shadow-xs transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-base">{u.name}</h3>
                        <span className="text-xs px-2 py-0.5 rounded font-semibold capitalize bg-amber-50 text-amber-800 border border-amber-200">
                          {u.role === 'donor' ? `${u.donorType} Donor` : `${u.consumerType} Recipient`}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Email: {u.email} · Phone: {u.phone} · Location: {u.city}, {u.district}
                      </div>
                      {u.residentCount && (
                        <div className="text-xs text-blue-700 font-medium mt-0.5">
                          Permanent Census: {u.residentCount} Residents
                        </div>
                      )}
                    </div>

                    <span className="text-xs text-slate-400">
                      Submitted: {u.documents[0]?.uploadedAt || 'Recently'}
                    </span>
                  </div>

                  {/* Submitted Documents list */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <div className="text-[11px] font-semibold uppercase text-slate-400">
                      Submitted Verification Documents
                    </div>
                    {u.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg text-xs border border-slate-100"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <span className="font-medium text-slate-800">{doc.title}</span>
                          <span className="text-slate-400">({doc.fileName} · {doc.fileSize})</span>
                        </div>
                        <span className="text-amber-700 font-medium">Pending Review</span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2">
                    <button
                      onClick={() => handleClarification(u.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50"
                    >
                      Request Clarification
                    </button>
                    <button
                      onClick={() => handleReject(u.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-rose-700 border border-rose-300 rounded-lg hover:bg-rose-50"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(u.id)}
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve (Issue ✓ Verified)</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: All Donations */}
      {activeTab === 'donations' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden text-xs">
          <div className="p-4 border-b border-slate-200 font-bold text-slate-900">
            Master Donation Registry
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Donor</th>
                  <th className="p-3">Meal</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Remaining</th>
                  <th className="p-3">Available Until</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allDonations.map((don) => (
                  <tr key={don.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-mono text-slate-600">{don.id}</td>
                    <td className="p-3 font-medium text-slate-900">{don.donorName}</td>
                    <td className="p-3 capitalize">{don.mealPeriod}</td>
                    <td className="p-3 tabular-nums">{don.foodQuantity} plates</td>
                    <td className="p-3 tabular-nums font-bold text-emerald-700">{don.remainingPlates}</td>
                    <td className="p-3 font-mono">{don.availableUntil}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded font-semibold text-[10px] bg-slate-100 capitalize">
                        {don.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => navigate('donation_details', { donationId: don.id })}
                        className="text-emerald-700 hover:underline font-semibold"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: All Requests */}
      {activeTab === 'requests' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden text-xs">
          <div className="p-4 border-b border-slate-200 font-bold text-slate-900">
            Master Consignment & Handover Requests
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Request ID</th>
                  <th className="p-3">Recipient Organization</th>
                  <th className="p-3">Source Donor</th>
                  <th className="p-3">Plates</th>
                  <th className="p-3">Transport Mode</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-mono font-bold text-slate-800">{req.id}</td>
                    <td className="p-3 font-medium text-slate-900">{req.consumerName}</td>
                    <td className="p-3 text-slate-700">{req.donorName}</td>
                    <td className="p-3 tabular-nums font-bold">{req.requestedPlates} plates</td>
                    <td className="p-3 capitalize">{req.transportPreference.replace('_', ' ')}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded font-semibold text-[10px] bg-emerald-100 text-emerald-800 capitalize">
                        {req.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => navigate('order_tracking', { requestId: req.id })}
                        className="text-blue-700 hover:underline font-semibold"
                      >
                        Live Tracking
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Audit Logs */}
      {activeTab === 'audit_logs' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden text-xs">
          <div className="p-4 border-b border-slate-200 font-bold text-slate-900">
            Immutable Audit Trail & Activity Logs
          </div>
          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3.5 hover:bg-slate-50 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                      {log.action}
                    </span>
                    <span className="font-semibold text-slate-800">{log.actorName}</span>
                    <span className="text-slate-400 capitalize">({log.actorRole})</span>
                  </div>
                  <p className="text-slate-600 mt-1">{log.details}</p>
                </div>
                <span className="text-slate-400 font-mono text-[11px] shrink-0">
                  {log.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
