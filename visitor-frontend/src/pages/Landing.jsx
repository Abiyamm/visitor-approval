import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, LogIn, UserPlus } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Header */}
      <header className="bg-emerald-900 text-white py-4 px-8 shadow-md flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-600 p-2 rounded-xl">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">Ethio Telecom </span>
        </div>
        <div className="space-x-3">
          <Link to="/login" className="text-sm font-semibold px-4 py-2 text-emerald-200 hover:text-white transition">Login</Link>
          <Link to="/signup" className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-4 py-2 rounded-xl shadow transition">Sign Up</Link>
        </div>
      </header>

      {/* Main Hero Content */}
      <main className="max-w-xl mx-auto px-6 py-20 text-center flex flex-col items-center my-auto">
        <div className="bg-emerald-100 text-emerald-800 p-4 rounded-3xl mb-6 shadow-inner">
          <ShieldCheck className="w-12 h-12 text-emerald-700 mx-auto" />
        </div>
        
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4 leading-tight">
          Ethio Telecom <br /><span className="text-emerald-700">Visitor Management System</span>
        </h1>
        <p className="text-slate-600 text-base mb-8 leading-relaxed">
          Welcome to the central access portal. Please log in or register an account to access host scheduling and security gate clearances.
        </p>

        {/* Entry Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <Link 
            to="/login" 
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg hover:shadow-emerald-200 transition flex items-center justify-center space-x-2 text-sm"
          >
            <LogIn className="w-4 h-4" />
            <span>Account Login</span>
          </Link>

          <Link 
            to="/signup" 
            className="w-full sm:w-auto bg-slate-800 hover:bg-slate-900 text-white font-semibold px-8 py-3.5 rounded-2xl shadow transition flex items-center justify-center space-x-2 text-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create New Account</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 text-center text-xs">
        &copy; 2026 Ethio Telecom. All rights reserved.
      </footer>
    </div>
  );
}