import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { loginUser } from '../features/user/userSlice';
import { Lock, Mail, AlertCircle, Loader } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { userInfo, loading, error } = useAppSelector((state) => state.user);

  // Parse redirect path from query parameters
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!email || !password) {
      setValidationError('Please fill in all fields.');
      return;
    }

    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 rounded-3xl bg-linear-to-br from-bg-surface/60 to-bg-dark/60 border border-border/50 shadow-2xl backdrop-blur-md">
        
        {/* Brand/Header */}
        <div className="text-center">
          <span className="text-2xl font-black tracking-wide text-white">
            🌾 Ghar-<span className="text-accent">Flavour</span>
          </span>
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            Sign in to access your home-cooked meals & grocery orders
          </p>
        </div>

        {/* Error Banners */}
        {(validationError || error) && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-400 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <span>{validationError || error}</span>
          </div>
        )}

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-xs">
            {/* Email Field */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="email-address" className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl bg-bg-dark/50 text-white placeholder-text-muted/50 focus:outline-hidden focus:border-accent transition-all text-sm"
                  placeholder="name@domain.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 text-left">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl bg-bg-dark/50 text-white placeholder-text-muted/50 focus:outline-hidden focus:border-accent transition-all text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full py-3 rounded-xl bg-linear-to-r from-primary to-accent text-white font-semibold shadow-lg hover:shadow-primary/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>

        {/* Footer Link */}
        <div className="text-center text-sm pt-4 border-t border-border/30">
          <span className="text-text-muted">New Customer? </span>
          <Link
            to={redirect !== '/' ? `/register?redirect=${redirect}` : '/register'}
            className="font-semibold text-accent hover:text-primary transition-colors"
          >
            Create an account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
