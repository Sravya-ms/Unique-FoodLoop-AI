import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../db/roomDatabase';
import { FoodRequest } from '../types';
import { ChatModal } from '../components/ChatModal';
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  MessageSquare,
  Phone,
  ArrowRight,
  Package,
  Calendar,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const OrderTrackingScreen: React.FC = () => {
  const { activeRequest, currentUser, navigate } = useApp();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // Fallback to active demo request if not selected
  const req: FoodRequest | undefined =
    activeRequest || db.requestDao.getAll()[0];

  if (!req) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">No Active Order Found</h2>
        <button
          onClick={() => navigate(currentUser?.role === 'donor' ? 'donor_dashboard' : 'consumer_dashboard')}
          className="text-emerald-700 font-semibold text-xs hover:underline"
        >
          ← Return to Dashboard
        </button>
      </div>
    );
  }

  const timelineSteps = [
    { label: 'REQUESTED', key: 'requested', desc: 'Official request submitted' },
    { label: 'ACCEPTED', key: 'accepted', desc: 'Donor approved batch reservation' },
    { label: 'READY FOR PICKUP', key: 'ready_for_pickup', desc: 'Packed in thermal containers' },
    { label: 'PICKUP / TRANSIT', key: 'in_transit', desc: 'Courier / self vehicle on route' },
    { label: 'RECEIVED', key: 'received', desc: 'Shelter confirmed delivery' },
    { label: 'COMPLETED', key: 'completed', desc: 'Redistributed & audited' },
  ];

  const currentStepIndex = req.deliveryDetails?.currentStepIndex || 0;

  const handleSimulateNextStep = () => {
    const nextIdx = Math.min(timelineSteps.length - 1, currentStepIndex + 1);
    db.requestDao.updateTrackingStep(req.id, nextIdx);
  };

  const handleConfirmReceipt = () => {
    db.requestDao.confirmReceipt(req.id);
    setShowConfirmModal(false);
    navigate('impact');
  };

  const isConsumer = currentUser?.role === 'consumer' || currentUser?.id === req.consumerId;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Live Logistics Tracking
            </span>
            <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              {req.id}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            {req.requestedPlates} Plates Consignment
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Donor: <strong className="text-slate-800">{req.donorName}</strong> → Recipient:{' '}
            <strong className="text-slate-800">{req.consumerName}</strong>
          </p>
        </div>

        {/* Coordination Chat Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowChat(true)}
            className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>Direct Coordination Chat</span>
          </button>

          {isConsumer && req.status !== 'completed' && (
            <button
              onClick={() => setShowConfirmModal(true)}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
            >
              Food Received
            </button>
          )}
        </div>
      </div>

      {/* Visual Timeline (Prompt Section 17 Specification) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            Handover Lifecycle Progression
          </h3>
          <span className="text-xs text-slate-400">Real-time status updates</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {timelineSteps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={step.key}
                className={`p-3.5 rounded-xl border text-center transition-all ${
                  isCurrent
                    ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20 shadow-xs'
                    : isCompleted
                    ? 'border-emerald-200 bg-white text-slate-700'
                    : 'border-slate-100 bg-slate-50/50 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-center mb-2">
                  {isCompleted ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                      ✓
                    </div>
                  ) : isCurrent ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold animate-pulse">
                      ●
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border border-slate-300 text-slate-400 flex items-center justify-center text-xs">
                      ○
                    </div>
                  )}
                </div>
                <div className="text-[11px] font-bold uppercase tracking-tight text-slate-900">
                  {step.label}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                  {step.desc}
                </div>
              </div>
            );
          })}
        </div>

        {/* Prototype simulation control */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px]">
            Demonstration mode: Simulate progressive status changes
          </span>
          <button
            onClick={handleSimulateNextStep}
            disabled={currentStepIndex >= timelineSteps.length - 1}
            className="text-emerald-700 font-semibold hover:underline disabled:opacity-40"
          >
            Advance to Next Tracking Step →
          </button>
        </div>
      </div>

      {/* Courier & Vehicle Live Telemetry Card */}
      {req.deliveryDetails && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">Transport Vehicle & Dispatch</h3>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Method</span>
                <span className="font-semibold text-slate-900 capitalize">
                  {req.transportPreference.replace('_', ' ')}
                  {req.courierProvider && ` (${req.courierProvider.replace('_', ' ')})`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Rider / Driver</span>
                <span className="font-semibold text-slate-900">
                  {req.deliveryDetails.riderName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Vehicle Number</span>
                <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {req.deliveryDetails.vehicleNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Vehicle Type</span>
                <span className="font-medium text-slate-700">
                  {req.deliveryDetails.vehicleType}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Route Distance & Handover</h3>

            <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Transit Distance</span>
                <span className="font-bold text-slate-900 tabular-nums">
                  {req.deliveryDetails.estimatedDistanceKm} km
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Estimated Transport Cost</span>
                <span className="font-bold text-emerald-700 tabular-nums">
                  ₹{req.deliveryDetails.estimatedCostInr}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Delivery Contact</span>
                <span className="font-medium text-slate-800 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  {req.deliveryDetails.riderPhone}
                </span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-[11px] text-emerald-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Verified courier protocol: Handover PIN and receipt signature required upon arrival.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal when clicking "FOOD RECEIVED" */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 text-center">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">
                Confirm Food Receipt
              </h3>
              <p className="text-xs text-slate-500">
                Please verify that the meal portions have arrived safely at your facility.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-slate-500">Quantity Received:</span>
                <span className="font-bold text-slate-900">{req.requestedPlates} plates</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Source Donor:</span>
                <span className="font-medium text-slate-800">{req.donorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Receiving Shelter:</span>
                <span className="font-medium text-slate-800">{req.consumerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Receipt Date:</span>
                <span className="font-medium text-slate-800">{new Date().toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReceipt}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm transition-colors"
              >
                Confirm Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Direct Coordination Chat */}
      {showChat && (
        <ChatModal
          request={req}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
};
