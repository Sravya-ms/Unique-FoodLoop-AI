import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../db/roomDatabase';
import { ConsumerType, User } from '../types';
import { Users, UploadCloud, ShieldCheck } from 'lucide-react';

export const AuthRegisterConsumer: React.FC = () => {
  const { loginAs, navigate } = useApp();
  const [consumerType, setConsumerType] = useState<ConsumerType>('old_age_home');
  const [organizationName, setOrganizationName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Narasaraopet');
  const [district, setDistrict] = useState('Palnadu');
  const [state, setState] = useState('Andhra Pradesh');
  const [residentCount, setResidentCount] = useState<number>(75);
  const [uploadedFileName, setUploadedFileName] = useState('NGO_Darpan_Registration_AP.pdf');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newConsumer: User = {
      id: `consumer-${Date.now()}`,
      name: organizationName,
      email,
      phone,
      whatsappNumber,
      role: 'consumer',
      consumerType,
      institutionName: organizationName,
      address,
      city,
      district,
      state,
      residentCount: Number(residentCount) || 10,
      verificationStatus: 'pending', // Starts pending admin review
      joinedYear: 2026,
      documents: [
        {
          id: `doc-${Date.now()}`,
          userId: `consumer-${Date.now()}`,
          docType: 'ngo_darpan',
          title: 'NITI Aayog NGO Darpan / Trust Deed',
          fileName: uploadedFileName,
          fileUrl: '#darpan-view',
          fileSize: '2.3 MB',
          uploadedAt: new Date().toISOString().split('T')[0],
          status: 'pending',
        },
      ],
      stats: {
        foodRequests: 0,
        foodReceived: 0,
      },
    };

    db.userDao.insert(newConsumer);
    loginAs(newConsumer);
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
        <div>
          <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
            Recipient Registration
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">Register Orphanage or Old-Age Home</h2>
          <p className="text-xs text-slate-500 mt-1">
            Strictly reserved for genuine care homes. All documents are reviewed prior to issuing request privileges.
          </p>
        </div>

        {/* Consumer Type Switcher */}
        <div className="p-1 bg-slate-100 rounded-lg flex gap-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setConsumerType('old_age_home')}
            className={`flex-1 py-2 rounded-md transition-colors ${
              consumerType === 'old_age_home'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Old-Age Home / Senior Care
          </button>
          <button
            type="button"
            onClick={() => setConsumerType('orphanage')}
            className={`flex-1 py-2 rounded-md transition-colors ${
              consumerType === 'orphanage'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Orphanage / Child Welfare Home
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Organization Name *
            </label>
            <input
              type="text"
              required
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              placeholder="e.g. Sri Krishna Senior Citizens Care Trust"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Official Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="care@organization.org"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Number of Permanent Residents *
              </label>
              <input
                type="number"
                min="5"
                max="500"
                required
                value={residentCount}
                onChange={(e) => setResidentCount(parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 94900 11223"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                WhatsApp Number (for delivery alerts) *
              </label>
              <input
                type="tel"
                required
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+91 94900 11223"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">City / Town *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">District *</label>
              <input
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">State *</label>
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Full Physical Address (Delivery Location) *
            </label>
            <textarea
              required
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Door number, landmark, street name, pincode"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Verification Document Upload */}
          <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-blue-600" />
              <div className="font-semibold text-slate-900">
                NITI Aayog NGO Darpan / Trust Deed / JJ Act Cert
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Official registration proof is mandatory before placing surplus food requests.
            </p>
            <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="text-xs text-slate-700 font-medium truncate">{uploadedFileName}</span>
              <button
                type="button"
                onClick={() => setUploadedFileName(`NGO_DARPAN_${Date.now().toString().slice(-4)}.pdf`)}
                className="text-[11px] text-blue-700 font-semibold hover:underline shrink-0"
              >
                Change File
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-xs transition-colors shadow-sm"
            >
              Submit Recipient Registration for Verification
            </button>
          </div>
        </form>

        <div className="text-center text-xs text-slate-500">
          Already registered?{' '}
          <button
            onClick={() => navigate('login_consumer')}
            className="text-blue-700 font-semibold hover:underline"
          >
            Sign in here
          </button>
        </div>
      </div>
    </div>
  );
};
