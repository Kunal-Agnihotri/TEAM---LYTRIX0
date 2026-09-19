import React from 'react';
import { NotificationItem } from '../types';
import { INITIAL_NOTIFICATIONS } from '../data/mockData';
import { Bell, X, CheckCircle } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-end">
      <div className="w-full max-w-md bg-[#fffce9] h-full shadow-2xl flex flex-col border-l border-[#f0dfae]">
        
        {/* Header */}
        <div className="h-20 bg-[#f6b84a] px-6 flex items-center justify-between text-white flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold">Notifications</h2>
            <p className="text-xs opacity-90 mt-0.5">Recent updates from BRIDGE platform.</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {INITIAL_NOTIFICATIONS.map((notif: NotificationItem) => (
            <div key={notif.id} className="bg-white p-4 rounded-xl border border-[rgba(98,133,67,0.12)] shadow-sm flex gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#789b55] mt-1.5 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-xs text-[#628543]">{notif.title}</h4>
                <p className="text-xs text-[#566b49] mt-1 leading-relaxed">{notif.message}</p>
                <span className="text-[10px] text-gray-400 mt-2 block">{notif.timestamp}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
