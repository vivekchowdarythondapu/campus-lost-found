import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { MapPin, Calendar, Search } from 'lucide-react';

const categories = [
  'Electronics', 'Books', 'Clothing', 'Accessories',
  'Documents', 'Keys', 'Bags', 'Jewellery',
  'Vehicles Key', 'Other'
];
const FoundItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = { type: 'found' };
      if (search) params.search = search;
      if (category) params.category = category;
      const { data } = await API.get('/items', { params });
      setItems(data.items);
    } catch {
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, [search, category]);

  return (
    <div className="min-h-screen dot-grid">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[var(--success)]" />
            <span className="text-[var(--success)] text-sm font-medium uppercase tracking-wider">Found Items</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-white">Items waiting for owners</h1>
          <p className="text-[var(--muted)] mt-2">Browse all found items reported on campus</p>
        </div>

        <div className="glass rounded-2xl border border-[var(--border)] p-4 mb-8 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="text" placeholder="Search found items..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="input-dark w-full pl-9 pr-4 py-2.5 rounded-xl text-sm"
            />
          </div>
          <select
            value={category} onChange={e => setCategory(e.target.value)}
            className="input-dark px-4 py-2.5 rounded-xl text-sm min-w-40"
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass rounded-2xl border border-[var(--border)] h-72 animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="font-display text-xl font-semibold text-white mb-2">No found items yet</h3>
            <p className="text-[var(--muted)] mb-4">Be the first to post a found item</p>
            <Link to="/post" className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium">
              Post Found Item
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item, i) => (
              <Link to={`/items/${item._id}`} key={item._id}>
                <div className="glass rounded-2xl border border-[var(--border)] overflow-hidden item-card">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-full h-44 object-cover" />
                  ) : (
                    <div className="w-full h-44 flex items-center justify-center"
                      style={{ background: 'rgba(0,214,143,0.05)' }}>
                      <span className="text-4xl opacity-40">📦</span>
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="badge-found text-xs px-2.5 py-1 rounded-full font-medium">FOUND</span>
                      <span className="badge-category text-xs px-2.5 py-1 rounded-full">{item.category}</span>
                    </div>
                    <h3 className="font-display font-semibold text-white text-base mb-1">{item.title}</h3>
                    <p className="text-[var(--muted)] text-sm line-clamp-2 mb-3">{item.description}</p>
                    <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                      <span className="flex items-center gap-1"><MapPin size={12} />{item.location}</span>
                      <span className="flex items-center gap-1"><Calendar size={12} />{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoundItems;