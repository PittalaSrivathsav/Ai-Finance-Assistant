import React, { useState, useEffect, useRef } from 'react';
import { Leaf, Eye, EyeOff, Lock, Mail, User, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const GOOGLE_CLIENT_ID = '96699893470-v89e105muavipb1o5i3gmv8pmo8tp560.apps.googleusercontent.com';

export const SignUpPage = () => {
  const { setActiveTab, registerUser, loginWithGoogle } = useFinance();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const googleBtnRef = useRef(null);

  const handleGoogleResponse = async (response) => {
    setError('');
    setGoogleLoading(true);
    try {
      await loginWithGoogle(response.credential);
    } catch (err) {
      setError(err.message || 'Google sign-up failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  // Initialize and render Google button immediately
  useEffect(() => {
    const initGoogle = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
          auto_select: false,
        });

        if (googleBtnRef.current) {
          googleBtnRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            theme: 'outline',
            size: 'large',
            type: 'standard',
            shape: 'rectangular',
            text: 'signup_with',
            width: googleBtnRef.current.offsetWidth || 340,
            logo_alignment: 'left',
          });
        }
      }
    };

    if (window.google?.accounts?.id) {
      initGoogle();
    } else {
      const timer = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(timer);
          initGoogle();
        }
      }, 50);
      return () => clearInterval(timer);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await registerUser(name, email, password);
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden w-full max-w-4xl grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Side (Illustration & Welcome) */}
        <div className="bg-gradient-to-br from-emerald-50 via-emerald-100/50 to-teal-50 p-8 sm:p-12 flex flex-col justify-between border-r border-slate-100">
          <div 
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <Leaf className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-900 text-base">AI Finance Assistant</span>
          </div>

          <div className="my-10 space-y-4">
            <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">
              Create Your Account
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Start your journey towards smarter financial management with machine learning categorization and automated forecasts.
            </p>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-emerald-200/50 shadow-sm mt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                  AI
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Automated Intelligence</p>
                  <p className="text-sm font-bold text-slate-800">Categorize & Forecast</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            AI Finance Assistant © 2026
          </div>
        </div>

        {/* Right Side (Sign Up Form) */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-900">Sign Up</h3>
            <p className="text-xs text-slate-500 mt-1">Create an account to get started</p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-xs animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Native Google Sign-Up Button Container */}
          <div className="w-full flex justify-center mb-4 min-h-[44px]">
            {googleLoading ? (
              <div className="flex items-center justify-center gap-2 py-2 text-xs text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                <span>Signing up with Google...</span>
              </div>
            ) : (
              <div ref={googleBtnRef} className="w-full flex justify-center" />
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Sign Up</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-6">
            Already have an account?{' '}
            <button
              onClick={() => setActiveTab('login')}
              className="text-emerald-600 font-semibold hover:underline"
            >
              Login
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};
