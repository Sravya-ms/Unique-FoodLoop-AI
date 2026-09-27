import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../db/roomDatabase';
import { checkDonationTimeStatus, formatTimeRemaining } from '../utils/timeWindows';
import { FoodRequest, TransportPreference } from '../types';
import {
  ShieldCheck,
  Clock,
  MapPin,
  Utensils,
  Truck,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const DonationDetailsScreen: React.FC = () => {
  const { activeDonation, currentUser, navigate, showToast } = useApp();

  const residentCount = currentUser?.residentCount || 85;

  // Recommended extra calculation: up to 10 extra plates if available
  const availableRemaining = activeDonation ? activeDonation.remainingPlates : 0;
  const initialRecommended = Math.min(availableRemaining, residentCount + Math.min(10, Math.max(0, availableRemaining - residentCount)));

  const [requestedPlates, setRequestedPlates] = useState<number>(initialRecommended || residentCount);
  const [transportPref, setTransportPref] = useState<TransportPreference>('on_demand_courier');
  const [courierProvider, setCourierProvider] = useState<'uber_parcel' | 'rapido' | 'porter'>('uber_parcel');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!activeDonation) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Donation Not Found</h2>
        <button
          onClick={() => navigate('consumer_dashboard')}
          className="text-emerald-700 font-semibold text-xs hover:underline"
        >
          ← Return to Available Food
        </button>
      </div>
    );
  }

  const timeStatus = checkDonationTimeStatus(activeDonation.availableUntil, activeDonation.expiresAtIso);
  const isExpired = timeStatus.isExpired;

  // Maximum allowed request cannot exceed available remaining
  const maxAllowed = Math.min(activeDonation.remainingPlates, residentCount + 10);

  const handlePlaceRequest = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      showToast('Please log in as a verified recipient organization to place a request.', 'warning');
      navigate('login_consumer');
      return;
    }

    if (currentUser.verificationStatus !== 'verified') {
      showToast('Access Restricted: Only verified organizations with approved documents can place food requests.', 'warning');
      navigate('verification_pending');
      return;
    }

    // Time window enforcement rule:
    // "The consumer should only order in the given time, If the time had completed then the consumer cannot proceed by doing any request."
    if (isExpired) {
      showToast(`This donation closed at ${activeDonation.availableUntil}. New requests can no longer be accepted for this batch.`, 'error');
      return;
    }

    if (requestedPlates <= 0 || requestedPlates > activeDonation.remainingPlates) {
      showToast(`Invalid quantity: Only ${activeDonation.remainingPlates} plates remain available.`, 'error');
      return;
    }

    setSubmitting(true);

    const newRequestId = `FL-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    const newRequest: FoodRequest = {
      id: newRequestId,
      donationId: activeDonation.id,
      consumerId: currentUser.id,
      consumerName: currentUser.name,
      consumerType: currentUser.consumerType || 'old_age_home',
      isConsumerVerified: true,
      donorId: activeDonation.donorId,
      donorName: activeDonation.donorName,
      residentCount,
      requestedPlates,
      recommendedExtraPlates: Math.max(0, requestedPlates - residentCount),
      status: 'pending', // Flow: REQUESTED -> DONOR ACCEPTANCE -> CONFIRMED
      transportPreference: transportPref,
      courierProvider: transportPref === 'on_demand_courier' ? courierProvider : undefined,
      deliveryDetails: {
        trackingCode: `TRK-${Date.now().toString().slice(-6)}`,
        riderName: courierProvider === 'uber_parcel' ? 'K. Venkatesh (Verified Courier)' : 'S. Ramesh (Verified Rider)',
        riderPhone: '+91 98855 44332',
        vehicleType: courierProvider === 'porter' ? 'Tata Ace Mini Van' : 'Electric Cargo Three-Wheeler',
        vehicleNumber: 'AP 07 TX 4590',
        estimatedDistanceKm: 2.4,
        estimatedCostInr: transportPref === 'on_demand_courier' ? (courierProvider === 'porter' ? 120 : 65) : 0,
        currentProgressPercent: 15,
        currentStepIndex: 0, // Requested
      },
      requestedAt: new Date().toISOString(),
      notes: notes.trim() || undefined,
    };

    const inserted = db.requestDao.insert(newRequest);
    setSubmitting(false);

    if (inserted) {
      showToast(`Official request ${newRequestId} submitted! The donor will review and accept shortly.`, 'success');
      navigate('order_tracking', { requestId: newRequestId });
    } else {
      showToast('Request failed: Insufficient remaining plates.', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <button
        onClick={() => navigate('consumer_dashboard')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Available Food</span>
      </button>

      {/* Main Details Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header Banner */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-emerald-50/60 to-slate-50 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                Surplus Batch Overview
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 flex items-center gap-2">
                <span>{activeDonation.donorName}</span>
                {activeDonation.isDonorVerified && (
                  <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-white px-2 py-0.5 rounded shadow-2xs">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    Verified Donor
                  </span>
                )}
              </h1>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{activeDonation.area}, {activeDonation.city}</span>
                <span>·</span>
                <span>2.4 km away</span>
              </div>
            </div>

            <div className="sm:text-right bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-2xl font-black text-emerald-700 tabular-nums">
                {activeDonation.remainingPlates} Plates
              </div>
              <div className="text-[11px] text-slate-500">
                Available of {activeDonation.foodQuantity} original
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Menu Items */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Declared Menu Contents
            </h3>
            <div className="flex flex-wrap gap-2">
              {activeDonation.menuItems.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-800 flex items-center gap-1.5"
                >
                  <Utensils className="w-3 h-3 text-emerald-600" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Time & Availability */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Meal Period</div>
              <div className="font-bold text-slate-900 capitalize text-sm mt-0.5">
                {activeDonation.mealPeriod}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Availability Deadline</div>
              <div className="font-bold text-slate-900 text-sm mt-0.5">
                Available until: {activeDonation.availableUntil}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Safe Window Status</div>
              <div className="mt-0.5">
                {isExpired ? (
                  <span className="font-bold text-rose-700">Donation Closed</span>
                ) : timeStatus.isLateWindow ? (
                  <span className="font-bold text-amber-700">⚠ Late Donation Window</span>
                ) : (
                  <span className="font-bold text-emerald-700">Active & Fresh</span>
                )}
              </div>
            </div>
          </div>

          {/* Dispatch instructions */}
          {activeDonation.specialInstructions && (
            <div className="text-xs bg-amber-50/70 p-3 rounded-xl border border-amber-200 text-amber-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Donor Packaging Note:</strong> {activeDonation.specialInstructions}
              </span>
            </div>
          )}

          {/* Request Form */}
          <form onSubmit={handlePlaceRequest} className="border-t border-slate-200 pt-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Place Official Organization Request
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                A request requires formal donor approval before logistics dispatch is activated.
              </p>
            </div>

            {/* Smart Recommendation */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Permanent People / Residents Requiring Food
                  </label>
                  <div className="text-sm font-bold text-slate-900 bg-white px-3.5 py-2.5 rounded-lg border border-slate-300">
                    [ {residentCount} ] Residents
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Requested Plates
                    </label>
                    <span className="text-[11px] text-emerald-700 font-medium">
                      Recommended: {Math.min(activeDonation.remainingPlates, residentCount + 5)} plates
                    </span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max={activeDonation.remainingPlates}
                    required
                    value={requestedPlates}
                    onChange={(e) => setRequestedPlates(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                  <div className="text-[11px] text-slate-500 mt-1">
                    Maximum request available right now: <strong>{activeDonation.remainingPlates} plates</strong>
                  </div>
                </div>
              </div>

              {/* Recommendation Explanation */}
              <div className="flex items-center gap-2 text-[11px] text-slate-600 bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>
                  The system recommends required residents ({residentCount}) + up to 10 additional buffer plates when food is available. Additional plates are never forced.
                </span>
              </div>
            </div>

            {/* Transport Options */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700">
                Select Pickup / Transport Method *
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Option 1: On-demand courier */}
                <div
                  onClick={() => setTransportPref('on_demand_courier')}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    transportPref === 'on_demand_courier'
                      ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">
                      Option 1 — Book On-Demand Courier
                    </span>
                    <Truck className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Integrated partner dispatch with live route and rider details.
                  </p>
                  <div className="mt-2 text-xs font-semibold text-blue-800">
                    Estimated: 2.4 km · ₹65
                  </div>

                  {transportPref === 'on_demand_courier' && (
                    <div className="mt-3 pt-2 border-t border-blue-200/60 flex gap-2">
                      {(['uber_parcel', 'rapido', 'porter'] as const).map((prov) => (
                        <button
                          key={prov}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCourierProvider(prov);
                          }}
                          className={`text-[10px] px-2 py-1 rounded font-semibold capitalize transition-colors ${
                            courierProvider === prov
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-slate-700 border border-slate-200'
                          }`}
                        >
                          {prov.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Option 2: Self collection */}
                <div
                  onClick={() => setTransportPref('self_pickup')}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    transportPref === 'self_pickup'
                      ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">
                      Option 2 — We Will Collect (Self Transport)
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Our organization van or volunteer team collects directly from donor campus.
                  </p>
                  <div className="mt-2 text-xs font-semibold text-emerald-800">
                    No courier cost (Self arranged)
                  </div>
                </div>
              </div>
            </div>

            {/* Coordination Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Coordination Message for Donor (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. For our senior care residents. We will carry 4 stainless steel buckets."
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Action Button */}
            <div className="pt-2">
              {isExpired ? (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg text-center font-semibold">
                  This donation window closed at {activeDonation.availableUntil}. New requests cannot be placed.
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={submitting || requestedPlates > activeDonation.remainingPlates}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>Place Official Request ({requestedPlates} Plates)</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
