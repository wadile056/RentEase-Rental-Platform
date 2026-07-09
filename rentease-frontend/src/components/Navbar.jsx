import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo brand marker */}
          <Link to="/" className="text-2xl font-bold text-brand-600 tracking-tight">
            Rent<span className="text-gray-800">Ease</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/catalog" className="text-gray-600 hover:text-brand-600 font-medium">Browse</Link>
            
            {/* Dynamic shopping cart layout metric indicator */}
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-brand-600 transition-colors">
              <ShoppingCart size={22} />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                {/* Admin quick-access management panel utility icon shortcut link */}
                {user.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    title="Admin Control Panel" 
                    className="p-2 text-gray-600 hover:text-brand-600 transition-colors"
                  >
                    <Package size={22} />
                  </Link>
                )}

                {/* Profile Dashboard portal route link */}
                <Link to={user.role === 'admin' ? "/admin" : "/dashboard"} className="flex items-center space-x-1 text-gray-700 hover:text-brand-600 transition-colors">
                  <User size={20} />
                  <span className="text-sm font-medium max-w-[100px] truncate">{user.name}</span>
                </Link>

                {/* Account teardown termination logout action click listener button */}
                <button onClick={logout} className="text-gray-500 hover:text-red-600 transition-colors cursor-pointer">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-brand-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-700 transition">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}