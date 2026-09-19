import React, { useState } from 'react';
import { WorkforceRequirement, WorkerMatch, Contract } from '../types';
import { INITIAL_REQUIREMENTS, INITIAL_MATCHES, INITIAL_CONTRACTS } from '../data/mockData';
import { Users, Plus, ShieldCheck, MapPin, Calendar, Clock, DollarSign, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';

export const BigFarmerDashboard: React.FC = () => {
  const [requirements, setRequirements] = useState<WorkforceRequirement[]>(INITIAL_REQUIREMENTS);
  const [matches] = useState<WorkerMatch[]>(INITIAL_MATCHES);
  const [contracts] = useState<Contract[]>(INITIAL_CONTRACTS);
  
  const [showNewReqModal, setShowNewReqModal] = useState(false);
  const [newLocation, setNewLocation] = useState('Ludhiana, Punjab');
  const [newWorkers, setNewWorkers] = useState(10);
  const [newStart, setNewStart] = useState('2026-10-05');
  const [newEnd, setNewEnd] = useState('2026-10-20');
  const [newRate, setNewRate] = useState(450);
  const [newCrop, setNewCrop] = useState('Wheat Harvesting');

  const handleCreateRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    const req: WorkforceRequirement = {
      id: 'REQ-' + (requirements.length + 101),
      farmerId: 'FARM-98421',
      farmerName: 'Ravi Kumar',
      location: newLocation,
      workersRequired: Number(newWorkers),
      startDate: newStart,
      endDate: newEnd,
      workHours: '07:00 AM - 03:00 PM',
      dailyRate: Number(newRate),
      cropRequirement: newCrop,
      status: 'active'
    };
    setRequirements([req, ...requirements]);
    setShowNewReqModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#b8cd91] p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-white">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Big Farmer & Workforce Coordination</h2>
          <p className="text-sm opacity-90 mt-1">Manage land requirements, deploy AI worker matching, and track buyer contracts.</p>
        </div>
        <button
          onClick={() => setShowNewReqModal(true)}
          className="bg-[#628543] hover:bg-[#566b49] text-white font-bold px-5 py-3 rounded-xl shadow-md transition flex items-center gap-2 text-sm"
        >
          <Plus className="w-5 h-5" />
          <span>Post Workforce Requirement</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[rgba(98,133,67,0.12)] shadow-sm">
          <p className="text-xs uppercase tracking-wider text-[#8a987f] font-semibold mb-1">Active Workforce Requests</p>
          <p className="text-3xl font-bold text-[#628543]">{requirements.length}</p>
          <p className="text-xs text-[#7d8c72] mt-2">Connecting with available local workers</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[rgba(98,133,67,0.12)] shadow-sm">
          <p className="text-xs uppercase tracking-wider text-[#8a987f] font-semibold mb-1">AI Match Pool</p>
          <p className="text-3xl font-bold text-[#628543]">28 Workers</p>
          <p className="text-xs text-[#7d8c72] mt-2">Verified availability & skill scoring</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[rgba(98,133,67,0.12)] shadow-sm">
          <p className="text-xs uppercase tracking-wider text-[#8a987f] font-semibold mb-1">Active Buyer Contracts</p>
          <p className="text-3xl font-bold text-[#628543]">{contracts.length}</p>
          <p className="text-xs text-[#7d8c72] mt-2">Secured with institutional processors</p>
        </div>
      </div>

      {/* Main Grid: Requirements & AI Matches */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Requirements List */}
        <div className="bg-white p-6 rounded-2xl border border-[rgba(98,133,67,0.12)] shadow-sm">
          <h3 className="text-lg font-bold text-[#628543] mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            <span>Your Workforce Requirements</span>
          </h3>
          <div className="space-y-3">
            {requirements.map((req) => (
              <div key={req.id} className="p-4 rounded-xl bg-[#fffce9] border border-[#f0dfae] space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-[#566b49] text-base">{req.cropRequirement}</h4>
                    <p className="text-xs text-[#7d8c72] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" /> {req.location}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#b8cd91] text-white">
                    {req.workersRequired} Workers
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-[#566b49] pt-2 border-t border-[rgba(98,133,67,0.1)]">
                  <div>Period: {req.startDate} to {req.endDate}</div>
                  <div>Daily Rate: ₹{req.dailyRate} / day</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Compatibility Match Engine */}
        <div className="bg-white p-6 rounded-2xl border border-[rgba(98,133,67,0.12)] shadow-sm">
          <h3 className="text-lg font-bold text-[#628543] mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#f6b84a]" />
            <span>AI Compatibility Match Engine</span>
          </h3>
          <div className="space-y-3">
            {matches.map((match) => (
              <div key={match.id} className="p-4 rounded-xl bg-[#f1faf5] border border-[#b8efd9] space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-[#111827] text-base">{match.workerName}</h4>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#789b55] text-white text-xs font-bold">
                    <span>{match.compatibilityScore}% Match</span>
                  </div>
                </div>
                <p className="text-xs text-[#7d8c72]">Location: {match.location} | Expected Rate: ₹{match.expectedRate}/day</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {match.skills.map((skill, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#e5efeb] text-[#628543]">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => alert(`Contract proposal sent to ${match.workerName}.`)}
                    className="px-4 py-1.5 bg-[#789b55] hover:bg-[#628543] text-white text-xs font-bold rounded-lg transition"
                  >
                    Send Offer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* New Requirement Modal */}
      {showNewReqModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border-2 border-[#27364a] max-w-lg w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setShowNewReqModal(false)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-600 hover:bg-gray-200"
            >
              X
            </button>
            <h3 className="text-xl font-bold text-[#628543] mb-4">Post Workforce Requirement</h3>
            
            <form onSubmit={handleCreateRequirement} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#173c3c] mb-1">CROP OR TASK REQUIREMENT</label>
                <input
                  type="text"
                  required
                  value={newCrop}
                  onChange={(e) => setNewCrop(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-[#9ceccf] bg-[#f1f7f2] text-sm text-[#1f2937] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#173c3c] mb-1">WORKERS REQUIRED</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newWorkers}
                    onChange={(e) => setNewWorkers(Number(e.target.value))}
                    className="w-full h-11 px-3 rounded-xl border border-[#9ceccf] bg-[#f1f7f2] text-sm text-[#1f2937] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#173c3c] mb-1">DAILY RATE (INR)</label>
                  <input
                    type="number"
                    min="100"
                    required
                    value={newRate}
                    onChange={(e) => setNewRate(Number(e.target.value))}
                    className="w-full h-11 px-3 rounded-xl border border-[#9ceccf] bg-[#f1f7f2] text-sm text-[#1f2937] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#173c3c] mb-1">START DATE</label>
                  <input
                    type="date"
                    required
                    value={newStart}
                    onChange={(e) => setNewStart(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-[#9ceccf] bg-[#f1f7f2] text-sm text-[#1f2937] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#173c3c] mb-1">END DATE</label>
                  <input
                    type="date"
                    required
                    value={newEnd}
                    onChange={(e) => setNewEnd(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-[#9ceccf] bg-[#f1f7f2] text-sm text-[#1f2937] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#173c3c] mb-1">LOCATION</label>
                <input
                  type="text"
                  required
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-[#9ceccf] bg-[#f1f7f2] text-sm text-[#1f2937] outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewReqModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#789b55] hover:bg-[#628543] text-white text-xs font-bold rounded-xl"
                >
                  Publish Requirement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
