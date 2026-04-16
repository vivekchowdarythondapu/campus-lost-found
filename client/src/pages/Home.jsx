import { Link } from 'react-router-dom';
import { Search, ArrowRight, Zap, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen dot-grid">
      {/* Hero */}
      <div className="relative max-w-7xl mx-auto px-4 pt-24 pb-20 text-center">
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-[var(--accent)] opacity-10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-64 h-64 bg-[var(--accent2)] opacity-10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-[var(--border)] text-sm text-[var(--muted)] mb-8">
          <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
          AI-powered matching active
        </div>

        <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Lost something on<br />
          <span className="gradient-text">campus?</span>
        </h1>
        <p className="text-[var(--muted)] text-lg md:text-xl max-w-2xl mx-auto mb-10">
          Our AI instantly matches lost items with found ones. Post, discover, and reunite — all in one place.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          {user ? (
            <>
              <Link to="/lost"
                className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-base">
                Browse Lost Items <ArrowRight size={18} />
              </Link>
              <Link to="/found"
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-base glass border border-[var(--border)] text-white hover:border-[var(--accent)] transition-all">
                Browse Found Items
              </Link>
              <Link to="/post"
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-base glass border border-[var(--border)] text-[var(--muted)] hover:text-white hover:border-[var(--accent)] transition-all">
                <Search size={18} /> Post an Item
              </Link>
            </>
          ) : (
            <>
              <Link to="/register"
                className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-base">
                Get Started Free <ArrowRight size={18} />
              </Link>
              <Link to="/login"
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-base glass border border-[var(--border)] text-white hover:border-[var(--accent)] transition-all">
                Login to Portal
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Features bar */}
      <div className="max-w-4xl mx-auto px-4 mb-20">
        <div className="glass rounded-2xl border border-[var(--border)] p-6 grid grid-cols-3 gap-6 text-center">
          {[
            { value: '🔍', label: 'Search Lost Items', desc: 'Find your missing belongings' },
            { value: '📦', label: 'Post Found Items', desc: 'Help others get items back' },
            { value: '🤖', label: 'AI Auto Matching', desc: 'Smart item detection' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-4xl mb-2">{s.value}</div>
              <div className="text-white text-sm font-medium">{s.label}</div>
              <div className="text-[var(--muted)] text-xs mt-1">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-7xl mx-auto px-4 pb-24">
        <h2 className="font-display text-3xl font-bold text-center text-white mb-12">
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Search,
              title: 'Report & Browse',
              desc: 'Post your lost item with photos and details. Browse all found items on campus instantly.',
              color: 'var(--accent)',
              step: '01'
            },
            {
              icon: Zap,
              title: 'AI Matching',
              desc: 'Our cosine similarity AI scans descriptions and locations to find your best matches automatically.',
              color: 'var(--accent2)',
              step: '02'
            },
            {
              icon: MessageCircle,
              title: 'Connect & Collect',
              desc: 'Chat directly with the finder or owner in real-time. Arrange pickup and mark as returned.',
              color: 'var(--success)',
              step: '03'
            },
          ].map((f) => (
            <div key={f.title}
              className="glass rounded-2xl border border-[var(--border)] p-6 item-card group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: `${f.color}20`, border: `1px solid ${f.color}40` }}>
                  <f.icon size={22} style={{ color: f.color }} />
                </div>
                <span className="font-display text-4xl font-bold text-white/5 group-hover:text-white/10 transition-colors">
                  {f.step}
                </span>
              </div>
              <h3 className="font-display text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-[var(--muted)] text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA — only show when not logged in */}
      {!user && (
        <div className="max-w-3xl mx-auto px-4 pb-24">
          <div className="glass rounded-3xl border border-[var(--accent)]/30 p-10 text-center relative overflow-hidden glow-accent">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/10 to-transparent pointer-events-none" />
            <h2 className="font-display text-3xl font-bold text-white mb-3">
              Ready to find your item?
            </h2>
            <p className="text-[var(--muted)] mb-6">
              Join your campus students on the Lost & Found portal
            </p>
            <Link to="/register"
              className="btn-primary inline-flex items-center gap-2 px-8 py-3 rounded-xl font-medium">
              Get Started Free <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;