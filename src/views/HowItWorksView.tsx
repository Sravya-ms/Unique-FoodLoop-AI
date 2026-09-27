import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Clock,
  ShieldCheck,
  Building2,
  Users,
  Truck,
  Heart,
  Scale,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const HowItWorksView: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
          Architecture & Protocol
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          How FoodLoop AI Works
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          From institutional catering surplus to recipient dining tables: A transparent, time-sensitive, and location-aware food coordination system.
        </p>
      </div>

      {/* The 4 Core Stages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
            01
          </div>
          <h3 className="text-lg font-bold text-slate-900">1. Verification & Identity Audit</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            No anonymous accounts interact in core transactions. Institutional donors upload FSSAI food safety licenses and university canteen affiliations. Recipient orphanages and old-age homes submit NITI Aayog NGO Darpan IDs or registered Trust Deeds. State welfare administrators audit and issue the green <strong>✓ Verified</strong> badge.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
            02
          </div>
          <h3 className="text-lg font-bold text-slate-900">2. Time-Bound Announcement</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Surplus food has a strict safe consumption window. Donors declare meal period (Breakfast, Lunch, Evening until 8:30 PM cutoff, Dinner) and plate quantity. The platform calculates safe distribution deadlines. During the final 30 minutes, a visible <strong>⚠ Late Donation Window</strong> warning is highlighted.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm">
            03
          </div>
          <h3 className="text-lg font-bold text-slate-900">3. Requirement Matching & Overbooking Guard</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Verified shelters discover nearby food batches within 25 km. The system recommends their exact resident count plus up to 10 additional buffer plates when surplus allows. Real-time plate subtraction prevents overbooking (e.g. 100 plates divided into 60 + 30 + 10 across multiple verified homes).
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-sm">
            04
          </div>
          <h3 className="text-lg font-bold text-slate-900">4. Live Coordination Chat & Handover</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            When the donor clicks Accept, a direct real-time chat channel activates immediately. The recipient coordinates transport via on-demand couriers (Uber Parcel / Rapido / Porter) or self-collection. Upon dining hall delivery, the recipient confirms receipt, updating verifiable impact metrics.
          </p>
        </div>
      </div>

      {/* Strict Window Table */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-bold">Standard Configured Safe-Use Windows</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-slate-400 border-b border-slate-800">
              <tr>
                <th className="pb-2">Meal Period</th>
                <th className="pb-2">Typical Service</th>
                <th className="pb-2">Normal Order Cutoff</th>
                <th className="pb-2">Hard Safe Deadline</th>
                <th className="pb-2">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              <tr>
                <td className="py-2.5 font-bold text-white">Breakfast</td>
                <td className="py-2.5">07:00 AM – 09:30 AM</td>
                <td className="py-2.5">10:00 AM</td>
                <td className="py-2.5 text-emerald-400 font-bold">10:30 AM</td>
                <td className="py-2.5 text-slate-400">Morning messes & hostels</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-white">Lunch</td>
                <td className="py-2.5">12:30 PM – 02:30 PM</td>
                <td className="py-2.5">03:00 PM</td>
                <td className="py-2.5 text-emerald-400 font-bold">03:30 PM</td>
                <td className="py-2.5 text-slate-400">Largest daily volume</td>
              </tr>
              <tr className="bg-emerald-950/40">
                <td className="py-2.5 font-bold text-emerald-300">Evening Snacks</td>
                <td className="py-2.5">04:30 PM – 07:30 PM</td>
                <td className="py-2.5">08:00 PM</td>
                <td className="py-2.5 text-emerald-400 font-bold">08:30 PM</td>
                <td className="py-2.5 text-emerald-300">Updated from 9:30 to 8:30 PM</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-white">Dinner</td>
                <td className="py-2.5">07:30 PM – 10:00 PM</td>
                <td className="py-2.5">10:15 PM</td>
                <td className="py-2.5 text-emerald-400 font-bold">10:45 PM</td>
                <td className="py-2.5 text-slate-400">Night catering & wedding halls</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Action CTA */}
      <div className="text-center pt-4">
        <button
          onClick={() => navigate('landing')}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-sm"
        >
          Return to FoodLoop AI Home
        </button>
      </div>
    </div>
  );
};
