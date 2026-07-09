import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';

// Context Imports
import { AuthContext } from './context/AuthContext';

// Layout Component
import Navbar from './components/Navbar';

// Page Views Imports
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Page View Import
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductManagement from './pages/admin/ProductManagement';

// Secure Route Guard for Protected Customer Pages
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" replace />;
};

// Strict Route Guard for Protected Admin Infrastructure Pages
const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  // Verify that a user profile exists and possesses an explicit admin role
  return user && user.role === 'admin' ? children : <Navigate to="/" replace />;
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans antialiased">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            {/* Public Browsing Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            
            {/* Authentication Gateway Portals */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Secure Customer Profile Dashboard Routing */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />

            {/* Secure Admin Dashboard Routing */}
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
            <Route 
                path="/admin/inventory" 
                element={
                  <AdminRoute>
                    <ProductManagement />
                  </AdminRoute>
                } 
            />

            {/* Fallback Catch-All Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}