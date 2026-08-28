import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, XCircle, Check, LogOut, UserPlus, X } from 'lucide-react';

export default function SecurityDashboard() {
  const [pendingVisits, setPendingVisits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states for walk-in guest (hostId removed)
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [password, setPassword] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [hasLaptop, setHasLaptop] = useState('without'); // 'with' or 'without'
  const [company, setCompany] = useState('');
  const [purpose, setPurpose] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPendingVisits = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/security/pending');
      const data = await res.json();
      setPendingVisits(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching visits:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingVisits();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/security/visits/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchPendingVisits();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleWalkInSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:5000/api/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          guestName, 
          guestEmail, 
          password, 
          guestPhone, 
          hasLaptop: hasLaptop === 'with', 
          company, 
          purpose 
        })
      });
      if (res.ok) {
        setGuestName('');
        setGuestEmail('');
        setPassword('');
        setGuestPhone('');
        setHasLaptop('without');
        setCompany('');
        setPurpose('');
        setIsModalOpen(false);
        fetchPendingVisits();
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to register walk-in guest.');
      }
    } catch (err) {
      console.error('Error submitting walk-in:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-emerald-900 text-white py-4 px-8 shadow-md flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-600 p-2 rounded-xl">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Security Clearance Portal</h1>
            <p className="text-xs text-emerald-200">Gate & Access Control Dashboard</p>
          </div>
        </div>
        <Link to="/" className="flex items-center space-x-1.5 text-xs bg-emerald-800 hover:bg-emerald-700 px-4 py-2 rounded-xl transition">
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4 bg-slate-50/50">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Pending Visitor Queue</h2>
              <p className="text-xs text-slate-500">Authorize or deny arriving guests</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                type="button"
                onClick={() => setIsModalOpen(true)} 
                className="flex items-center space-x-2 text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 px-4 py-2.5 rounded-xl shadow-md transition cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Register Walk-In</span>
              </button>
              <button 
                type="button"
                onClick={fetchPendingVisits} 
                className="text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-3.5 py-2.5 rounded-xl shadow-sm transition cursor-pointer"
              >
                Refresh List
              </button>
            </div>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-12 text-slate-400">Loading pending requests...</div>
            ) : pendingVisits.length === 0 ? (
              <div className="text-center py-16">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h3 className="text-slate-800 font-bold">All caught up!</h3>
                <p className="text-slate-400 text-sm mt-1">No pending visitor requests waiting for review.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingVisits.map(visit => (
                  <div key={visit.id} className="border border-slate-100 bg-slate-50/60 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-slate-900 text-lg">{visit.guestName}</h3>
                        <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Pending</span>
                      </div>
                      <p className="text-sm text-slate-600">Email: <span className="text-slate-800 font-medium">{visit.guestEmail}</span></p>
                      <p className="text-sm text-slate-600">Phone: <span className="text-slate-800 font-medium">{visit.guestPhone}</span></p>
                      <p className="text-sm text-slate-600">Company: <span className="text-slate-800 font-medium">{visit.company || 'Independent'}</span></p>
                      <p className="text-sm text-slate-600">Device: <span className="text-slate-800 font-medium">{visit.hasLaptop ? 'With Laptop' : 'Without Laptop'}</span></p>
                      <p className="text-sm text-slate-600">Purpose: <span className="text-slate-800 font-medium">{visit.purpose}</span></p>
                    </div>

                    <div className="flex items-center space-x-2 w-full md:w-auto pt-2 md:pt-0">
                      <button onClick={() => handleUpdateStatus(visit.id, 'APPROVED')} className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition flex items-center justify-center space-x-1 cursor-pointer">
                        <Check className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      <button onClick={() => handleUpdateStatus(visit.id, 'DENIED')} className="flex-1 md:flex-none bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition flex items-center justify-center space-x-1 cursor-pointer">
                        <XCircle className="w-4 h-4" />
                        <span>Deny</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Walk-In Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden my-6 border border-emerald-900/20">
            
            {/* Modal Header (Fixed / Shrink-0) */}
            <div className="bg-emerald-900 px-6 py-4 flex justify-between items-center text-white shrink-0">
              <div className="flex items-center space-x-3">
                <div className="bg-emerald-600 p-2 rounded-xl">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-base">Register Gate Walk-In Guest</h2>
                  <p className="text-xs text-emerald-200">Gate & Access Control Form</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)} 
                className="text-emerald-200 hover:text-white transition cursor-pointer bg-emerald-800 p-1.5 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Scrollable Form Body */}
            <form onSubmit={handleWalkInSubmit} className="p-6 space-y-4 bg-emerald-50/30 overflow-y-auto flex-1">
              <div className="border-b border-emerald-200 pb-3 mb-2">
                <h3 className="text-lg font-bold text-emerald-900">Guest Form</h3>
                <p className="text-xs text-emerald-700">Fill in the details below to register a new guest</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-900 mb-1">Full Name</label>
                <input 
                  type="text" 
                  placeholder="Enter full name" 
                  value={guestName} 
                  onChange={e => setGuestName(e.target.value)} 
                  required 
                  className="w-full p-3.5 bg-white border border-emerald-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-900 mb-1">Email Address</label>
                <input 
                  type="email" 
                  placeholder="Enter email" 
                  value={guestEmail} 
                  onChange={e => setGuestEmail(e.target.value)} 
                  required 
                  className="w-full p-3.5 bg-white border border-emerald-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-900 mb-1">Password</label>
                <input 
                  type="password" 
                  placeholder="Create a password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                  className="w-full p-3.5 bg-white border border-emerald-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-900 mb-1">Phone Number</label>
                <input 
                  type="text" 
                  placeholder="Enter phone number" 
                  value={guestPhone} 
                  onChange={e => setGuestPhone(e.target.value)} 
                  required 
                  className="w-full p-3.5 bg-white border border-emerald-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-900 mb-1">Device Status</label>
                <select 
                  value={hasLaptop} 
                  onChange={e => setHasLaptop(e.target.value)} 
                  className="w-full p-3.5 bg-white border border-emerald-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700"
                >
                  <option value="without">Without Laptop</option>
                  <option value="with">With Laptop</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-900 mb-1">Company They Came From</label>
                <input 
                  type="text" 
                  placeholder="e.g. Acme Corp" 
                  value={company} 
                  onChange={e => setCompany(e.target.value)} 
                  className="w-full p-3.5 bg-white border border-emerald-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-900 mb-1">Purpose of Visit</label>
                <textarea 
                  placeholder="Enter purpose of visit" 
                  value={purpose} 
                  onChange={e => setPurpose(e.target.value)} 
                  required 
                  rows="3"
                  className="w-full p-3.5 bg-white border border-emerald-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800" 
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2 pb-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-5 py-2.5 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-semibold hover:bg-emerald-100 transition cursor-pointer bg-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow transition cursor-pointer"
                >
                  {isSubmitting ? 'Registering...' : 'Register Walk-In'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}