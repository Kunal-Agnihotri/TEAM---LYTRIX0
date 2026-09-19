import React, { useState } from 'react';
import { Contract } from '../types';
import { INITIAL_CONTRACTS } from '../data/mockData';
import { Building, Plus, FileText, CheckCircle, Clock, ArrowRight } from 'lucide-react';

export const BuyerDashboard: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>(INITIAL_CONTRACTS);
  const [showModal, setShowModal] = useState(false);
  
  const [crop, setCrop] = useState('Wheat (Grade A)');
  const [quantity, setQuantity] = useState('300 Quintals');
  const [delivery, setDelivery] = useState('Delivery by 15 November 2026');
  const [terms, setTerms] = useState('10 percent advance, 90 percent upon warehouse inspection');

  const handleCreateContract = (e: React.FormEvent) => {
    e.preventDefault();
    const newCon: Contract = {
      id: 'CON-' + (contracts.length + 501),
      parties: ['Apex Agro Industries', 'Verified Big Farmer Network'],
      cropOrTask: crop,
      quantityOrWorkers: quantity,
      durationOrDelivery: delivery,
      paymentTerms: terms,
      status: 'proposed',
      lastUpdated: '2026-09-18',
      proposedBy: 'Apex Agro Industries'
    };
    setContracts([newCon, ...contracts]);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#b8cd91] p-6 rounded-2xl shadow-sm text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Agricultural Buyer (Industry) Portal</h2>
          <p className="text-sm opacity-90 mt-1">Submit produce requirements, negotiate verified contracts, and track institutional deliveries.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#628543] hover:bg-[#566b49] text-white font-bold px-5 py-3 rounded-xl shadow-md transition flex items-center gap-2 text-sm"
        >
          <Plus className="w-5 h-5" />
          <span>New Produce Contract Proposal</span>
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[rgba(98,133,67,0.12)] shadow-sm">
          <p className="text-xs uppercase tracking-wider text-[#8a987f] font-semibold mb-1">Active Contracts</p>
          <p className="text-3xl font-bold text-[#628543]">{contracts.length}</p>
          <p className="text-xs text-[#7d8c72] mt-2">Secured with verified Big Farmers</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[rgba(98,133,67,0.12)] shadow-sm">
          <p className="text-xs uppercase tracking-wider text-[#8a987f] font-semibold mb-1">Total Tonnage Procured</p>
          <p className="text-3xl font-bold text-[#628543]">550 Quintals</p>
          <p className="text-xs text-[#7d8c72] mt-2">Verified quality standards</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[rgba(98,133,67,0.12)] shadow-sm">
          <p className="text-xs uppercase tracking-wider text-[#8a987f] font-semibold mb-1">Buyer Verification</p>
          <p className="text-3xl font-bold text-[#628543]">GST Verified</p>
          <p className="text-xs text-[#7d8c72] mt-2">07AAAAA0000A1Z5</p>
        </div>
      </div>

      {/* Contracts List */}
      <div className="bg-white p-6 rounded-2xl border border-[rgba(98,133,67,0.12)] shadow-sm">
        <h3 className="text-lg font-bold text-[#628543] mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          <span>Produce Contracts & Status Tracking</span>
        </h3>
        <div className="space-y-4">
          {contracts.map((con) => (
            <div key={con.id} className="p-5 rounded-2xl bg-[#fffce9] border border-[#f0dfae] space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-[#566b49] text-lg">{con.cropOrTask}</h4>
                  <p className="text-xs text-[#7d8c72]">Parties: {con.parties.join(' <-> ')}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  con.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {con.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-[#566b49] pt-2 border-t border-[rgba(98,133,67,0.1)]">
                <div>Quantity: {con.quantityOrWorkers}</div>
                <div>Delivery: {con.durationOrDelivery}</div>
                <div>Terms: {con.paymentTerms}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Contract Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border-2 border-[#27364a] max-w-lg w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-600 hover:bg-gray-200"
            >
              X
            </button>
            <h3 className="text-xl font-bold text-[#628543] mb-4">Create Produce Contract Proposal</h3>
            
            <form onSubmit={handleCreateContract} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#173c3c] mb-1">CROP & VARIETY</label>
                <input
                  type="text"
                  required
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-[#9ceccf] bg-[#f1f7f2] text-sm text-[#1f2937] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#173c3c] mb-1">QUANTITY</label>
                <input
                  type="text"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-[#9ceccf] bg-[#f1f7f2] text-sm text-[#1f2937] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#173c3c] mb-1">DELIVERY SCHEDULE</label>
                <input
                  type="text"
                  required
                  value={delivery}
                  onChange={(e) => setDelivery(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-[#9ceccf] bg-[#f1f7f2] text-sm text-[#1f2937] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#173c3c] mb-1">PAYMENT & SETTLEMENT TERMS</label>
                <input
                  type="text"
                  required
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-[#9ceccf] bg-[#f1f7f2] text-sm text-[#1f2937] outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#789b55] hover:bg-[#628543] text-white text-xs font-bold rounded-xl"
                >
                  Send Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
