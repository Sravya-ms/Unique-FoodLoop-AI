import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../db/roomDatabase';
import { FoodDonation, FoodRequest } from '../types';
import { checkDonationTimeStatus } from '../utils/timeWindows';
import { ChatModal } from '../components/ChatModal';
import {
  PlusCircle,
  ShieldCheck,
  Clock,
  MapPin,
  Utensils,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Truck,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const DonorDashboard: React.FC = () => {
  const { currentUser, navigate, showToast, showConfirm } = useApp();
  const [activeChatRequest, setActiveChatRequest] = useState<FoodRequest | null>(null);

  if (!currentUser) return null;

  // Retrieve donor donations and requests from Room Database
  const myDonations = db.donationDao.getByDonorId(currentUser.id);
  const myRequests = db.requestDao.getByDonorId(currentUser.id);

  const activeDonations = myDonations.filter(
    (d) => d.status !== 'completed' && d.status !== 'cancelled' && d.status !== 'expired'
  );

  const pendingRequests = myRequests.filter((r) => r.status === 'pending');
  const acceptedRequests = myRequests.filter((r) => r.status !== 'pending' && r.status !== 'declined');

  // Stats calculation
  const totalDonations = (currentUser.stats?.totalDonations || 0) + myDonations.length;
  const totalPlatesDonated =
    (currentUser.stats?.totalPlates || 0) +
    myDonations.reduce((acc, d) => acc + d.foodQuantity, 0);
  const successfulRedistributions =
    (currentUser.stats?.successfulRedistributions || 0) +
    myDonations.filter((d) => d.status === 'completed').length;

  const handleAcceptRequest = (requestId: string) => {
    const success = db.requestDao.acceptRequest(requestId);
    if (!success) {
      showToast('Unable to accept: Not enough remaining plates available in this batch.', 'error');
    } else {
      showToast('Request accepted! Real-time coordination chat is now active.', 'success');
      const updatedReq = db.requestDao.getById(requestId);
      if (updatedReq) {
        setActiveChatRequest(updatedReq);
      }
    }
  };

  const handleDeclineRequest = (requestId: string) => {
    showConfirm({
      title: 'Decline Food Request',
      message: 'Are you sure you want to decline this request? The care shelter will be notified to discover alternative nearby donations.',
      confirmLabel: 'Decline Request',
      cancelLabel: 'Keep Pending',
      onConfirm: () => {
        db.requestDao.declineRequest(requestId, 'Unable to fulfill at this hour.');
        showToast('Request was declined.', 'info');
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            Donor Operations Console
          </div>
          <div className="flex items-center gap-2 mt-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Good Morning, {currentUser.institutionName || currentUser.name}
            </h1>
            {currentUser.verificationStatus === 'verified' ? (
              <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                Verified Donor
              </span>
            ) : (
              <span className="inline-flex items-center text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                Verification Pending
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {currentUser.city}, {currentUser.district} · {currentUser.address}
          </p>
        </div>

        {/* Main CTA: + Donate Food */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('donate_food')}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs uppercase tracking-wider shadow-sm hover:shadow transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Donate Food</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500">Total Donations</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {totalDonations}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Campus & banquet records</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500">Total Plates Donated</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1 tabular-nums">
            {totalPlatesDonated.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Wholesome portions delivered</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500">Successful Redistributions</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {successfulRedistributions}
          </div>
          <div className="text-[11px] text-emerald-700 mt-1">Confirmed with receipt</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500">Active Live Batches</div>
          <div className="text-2xl font-bold text-amber-600 mt-1 tabular-nums">
            {activeDonations.length}
          </div>
          <div className="text-[11px] text-amber-700 mt-1">Within safe availability window</div>
        </div>
      </div>

      {/* Recent Requests Needing Donor Action */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Food Requests</h2>
            <p className="text-xs text-slate-500">
              Verified recipient orphanages & elder care homes requesting surplus plates.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {pendingRequests.length} Pending Approval
          </span>
        </div>

        {myRequests.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-xs text-slate-400">
            No requests received yet. Publish a food batch to notify nearby verified homes.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myRequests.map((req) => {
              const isPending = req.status === 'pending';
              const isAccepted = req.status !== 'pending' && req.status !== 'declined';

              return (
                <div
                  key={req.id}
                  className={`bg-white rounded-xl border p-5 space-y-4 transition-shadow ${
                    isPending ? 'border-amber-300 ring-1 ring-amber-100 shadow-sm' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 text-sm">{req.consumerName}</span>
                        <span className="inline-flex items-center text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                          <ShieldCheck className="w-3 h-3 mr-0.5" />
                          Verified
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Request ID: <span className="font-mono">{req.id}</span> · {req.residentCount} Residents
                      </div>
                    </div>

                    <span
                      className={`text-xs px-2.5 py-1 rounded-md font-semibold capitalize ${
                        req.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : req.status === 'declined'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {req.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Plates Details */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-lg text-xs">
                    <div>
                      <div className="text-[10px] text-slate-400">Requested</div>
                      <div className="font-bold text-slate-900 tabular-nums">
                        {req.requestedPlates} plates
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Residents</div>
                      <div className="font-bold text-slate-900 tabular-nums">
                        {req.residentCount} people
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Logistics Mode</div>
                      <div className="font-semibold text-slate-700 capitalize">
                        {req.transportPreference.replace('_', ' ')}
                      </div>
                    </div>
                  </div>

                  {req.notes && (
                    <div className="text-xs text-slate-600 italic bg-amber-50/50 p-2.5 rounded border border-amber-100/60">
                      "{req.notes}"
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    {isPending ? (
                      <div className="flex items-center gap-2 w-full">
                        <button
                          onClick={() => handleAcceptRequest(req.id)}
                          className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Accept Request</span>
                        </button>
                        <button
                          onClick={() => handleDeclineRequest(req.id)}
                          className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full">
                        <button
                          onClick={() => setActiveChatRequest(req)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Coordination Chat</span>
                        </button>

                        <button
                          onClick={() => navigate('order_tracking', { requestId: req.id })}
                          className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 font-medium"
                        >
                          <span>Track Handover</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Active Donations Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Active Donations & Menu</h2>
            <p className="text-xs text-slate-500">
              Live batches currently discoverable by verified recipient organizations.
            </p>
          </div>
          <button
            onClick={() => navigate('history')}
            className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold"
          >
            View Complete History →
          </button>
        </div>

        {myDonations.length === 0 ? (
          <div className="bg-white p-12 rounded-xl border border-slate-200 text-center space-y-3">
            <Utensils className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">No Active Surplus Batches</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Announce fresh surplus meals from today's cooking before the time window closes.
            </p>
            <button
              onClick={() => navigate('donate_food')}
              className="px-4 py-2 bg-emerald-600 text-white font-semibold text-xs rounded-lg"
            >
              + Create First Donation
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myDonations.map((don) => {
              const timeStatus = checkDonationTimeStatus(don.availableUntil, don.expiresAtIso);
              return (
                <div
                  key={don.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between"
                >
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold uppercase tracking-wider text-slate-500 text-[10px]">
                        {don.mealPeriod}
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                          timeStatus.isLateWindow
                            ? 'bg-amber-100 text-amber-800'
                            : don.remainingPlates === 0
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {timeStatus.isLateWindow
                          ? '⚠ Late Window'
                          : don.remainingPlates === 0
                          ? 'Fully Reserved'
                          : `${don.remainingPlates} Plates Remaining`}
                      </span>
                    </div>

                    <div>
                      <div className="text-xl font-bold text-slate-900 tabular-nums">
                        {don.foodQuantity} Plates Total
                      </div>
                      <div className="text-xs text-slate-500">
                        {don.reservedPlates} reserved · {don.remainingPlates} unreserved
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="space-y-1">
                      <div className="text-[10px] font-semibold uppercase text-slate-400">
                        Menu Items
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {don.menuItems.map((item, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Timings */}
                    <div className="pt-2 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Available until: <strong>{don.availableUntil}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{don.pickupAddress}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">Status: {don.status}</span>
                    <button
                      onClick={() => navigate('donation_details', { donationId: don.id })}
                      className="text-emerald-700 font-semibold hover:underline"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Direct Coordination Chat Modal */}
      {activeChatRequest && (
        <ChatModal
          request={activeChatRequest}
          onClose={() => setActiveChatRequest(null)}
        />
      )}
    </div>
  );
};
