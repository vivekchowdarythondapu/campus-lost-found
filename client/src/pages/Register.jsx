import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email.endsWith('@srmap.edu.in')) {
      toast.error('Please use your SRM AP college email (@srmap.edu.in)');
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', form);
      login(data);
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen dot-grid flex items-center justify-center px-4 py-12">
      <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-[var(--accent2)] opacity-10 rounded-full blur-3xl pointer-events-none" />
      <div className="w-full max-w-md animate-fade-up">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent2)] flex items-center justify-center text-xl font-bold text-white mx-auto mb-4">
            LF
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Create account</h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
            Join the SRM AP Campus Lost & Found portal
          </p>
        </div>

        <div className="glass rounded-2xl border border-[var(--border)] p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2"
                style={{ color: 'var(--muted)' }}>Full name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--muted)' }} />
                <input type="text" required value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="input-dark w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                  placeholder="Vivek Chowdary" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2"
                style={{ color: 'var(--muted)' }}>College email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--muted)' }} />
                <input type="email" required value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="input-dark w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                  placeholder="firstname_lastname@srmap.edu.in" />
              </div>
              <p className="text-xs mt-1.5 flex items-center gap-1"
                style={{ color: 'var(--muted)' }}>
                <span>🎓</span>
                <span>Only SRM AP college emails are allowed</span>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2"
                style={{ color: 'var(--muted)' }}>
                Phone <span style={{ opacity: 0.5 }}>(optional)</span>
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--muted)' }} />
                <input type="text" value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="input-dark w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                  placeholder="9876543210" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2"
                style={{ color: 'var(--muted)' }}>Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--muted)' }} />
                <input type="password" required value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="input-dark w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                  placeholder="Min 6 characters" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium">
              {loading ? 'Creating account...' : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </button>
          </form>
        </div>

        <div className="glass rounded-xl border border-[var(--border)] p-4 mt-4">
          <p className="text-xs text-center" style={{ color: 'var(--muted)' }}>
            🎓 Exclusively for <strong className="text-white">SRM AP University</strong> students.
            Use your college email <strong className="text-white">firstname_lastname@srmap.edu.in</strong>
          </p>
        </div>

        <p className="text-center text-sm mt-4" style={{ color: 'var(--muted)' }}>
          Already have an account?{' '}
          <Link to="/login" className="font-medium hover:underline"
            style={{ color: 'var(--accent)' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;