import React from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../db/roomDatabase';
import {
  Bell,
  Clock,
  CheckCircle2,
  Truck,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { currentUser, userNotifications, navigate } = useApp();

  if (!currentUser) return null;

  const handleMarkAllRead = () => {
    db.notificationDao.markAllAsRead(currentUser.id);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'new_donation':
        return <Bell className="w-5 h-5 text-emerald-600" />;
      case 'urgent_expiry':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'request_accepted':
      case 'food_received':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'delivery_update':
        return <Truck className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Strictly isolated alerts for {currentUser.name} ({currentUser.role}).
          </p>
        </div>

        {userNotifications.length > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-3">
        {userNotifications.length === 0 ? (
          <div className="bg-white p-12 rounded-xl border border-slate-200 text-center text-xs text-slate-400">
            No notifications at this time.
          </div>
        ) : (
          userNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                notif.isRead
                  ? 'bg-white border-slate-200 text-slate-700'
                  : 'bg-emerald-50/40 border-emerald-200 ring-1 ring-emerald-100 text-slate-900'
              }`}
            >
              <div className="p-2 rounded-lg bg-white border border-slate-200 shrink-0">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs">{notif.title}</h4>
                  <span className="text-[10px] text-slate-400">{notif.createdAt}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>

                {(notif.donationId || notif.requestId) && (
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        if (notif.requestId) {
                          navigate('order_tracking', { requestId: notif.requestId });
                        } else if (notif.donationId) {
                          navigate('donation_details', { donationId: notif.donationId });
                        }
                      }}
                      className="text-xs font-semibold text-emerald-700 hover:underline inline-flex items-center gap-1"
                    >
                      <span>View details</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
