import React, { useState } from 'react';
import { UserRole, UserProfile } from '../types';
import { INITIAL_PROFILES } from '../data/mockData';
import { ShieldCheck, User, Building, Users, Lock, Phone, Mail, FileText, CheckCircle, ArrowRight } from 'lucide-react';

interface AuthScreenProps {
  onLogin: (profile: UserProfile) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [role, setRole] = useState<UserRole>('farmer');
  const [isRegister, setIsRegister] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [showAgriModal, setShowAgriModal] = useState(false);
  const [selectedState, setSelectedState] = useState('');

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Dummy admin ID secret bypass (e.g. admin@bridge or ADMIN123)
    if (identifier.toLowerCase() === 'admin@bridge' || identifier.toUpperCase() === 'ADMIN123') {
      onLogin({
        id: 'TEAM-001',
        name: 'Bridge Admin Team',
        role: 'buyer', // Accesses team dashboard via buyer or special profile
        username: '@bridge_admin',
        email: 'admin@bridge.org',
        phone: '+91 9000000000',
        location: 'National HQ',
        bio: 'Platform administration and verification team.',
        rating: 5.0
      });
      return;
    }

    if (role === 'farmer' && identifier.length !== 11 && !isRegister) {
      setError('Farmer ID must be exactly 11 digits.');
      return;
    }
    if (role === 'buyer' && identifier.length !== 15 && !isRegister) {
      setError('GST ID must be exactly 15 alphanumeric characters.');
      return;
    }
    if (role === 'worker' && identifier.length !== 10 && !isRegister) {
      setError('Phone number must be 10 digits.');
      return;
    }

    if (isRegister) {
      alert('Registration successful! You can now log in.');
      setIsRegister(false);
      return;
    }

    // Login success
    const profile = INITIAL_PROFILES[role];
    if (profile) {
      onLogin(profile);
    } else {
      onLogin({
        id: identifier || 'USR-999',
        name: role.toUpperCase() + ' User',
        role,
        username: '@' + role + '_user',
        email: email || 'user@bridge.com',
        phone: contact || '+91 9876543210',
        location: 'Punjab, India',
        bio: 'Verified BRIDGE participant.',
        rating: 4.8
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dff9ec] via-[#fff9dc] to-[#eef8f2] flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white border-2 border-[#27364a] rounded-2xl p-8 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#e8ecea]">
          <div>
            <h1 className="text-3xl font-bold text-[#111827]">BRIDGE</h1>
            <p className="text-xs text-[#68788c] mt-1">Agricultural Workforce & Contract Coordination Platform</p>
          </div>

          {/* Role selector dropdown */}
          <div className="flex gap-2 bg-[#f1f7f2] p-1.5 rounded-xl border border-[#9ceccf]">
            {(['farmer', 'worker', 'buyer'] as UserRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => { setRole(r); setError(''); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide transition ${
                  role === r ? 'bg-[#789b55] text-white shadow-sm' : 'text-[#566b49] hover:bg-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleAuthSubmit} className="mt-6 space-y-4">
          <div className="text-lg font-bold text-[#628543] capitalize">
            {isRegister ? `Register as ${role}` : `Log in as ${role}`}
          </div>

          <div>
            <label className="block text-sm font-bold text-[#173c3c] mb-1">
              {role === 'farmer' ? 'FARMER ID (11 Digits)' : role === 'buyer' ? 'GST ID (15 Characters / or admin@bridge)' : 'PHONE NUMBER (10 Digits)'}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={role === 'farmer' ? 'Enter 11-digit Farmer ID' : role === 'buyer' ? 'Enter 15-character GST ID (or admin@bridge)' : 'Enter 10-digit phone number'}
                className="w-full h-12 px-4 rounded-xl border-2 border-[#9ceccf] bg-[#f1f7f2] text-sm text-[#1f2937] outline-none focus:border-[#789b55]"
              />
              <User className="absolute right-3 top-3.5 w-5 h-5 text-[#6e7c90]" />
            </div>
            {role === 'farmer' && !isRegister && (
              <button
                type="button"
                onClick={() => setShowAgriModal(true)}
                className="mt-1.5 text-xs font-semibold text-[#008f68] hover:underline"
              >
                Do not have a Farmer ID? Check AgriStack State Portal
              </button>
            )}
          </div>

          {isRegister && (
            <>
              <div>
                <label className="block text-sm font-bold text-[#173c3c] mb-1">CONTACT NUMBER</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Enter 10-digit contact number"
                    className="w-full h-12 px-4 rounded-xl border-2 border-[#9ceccf] bg-[#f1f7f2] text-sm text-[#1f2937] outline-none focus:border-[#789b55]"
                  />
                  <Phone className="absolute right-3 top-3.5 w-5 h-5 text-[#6e7c90]" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#173c3c] mb-1">EMAIL ADDRESS</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full h-12 px-4 rounded-xl border-2 border-[#9ceccf] bg-[#f1f7f2] text-sm text-[#1f2937] outline-none focus:border-[#789b55]"
                  />
                  <Mail className="absolute right-3 top-3.5 w-5 h-5 text-[#6e7c90]" />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-bold text-[#173c3c] mb-1">PASSWORD</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter secure password"
                className="w-full h-12 px-4 rounded-xl border-2 border-[#9ceccf] bg-[#f1f7f2] text-sm text-[#1f2937] outline-none focus:border-[#789b55]"
              />
              <Lock className="absolute right-3 top-3.5 w-5 h-5 text-[#6e7c90]" />
            </div>
          </div>

          {error && <p className="text-xs font-semibold text-red-600">{error}</p>}

          <button
            type="submit"
            className="w-full h-12 bg-[#789b55] hover:bg-[#628543] text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
          >
            <span>{isRegister ? 'Complete Registration' : 'Access Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Switch mode */}
        <div className="text-center mt-4 text-sm text-[#68788c]">
          {isRegister ? 'Already registered?' : 'Need an account?'}{' '}
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-[#628543] font-bold hover:underline"
          >
            {isRegister ? 'Log in here' : 'Register now'}
          </button>
        </div>

        {/* AgriStack Portal Modal */}
        {showAgriModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border-2 border-[#27364a] max-w-md w-full p-6 relative shadow-2xl">
              <button
                type="button"
                onClick={() => setShowAgriModal(false)}
                className="absolute right-4 top-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-600 hover:bg-gray-200"
              >
                X
              </button>
              <h2 className="text-xl font-bold text-[#111827] mb-2">Get Farmer ID via AgriStack</h2>
              <p className="text-xs text-[#68788c] mb-4">Select your state to open the official state Farmer Registry portal.</p>
              
              <label className="block text-xs font-bold text-[#173c3c] mb-1">SELECT STATE</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full h-12 px-3 rounded-xl border-2 border-[#9ceccf] bg-[#f1f7f2] text-sm text-[#27364a] outline-none mb-4"
              >
                <option value="">Select your state</option>
                <option value="Punjab">Punjab</option>
                <option value="Haryana">Haryana</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
              </select>

              {selectedState && (
                <div className="p-4 bg-[#f1faf5] border border-[#b8efd9] rounded-xl">
                  <p className="text-xs text-[#68788c] mb-1">Official Registry Portal for {selectedState}</p>
                  <a
                    href="https://agristack.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-2.5 bg-[#789b55] text-white text-center font-bold text-xs rounded-lg hover:bg-[#628543]"
                  >
                    Open AgriStack Portal
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
