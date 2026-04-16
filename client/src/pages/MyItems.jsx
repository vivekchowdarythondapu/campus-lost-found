import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { Trash2, Eye, Zap, Plus, MapPin } from 'lucide-react';
import QRModal from '../components/QRModal';

const MyItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qrItem, setQrItem] = useState(null);

  const fetchItems = async () => {
    try {
      const { data } = await API.get('/items/my');
      setItems(data);
    } catch {
      toast.error('Failed to load your items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await API.delete(`/items/${id}`);
      toast.success('Item deleted');
      fetchItems();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const statusStyle = (status) => ({
    active: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    matched: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    returned: 'bg-green-500/10 text-green-400 border border-green-500/20',
    rejected: 'bg-red-500/10 text-red-400 border border-red-500/20',
  }[status] || '');

  return (
    <div className="min-h-screen dot-grid">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-display text-4xl font-bold text-white">My Items</h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
              {items.length} item{items.length !== 1 ? 's' : ''} posted
            </p>
          </div>
          <Link to="/post"
            className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium">
            <Plus size={16} /> Post Item
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass rounded-2xl border border-[var(--border)] h-24 animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="font-display text-xl font-semibold text-white mb-2">No items yet</h3>
            <p className="mb-6 text-sm" style={{ color: 'var(--muted)' }}>
              Post your first lost or found item
            </p>
            <Link to="/post"
              className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium">
              <Plus size={16} /> Post Item
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map(item => (
              <div key={item._id}
                className="glass rounded-2xl border border-[var(--border)] p-5 flex items-center gap-5 item-card">
                {item.image && item.image !== '' ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-xl flex-shrink-0"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 text-xl font-bold"
                    style={{
                      background: item.type === 'lost' ? 'rgba(255,77,109,0.1)' : 'rgba(0,214,143,0.1)',
                      color: item.type === 'lost' ? 'var(--danger)' : 'var(--success)'
                    }}>
                    {item.category === 'Electronics' ? '📱' :
                     item.category === 'Books' ? '📚' :
                     item.category === 'Keys' ? '🔑' :
                     item.category === 'Bags' ? '🎒' :
                     item.category === 'Jewellery' ? '💍' :
                     item.category === 'Vehicles' ? '🚗' :
                     item.category === 'Documents' ? '📄' :
                     item.type === 'lost' ? '?' : '📦'}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      item.type === 'lost' ? 'badge-lost' : 'badge-found'
                    }`}>{item.type.toUpperCase()}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusStyle(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-white truncate">{item.title}</h3>
                  <p className="text-sm flex items-center gap-1 mt-0.5" style={{ color: 'var(--muted)' }}>
                    <MapPin size={12} /> {item.location}
                  </p>
                  {item.matches?.length > 0 && (
                    <p className="text-xs mt-1 flex items-center gap-1" style={{ color: '#A78BFA' }}>
                      <Zap size={11} /> {item.matches.length} AI match{item.matches.length > 1 ? 'es' : ''} found
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* QR Button */}
                  <button
                    onClick={() => setQrItem(item)}
                    className="p-2 rounded-lg transition-all text-lg"
                    style={{ color: 'var(--warning)' }}
                    title="Get QR Code"
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,181,71,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    📱
                  </button>

                  {/* View Button */}
                  <Link to={`/items/${item._id}`}
                    className="p-2 rounded-lg transition-all"
                    style={{ color: 'var(--muted)' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = 'var(--muted)';
                      e.currentTarget.style.background = 'transparent';
                    }}>
                    <Eye size={16} />
                  </Link>

                  {/* Matches Button */}
                  <Link to={`/matches/${item._id}`}
                    className="p-2 rounded-lg transition-all"
                    style={{ color: '#A78BFA' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(167,139,250,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <Zap size={16} />
                  </Link>

                  {/* Delete Button */}
                  <button onClick={() => handleDelete(item._id)}
                    className="p-2 rounded-lg transition-all"
                    style={{ color: 'var(--muted)' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = 'var(--danger)';
                      e.currentTarget.style.background = 'rgba(255,77,109,0.1)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = 'var(--muted)';
                      e.currentTarget.style.background = 'transparent';
                    }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* QR Modal */}
      {qrItem && <QRModal item={qrItem} onClose={() => setQrItem(null)} />}
    </div>
  );
};

export default MyItems;