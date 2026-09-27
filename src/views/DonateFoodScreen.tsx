import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../db/roomDatabase';
import { MEAL_PERIOD_CONFIGS } from '../utils/timeWindows';
import { MealPeriod, FoodDonation } from '../types';
import {
  Utensils,
  Clock,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Camera,
  Soup,
} from 'lucide-react';

export const DonateFoodScreen: React.FC = () => {
  const { currentUser, navigate, showToast } = useApp();

  const [step, setStep] = useState<number>(1);

  // Form State
  const [mealPeriod, setMealPeriod] = useState<MealPeriod>('lunch');
  const [plates, setPlates] = useState<number>(100);
  const [menuItems, setMenuItems] = useState<string[]>([
    'Steamed Rice',
    'Dal Tadka / Pappu',
    'Vegetable Curry',
    'Fresh Curd',
  ]);
  const [newItemInput, setNewItemInput] = useState('');
  const [city, setCity] = useState(currentUser?.city || 'Narasaraopet');
  const [area, setArea] = useState(currentUser?.address?.split(',')[0] || 'Kotappakonda Road');
  const [pickupAddress, setPickupAddress] = useState(
    currentUser?.address || 'Central Campus Mess, Block C, Narasaraopet'
  );
  const [specialInstructions, setSpecialInstructions] = useState(
    'Packed in high-grade insulated thermal canisters. Bring clean vessels for transfer.'
  );

  // Safety Confirmation
  const [safetyHygienic, setSafetyHygienic] = useState(true);
  const [safetyStored, setSafetyStored] = useState(true);
  const [safetyWindow, setSafetyWindow] = useState(true);
  const [safetyNoContamination, setSafetyNoContamination] = useState(true);
  const [safetyAccurate, setSafetyAccurate] = useState(true);

  if (!currentUser) return null;

  // Selected meal config
  const currentConfig = MEAL_PERIOD_CONFIGS[mealPeriod];

  const handleAddMenuItem = () => {
    if (newItemInput.trim() && !menuItems.includes(newItemInput.trim())) {
      setMenuItems([...menuItems, newItemInput.trim()]);
      setNewItemInput('');
    }
  };

  const handleRemoveMenuItem = (index: number) => {
    setMenuItems(menuItems.filter((_, i) => i !== index));
  };

  const allSafetyConfirmed =
    safetyHygienic && safetyStored && safetyWindow && safetyNoContamination && safetyAccurate;

  const handlePublish = () => {
    const expiresDate = new Date();
    // Configure default expiry window
    if (mealPeriod === 'breakfast') expiresDate.setHours(10, 30, 0, 0);
    else if (mealPeriod === 'lunch') expiresDate.setHours(15, 30, 0, 0);
    else if (mealPeriod === 'evening') expiresDate.setHours(20, 30, 0, 0); // 8:30 PM cutoff
    else if (mealPeriod === 'dinner') expiresDate.setHours(22, 45, 0, 0);

    const newDonation: FoodDonation = {
      id: `don-${Date.now()}`,
      donorId: currentUser.id,
      donorName: currentUser.name,
      donorType: currentUser.donorType || 'institutional',
      institutionName: currentUser.institutionName || currentUser.name,
      isDonorVerified: currentUser.verificationStatus === 'verified',
      mealPeriod,
      foodQuantity: Number(plates),
      reservedPlates: 0,
      remainingPlates: Number(plates),
      foodType: 'veg',
      menuItems,
      city,
      area,
      pickupAddress,
      coordinates: { lat: 16.2359, lng: 80.0496 },
      announcementTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      normalDeadline: currentConfig.normalDeadline,
      availableUntil: currentConfig.lateWindowDeadline,
      expiresAtIso: expiresDate.toISOString(),
      isLateWindow: false,
      safetyCertifications: {
        hygienicPrep: safetyHygienic,
        storedProperly: safetyStored,
        safeWindow: safetyWindow,
        noContamination: safetyNoContamination,
        accurateInfo: safetyAccurate,
      },
      status: 'published',
      createdAt: new Date().toISOString(),
      specialInstructions,
    };

    db.donationDao.insert(newDonation);
    showToast('Food donation announced successfully! Nearby verified recipient homes have been alerted.', 'success');
    navigate('donor_dashboard');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span>Step {step} of 7</span>
          <span className="font-semibold text-emerald-800">
            {step === 1 && 'Meal Period'}
            {step === 2 && 'Food Quantity'}
            {step === 3 && 'Menu Details'}
            {step === 4 && 'Location & Address'}
            {step === 5 && 'Availability Window'}
            {step === 6 && 'Safety Confirmation'}
            {step === 7 && 'Review & Publish'}
          </span>
        </div>
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-600 h-full transition-all duration-300"
            style={{ width: `${(step / 7) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Step 1: Meal Period */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Step 1 — Meal Period</h2>
              <p className="text-xs text-slate-500 mt-1">
                Select the meal category. Timings and cutoff windows adapt automatically.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {(Object.keys(MEAL_PERIOD_CONFIGS) as MealPeriod[]).map((periodKey) => {
                const config = MEAL_PERIOD_CONFIGS[periodKey];
                const isSelected = mealPeriod === periodKey;

                return (
                  <button
                    key={periodKey}
                    type="button"
                    onClick={() => setMealPeriod(periodKey)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm capitalize">
                        {config.name}
                      </span>
                      {periodKey === 'evening' && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                          Cutoff: 8:30 PM
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{config.description}</div>
                    <div className="mt-2 text-[11px] text-slate-400 font-mono">
                      Safe until {config.lateWindowDeadline}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Food Quantity */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Step 2 — Food Quantity</h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter the number of full meal plates available. (Weight measurement is not mandatory).
              </p>
            </div>

            <div className="pt-4 max-w-sm mx-auto text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setPlates(Math.max(10, plates - 10))}
                  className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-lg"
                >
                  -
                </button>
                <div className="relative">
                  <input
                    type="number"
                    min="5"
                    max="5000"
                    value={plates}
                    onChange={(e) => setPlates(parseInt(e.target.value, 10) || 0)}
                    className="w-32 py-3 text-center text-3xl font-extrabold text-slate-900 border-2 border-emerald-500 rounded-xl focus:outline-none"
                  />
                  <span className="block text-[11px] text-slate-400 mt-1 font-semibold uppercase">
                    Plates
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPlates(plates + 10)}
                  className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-lg"
                >
                  +
                </button>
              </div>

              {/* Quick presets */}
              <div className="flex items-center justify-center gap-2 pt-2">
                {[50, 75, 100, 150, 200].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setPlates(preset)}
                    className={`px-3 py-1 text-xs rounded-md font-semibold transition-colors ${
                      plates === preset
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Food Menu */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Step 3 — Food Menu Items</h2>
              <p className="text-xs text-slate-500 mt-1">
                List the specific food items prepared in this batch for recipient awareness.
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newItemInput}
                onChange={(e) => setNewItemInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddMenuItem();
                  }
                }}
                placeholder="Type item (e.g. Vegetable Pulao, Sambar, Curd...)"
                className="flex-1 px-3.5 py-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddMenuItem}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            {/* Common tags */}
            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              <span className="text-slate-400 text-[11px]">Quick add:</span>
              {['Steamed Rice', 'Dal Tadka', 'Sambar', 'Mixed Veg Curry', 'Pulao', 'Curd', 'Chapati'].map(
                (quickTag) => (
                  <button
                    key={quickTag}
                    type="button"
                    onClick={() => {
                      if (!menuItems.includes(quickTag)) setMenuItems([...menuItems, quickTag]);
                    }}
                    className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded transition-colors"
                  >
                    + {quickTag}
                  </button>
                )
              )}
            </div>

            {/* Current Menu List */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-semibold text-slate-700">Current Menu List:</div>
              {menuItems.length === 0 ? (
                <div className="text-xs text-slate-400 italic">No menu items added yet.</div>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                  {menuItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 text-xs bg-white">
                      <span className="font-medium text-slate-800">{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMenuItem(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Location */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Step 4 — Pickup Location</h2>
              <p className="text-xs text-slate-500 mt-1">
                Provide precise dispatch address so recipient vehicles or couriers reach without delay.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">City / Hub *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Area / Landmark *</label>
                <input
                  type="text"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block font-semibold text-slate-700 mb-1">Exact Pickup Address *</label>
              <textarea
                required
                rows={2}
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="text-xs">
              <label className="block font-semibold text-slate-700 mb-1">
                Special Packaging or Handover Instructions
              </label>
              <input
                type="text"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Report to Gate 2 security counter."
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Step 5: Availability */}
        {step === 5 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Step 5 — Availability Window</h2>
              <p className="text-xs text-slate-500 mt-1">
                Automatically calculated based on safe consumption rules for {mealPeriod}.
              </p>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
              <Clock className="w-10 h-10 text-emerald-700 mx-auto" />
              <div>
                <div className="text-xs text-emerald-800 font-semibold uppercase tracking-wider">
                  Configured Distribution Deadline
                </div>
                <div className="text-3xl font-extrabold text-slate-900 mt-1">
                  Available until: {currentConfig.lateWindowDeadline}
                </div>
              </div>
              <div className="max-w-md mx-auto text-xs text-slate-600 leading-relaxed">
                Normal Announcement Cutoff: <strong>{currentConfig.normalDeadline}</strong>
                <br />
                Late Announcement Window: <strong>{currentConfig.normalDeadline} – {currentConfig.lateWindowDeadline}</strong>
                <br />
                <span className="text-slate-400 text-[11px]">
                  After {currentConfig.lateWindowDeadline}, the donation automatically closes for safety.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Safety Confirmation */}
        {step === 6 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Step 6 — Safety Confirmation</h2>
              <p className="text-xs text-slate-500 mt-1">
                Food safety is the joint responsibility of donors and recipient care organizations.
              </p>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-800">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={safetyHygienic}
                  onChange={(e) => setSafetyHygienic(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Food was prepared hygienically in a clean, sanitized facility</span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={safetyStored}
                  onChange={(e) => setSafetyStored(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Food has been stored appropriately in food-grade covered containers</span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={safetyWindow}
                  onChange={(e) => setSafetyWindow(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Food is within the applicable safe-use window (not re-heated leftover)</span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={safetyNoContamination}
                  onChange={(e) => setSafetyNoContamination(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Food has not been knowingly contaminated or left in open air</span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={safetyAccurate}
                  onChange={(e) => setSafetyAccurate(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Information provided regarding quantity and ingredients is accurate</span>
              </label>
            </div>

            <div className="p-3 bg-amber-50 text-amber-900 rounded-lg text-[11px] leading-relaxed border border-amber-200">
              <strong>Disclaimer:</strong> FoodLoop AI platform verification confirms institution identity and licenses. It does not replace recipient inspection upon pickup.
            </div>
          </div>
        )}

        {/* Step 7: Preview */}
        {step === 7 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Step 7 — Donation Preview</h2>
              <p className="text-xs text-slate-500 mt-1">
                Review exact details before publishing to verified recipient shelters.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                <div>
                  <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                    FOOD DONATION PREVIEW
                  </div>
                  <div className="text-lg font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                    <span>{currentUser.name}</span>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      ✓ Verified
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">{city}, {area}</div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black text-emerald-700 tabular-nums">{plates} Plates</div>
                  <div className="text-[11px] text-slate-500 capitalize">{mealPeriod} Batch</div>
                </div>
              </div>

              {/* Menu Details */}
              <div>
                <div className="text-xs font-semibold text-slate-700 mb-1">Declared Menu:</div>
                <div className="flex flex-wrap gap-1.5">
                  {menuItems.map((item, idx) => (
                    <span key={idx} className="bg-white border border-slate-200 px-2.5 py-1 rounded text-xs font-medium text-slate-800">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Timing */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Availability Limit</div>
                  <div className="font-bold text-slate-900">Available until: {currentConfig.lateWindowDeadline}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Dispatch Point</div>
                  <div className="font-medium text-slate-700 truncate max-w-[200px]">{pickupAddress}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 7 ? (
            <button
              type="button"
              disabled={step === 6 && !allSafetyConfirmed}
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePublish}
              className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm transition-all flex items-center gap-2"
            >
              <span>Publish Donation</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
