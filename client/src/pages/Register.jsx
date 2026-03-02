/** @fileoverview Registration page with name, email, password, confirm password */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { register as registerAPI } from '../api/auth';
import { Zap, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const loginStore = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const data = await registerAPI(name, email, password);
      loginStore(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Zap className="w-12 h-12 text-neon-cyan mx-auto mb-3" />
          <h1 className="font-accent text-neon-cyan font-bold text-2xl tracking-wider">V</h1>
          <p className="text-gray-500 text-sm mt-1">Begin your evolution.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-bg-card border border-border-dim rounded-xl p-6">
          <h2 className="text-lg font-heading text-white mb-4">Create Account</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="mb-3">
            <label className="block text-sm text-gray-400 mb-1">Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-bg-elevated border border-border-dim rounded-lg pl-10 pr-4 py-2.5 text-white text-sm focus:border-neon-cyan focus:outline-none transition-colors"
                placeholder="Your name"
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-bg-elevated border border-border-dim rounded-lg pl-10 pr-4 py-2.5 text-white text-sm focus:border-neon-cyan focus:outline-none transition-colors"
                placeholder="pilot@v.dev"
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-bg-elevated border border-border-dim rounded-lg pl-10 pr-10 py-2.5 text-white text-sm focus:border-neon-cyan focus:outline-none transition-colors"
                placeholder="Min 6 characters"
                required
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-1">Confirm Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
              <input
                type={showPass ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full bg-bg-elevated border border-border-dim rounded-lg pl-10 pr-4 py-2.5 text-white text-sm focus:border-neon-cyan focus:outline-none transition-colors"
                placeholder="Repeat password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-neon-cyan text-bg-primary font-bold rounded-lg hover:bg-neon-cyan/90 transition-colors disabled:opacity-50 text-sm"
          >
            {loading ? 'Creating...' : 'Register'}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already registered?{' '}
            <Link to="/login" className="text-neon-cyan hover:underline">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
