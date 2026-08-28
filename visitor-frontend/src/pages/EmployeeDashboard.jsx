import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Building2, Users, LogOut, RefreshCw, UserPlus, X, CheckCircle2, AlertCircle } from 'lucide-react';

export default function EmployeeDashboard() {
  const [myVisits, setMyVisits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [company, setCompany] = useState('');
  const [purpose, setPurpose] = useState('');
  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { hostId: routeHostId } = useParams();
  const hostId = routeHostId || "19a93b9d-4114-4986-b82f-b3e5b72c0b50";

  const fetchMyVisits = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/hosts/${hostId}/visits`);
      const data = await res.json();
      setMyVisits(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching employee visits:', err);
      setMyVisits([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyVisits();
  }, [hostId]);

  const handleCreateVisit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNotification(null);

    try {
      const res = await fetch('http://localhost:5000/api/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestName, guestEmail, guestPhone, company, purpose, hostId })
      });
      const data = await res.json();
      if (res.ok) {
        setNotification({ type: 'success', text: 'Guest registered successfully! Pending security approval.' });
        setGuestName(''); setGuestEmail(''); setGuestPhone(''); setCompany(''); setPurpose('');
        fetchMyVisits();
        setTimeout(() => {
          setIsModalOpen(false);
          setNotification(null);
        }, 1500);
      } else {
        setNotification({ type: 'error', text: data.error || 'Failed to submit.' });
      }
    } catch (err) {
      setNotification({ type: 'error', text: 'Server connection error.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-emerald-900 text-white py-4 px-8 shadow-md flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-600 p-2 rounded-xl">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Employee Portal</h1>
            <p className="text-xs text-emerald-200">Ethio Telecom Staff Dashboard</p>
          </div>
        </div>
        <Link to="/" className="flex items-center space-x-1.5 text-xs bg-emerald-800 hover:bg-emerald-700 px-4 py-2 rounded-xl transition">
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Visitors Scheduled For You</h2>
              <p className="text-xs text-slate-500">Track guest approvals and security clearance</p>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center space-x-1 text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 px-3.5 py-2 rounded-xl shadow transition"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Register Guest</span>
              </button>
              <button 
                onClick={fetchMyVisits} 
                className="flex items-center space-x-1 text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-3.5 py-2 rounded-xl shadow-sm transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-12 text-slate-400">Loading visitor list...</div>
            ) : myVisits.length === 0 ? (
              <div className="text-center py-16">
                <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h3 className="text-slate-800 font-bold">No active visitors</h3>
                <p className="text-slate-400 text-sm mt-1">Register a guest using the button above.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myVisits.map(visit => {
                  const status = visit.status || 'PENDING';
                  return (
                    <div key={visit.id} className="border border-slate-100 bg-slate-50/60 p-5 rounded-2xl flex justify-between items-center">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-slate-900 text-lg">{visit.guestName}</h3>
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase ${
                            status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                            status === 'DENIED' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">Company: <span className="text-slate-800 font-medium">{visit.company || 'N/A'}</span></p>
                        <p className="text-sm text-slate-600">Purpose: <span className="text-slate-800 font-medium">{visit.purpose}</span></p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Guest Form Modal for Employee */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="bg-emerald-900 p-6 text-white flex justify-between items-center">
              <h2 className="text-lg font-bold">Add Guest Request</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateVisit} className="p-6 space-y-4">
              {notification && (
                <div className={`p-3 rounded-xl text-xs font-medium ${notification.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
                  {notification.text}
                </div>
              )}
              <input type="text" placeholder="Guest Full Name" value={guestName} onChange={e => setGuestName(e.target.value)} required className="w-full p-3 bg-slate-50 border rounded-xl text-sm" />
              <input type="email" placeholder="Guest Email" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} required className="w-full p-3 bg-slate-50 border rounded-xl text-sm" />
              <input type="text" placeholder="Guest Phone" value={guestPhone} onChange={e => setGuestPhone(e.target.value)} required className="w-full p-3 bg-slate-50 border rounded-xl text-sm" />
              <input type="text" placeholder="Company (Optional)" value={company} onChange={e => setCompany(e.target.value)} className="w-full p-3 bg-slate-50 border rounded-xl text-sm" />
              <textarea placeholder="Purpose of Visit" value={purpose} onChange={e => setPurpose(e.target.value)} required className="w-full p-3 bg-slate-50 border rounded-xl text-sm" rows="2" />
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-xl text-xs font-semibold">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}