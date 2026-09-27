import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../db/roomDatabase';
import { checkDonationTimeStatus, formatTimeRemaining } from '../utils/timeWindows';
import { FoodDonation } from '../types';
import {
  Search,
  Filter,
  ShieldCheck,
  Clock,
  MapPin,
  Utensils,
  ArrowRight,
  Truck,
  MessageSquare,
  AlertTriangle,
  Users,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export const ConsumerDashboard: React.FC = () => {
  const { currentUser, navigate, t } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMeal, setFilterMeal] = useState<string>('all');
  const [filterMinPlates, setFilterMinPlates] = useState<number>(0);

  if (!currentUser) return null;

  // Retrieve active donations & consumer requests from Room Database
  const allDonations = db.donationDao.getAll();
  const myRequests = db.requestDao.getByConsumerId(currentUser.id);

  const activeRequests = myRequests.filter(
    (r) => r.status !== 'completed' && r.status !== 'declined' && r.status !== 'cancelled'
  );

  const peopleRequiringFood = currentUser.residentCount || 85;
  const foodReceivedCount =
    (currentUser.stats?.foodReceived || 0) +
    myRequests.filter((r) => r.status === 'completed').length;

  // Search & Filter Logic
  const filteredDonations = allDonations.filter((donation) => {
    // Exclude completed or cancelled donations
    if (donation.status === 'completed' || donation.status === 'cancelled') return false;

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchMenu = donation.menuItems.some((item) => item.toLowerCase().includes(q));
      const matchDonor = donation.donorName.toLowerCase().includes(q);
      const matchLocation = donation.city.toLowerCase().includes(q) || donation.area.toLowerCase().includes(q);
      const matchMeal = donation.mealPeriod.toLowerCase().includes(q);
      const matchPlates = donation.remainingPlates.toString().includes(q);

      if (!matchMenu && !matchDonor && !matchLocation && !matchMeal && !matchPlates) {
        return false;
      }
    }

    // Filter Meal
    if (filterMeal !== 'all' && donation.mealPeriod !== filterMeal) {
      return false;
    }

    // Filter Min Plates
    if (filterMinPlates > 0 && donation.remainingPlates < filterMinPlates) {
      return false;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-700">
            Recipient Welfare Operations
          </div>
          <div className="flex items-center gap-2 mt-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Good Morning, {currentUser.institutionName || currentUser.name}
            </h1>
            {currentUser.verificationStatus === 'verified' ? (
              <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                Verified Organization
              </span>
            ) : (
              <span className="inline-flex items-center text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                Verification Pending
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {currentUser.residentCount} Permanent Residents · {currentUser.city}, {currentUser.district}
          </p>
        </div>

        {activeRequests.length > 0 && (
          <button
            onClick={() => navigate('order_tracking', { requestId: activeRequests[0].id })}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs flex items-center gap-2 shadow-xs transition-colors"
          >
            <Truck className="w-4 h-4" />
            <span>Track Active Handover ({activeRequests[0].requestedPlates} plates)</span>
          </button>
        )}
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500">People Requiring Food</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {peopleRequiringFood} Residents
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Registered care census</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500">Active Requests</div>
          <div className="text-2xl font-bold text-blue-600 mt-1 tabular-nums">
            {activeRequests.length}
          </div>
          <div className="text-[11px] text-blue-700 mt-1">Under approval / dispatch</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500">Food Received (Times)</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1 tabular-nums">
            {foodReceivedCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Confirmed meal consignments</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500">Successful Receipts</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {foodReceivedCount}
          </div>
          <div className="text-[11px] text-emerald-700 mt-1">100% verified distribution</div>
        </div>
      </div>

      {/* Active Requests Highlight Banner if any */}
      {activeRequests.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <div className="font-bold text-blue-950">
                Active Order: {activeRequests[0].id} from {activeRequests[0].donorName}
              </div>
              <div className="text-blue-800">
                {activeRequests[0].requestedPlates} Plates · Status: {activeRequests[0].status.toUpperCase()}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('order_tracking', { requestId: activeRequests[0].id })}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold text-xs transition-colors"
            >
              View Order Tracking
            </button>
          </div>
        </div>
      )}

      {/* Search & Food Discovery Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search donations... (e.g. rice, lunch, 100 plates, Narasaraopet)"
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Meal filter buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold overflow-x-auto">
            {['all', 'breakfast', 'lunch', 'evening', 'dinner'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setFilterMeal(m)}
                className={`px-3 py-1.5 rounded-md capitalize transition-colors ${
                  filterMeal === m ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {m === 'all' ? 'All Meals' : m}
              </button>
            ))}
          </div>
        </div>

        {/* Quick plate filter chips */}
        <div className="flex items-center gap-2 text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span className="text-[11px] font-medium text-slate-400">Min Plates:</span>
          {[0, 30, 50, 80, 100].map((min) => (
            <button
              key={min}
              type="button"
              onClick={() => setFilterMinPlates(min)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                filterMinPlates === min
                  ? 'bg-blue-100 text-blue-800 font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {min === 0 ? 'Any' : `${min}+ plates`}
            </button>
          ))}
          <span className="text-[11px] text-slate-400 ml-auto hidden sm:inline">
            Showing {filteredDonations.length} available batches
          </span>
        </div>
      </div>

      {/* Main Section: Nearby Food Donations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Nearby Surplus Food Batches</h2>
            <p className="text-xs text-slate-500">
              Only verified care homes can place official requests within safe-consumption windows.
            </p>
          </div>
        </div>

        {filteredDonations.length === 0 ? (
          <div className="bg-white p-12 rounded-xl border border-slate-200 text-center space-y-3">
            <Utensils className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">No Matching Surplus Food Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search filters or check back shortly as institutional messes announce meals after service.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDonations.map((don) => {
              const timeStatus = checkDonationTimeStatus(don.availableUntil, don.expiresAtIso);
              const isExpired = timeStatus.isExpired;

              return (
                <div
                  key={don.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="p-5 space-y-3">
                    {/* Top Row */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold uppercase tracking-wider text-slate-600 text-[10px]">
                        🍱 {don.foodQuantity} Plates ({don.remainingPlates} Remaining)
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                          isExpired
                            ? 'bg-rose-100 text-rose-800'
                            : timeStatus.isLateWindow
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isExpired
                          ? 'Donation Closed'
                          : timeStatus.isLateWindow
                          ? '⚠ Late Window'
                          : 'Available'}
                      </span>
                    </div>

                    {/* Donor Info */}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-slate-900 text-base">{don.donorName}</h3>
                        {don.isDonorVerified && (
                          <span className="text-emerald-700 font-semibold text-xs flex items-center">
                            <ShieldCheck className="w-3.5 h-3.5 mr-0.5" />
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span>2.4 km away</span>
                        <span>·</span>
                        <span>{don.area}, {don.city}</span>
                      </div>
                    </div>

                    {/* Menu items preview */}
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs">
                      <div className="text-[10px] uppercase font-semibold text-slate-400 mb-1">
                        Menu Contents
                      </div>
                      <div className="text-slate-800 font-medium">
                        {don.menuItems.join(' • ')}
                      </div>
                    </div>

                    {/* Meal Period & Availability */}
                    <div className="space-y-1 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          Meal: <strong className="capitalize">{don.mealPeriod}</strong> · Available until{' '}
                          <strong>{don.availableUntil}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Late Window Warning */}
                    {timeStatus.isLateWindow && !isExpired && (
                      <div className="flex items-center gap-1.5 text-[11px] text-amber-800 bg-amber-50 p-2 rounded border border-amber-200">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Closing shortly. Immediate request recommended.</span>
                      </div>
                    )}
                  </div>

                  {/* Card Action */}
                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">
                      {don.remainingPlates > 0 ? `${don.remainingPlates} plates left` : 'Fully reserved'}
                    </span>
                    <button
                      onClick={() => navigate('donation_details', { donationId: don.id })}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <span>{t('btn_view_details')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
