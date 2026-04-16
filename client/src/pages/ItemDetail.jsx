import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { MapPin, Calendar, Zap, MessageCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import QRModal from '../components/QRModal';
import ShareButtons from '../components/ShareButtons';

const ItemDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get(`/items/${id}`);
        setItem(data);
      } catch {
        toast.error('Item not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen dot-grid flex items-center justify-center">
      <div style={{ color: 'var(--muted)' }}>Loading...</div>
    </div>
  );
  if (!item) return null;

  const isOwner = user?._id === item.postedBy?._id;

  const statusStyle = {
    active: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    matched: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    returned: 'text-green-400 border border-green-400/20',
    rejected: 'bg-red-500/10 text-red-400 border border-red-500/20',
  }[item.status] || '';

  return (
    <div className="min-h-screen dot-grid">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-sm transition-colors"
          style={{ color: 'var(--muted)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'white'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left — Image */}
          <div>
            {item.image ? (
              <img
                src={item.image}
                alt={item.title}
                className="w-full rounded-2xl object-cover"
                style={{ maxHeight: '400px' }}
              />
            ) : (
              <div
                className="w-full h-72 glass rounded-2xl border border-[var(--border)] flex items-center justify-center"
                style={{ background: item.type === 'lost' ? 'rgba(255,77,109,0.05)' : 'rgba(0,214,143,0.05)' }}
              >
                <span className="text-6xl opacity-30">
                  {item.type === 'lost' ? '?' : '📦'}
                </span>
              </div>
            )}
          </div>

          {/* Right — Details */}
          <div className="space-y-5">
            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                item.type === 'lost' ? 'badge-lost' : 'badge-found'
              }`}>
                {item.type.toUpperCase()}
              </span>
              <span className="badge-category text-xs px-3 py-1 rounded-full">
                {item.category}
              </span>
              <span className={`text-xs px-3 py-1 rounded-full ${statusStyle}`}>
                {item.status}
              </span>
            </div>

            <h1 className="font-display text-3xl font-bold text-white">
              {item.title}
            </h1>
            <p className="leading-relaxed" style={{ color: 'var(--muted)' }}>
              {item.description}
            </p>

            {/* Meta info */}
            <div className="glass rounded-xl border border-[var(--border)] p-4 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <MapPin size={15} style={{ color: 'var(--accent)' }} className="flex-shrink-0" />
                <span style={{ color: 'var(--muted)' }}>Location:</span>
                <span className="text-white">{item.location}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar size={15} style={{ color: 'var(--accent)' }} className="flex-shrink-0" />
                <span style={{ color: 'var(--muted)' }}>Date:</span>
                <span className="text-white">
                  {new Date(item.date).toLocaleDateString('en-IN', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </span>
              </div>
            </div>

            {/* Posted by */}
            <div className="glass rounded-xl border border-[var(--border)] p-4">
              <p className="text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--muted)' }}>
                Posted by
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent2))' }}>
                  {item.postedBy?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-medium">{item.postedBy?.name}</p>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>{item.postedBy?.email}</p>
                  {item.postedBy?.phone && (
                    <p className="text-sm" style={{ color: 'var(--muted)' }}>
                      {item.postedBy?.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Share Buttons */}
            <ShareButtons item={item} />

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              {!isOwner && user && (
                <Link
                  to={`/chat?userId=${item.postedBy?._id}&itemId=${item._id}`}
                  className="btn-primary flex items-center justify-center gap-2 py-3 rounded-xl font-medium"
                >
                  <MessageCircle size={17} />
                  <span>Send Message</span>
                </Link>
              )}
              {user && (
                <Link
                  to={`/matches/${item._id}`}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl font-medium glass border transition-all"
                  style={{ borderColor: 'rgba(168,85,247,0.3)', color: '#c084fc' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#c084fc'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(168,85,247,0.3)'}
                >
                  <Zap size={17} />
                  <span>View AI Matches</span>
                </Link>
              )}
              <button
                onClick={() => setShowQR(true)}
                className="flex items-center justify-center gap-2 py-3 rounded-xl font-medium glass border transition-all"
                style={{ borderColor: 'rgba(255,181,71,0.3)', color: 'var(--warning)' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--warning)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,181,71,0.3)'}
              >
                <span>📱</span>
                <span>Get QR Code</span>
              </button>
              {isOwner && item.status !== 'returned' && (
                <button
                  onClick={async () => {
                    await API.put(`/items/${item._id}/status`, { status: 'returned' });
                    toast.success('Marked as returned!');
                    navigate('/my-items');
                  }}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl font-medium glass border transition-all"
                  style={{ borderColor: 'rgba(0,214,143,0.3)', color: 'var(--success)' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--success)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(0,214,143,0.3)'}
                >
                  <CheckCircle size={17} />
                  <span>Mark as Returned</span>
                </button>
              )}
              {!user && (
                <Link
                  to="/login"
                  className="btn-primary flex items-center justify-center gap-2 py-3 rounded-xl font-medium"
                >
                  <span>Login to Contact</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* QR Modal */}
      {showQR && <QRModal item={item} onClose={() => setShowQR(false)} />}
    </div>
  );
};

export default ItemDetail;