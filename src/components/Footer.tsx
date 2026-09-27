import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Heart, Leaf } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate, currentUser } = useApp();

  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                F
              </div>
              <span className="font-bold text-slate-900 text-base">FoodLoop AI</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              Smart Food Donation, Redistribution & Recipient Coordination Platform connecting verified institutional and community donors with orphanages and elder care homes.
            </p>
            <div className="flex items-center gap-2 text-slate-500 pt-1">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero Avoidable Food Waste</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-900">Platform</h4>
            <ul className="space-y-1.5 text-slate-500">
              <li>
                <button onClick={() => navigate('how_it_works')} className="hover:text-emerald-700">
                  How FoodLoop AI Works
                </button>
              </li>
              <li>
                <button onClick={() => navigate('impact')} className="hover:text-emerald-700">
                  Impact Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (!currentUser) navigate('login_donor');
                    else if (currentUser.role === 'donor') navigate('donate_food');
                  }}
                  className="hover:text-emerald-700"
                >
                  Donate Surplus Food
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (!currentUser) navigate('login_consumer');
                    else if (currentUser.role === 'consumer') navigate('consumer_dashboard');
                  }}
                  className="hover:text-emerald-700"
                >
                  Discover Available Meals
                </button>
              </li>
            </ul>
          </div>

          {/* Verification & Standards */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-900">Safety & Trust</h4>
            <ul className="space-y-1.5 text-slate-500">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>NITI Aayog & NGO Darpan Verification</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>FSSAI License Compliance</span>
              </li>
              <li>
                <span>Strict Meal Safe Windows (Evening 8:30 PM cutoff)</span>
              </li>
              <li>
                <span>Temperature & Hygiene Declarations</span>
              </li>
            </ul>
          </div>

          {/* Demonstration Notice */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-900">Pilot & Prototype</h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              Demonstration prototype built for Smart India Hackathon (SIH) and academic presentation. Live verification pilot active for Narasaraopet & Palnadu region.
            </p>
            <div className="pt-1">
              {!currentUser && (
                <button
                  onClick={() => navigate('login_admin')}
                  className="text-slate-400 hover:text-slate-600 text-[11px]"
                >
                  Administrator Portal
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <div>
            © 2026 FoodLoop AI. All rights reserved. Turning surplus food into shared meals.
          </div>
          <div className="flex items-center gap-4">
            <span>Prototype Demonstration Mode</span>
            <span>·</span>
            <span>Narasaraopet Hub</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
