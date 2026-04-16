import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import LostItems from './pages/LostItems';
import FoundItems from './pages/FoundItems';
import PostItem from './pages/PostItem';
import ItemDetail from './pages/ItemDetail';
import MyItems from './pages/MyItems';
import Chat from './pages/Chat';
import AdminDashboard from './pages/AdminDashboard';
import Matches from './pages/Matches';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';
import SearchPage from './pages/Search';
import InstallPWA from './components/InstallPWA';
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen dot-grid flex items-center justify-center">
      <div style={{ color: 'var(--muted)' }}>Loading...</div>
    </div>
  );
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen dot-grid flex items-center justify-center">
      <div style={{ color: 'var(--muted)' }}>Loading...</div>
    </div>
  );
  return user?.role === 'admin' ? children : <Navigate to="/" />;
};

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/lost" element={<ProtectedRoute><LostItems /></ProtectedRoute>} />
        <Route path="/found" element={<ProtectedRoute><FoundItems /></ProtectedRoute>} />
        <Route path="/items/:id" element={<ProtectedRoute><ItemDetail /></ProtectedRoute>} />
        <Route path="/post" element={<ProtectedRoute><PostItem /></ProtectedRoute>} />
        <Route path="/my-items" element={<ProtectedRoute><MyItems /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/matches/:itemId" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
<Route path="/analytics" element={<AdminRoute><Analytics /></AdminRoute>} />
<Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />    
    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <AppRoutes />
      <InstallPWA />
    </AuthProvider>
  );
}
export default App;