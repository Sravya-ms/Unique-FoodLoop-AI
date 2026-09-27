import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../db/roomDatabase';
import { Calendar, Search, Filter, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const HistoryView: React.FC = () => {
  const { currentUser, navigate } = useApp();
  const [filterQuery, setFilterQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  if (!currentUser) return null;

  const isDonor = currentUser.role === 'donor';

  const records = isDonor
    ? db.donationDao.getByDonorId(currentUser.id)
    : db.requestDao.getByConsumerId(currentUser.id);

  const filtered = records.filter((item: any) => {
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase();
      const matchText = (item.menuItems?.join(' ') || item.donorName || item.consumerName || item.id || '').toLowerCase();
      if (!matchText.includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isDonor ? 'Donation History & Lifecycle' : 'Food Request History'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Archived records of surplus food consignments and receipts.
          </p>
        </div>

        {isDonor && (
          <button
            onClick={() => navigate('donate_food')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs"
          >
            + New Donation
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Search history by ID, menu, or institution..."
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none text-slate-700"
        >
          <option value="all">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="accepted">Accepted</option>
          <option value="pending">Pending</option>
          <option value="published">Published</option>
        </select>
      </div>

      {/* Table List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden text-xs">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            No history records matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Reference ID</th>
                  <th className="p-3.5">{isDonor ? 'Meal & Menu' : 'Source Donor'}</th>
                  <th className="p-3.5">Plates</th>
                  <th className="p-3.5">Date & Time</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item: any) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-mono text-slate-700 font-bold">{item.id}</td>
                    <td className="p-3.5">
                      {isDonor ? (
                        <div>
                          <span className="font-semibold capitalize text-slate-900">{item.mealPeriod}</span>
                          <span className="text-slate-500 ml-2">({item.menuItems?.slice(0, 2).join(', ')}...)</span>
                        </div>
                      ) : (
                        <div className="font-medium text-slate-900">{item.donorName}</div>
                      )}
                    </td>
                    <td className="p-3.5 tabular-nums font-bold text-slate-900">
                      {item.requestedPlates || item.foodQuantity} plates
                    </td>
                    <td className="p-3.5 text-slate-500">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Today'}
                    </td>
                    <td className="p-3.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded capitalize">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <button
                        onClick={() => {
                          if (isDonor) {
                            navigate('donation_details', { donationId: item.id });
                          } else {
                            navigate('order_tracking', { requestId: item.id });
                          }
                        }}
                        className="text-emerald-700 font-semibold hover:underline"
                      >
                        Inspect →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
