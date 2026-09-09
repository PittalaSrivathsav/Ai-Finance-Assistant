import React, { useState, useEffect, useRef } from 'react';
import { Leaf, Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const GOOGLE_CLIENT_ID = '96699893470-v89e105muavipb1o5i3gmv8pmo8tp560.apps.googleusercontent.com';

export const LoginPage = () => {
  const { setActiveTab, loginUser, loginWithGoogle } = useFinance();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
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
      setError(err.message || 'Google sign-in failed. Please try again.');
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
            text: 'continue_with',
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
      await loginUser(email, password);
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden w-full max-w-4xl grid grid-cols-1 md:grid-cols-2">

        {/* Left Side */}
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
              Welcome Back!
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Login to continue your financial journey with AI-driven insights and automatic categorization.
            </p>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-emerald-200/50 shadow-sm mt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-lg">
                  ₹
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Smart Budgeting</p>
                  <p className="text-sm font-bold text-slate-800">Track & Automate</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            AI-driven Financial Management Platform
          </div>
        </div>

        {/* Right Side */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-900">Login</h3>
            <p className="text-xs text-slate-500 mt-1">Enter your credentials to access your account</p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Native Google Sign-In Button Container */}
          <div className="w-full flex justify-center mb-4 min-h-[44px]">
            {googleLoading ? (
              <div className="flex items-center justify-center gap-2 py-2 text-xs text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                <span>Signing in with Google...</span>
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
                  placeholder="Enter your password"
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

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 w-3.5 h-3.5"
                />
                <span>Remember me</span>
              </label>
              <button type="button" className="text-emerald-600 font-medium hover:underline">
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500">
            <p className="font-semibold text-slate-700 mb-0.5">Demo Credentials:</p>
            <p>Email: <span className="font-mono text-emerald-700 font-medium">srivathsav@example.com</span></p>
            <p>Password: <span className="font-mono text-emerald-700 font-medium">password123</span></p>
          </div>

          <p className="text-center text-xs text-slate-500 mt-4">
            Don't have an account?{' '}
            <button
              onClick={() => setActiveTab('signup')}
              className="text-emerald-600 font-semibold hover:underline"
            >
              Sign Up
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};
