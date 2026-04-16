import { useState, useEffect } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { Users, Package, CheckCircle, TrendingUp, Shield, Trash2, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState('stats');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, itemsRes, usersRes] = await Promise.all([
          API.get('/admin/stats'),
          API.get('/admin/items'),
          API.get('/admin/users')
        ]);
        setStats(statsRes.data);
        setItems(itemsRes.data.items);
        setUsers(usersRes.data);
      } catch {
        toast.error('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const updateItemStatus = async (id, status) => {
    try {
      await API.put(`/admin/items/${id}`, { status });
      toast.success('Status updated');
      setItems(prev => prev.map(i => i._id === id ? { ...i, status } : i));
    } catch {
      toast.error('Failed to update');
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (loading) return (
    <div className="min-h-screen dot-grid flex items-center justify-center">
      <div style={{ color: 'var(--muted)' }}>Loading dashboard...</div>
    </div>
  );

  const statCards = stats ? [
    { label: 'Total Items', value: stats.totalItems, icon: Package, color: 'var(--accent)' },
    { label: 'Lost Items', value: stats.lostItems, icon: Package, color: 'var(--danger)' },
    { label: 'Found Items', value: stats.foundItems, icon: CheckCircle, color: 'var(--success)' },
    { label: 'Returned', value: stats.returnedItems, icon: CheckCircle, color: 'var(--warning)' },
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'var(--accent2)' },
    { label: 'Active Items', value: stats.activeItems, icon: TrendingUp, color: 'var(--accent)' },
    { label: 'Matched', value: stats.matchedItems, icon: TrendingUp, color: '#A78BFA' },
  ] : [];

  return (
    <div className="min-h-screen dot-grid">
      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)' }}>
            <Shield size={20} style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <h1 className="font-display text-4xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              Manage all campus lost and found items
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          <div className="glass rounded-xl border border-[var(--border)] p-1 flex gap-2">
            {['stats', 'items', 'users'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-5 py-2 rounded-lg capitalize text-sm font-medium transition-all"
                style={{
                  background: tab === t ? 'var(--accent)' : 'transparent',
                  color: tab === t ? 'white' : 'var(--muted)'
                }}
              >
                {t}
              </button>
            ))}
          </div>
          <Link
            to="/analytics"
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium glass border transition-all"
            style={{ borderColor: 'rgba(108,99,255,0.3)', color: 'var(--accent)' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(108,99,255,0.3)'}
          >
            <TrendingUp size={15} />
            View Analytics
          </Link>
        </div>

        {/* Stats Tab */}
        {tab === 'stats' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statCards.map(s => (
              <div key={s.label}
                className="glass rounded-2xl border border-[var(--border)] p-5 item-card">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>{s.label}</p>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `${s.color}20` }}>
                    <s.icon size={16} style={{ color: s.color }} />
                  </div>
                </div>
                <p className="font-display text-3xl font-bold text-white">{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Items Tab */}
        {tab === 'items' && (
          <div className="glass rounded-2xl border border-[var(--border)] overflow-hidden">
            <div className="p-5 border-b border-[var(--border)]">
              <h2 className="font-display font-semibold text-white">
                All Items ({items.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    {['Item', 'Type', 'Category', 'Status', 'Posted By', 'Actions'].map(h => (
                      <th key={h}
                        className="text-left px-5 py-3 text-xs uppercase tracking-wider font-medium"
                        style={{ color: 'var(--muted)' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item._id}
                      className="border-b border-[var(--border)] transition-colors"
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {item.image ? (
                            <img src={item.image} alt=""
                              className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                              style={{ background: 'rgba(255,255,255,0.05)' }}>?</div>
                          )}
                          <div>
                            <p className="text-white text-sm font-medium">{item.title}</p>
                            <p className="text-xs flex items-center gap-1 mt-0.5"
                              style={{ color: 'var(--muted)' }}>
                              <MapPin size={10} /> {item.location}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          item.type === 'lost' ? 'badge-lost' : 'badge-found'
                        }`}>{item.type}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="badge-category text-xs px-2.5 py-1 rounded-full">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs px-2.5 py-1 rounded-full"
                          style={{
                            background: item.status === 'active' ? 'rgba(59,130,246,0.1)' :
                              item.status === 'returned' ? 'rgba(0,214,143,0.1)' :
                              item.status === 'matched' ? 'rgba(168,85,247,0.1)' :
                              'rgba(239,68,68,0.1)',
                            color: item.status === 'active' ? '#60a5fa' :
                              item.status === 'returned' ? 'var(--success)' :
                              item.status === 'matched' ? '#c084fc' : '#f87171'
                          }}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm" style={{ color: 'var(--muted)' }}>
                        {item.postedBy?.name}
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={item.status}
                          onChange={e => updateItemStatus(item._id, e.target.value)}
                          className="input-dark text-xs px-3 py-1.5 rounded-lg"
                        >
                          <option value="active">Active</option>
                          <option value="matched">Matched</option>
                          <option value="returned">Returned</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {tab === 'users' && (
          <div className="glass rounded-2xl border border-[var(--border)] overflow-hidden">
            <div className="p-5 border-b border-[var(--border)]">
              <h2 className="font-display font-semibold text-white">
                All Users ({users.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    {['User', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                      <th key={h}
                        className="text-left px-5 py-3 text-xs uppercase tracking-wider font-medium"
                        style={{ color: 'var(--muted)' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}
                      className="border-b border-[var(--border)] transition-colors"
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent2))' }}>
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <p className="text-white text-sm font-medium">{u.name}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm" style={{ color: 'var(--muted)' }}>
                        {u.email}
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs px-2.5 py-1 rounded-full"
                          style={{
                            background: u.role === 'admin' ? 'rgba(108,99,255,0.1)' : 'rgba(255,255,255,0.05)',
                            color: u.role === 'admin' ? 'var(--accent)' : 'var(--muted)',
                            border: u.role === 'admin' ? '1px solid rgba(108,99,255,0.2)' : '1px solid rgba(255,255,255,0.1)'
                          }}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm" style={{ color: 'var(--muted)' }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4">
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => deleteUser(u._id)}
                            className="p-2 rounded-lg transition-all"
                            style={{ color: 'var(--muted)' }}
                            onMouseEnter={e => {
                              e.currentTarget.style.color = 'var(--danger)';
                              e.currentTarget.style.background = 'rgba(255,77,109,0.1)';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.color = 'var(--muted)';
                              e.currentTarget.style.background = 'transparent';
                            }}
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;