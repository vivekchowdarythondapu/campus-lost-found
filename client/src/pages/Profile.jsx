import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { User, Mail, Phone, Lock, Upload, Package, CheckCircle, Zap } from 'lucide-react';

const Profile = () => {
  const { user, login } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState('');
  const [form, setForm] = useState({
    name: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get('/profile');
        setProfile(data);
        setForm({
          name: data.name || '',
          phone: data.phone || '',
          password: '',
          confirmPassword: ''
        });
        setPreview(data.avatar || '');
      } catch {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    if (form.password && form.password.length < 6) {
      toast.error('Password must be at least 6 characters!');
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('phone', form.phone);
      if (form.password) formData.append('password', form.password);
      if (avatar) formData.append('avatar', avatar, avatar.name);
      const { data } = await API.put('/profile', formData);
      login(data);
      toast.success('Profile updated successfully!');
      setForm(prev => ({ ...prev, password: '', confirmPassword: '' }));
      setAvatar(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen dot-grid flex items-center justify-center">
      <div style={{ color: 'var(--muted)' }}>Loading profile...</div>
    </div>
  );

  return (
    <div className="min-h-screen dot-grid">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-white">Profile</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
            Manage your account settings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Left — Avatar + Stats */}
          <div className="space-y-4">
            {/* Avatar Card */}
            <div className="glass rounded-2xl border border-[var(--border)] p-6 text-center">
              <label className="cursor-pointer block">
                <div className="relative inline-block mb-4">
                  {preview ? (
                    <img src={preview} alt="avatar"
                      className="w-24 h-24 rounded-full object-cover mx-auto border-2"
                      style={{ borderColor: 'var(--accent)' }} />
                  ) : (
                    <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white mx-auto"
                      style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent2))' }}>
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--accent)' }}>
                    <Upload size={12} className="text-white" />
                  </div>
                </div>
                <input type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
                <p className="text-xs" style={{ color: 'var(--muted)' }}>
                  Click to change photo
                </p>
              </label>
              <h3 className="font-display font-bold text-white mt-3">{profile?.name}</h3>
              <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>{profile?.email}</p>
              <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full"
                style={{
                  background: profile?.role === 'admin' ? 'rgba(108,99,255,0.1)' : 'rgba(255,255,255,0.05)',
                  color: profile?.role === 'admin' ? 'var(--accent)' : 'var(--muted)',
                  border: `1px solid ${profile?.role === 'admin' ? 'rgba(108,99,255,0.2)' : 'rgba(255,255,255,0.1)'}`
                }}>
                {profile?.role}
              </span>
            </div>

            {/* Stats Card */}
            <div className="glass rounded-2xl border border-[var(--border)] p-5">
              <h3 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">
                My Stats
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Total Items', value: profile?.stats?.totalItems || 0, icon: Package, color: 'var(--accent)' },
                  { label: 'Lost Items', value: profile?.stats?.lostItems || 0, icon: Package, color: 'var(--danger)' },
                  { label: 'Found Items', value: profile?.stats?.foundItems || 0, icon: Package, color: 'var(--success)' },
                  { label: 'Returned', value: profile?.stats?.returnedItems || 0, icon: CheckCircle, color: 'var(--success)' },
                  { label: 'Matched', value: profile?.stats?.matchedItems || 0, icon: Zap, color: '#A78BFA' },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <s.icon size={14} style={{ color: s.color }} />
                      <span className="text-sm" style={{ color: 'var(--muted)' }}>{s.label}</span>
                    </div>
                    <span className="font-display font-bold text-white">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Edit Form */}
          <div className="md:col-span-2">
            <div className="glass rounded-2xl border border-[var(--border)] p-6">
              <h2 className="font-display text-xl font-bold text-white mb-6">
                Edit Profile
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-2"
                    style={{ color: 'var(--muted)' }}>Full Name</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2"
                      style={{ color: 'var(--muted)' }} />
                    <input type="text" value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="input-dark w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                      placeholder="Your full name" />
                  </div>
                </div>

                {/* Email — read only, shows actual email */}
                <div>
                  <label className="block text-sm font-medium mb-2"
                    style={{ color: 'var(--muted)' }}>Email address</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2"
                      style={{ color: 'var(--muted)' }} />
                    <input
                      type="email"
                      value={profile?.email || ''}
                      disabled
                      className="input-dark w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                      style={{ cursor: 'default' }}
                    />
                  </div>
                  <p className="text-xs mt-1.5 flex items-center gap-1"
                    style={{ color: 'var(--muted)' }}>
                    <span>🔒</span>
                    <span>Your registered email cannot be changed</span>
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium mb-2"
                    style={{ color: 'var(--muted)' }}>Phone Number</label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2"
                      style={{ color: 'var(--muted)' }} />
                    <input type="text" value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      className="input-dark w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                      placeholder="9876543210" />
                  </div>
                </div>

                {/* Password section */}
                <div className="border-t border-[var(--border)] pt-5">
                  <h3 className="font-display font-semibold text-white mb-1">
                    Change Password
                  </h3>
                  <p className="text-xs mb-4" style={{ color: 'var(--muted)' }}>
                    Leave blank if you don't want to change your password
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2"
                        style={{ color: 'var(--muted)' }}>New Password</label>
                      <div className="relative">
                        <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2"
                          style={{ color: 'var(--muted)' }} />
                        <input type="password" value={form.password}
                          onChange={e => setForm({ ...form, password: e.target.value })}
                          className="input-dark w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                          placeholder="Min 6 characters" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2"
                        style={{ color: 'var(--muted)' }}>Confirm New Password</label>
                      <div className="relative">
                        <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2"
                          style={{ color: 'var(--muted)' }} />
                        <input type="password" value={form.confirmPassword}
                          onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                          className="input-dark w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                          placeholder="Repeat new password" />
                      </div>
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={saving}
                  className="btn-primary w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;