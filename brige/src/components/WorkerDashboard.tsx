import React, { useState } from 'react';
import { WorkforceRequirement } from '../types';
import { INITIAL_REQUIREMENTS } from '../data/mockData';
import { Briefcase, MapPin, Calendar, Clock, DollarSign, CheckCircle, XCircle, MessageSquare } from 'lucide-react';

export const WorkerDashboard: React.FC = () => {
  const [opportunities, setOpportunities] = useState<WorkforceRequirement[]>(INITIAL_REQUIREMENTS);
  const [acceptedJobs, setAcceptedJobs] = useState<string[]>([]);

  const handleAccept = (id: string) => {
    setAcceptedJobs([...acceptedJobs, id]);
    alert('Opportunity accepted successfully! Contract notification sent to Big Farmer.');
  };

  const handleNegotiate = (id: string) => {
    const newRate = prompt('Enter your counter daily rate (INR):');
    if (newRate) {
      alert(`Counter proposal of ₹${newRate}/day sent to Big Farmer for negotiation.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#b8cd91] p-6 rounded-2xl shadow-sm text-white">
        <h2 className="text-2xl font-bold tracking-tight">Agricultural Worker & Opportunity Feed</h2>
        <p className="text-sm opacity-90 mt-1">Browse AI-matched harvesting, sowing, and farm work opportunities with transparent daily rates.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[rgba(98,133,67,0.12)] shadow-sm">
          <p className="text-xs uppercase tracking-wider text-[#8a987f] font-semibold mb-1">Available Opportunities</p>
          <p className="text-3xl font-bold text-[#628543]">{opportunities.length}</p>
          <p className="text-xs text-[#7d8c72] mt-2">Matched to your location and availability</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[rgba(98,133,67,0.12)] shadow-sm">
          <p className="text-xs uppercase tracking-wider text-[#8a987f] font-semibold mb-1">Accepted Jobs</p>
          <p className="text-3xl font-bold text-[#628543]">{acceptedJobs.length}</p>
          <p className="text-xs text-[#7d8c72] mt-2">Confirmed upcoming farm engagements</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[rgba(98,133,67,0.12)] shadow-sm">
          <p className="text-xs uppercase tracking-wider text-[#8a987f] font-semibold mb-1">Worker Rating</p>
          <p className="text-3xl font-bold text-[#628543]">4.9 / 5.0</p>
          <p className="text-xs text-[#7d8c72] mt-2">Based on completed work history</p>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="bg-white p-6 rounded-2xl border border-[rgba(98,133,67,0.12)] shadow-sm">
        <h3 className="text-lg font-bold text-[#628543] mb-4 flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          <span>AI-Compatible Work Opportunities</span>
        </h3>
        <div className="space-y-4">
          {opportunities.map((opp) => {
            const isAccepted = acceptedJobs.includes(opp.id);
            return (
              <div key={opp.id} className="p-5 rounded-2xl bg-[#fffce9] border border-[#f0dfae] space-y-3">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                  <div>
                    <h4 className="font-bold text-[#566b49] text-lg">{opp.cropRequirement}</h4>
                    <p className="text-xs text-[#7d8c72] mt-0.5">Big Farmer: {opp.farmerName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#789b55] text-white">
                      ₹{opp.dailyRate} / day
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#f6b84a] text-[#765923]">
                      {opp.workersRequired} Workers Needed
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-[#566b49] pt-2 border-t border-[rgba(98,133,67,0.1)]">
                  <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#789b55]" /> {opp.location}</div>
                  <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#789b55]" /> {opp.startDate} to {opp.endDate}</div>
                  <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#789b55]" /> {opp.workHours}</div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => handleNegotiate(opp.id)}
                    className="px-4 py-2 bg-[#f3e9bd] hover:bg-[#ebd99a] text-[#566b49] text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Negotiate Rate</span>
                  </button>
                  {isAccepted ? (
                    <span className="px-4 py-2 bg-green-100 text-green-800 text-xs font-bold rounded-xl flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" /> Accepted
                    </span>
                  ) : (
                    <button
                      onClick={() => handleAccept(opp.id)}
                      className="px-5 py-2 bg-[#789b55] hover:bg-[#628543] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Accept Opportunity</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
