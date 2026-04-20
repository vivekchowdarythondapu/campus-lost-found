import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { Upload, MapPin, Calendar, Tag, FileText, Type } from 'lucide-react';

const categories = [
  'Electronics', 'Books', 'Clothing', 'Accessories',
  'Documents', 'Keys', 'Bags', 'Jewellery',
  'Vehicles Key', 'Other'
];

const PostItem = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [form, setForm] = useState({
    title: '', description: '', category: '',
    type: 'lost', location: '', date: ''
  });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) { setImage(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (image) formData.append('image', image);
      await API.post('/items', formData);
      toast.success('Item posted! AI is finding matches...');
      navigate('/my-items');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen dot-grid">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-white">Post an Item</h1>
          <p style={{ color: 'var(--muted)' }} className="mt-2">
            Report a lost or found item on campus
          </p>
        </div>

        <div className="glass rounded-2xl border border-[var(--border)] p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3"
                style={{ color: 'var(--muted)' }}>Item Type</label>
              <div className="grid grid-cols-2 gap-3">
                {['lost', 'found'].map(t => (
                  <button type="button" key={t}
                    onClick={() => setForm({ ...form, type: t })}
                    className="py-3 rounded-xl font-medium text-sm transition-all border"
                    style={{
                      borderColor: form.type === t
                        ? t === 'lost' ? 'var(--danger)' : 'var(--success)'
                        : 'var(--border)',
                      background: form.type === t
                        ? t === 'lost' ? 'rgba(255,77,109,0.1)' : 'rgba(0,214,143,0.1)'
                        : 'transparent',
                      color: form.type === t
                        ? t === 'lost' ? 'var(--danger)' : 'var(--success)'
                        : 'var(--muted)'
                    }}>
                    {t === 'lost' ? 'Lost Item' : 'Found Item'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2"
                style={{ color: 'var(--muted)' }}>Title</label>
              <div className="relative">
                <Type size={15} className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--muted)' }} />
                <input type="text" required value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="input-dark w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                  placeholder="e.g. Blue iPhone 13" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2"
                style={{ color: 'var(--muted)' }}>Description</label>
              <div className="relative">
                <FileText size={15} className="absolute left-3 top-3"
                  style={{ color: 'var(--muted)' }} />
                <textarea required rows={3} value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="input-dark w-full pl-10 pr-4 py-3 rounded-xl text-sm resize-none"
                  placeholder="Describe the item in detail..." />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--muted)' }}>Category</label>
                <div className="relative">
                  <Tag size={15} className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--muted)' }} />
                  <select required value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="input-dark w-full pl-10 pr-4 py-3 rounded-xl text-sm appearance-none">
                    <option value="">Select...</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--muted)' }}>Date</label>
                <div className="relative">
                  <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--muted)' }} />
                  <input type="date" required value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    className="input-dark w-full pl-10 pr-4 py-3 rounded-xl text-sm" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2"
                style={{ color: 'var(--muted)' }}>Location on Campus</label>
              <div className="relative">
                <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--muted)' }} />
                <input type="text" required value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                  className="input-dark w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                  placeholder="e.g. Library, Block A, Cafeteria" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2"
                style={{ color: 'var(--muted)' }}>
                Image <span style={{ opacity: 0.5 }}>(optional)</span>
              </label>
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed rounded-xl p-6 text-center transition-all"
                  style={{ borderColor: preview ? 'var(--accent)' : 'var(--border)' }}>
                  {preview ? (
                    <img src={preview} alt="preview"
                      className="max-h-40 mx-auto rounded-lg object-cover" />
                  ) : (
                    <div style={{ color: 'var(--muted)' }}>
                      <Upload size={24} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Click to upload image</p>
                      <p className="text-xs mt-1 opacity-50">JPG, PNG, WebP up to 5MB</p>
                    </div>
                  )}
                </div>
                <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
              </label>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3.5 rounded-xl font-medium flex items-center justify-center gap-2">
              {loading ? 'Posting...' : 'Post Item'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostItem;