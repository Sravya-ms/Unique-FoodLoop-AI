import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowRight,
  ShieldCheck,
  Clock,
  MapPin,
  Sparkles,
  Heart,
  Truck,
  Building2,
  Users,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Soup,
  TrendingUp,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { navigate, t } = useApp();

  return (
    <div className="space-y-20 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-b from-emerald-50/60 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Quiet text kicker instead of badge */}
            <div className="text-xs font-semibold tracking-wider text-emerald-800 uppercase">
              Smart Redistribution Platform · Verified Ecosystem
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight text-balance leading-tight">
              FoodLoop AI <br />
              <span className="text-emerald-700">“Turning Surplus Food Into Shared Meals.”</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto text-balance leading-relaxed">
              Connect surplus food with verified organizations before it becomes waste. A transparent, time-sensitive, and location-aware food coordination network.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={() => navigate('login_donor')}
                className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
              >
                <span>{t('btn_donate_food')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('login_consumer')}
                className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 rounded-lg font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>{t('btn_find_food')}</span>
              </button>

              <button
                onClick={() => navigate('how_it_works')}
                className="w-full sm:w-auto px-5 py-3.5 text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors flex items-center justify-center"
              >
                <span>{t('btn_how_it_works')}</span>
              </button>
            </div>

            {/* Notice for Academic & Prototype evaluation */}
            <div className="text-[12px] text-slate-400 pt-2">
              <span>Smart India Hackathon (SIH) & University Prototype Demonstration</span>
            </div>
          </div>

          {/* Hero Visual Flow: Donor -> FoodLoop AI -> Verified Org -> Food Delivered */}
          <div className="mt-14 max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <div className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-6">
              Verified Core Lifecycle Flow
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-slate-900">1. Verified Donor</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  College mess, hotel or caterer announces fresh surplus batch
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-slate-900">2. FoodLoop AI</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Time-bounded matching, overbooking prevention & notifications
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                  <Users className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-slate-900">3. Verified Recipient</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Orphanage or old-age home places official request
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-slate-900">4. Handover & Receipt</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Uber/Rapido or self-transport handover confirmed
                </div>
              </div>
            </div>
          </div>

          {/* Stat Cards Adhering to quantitative proof adjacency */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <div className="bg-white p-5 rounded-xl border border-slate-200 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">27+</div>
              <div className="text-xs font-medium text-slate-500 mt-1">{t('stat_food_donations')}</div>
              <div className="text-[10px] text-emerald-700 mt-1">Narasaraopet & Regional Canteens</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-700 tabular-nums">3,420+</div>
              <div className="text-xs font-medium text-slate-500 mt-1">{t('stat_plates_redistributed')}</div>
              <div className="text-[10px] text-slate-400 mt-1">Nutritious meals safely shared</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">18</div>
              <div className="text-xs font-medium text-slate-500 mt-1">{t('stat_verified_donors')}</div>
              <div className="text-[10px] text-emerald-700 mt-1">FSSAI / Mess Verified</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">24</div>
              <div className="text-xs font-medium text-slate-500 mt-1">{t('stat_verified_orgs')}</div>
              <div className="text-[10px] text-emerald-700 mt-1">NGO Darpan Verified Care Homes</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. How FoodLoop AI Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            Deterministic Coordination
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mt-1">
            How FoodLoop AI Works
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Every step is governed by strict verification, safe time windows, and real-time quantity accounting to prevent overbooking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-base">
              01
            </div>
            <h3 className="font-bold text-slate-900 text-base">Announce Within Window</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Donors input plate counts, menu items, and location. FoodLoop calculates the strict availability window based on meal period rules (e.g. Lunch until 3:30 PM, Evening until 8:30 PM).
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-base">
              02
            </div>
            <h3 className="font-bold text-slate-900 text-base">Discover & Official Request</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Verified orphanages and old-age homes receive instant proximity alerts. The system calculates requirements (e.g. 85 residents + up to 10 buffer plates) and places an official request.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-base">
              03
            </div>
            <h3 className="font-bold text-slate-900 text-base">Direct Chat & Handover</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Once accepted, a private coordination chat opens automatically. Transport is coordinated via on-demand couriers (Uber Parcel/Rapido) or self-pickup, followed by signed receipt confirmation.
            </p>
          </div>
        </div>
      </section>

      {/* 3. For Food Donors & For Recipient Homes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Donors Card */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 space-y-6">
            <div>
              <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                For Food Donors
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                Colleges, Caterers, Restaurants & Citizens
              </h3>
              <p className="text-xs text-slate-600 mt-2">
                Whether you run an engineering college canteen, manage a wedding banquet, or have surplus food from a private gathering, FoodLoop gives you an instant, dignified redistribution channel.
              </p>
            </div>

            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Institutional & Individual Accounts:</strong> Register with verified FSSAI credentials or valid email identity.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Quantity Governance:</strong> Manage original vs. reserved vs. remaining plates with automated overbooking guard.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Decisive Control:</strong> Review recipient details, resident count, and choose to Accept or Decline with complete transparency.</span>
              </li>
            </ul>

            <button
              onClick={() => navigate('login_donor')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 rounded-lg transition-colors"
            >
              <span>Access Donor Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Consumers Card */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 space-y-6">
            <div>
              <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                For Food Consumers
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                Orphanages & Old-Age Homes
              </h3>
              <p className="text-xs text-slate-600 mt-2">
                Exclusively reserved for verified shelters, children's homes, and senior citizen residences. Receive hot, hygienic, wholesome meals for your residents without uncertainty.
              </p>
            </div>

            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Verified Organization Only:</strong> Vetted through NITI Aayog NGO Darpan, Trust Deeds, and District Welfare records.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Smart Requirement Match:</strong> Specify your exact resident count and receive up to 10 safety buffer plates when food is plentiful.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Dual Logistics Options:</strong> Arrange your own vehicle or book integrated on-demand couriers (Uber Parcel / Rapido / Porter).</span>
              </li>
            </ul>

            <button
              onClick={() => navigate('login_consumer')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2.5 rounded-lg transition-colors"
            >
              <span>Access Recipient Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Time-Sensitive Donations & Updated 8:30 PM Evening Cutoff */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-2xl space-y-4">
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Safe-Use Window Governance
            </div>
            <h2 className="text-3xl font-bold tracking-tight">
              Strict Time-Bound Distribution Windows
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Food safety requires strict time windows. FoodLoop AI implements automated deadline enforcement across all four meal periods, including our updated <strong>8:30 PM Evening cutoff</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <div className="text-xs text-slate-400">Breakfast Window</div>
              <div className="text-lg font-bold text-white mt-1">Until 10:30 AM</div>
              <div className="text-[11px] text-slate-400 mt-2">Normal cutoff: 10:00 AM · Late window: 10:00–10:30 AM</div>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <div className="text-xs text-slate-400">Lunch Window</div>
              <div className="text-lg font-bold text-white mt-1">Until 03:30 PM</div>
              <div className="text-[11px] text-slate-400 mt-2">Normal cutoff: 3:00 PM · Late window: 3:00–3:30 PM</div>
            </div>

            <div className="bg-emerald-950/80 p-4 rounded-xl border border-emerald-500/50 ring-1 ring-emerald-500">
              <div className="flex items-center justify-between text-xs text-emerald-300">
                <span>Evening Window</span>
                <span className="text-[10px] bg-emerald-800 text-emerald-100 px-1.5 py-0.5 rounded">UPDATED</span>
              </div>
              <div className="text-lg font-bold text-white mt-1">Until 08:30 PM</div>
              <div className="text-[11px] text-emerald-200 mt-2">Normal cutoff: 8:00 PM · Late window: 8:00–8:30 PM</div>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <div className="text-xs text-slate-400">Dinner Window</div>
              <div className="text-lg font-bold text-white mt-1">Until 10:45 PM</div>
              <div className="text-[11px] text-slate-400 mt-2">Normal cutoff: 10:15 PM · Late window: 10:15–10:45 PM</div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs text-amber-300 bg-amber-950/40 p-3 rounded-lg border border-amber-900/50">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Orders cannot be initiated once the cut-off passes. Ongoing requests accepted within the time frame proceed normally through handover.
            </span>
          </div>
        </div>
      </section>

      {/* 5. AI-Powered Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            Machine Intelligence
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mt-1">
            AI-Powered Surplus & Logistics Optimization
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            AI enhances matching speed, predicts mess surplus before waste occurs, and guides recipient organizations without compromising transactional determinism.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <TrendingUp className="w-8 h-8 text-emerald-600 mb-3" />
            <h4 className="font-bold text-slate-900 text-base">Surplus Prediction</h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Analyzes historical campus mess cycles, weekend banquet schedules, and holiday trends to forecast surplus volume 3–4 hours ahead of meal completion.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <Scale className="w-8 h-8 text-blue-600 mb-3" />
            <h4 className="font-bold text-slate-900 text-base">Smart Recipient Matching</h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Dynamically matches donations with shelters based on travel distance, resident headcount, dietary requirements (veg/jain), and historical capacity.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <Truck className="w-8 h-8 text-amber-600 mb-3" />
            <h4 className="font-bold text-slate-900 text-base">Logistics & Route Optimization</h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Recommends optimal courier dispatch (Uber Parcel, Rapido, or NGO van) with live transit timeline, ETA calculations, and vehicle tracking.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Safety & Verification Workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 sm:p-10">
          <div className="max-w-2xl mb-8">
            <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              Trust & Governance Architecture
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              No Unverified Participants in Core Transactions
            </h3>
            <p className="text-xs text-slate-600 mt-2">
              To safeguard children and senior citizens, verification is never granted based on official-sounding emails alone. Every institution undergoes formal review.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <div className="text-[11px] font-bold text-slate-400">Step 1</div>
              <div className="text-xs font-bold text-slate-900 mt-1">Registration</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Email & Phone verification</div>
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <div className="text-[11px] font-bold text-slate-400">Step 2</div>
              <div className="text-xs font-bold text-slate-900 mt-1">Institution Details</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Location & resident census</div>
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <div className="text-[11px] font-bold text-slate-400">Step 3</div>
              <div className="text-xs font-bold text-slate-900 mt-1">Document Submission</div>
              <div className="text-[10px] text-slate-500 mt-0.5">FSSAI / NGO Darpan / Trust</div>
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <div className="text-[11px] font-bold text-slate-400">Step 4</div>
              <div className="text-xs font-bold text-slate-900 mt-1">Admin Audit</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Review by Welfare team</div>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="text-[11px] font-bold text-emerald-700">Step 5</div>
              <div className="text-xs font-bold text-emerald-900 mt-1">✓ Verified Badge</div>
              <div className="text-[10px] text-emerald-700 mt-0.5">Full ecosystem access</div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-emerald-700 text-white rounded-3xl p-10 sm:p-14 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Prevent Food Waste in Your Community?
          </h2>
          <p className="text-emerald-100 max-w-xl mx-auto text-xs sm:text-sm leading-relaxed">
            Join verified educational institutions, banquets, restaurants, orphanages, and elder care homes across the region on FoodLoop AI.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('register_donor')}
              className="w-full sm:w-auto px-6 py-3.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
            >
              Register as Donor
            </button>
            <button
              onClick={() => navigate('register_consumer')}
              className="w-full sm:w-auto px-6 py-3.5 bg-emerald-800 text-white hover:bg-emerald-900 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Register as Recipient Home
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
