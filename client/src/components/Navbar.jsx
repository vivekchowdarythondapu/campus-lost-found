import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, PlusCircle, Menu, X, Search } from 'lucide-react';
import { useState } from 'react';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className={`relative px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
        isActive(to)
          ? 'text-white bg-white/10'
          : 'text-[var(--muted)] hover:text-white hover:bg-white/5'
      }`}
    >
      {children}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 glass border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent2)] flex items-center justify-center text-sm font-bold text-white">
            LF
          </div>
          <span className="font-display font-bold text-white text-lg hidden sm:block">
            Campus <span className="gradient-text">L&F</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {user && <NavLink to="/lost">Lost Items</NavLink>}
          {user && <NavLink to="/found">Found Items</NavLink>}
          {user && <NavLink to="/search">Search</NavLink>}
          {user && <NavLink to="/my-items">My Items</NavLink>}
          {user && <NavLink to="/chat">Messages</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link to="/post"
  className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium">
  <PlusCircle size={15} /> Post Item
</Link>
<NotificationBell />
<div className="flex items-center gap-2 pl-3 border-l border-[var(--border)]">
                <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name}
                      className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent2)] flex items-center justify-center text-xs font-bold text-white">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-[var(--muted)] hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login"
                className="px-4 py-2 text-sm text-[var(--muted)] hover:text-white transition-colors">
                Login
              </Link>
              <Link to="/register"
                className="btn-primary px-4 py-2 rounded-lg text-sm font-medium">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-[var(--muted)] hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[var(--border)] px-4 py-3 space-y-1">
          {user && <Link to="/lost" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-[var(--muted)] hover:text-white rounded-lg hover:bg-white/5">Lost Items</Link>}
          {user && <Link to="/search" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-[var(--muted)] hover:text-white rounded-lg hover:bg-white/5">Search</Link>}
          {user && <Link to="/found" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-[var(--muted)] hover:text-white rounded-lg hover:bg-white/5">Found Items</Link>}
          {user && <Link to="/post" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-white rounded-lg bg-[var(--accent)]">Post Item</Link>}
          {user && <Link to="/my-items" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-[var(--muted)] hover:text-white rounded-lg hover:bg-white/5">My Items</Link>}
          {user && <Link to="/chat" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-[var(--muted)] hover:text-white rounded-lg hover:bg-white/5">Messages</Link>}
          {user && <Link to="/profile" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-[var(--muted)] hover:text-white rounded-lg hover:bg-white/5">Profile</Link>}
          {user?.role === 'admin' && <Link to="/admin" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-[var(--muted)] hover:text-white rounded-lg hover:bg-white/5">Admin</Link>}
          {user && <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-white/5" style={{ color: 'var(--danger)' }}>Logout</button>}
          {!user && <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-[var(--muted)] hover:text-white rounded-lg hover:bg-white/5">Login</Link>}
          {!user && <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-white rounded-lg bg-[var(--accent)]">Get Started</Link>}
        </div>
      )}
    </nav>
  );
};

export default Navbar;