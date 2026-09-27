import React from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../db/roomDatabase';
import {
  Heart,
  Leaf,
  Droplets,
  TrendingUp,
  ShieldCheck,
  Building2,
  Users,
  Award,
  ArrowRight,
  PieChart,
} from 'lucide-react';

export const ImpactDashboard: React.FC = () => {
  const { navigate } = useApp();
  const stats = db.adminDao.getStats();

  // Environmental impact calculations based on standard UNEP & FAO conversion factors:
  // ~0.4 kg average surplus meal per plate
  // ~2.5 kg CO2e saved per kg of avoided cooked food waste
  // ~1,000 liters water saved per kg of wholesome food
  const totalPlates = stats.totalPlatesRedistributed;
  const foodSavedKg = Math.round(totalPlates * 0.4);
  const co2AvoidedKg = Math.round(foodSavedKg * 2.5);
  const waterSavedLiters = Math.round(foodSavedKg * 950);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="max-w-3xl space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
          Redistribution & Sustainability Metrics
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          FoodLoop AI Impact Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Measuring the real-world humanitarian and environmental outcome of connecting surplus catering and campus food with verified orphanages and elder care homes.
        </p>
      </div>

      {/* Primary Outcome Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Plates Redistributed</span>
            <Heart className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tabular-nums">
            {totalPlates.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            +100% Verified nutritious meals
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Surplus Rescued</span>
            <Leaf className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-700 tabular-nums">
            {foodSavedKg.toLocaleString()} kg
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Cooked food diverted from landfills
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>CO₂e Avoided</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tabular-nums">
            {co2AvoidedKg.toLocaleString()} kg
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Greenhouse gas emissions mitigated
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Water Conserved</span>
            <Droplets className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-3xl font-extrabold text-cyan-700 tabular-nums">
            {(waterSavedLiters / 1000).toFixed(1)}k L
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Agricultural water footprint saved
          </div>
        </div>
      </div>

      {/* Ecosystem Participation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>Verified Donors</span>
          </div>
          <div className="text-3xl font-bold text-slate-900 tabular-nums">
            {stats.verifiedDonors} Donors
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Educational campus messes, banquet halls, and commercial catering companies verified with FSSAI licenses.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Users className="w-4 h-4 text-blue-600" />
            <span>Verified Care Shelters</span>
          </div>
          <div className="text-3xl font-bold text-slate-900 tabular-nums">
            {stats.verifiedConsumers} Homes
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Registered orphanages, children's shelters, and senior citizen old-age homes across the Palnadu district.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Award className="w-4 h-4 text-amber-600" />
            <span>Redistribution Success Rate</span>
          </div>
          <div className="text-3xl font-bold text-slate-900 tabular-nums">
            96.2%
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Donated surplus accepted and confirmed received with verified digital signatures and audit logging.
          </p>
        </div>
      </div>

      {/* Visual Meal Period Breakdown & Logistics Mode Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meal Period Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Meal Period Redistribution Distribution
            </h3>
            <p className="text-xs text-slate-500">
              Breakdown of surplus meals shared across daily service cycles.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-slate-700">Lunch Surplus (12:00 PM – 3:30 PM)</span>
                <span className="font-bold text-slate-900 tabular-nums">1,820 plates (53%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '53%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-slate-700">Evening Surplus (4:30 PM – 8:30 PM cutoff)</span>
                <span className="font-bold text-slate-900 tabular-nums">850 plates (25%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '25%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-slate-700">Dinner Surplus (7:30 PM – 10:45 PM)</span>
                <span className="font-bold text-slate-900 tabular-nums">510 plates (15%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '15%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-slate-700">Breakfast (7:00 AM – 10:30 AM)</span>
                <span className="font-bold text-slate-900 tabular-nums">240 plates (7%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-slate-400 h-full rounded-full" style={{ width: '7%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Transport & Redistribution Mode Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Handover & Transport Preferences
            </h3>
            <p className="text-xs text-slate-500">
              Balancing on-demand logistics with organization self-transport.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-slate-700">On-Demand Courier (Uber / Rapido / Porter)</span>
                <span className="font-bold text-slate-900 tabular-nums">64%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '64%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-slate-700">Self Collection (Shelter Vehicle / Volunteers)</span>
                <span className="font-bold text-slate-900 tabular-nums">28%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '28%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-slate-700">Donor Direct Delivery</span>
                <span className="font-bold text-slate-900 tabular-nums">8%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-slate-400 h-full rounded-full" style={{ width: '8%' }} />
              </div>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-400 leading-normal border-t border-slate-100">
            Average fulfillment window: <strong>34 minutes</strong> from donor announcement to dining hall receipt.
          </div>
        </div>
      </div>

      {/* Prototype Disclosure Note */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 flex items-center justify-between">
        <span>
          Metrics represent demonstration statistics based on the FoodLoop AI pilot in Narasaraopet.
        </span>
        <button
          onClick={() => navigate('landing')}
          className="text-emerald-700 font-semibold hover:underline shrink-0"
        >
          Return to Home →
        </button>
      </div>
    </div>
  );
};
