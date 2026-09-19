import React, { useState } from 'react';
import { UserProfile, UserRole } from './types';
import { INITIAL_PROFILES } from './data/mockData';
import { AuthScreen } from './components/AuthScreen';
import { BigFarmerDashboard } from './components/BigFarmerDashboard';
import { WorkerDashboard } from './components/WorkerDashboard';
import { BuyerDashboard } from './components/BuyerDashboard';
import { TeamDashboard } from './components/TeamDashboard';
import { AashiAssistant } from './components/AashiAssistant';
import { NotificationsModal } from './components/NotificationsModal';
import { ProfileModal } from './components/ProfileModal';
import { Bell, User, Menu, Home, Store, FileText, HelpCircle, LogOut, Sparkles } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(INITIAL_PROFILES.farmer);
  const [activeTab, setActiveTab] = useState<'home' | 'market' | 'deals' | 'help'>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAashiOpen, setIsAashiOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  if (!currentUser) {
    return <AuthScreen onLogin={(user) => setCurrentUser(user)} />;
  }

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const renderDashboard = () => {
    if (activeTab === 'market') {
      if (currentUser.role === 'farmer') return <BigFarmerDashboard />;
      if (currentUser.role === 'worker') return <WorkerDashboard />;
      if (currentUser.role === 'buyer') return <BuyerDashboard />;
      return <TeamDashboard />;
    }
    if (activeTab === 'deals') {
      return <BuyerDashboard />;
    }
    if (activeTab === 'help') {
      return (
        <div className="bg-white p-8 rounded-2xl border border-[rgba(98,133,67,0.12)] space-y-4">
          <h2 className="text-2xl font-bold text-[#628543]">Help & Platform Support</h2>
          <p className="text-sm text-[#566b49] leading-relaxed">
            BRIDGE is an AI-enabled agricultural coordination and contract-management platform connecting Big Farmers, Agricultural Workers, and Buyers. Use Aashi AI assistant for instant multilingual answers or contact admin support.
          </p>
        </div>
      );
    }

    // Default Home tab based on role
    switch (currentUser.role) {
      case 'farmer':
        return <BigFarmerDashboard />;
      case 'worker':
        return <WorkerDashboard />;
      case 'buyer':
        return <BuyerDashboard />;
      default:
        return <BigFarmerDashboard />;
    }
  };

  return (
    <div className="w-screen h-screen bg-[#fff9dc] flex flex-col overflow-hidden font-sans">
      
      {/* Topbar */}
      <header className="h-[78px] px-8 bg-[#fffce9] flex items-center justify-between border-b border-[rgba(98,133,67,0.1)] flex-shrink-0 z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-10 h-10 rounded-xl bg-[#f6b84a] text-white flex items-center justify-center shadow-sm hover:bg-[#e0a43f] transition"
            title="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-2xl font-bold tracking-tight text-[#628543]">BRIDGE</span>
          <span className="hidden sm:inline-block px-3 py-1 bg-[#b8cd91] text-white text-xs font-bold rounded-full uppercase tracking-wider">
            Role: {currentUser.role}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsNotifOpen(true)}
            className="w-10 h-10 rounded-full hover:bg-[rgba(120,155,85,0.1)] flex items-center justify-center text-[#628543] transition relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#f6b84a]" />
          </button>

          <button
            onClick={() => setIsProfileOpen(true)}
            className="w-10 h-10 rounded-full bg-[#789b55] text-white flex items-center justify-center shadow-md hover:bg-[#628543] transition"
            title="Profile"
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 relative overflow-hidden flex">
        
        {/* Sidebar */}
        <aside className={`absolute top-0 left-0 w-[240px] h-full bg-[#f6b84a] z-40 p-6 shadow-2xl transform transition-transform duration-300 flex flex-col justify-between ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div>
            <div className="text-2xl font-bold text-white tracking-tight mb-8">BRIDGE Menu</div>
            <div className="space-y-2">
              <button
                onClick={() => { setActiveTab('home'); setIsSidebarOpen(false); }}
                className={`w-full h-12 px-4 rounded-xl flex items-center gap-3 text-white font-semibold text-sm transition ${
                  activeTab === 'home' ? 'bg-white/30' : 'hover:bg-white/15'
                }`}
              >
                <Home className="w-5 h-5" />
                <span>Home / Dashboard</span>
              </button>

              <button
                onClick={() => { setActiveTab('market'); setIsSidebarOpen(false); }}
                className={`w-full h-12 px-4 rounded-xl flex items-center gap-3 text-white font-semibold text-sm transition ${
                  activeTab === 'market' ? 'bg-white/30' : 'hover:bg-white/15'
                }`}
              >
                <Store className="w-5 h-5" />
                <span>{currentUser.role === 'worker' ? 'Opportunities' : 'Market / Feed'}</span>
              </button>

              <button
                onClick={() => { setActiveTab('deals'); setIsSidebarOpen(false); }}
                className={`w-full h-12 px-4 rounded-xl flex items-center gap-3 text-white font-semibold text-sm transition ${
                  activeTab === 'deals' ? 'bg-white/30' : 'hover:bg-white/15'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span>Contracts & Deals</span>
              </button>

              <button
                onClick={() => { setActiveTab('help'); setIsSidebarOpen(false); }}
                className={`w-full h-12 px-4 rounded-xl flex items-center gap-3 text-white font-semibold text-sm transition ${
                  activeTab === 'help' ? 'bg-white/30' : 'hover:bg-white/15'
                }`}
              >
                <HelpCircle className="w-5 h-5" />
                <span>Help & Support</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-white/20">
            <button
              onClick={handleLogout}
              className="w-full h-12 px-4 rounded-xl flex items-center gap-3 text-white font-semibold text-sm hover:bg-white/15 transition"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Backdrop for sidebar */}
        {isSidebarOpen && (
          <div onClick={() => setIsSidebarOpen(false)} className="absolute inset-0 bg-black/20 z-30 backdrop-blur-[1px]" />
        )}

        {/* Main Content Panel */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto min-h-full bg-[#fffce9] rounded-3xl border border-[rgba(98,133,67,0.12)] p-6 shadow-sm">
            {renderDashboard()}
          </div>
        </main>

        {/* Floating Aashi AI Assistant Button */}
        <button
          onClick={() => setIsAashiOpen(true)}
          className="absolute right-6 bottom-6 z-40 bg-[#789b55] hover:bg-[#628543] text-white px-5 py-4 rounded-full shadow-2xl flex items-center gap-3 transition transform hover:scale-105"
          title="Open Aashi - Multilingual AI Assistant"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm tracking-wide">Ask Aashi AI</span>
        </button>

      </div>

      {/* Modals & Overlays */}
      <AashiAssistant isOpen={isAashiOpen} onClose={() => setIsAashiOpen(false)} />
      <NotificationsModal isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
      <ProfileModal
        isOpen={isProfileOpen}
        profile={currentUser}
        onClose={() => setIsProfileOpen(false)}
        onUpdate={(updated) => setCurrentUser(updated)}
      />

    </div>
  );
}
