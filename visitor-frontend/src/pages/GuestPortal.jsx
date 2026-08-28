import React, { useState, useEffect } from 'react';
import { UserPlus, CheckCircle2 } from 'lucide-react';

export default function GuestPortal() {
  const [hosts, setHosts] = useState([]);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [password, setPassword] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [hasLaptop, setHasLaptop] = useState('without'); // 'with' or 'without'
  const [company, setCompany] = useState('');
  const [purpose, setPurpose] = useState('');
  const [hostId, setHostId] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  useEffect(() => {
    // Fetch host list for dropdown
    fetch('http://localhost:5000/api/hosts')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setHosts(data);
          setHostId(data[0].id);
        }
      })
      .catch(err => console.error('Error fetching hosts:', err));
  }, []);

  const handleSubmit = async (e) => {
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
          purpose,
          hostId
        })
      });

      if (res.ok) {
        setSuccessMessage(true);
        // Clear form
        setGuestName('');
        setGuestEmail('');
        setPassword('');
        setGuestPhone('');
        setCompany('');
        setPurpose('');
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to submit visit request.');
      }
    } catch (err) {
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* Reduced max-height and padding so the title & header are always in view */}
      <div className="bg-white rounded-3xl shadow-xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-100 my-auto">
        
        {/* Fixed Header with Title */}
        <div className="bg-emerald-900 px-6 py-5 text-white shrink-0">
          <h1 className="text-lg font-bold flex items-center space-x-2">
            <UserPlus className="w-5 h-5" />
            <span>Visitor Registration Form</span>
          </h1>
          <p className="text-xs text-emerald-200 mt-1">Please fill in your visit details</p>
        </div>

        {/* Scrollable Body Content */}
        <div className="overflow-y-auto flex-1 p-6">
          {successMessage ? (
            <div className="py-10 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h2 className="text-xl font-bold text-slate-800">Request Submitted!</h2>
              <p className="text-sm text-slate-500">Your visit request has been sent for security approval.</p>
              <button 
                onClick={() => setSuccessMessage(false)} 
                className="mt-4 px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
                <input 
                  type="text" 
                  placeholder="Enter full name" 
                  value={guestName} 
                  onChange={e => setGuestName(e.target.value)} 
                  required 
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
                <input 
                  type="email" 
                  placeholder="Enter email" 
                  value={guestEmail} 
                  onChange={e => setGuestEmail(e.target.value)} 
                  required 
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
                <input 
                  type="password" 
                  placeholder="Create a password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number</label>
                <input 
                  type="text" 
                  placeholder="Enter phone number" 
                  value={guestPhone} 
                  onChange={e => setGuestPhone(e.target.value)} 
                  required 
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Device Status</label>
                <select 
                  value={hasLaptop} 
                  onChange={e => setHasLaptop(e.target.value)} 
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700"
                >
                  <option value="without">Without Laptop</option>
                  <option value="with">With Laptop</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Company They Came From</label>
                <input 
                  type="text" 
                  placeholder="e.g. Acme Corp" 
                  value={company} 
                  onChange={e => setCompany(e.target.value)} 
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Host Employee</label>
                <select 
                  value={hostId} 
                  onChange={e => setHostId(e.target.value)} 
                  required 
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700"
                >
                  {hosts.map(h => (
                    <option key={h.id} value={h.id}>
                      {h.name} — {h.department || 'General'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Purpose of Visit</label>
                <textarea 
                  placeholder="Enter purpose of visit" 
                  value={purpose} 
                  onChange={e => setPurpose(e.target.value)} 
                  required 
                  rows="3"
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold shadow-md transition cursor-pointer mb-2"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Visit Request'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}