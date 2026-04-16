import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { MapPin, Calendar, Zap, MessageCircle, ArrowLeft } from 'lucide-react';

const Matches = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get(`/matches/${itemId}`);
        setMatches(data);
      } catch {
        toast.error('Failed to load matches');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [itemId]);

  const scoreColor = (score) => {
    if (score >= 70) return 'text-[var(--success)] bg-[var(--success)]/10 border-[var(--success)]/20';
    if (score >= 40) return 'text-[var(--warning)] bg-[var(--warning)]/10 border-[var(--warning)]/20';
    return 'text-[var(--muted)] bg-white/5 border-white/10';
  };

  return (
    <div className="min-h-screen dot-grid">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[var(--muted)] hover:text-white transition-colors mb-6 text-sm">
          <ArrowLeft size={16} /> Back
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={18} className="text-purple-400" />
            <span className="text-purple-400 text-sm font-medium uppercase tracking-wider">AI Matching Engine</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-white">Potential Matches</h1>
          <p className="text-[var(--muted)] mt-2">
            {loading ? 'Scanning items...' : `${matches.length} potential match${matches.length !== 1 ? 'es' : ''} found`}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass rounded-2xl border border-[var(--border)] h-64 animate-pulse" />
            ))}
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-5">
              <Zap size={32} className="text-purple-400 opacity-50" />
            </div>
            <h3 className="font-display text-xl font-semibold text-white mb-2">No matches yet</h3>
            <p className="text-[var(--muted)] text-sm max-w-sm mx-auto">
              Our AI will automatically find matches as more items are posted on campus
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {matches.map((item, i) => (
              <div key={item._id}
                className="glass rounded-2xl border border-[var(--border)] overflow-hidden item-card"
                style={{ animationDelay: `${i * 0.05}s` }}>
                {item.image && (
                  <img src={item.image} alt={item.title} className="w-full h-40 object-cover" />
                )}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      item.type === 'lost' ? 'badge-lost' : 'badge-found'
                    }`}>{item.type.toUpperCase()}</span>
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold border flex items-center gap-1 ${scoreColor(item.score)}`}>
                      <Zap size={11} /> {item.score}% match
                    </span>
                  </div>

                  {/* Score bar */}
                  <div className="w-full h-1 bg-white/5 rounded-full mb-4 overflow-hidden">
                    <div className="h-full rounded-full transition-all"
                      style={{
                        width: `${item.score}%`,
                        background: item.score >= 70
                          ? 'var(--success)'
                          : item.score >= 40
                          ? 'var(--warning)'
                          : 'var(--muted)'
                      }} />
                  </div>

                  <h3 className="font-display font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-[var(--muted)] text-sm line-clamp-2 mb-3">{item.description}</p>

                  <div className="flex items-center justify-between text-xs text-[var(--muted)] mb-4">
                    <span className="flex items-center gap-1"><MapPin size={12} />{item.location}</span>
                    <span className="flex items-center gap-1"><Calendar size={12} />{new Date(item.date).toLocaleDateString()}</span>
                  </div>

                  <div className="flex gap-2">
                    <Link to={`/items/${item._id}`}
                      className="flex-1 text-center py-2 rounded-xl text-sm font-medium glass border border-[var(--border)] text-white hover:border-[var(--accent)] transition-all">
                      View Item
                    </Link>
                    <Link to={`/chat?userId=${item.postedBy?._id}&itemId=${item._id}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium btn-primary">
                      <MessageCircle size={14} /> Contact
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;