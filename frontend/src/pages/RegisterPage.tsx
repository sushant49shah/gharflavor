import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { registerUser } from '../features/user/userSlice';
import { User, Lock, Mail, AlertCircle, Loader } from 'lucide-react';
import Icon from '../assets/icon.svg';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { userInfo, loading, error } = useAppSelector((state) => state.user);

  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!name || !email || !password || !confirmPassword) {
      setValidationError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters.');
      return;
    }

    dispatch(registerUser({ name, email, password }));
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 rounded-3xl bg-linear-to-br from-bg-surface/60 to-bg-dark/60 border border-border/50 shadow-2xl backdrop-blur-md">
        
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
              <img src={Icon} alt="Ghar-Flavour Logo" className="h-12 w-auto" />
              <span className="text-3xl">Ghar</span>
              <span className="text-3xl text-accent">Flavor</span>
            </div>
        </div>

        {/* Errors */}
        {(validationError || error) && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-400 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <span>{validationError || error}</span>
          </div>
        )}

        {/* Form */}
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-xs">
            {/* Name Field */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="fullname" className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                  <User className="h-5 w-5" />
                </div>
                <input
                  id="fullname"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl bg-bg-dark/50 text-white placeholder-text-mtext-text-muted/50 focus:outline-hidden focus:border-accent transition-all text-sm"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="email" className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl bg-bg-dark/50 text-white placeholder-text-mtext-text-muted/50 focus:outline-hidden focus:border-accent transition-all text-sm"
                  placeholder="name@domain.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="password" className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl bg-bg-dark/50 text-white placeholder-text-mtext-text-muted/50 focus:outline-hidden focus:border-accent transition-all text-sm"
                  placeholder="•••••••• (Min 6 chars)"
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="confirmPassword" className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl bg-bg-dark/50 text-white placeholder-text-mtext-text-muted/50 focus:outline-hidden focus:border-accent transition-all text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full py-3 rounded-xl bg-linear-to-r from-primary to-accent text-white font-semibold shadow-lg hover:shadow-primary/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Register'
              )}
            </button>
          </div>
        </form>

        {/* Link to login */}
        <div className="text-center text-sm pt-4 border-t border-border/30">
          <span className="text-text-muted">Already have an account? </span>
          <Link
            to={redirect !== '/' ? `/login?redirect=${redirect}` : '/login'}
            className="font-semibold text-accent hover:text-primary transition-colors"
          >
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
