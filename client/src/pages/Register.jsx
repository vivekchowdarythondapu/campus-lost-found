import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { Mail, Lock, User, Phone, ArrowRight, Shield } from 'lucide-react';

const Register = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    confirmPassword: '', phone: '', otp: ''
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error('Please enter name and email first');
      return;
    }
    if (!form.email.endsWith('@srmap.edu.in')) {
      toast.error('Please use your SRM AP college email (@srmap.edu.in)');
      return;
    }
    setLoading(true);
    try {
      await API.post('/auth/send-otp', {
        name: form.name,
        email: form.email
      });
      toast.success('OTP sent to your college email!');
      setOtpSent(true);
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      await API.post('/auth/send-otp', {
        name: form.name,
        email: form.email
      });
      toast.success('OTP resent successfully!');
    } catch (err) {
      toast.error('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters!');
      return;
    }
    if (!form.otp || form.otp.length !== 6) {
      toast.error('Please enter the 6-digit OTP');
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        otp: form.otp
      });
      login(data);
      toast.success('Account created successfully!');
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
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent2)] flex items-center justify-center text-xl font-bold text-white mx-auto mb-4">
            LF
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Create account</h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
            Join the SRM AP Campus Lost & Found portal
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
              style={{
                background: step >= 1 ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                color: step >= 1 ? 'white' : 'var(--muted)'
              }}>1</div>
            <span className="text-xs" style={{ color: step >= 1 ? 'white' : 'var(--muted)' }}>
              Details
            </span>
          </div>
          <div className="w-8 h-px" style={{ background: 'var(--border)' }} />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
              style={{
                background: step >= 2 ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                color: step >= 2 ? 'white' : 'var(--muted)'
              }}>2</div>
            <span className="text-xs" style={{ color: step >= 2 ? 'white' : 'var(--muted)' }}>
              Verify OTP
            </span>
          </div>
        </div>

        <div className="glass rounded-2xl border border-[var(--border)] p-8">

          {/* Step 1 — Details */}
          {step === 1 && (
            <form onSubmit={handleSendOTP} className="space-y-5">
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

              <div>
                <label className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--muted)' }}>Confirm Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--muted)' }} />
                  <input type="password" required value={form.confirmPassword}
                    onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                    className="input-dark w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                    placeholder="Repeat password" />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium">
                {loading ? 'Sending OTP...' : (
                  <>Send OTP to College Email <ArrowRight size={16} /></>
                )}
              </button>
            </form>
          )}

          {/* Step 2 — OTP Verification */}
          {step === 2 && (
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="text-center p-4 rounded-xl mb-2"
                style={{ background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)' }}>
                <Shield size={24} className="mx-auto mb-2" style={{ color: 'var(--accent)' }} />
                <p className="text-white text-sm font-medium">OTP sent to:</p>
                <p className="text-sm mt-1" style={{ color: 'var(--accent)' }}>{form.email}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                  Check your college email inbox. OTP expires in 10 minutes.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--muted)' }}>Enter 6-digit OTP</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={form.otp}
                  onChange={e => setForm({ ...form, otp: e.target.value.replace(/\D/g, '') })}
                  className="input-dark w-full px-4 py-4 rounded-xl text-center text-2xl font-bold tracking-widest"
                  placeholder="000000"
                  autoFocus
                />
              </div>

              <button type="submit" disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium">
                {loading ? 'Verifying...' : (
                  <>Verify & Create Account <ArrowRight size={16} /></>
                )}
              </button>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm transition-colors"
                  style={{ color: 'var(--muted)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'white'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="text-sm transition-colors"
                  style={{ color: 'var(--accent)' }}
                >
                  Resend OTP
                </button>
              </div>
            </form>
          )}
        </div>

        {/* College notice */}
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