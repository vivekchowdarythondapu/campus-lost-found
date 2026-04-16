import { useState, useEffect } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart,
  Line, Legend
} from 'recharts';
import { TrendingUp, Package, MapPin, Tag } from 'lucide-react';

const COLORS = ['#6C63FF', '#FF6584', '#00D68F', '#FFB547', '#FF4D6D', '#A78BFA', '#34D399', '#F472B6'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-xl border border-[var(--border)] p-3">
        <p className="text-white text-sm font-medium mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-xs" style={{ color: p.color }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await API.get('/analytics');
        setData(data);
      } catch {
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return (
    <div className="min-h-screen dot-grid flex items-center justify-center">
      <div style={{ color: 'var(--muted)' }}>Loading analytics...</div>
    </div>
  );

  return (
    <div className="min-h-screen dot-grid">
      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} style={{ color: 'var(--accent)' }} />
            <span className="text-sm font-medium uppercase tracking-wider"
              style={{ color: 'var(--accent)' }}>Analytics</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-white">
            Portal Insights
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
            Visual overview of campus lost & found activity
          </p>
        </div>

        {/* Charts Grid */}
        <div className="space-y-6">

          {/* Monthly Lost vs Found */}
          <div className="glass rounded-2xl border border-[var(--border)] p-6">
            <h2 className="font-display font-semibold text-white mb-1">
              Monthly Activity
            </h2>
            <p className="text-xs mb-5" style={{ color: 'var(--muted)' }}>
              Lost vs Found items over the last 6 months
            </p>
            {data?.monthly?.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data.monthly} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: '#7A7A9A', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#7A7A9A', fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ color: '#7A7A9A', fontSize: 12 }} />
                  <Bar dataKey="lost" name="Lost" fill="#FF4D6D" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="found" name="Found" fill="#00D68F" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-sm"
                style={{ color: 'var(--muted)' }}>
                No data available yet
              </div>
            )}
          </div>

          {/* Row: Category + Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Category Breakdown */}
            <div className="glass rounded-2xl border border-[var(--border)] p-6">
              <div className="flex items-center gap-2 mb-1">
                <Tag size={16} style={{ color: 'var(--accent)' }} />
                <h2 className="font-display font-semibold text-white">By Category</h2>
              </div>
              <p className="text-xs mb-5" style={{ color: 'var(--muted)' }}>
                Most common item categories
              </p>
              {data?.categories?.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={data.categories}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {data.categories.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      formatter={(value) => (
                        <span style={{ color: '#7A7A9A', fontSize: 11 }}>{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex items-center justify-center text-sm"
                  style={{ color: 'var(--muted)' }}>
                  No data available yet
                </div>
              )}
            </div>

            {/* Status Breakdown */}
            <div className="glass rounded-2xl border border-[var(--border)] p-6">
              <div className="flex items-center gap-2 mb-1">
                <Package size={16} style={{ color: 'var(--accent)' }} />
                <h2 className="font-display font-semibold text-white">By Status</h2>
              </div>
              <p className="text-xs mb-5" style={{ color: 'var(--muted)' }}>
                Current status of all items
              </p>
              {data?.status?.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={data.status}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {data.status.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={
                            entry.name === 'active' ? '#6C63FF' :
                            entry.name === 'returned' ? '#00D68F' :
                            entry.name === 'matched' ? '#A78BFA' :
                            '#FF4D6D'
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      formatter={(value) => (
                        <span style={{ color: '#7A7A9A', fontSize: 11 }}>{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex items-center justify-center text-sm"
                  style={{ color: 'var(--muted)' }}>
                  No data available yet
                </div>
              )}
            </div>
          </div>

          {/* Daily Activity */}
          <div className="glass rounded-2xl border border-[var(--border)] p-6">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={16} style={{ color: 'var(--accent)' }} />
              <h2 className="font-display font-semibold text-white">Daily Activity</h2>
            </div>
            <p className="text-xs mb-5" style={{ color: 'var(--muted)' }}>
              Items posted in the last 7 days
            </p>
            {data?.daily?.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data.daily} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: '#7A7A9A', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#7A7A9A', fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="items"
                    name="Items"
                    stroke="#6C63FF"
                    strokeWidth={2}
                    dot={{ fill: '#6C63FF', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-sm"
                style={{ color: 'var(--muted)' }}>
                No data available yet
              </div>
            )}
          </div>

          {/* Top Locations */}
          <div className="glass rounded-2xl border border-[var(--border)] p-6">
            <div className="flex items-center gap-2 mb-1">
              <MapPin size={16} style={{ color: 'var(--accent)' }} />
              <h2 className="font-display font-semibold text-white">Top Locations</h2>
            </div>
            <p className="text-xs mb-5" style={{ color: 'var(--muted)' }}>
              Campus hotspots for lost & found items
            </p>
            {data?.locations?.length > 0 ? (
              <div className="space-y-3">
                {data.locations.map((loc, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs font-bold w-5 text-center"
                      style={{ color: 'var(--muted)' }}>
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-white">{loc.name}</span>
                        <span className="text-xs" style={{ color: 'var(--muted)' }}>
                          {loc.count} items
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden"
                        style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(loc.count / data.locations[0].count) * 100}%`,
                            background: COLORS[i % COLORS.length]
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-24 flex items-center justify-center text-sm"
                style={{ color: 'var(--muted)' }}>
                No data available yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;