import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../db/roomDatabase';
import { DonorType, User } from '../types';
import { Building2, UploadCloud, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export const AuthRegisterDonor: React.FC = () => {
  const { loginAs, navigate } = useApp();
  const [donorType, setDonorType] = useState<DonorType>('institutional');
  const [name, setName] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [institutionCategory, setInstitutionCategory] = useState('College / University Campus Mess');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Narasaraopet');
  const [district, setDistrict] = useState('Palnadu');
  const [address, setAddress] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('FSSAI_Registration_Certificate.pdf');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newDonor: User = {
      id: `donor-${Date.now()}`,
      name: donorType === 'institutional' ? institutionName : name,
      email,
      phone,
      role: 'donor',
      donorType,
      institutionName: donorType === 'institutional' ? institutionName : 'Individual / Commoner Donor',
      institutionCategory: donorType === 'institutional' ? institutionCategory : 'Community & Family Functions',
      address,
      city,
      district,
      state: 'Andhra Pradesh',
      verificationStatus: 'pending', // Starts pending admin review
      joinedYear: 2026,
      documents: [
        {
          id: `doc-${Date.now()}`,
          userId: `donor-${Date.now()}`,
          docType: 'fssai_license',
          title: 'Food Safety & Hygiene License',
          fileName: uploadedFileName,
          fileUrl: '#doc-view',
          fileSize: '1.6 MB',
          uploadedAt: new Date().toISOString().split('T')[0],
          status: 'pending',
        },
      ],
      stats: {
        totalDonations: 0,
        totalPlates: 0,
        successfulRedistributions: 0,
      },
    };

    db.userDao.insert(newDonor);
    loginAs(newDonor);
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
        <div>
          <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            Donor Registration
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">Register as a Food Donor</h2>
          <p className="text-xs text-slate-500 mt-1">
            Institutional entities or common citizens can announce surplus meals for verified care shelters.
          </p>
        </div>

        {/* Donor Type Switcher */}
        <div className="p-1 bg-slate-100 rounded-lg flex gap-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setDonorType('institutional')}
            className={`flex-1 py-2 rounded-md transition-colors ${
              donorType === 'institutional'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Institutional Donor (College, Caterer, Hotel)
          </button>
          <button
            type="button"
            onClick={() => setDonorType('individual')}
            className={`flex-1 py-2 rounded-md transition-colors ${
              donorType === 'individual'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Individual / Commoner Donor (Functions, Home)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {donorType === 'institutional' ? (
            <>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Institution Name *
                </label>
                <input
                  type="text"
                  required
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  placeholder="e.g. JNTU Narasaraopet College Mess"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Category *
                </label>
                <select
                  value={institutionCategory}
                  onChange={(e) => setInstitutionCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  <option>College / University Campus Mess</option>
                  <option>Hostel Dining Facility</option>
                  <option>Corporate Office Canteen</option>
                  <option>Restaurant & Hotel</option>
                  <option>Catering & Marriage Banquet Hall</option>
                  <option>Hospital Dietary Kitchen</option>
                  <option>Religious / Community Institution</option>
                </select>
              </div>
            </>
          ) : (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Your Full Name / Event Organizer *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rajesh Kumar"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Valid Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="official@institution.org"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Phone Number (WhatsApp verified) *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98480 12345"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">City / Town *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">District *</label>
              <input
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Pickup Address (Dispatch Location) *
            </label>
            <textarea
              required
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Full street address, landmark, canteen building, gate number"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Verification Document Upload */}
          <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-emerald-600" />
              <div className="font-semibold text-slate-900">
                {donorType === 'institutional'
                  ? 'FSSAI License or Canteen Affiliation Document'
                  : 'Valid Identity Proof / Municipal Event Permission'}
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Required for the administrator review. We cross-verify with district health & food safety registers.
            </p>
            <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="text-xs text-slate-700 font-medium truncate">{uploadedFileName}</span>
              <button
                type="button"
                onClick={() => setUploadedFileName(`FSSAI_${Date.now().toString().slice(-4)}.pdf`)}
                className="text-[11px] text-emerald-700 font-semibold hover:underline shrink-0"
              >
                Change File
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs transition-colors shadow-sm"
            >
              Submit Donor Registration for Admin Review
            </button>
          </div>
        </form>

        <div className="text-center text-xs text-slate-500">
          Already registered?{' '}
          <button
            onClick={() => navigate('login_donor')}
            className="text-emerald-700 font-semibold hover:underline"
          >
            Sign in here
          </button>
        </div>
      </div>
    </div>
  );
};
