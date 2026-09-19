import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, Mail, Phone, MapPin, Building, ShieldCheck, X } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  profile: UserProfile;
  onClose: () => void;
  onUpdate: (updated: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, profile, onClose, onUpdate }) => {
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [location, setLocation] = useState(profile.location);
  const [bio, setBio] = useState(profile.bio);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      ...profile,
      name,
      phone,
      location,
      bio
    });
    alert('Profile updated successfully.');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border-2 border-[#27364a] max-w-lg w-full p-6 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-600 hover:bg-gray-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
          <div className="w-16 h-16 rounded-full bg-[#628543] text-white flex items-center justify-center text-2xl font-bold">
            {profile.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#111827]">{profile.name}</h2>
            <p className="text-xs text-[#68788c]">{profile.username} | Role: {profile.role.toUpperCase()}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#173c3c] mb-1">FULL NAME</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 px-3 rounded-xl border border-[#9ceccf] bg-[#f1f7f2] text-sm text-[#1f2937] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#173c3c] mb-1">PHONE NUMBER</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-[#9ceccf] bg-[#f1f7f2] text-sm text-[#1f2937] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#173c3c] mb-1">LOCATION</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-[#9ceccf] bg-[#f1f7f2] text-sm text-[#1f2937] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#173c3c] mb-1">BIO / DESCRIPTION</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#9ceccf] bg-[#f1f7f2] text-sm text-[#1f2937] outline-none resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 text-xs font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#789b55] hover:bg-[#628543] text-white text-xs font-bold rounded-xl"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
