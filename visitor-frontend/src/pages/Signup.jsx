import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, CheckCircle2 } from 'lucide-react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('EMPLOYEE');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, department })
      });
      const data = await res.json();

      if (res.ok) {
        navigate('/login');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Cannot connect to authentication server');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
        <div className="text-center mb-6">
          <div className="bg-emerald-100 text-emerald-700 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <UserPlus className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Create Account</h2>
          <p className="text-xs text-slate-400 mt-1">Register your staff or security profile</p>
        </div>

        {error && <div className="mb-4 p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs">{error}</div>}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Full Name</label>
            <input type="text" placeholder="Abebe Bikila" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Email</label>
            <input type="email" placeholder="user@ethiotelecom.et" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Password</label>
            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Account Role</label>
            <select value={role} onChange={e => setRole(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm font-medium">
              <option value="EMPLOYEE">Employee / Host Staff</option>
              <option value="SECURITY">Security Officer / Gate Guard</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Department</label>
            <input type="text" placeholder="IT, HR, Security, etc." value={department} onChange={e => setDepartment(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm" />
          </div>

          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl shadow transition mt-2 text-sm">
            Complete Registration
          </button>
        </form>

        <div className="text-center mt-4">
          <Link to="/login" className="text-xs text-emerald-700 font-semibold hover:underline">
            Already registered? Login here
          </Link>
        </div>
      </div>
    </div>
  );
}