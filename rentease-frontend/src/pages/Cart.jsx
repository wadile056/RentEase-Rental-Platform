import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, Calendar, MapPin, CreditCard, ShieldCheck, ShoppingBag } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';

export default function Cart() {
  const { cartItems, removeFromCart, clearCart, totalMonthlyRent, totalSecurityDeposit } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Checkout Form State
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [startDate, setStartDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center bg-white border border-gray-100 rounded-2xl shadow-xs mt-10">
        <div className="text-gray-300 flex justify-center mb-4">
          <ShoppingBag size={64} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-6">Explore our catalog to add premium furniture and appliances to your space.</p>
        <Link to="/catalog" className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-brand-600 transition">
          Browse Products
        </Link>
      </div>
    );
  }

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError('Please login to complete your rental reservation.');
      return;
    }

    if (!street || !city || !stateName || !zipCode || !startDate) {
      setError('Please complete all delivery details and schedule a start date.');
      return;
    }

    setLoading(true);

    try {
      // Loop through cart items and post rental logs iteratively
      for (const item of cartItems) {
        await API.post('/rentals', {
          productId: item._id,
          tenureMonths: item.selectedTenure,
          startDate: startDate,
          deliveryAddress: { street, city, state: stateName, zipCode }
        });
      }

      clearCart();
      navigate('/dashboard?checkout=success');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during verification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Review Your Rental Plan</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Columns: Items & Logistics Form */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Cart Items List */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6 shadow-xs space-y-4">
            <h2 className="font-bold text-gray-800 text-lg border-b border-gray-50 pb-3">Selected Items</h2>
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center space-x-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                <img src={item.images[0]} alt={item.name} className="w-20 h-16 rounded-lg object-cover bg-gray-50" />
                <div className="flex-grow">
                  <h3 className="font-semibold text-gray-800 text-sm md:text-base">{item.name}</h3>
                  <div className="flex space-x-4 text-xs text-gray-500 mt-1">
                    <span>Tenure: <strong className="text-gray-700">{item.selectedTenure} Mos</strong></span>
                    <span>Deposit: <strong className="text-gray-700">${item.securityDeposit}</strong></span>
                  </div>
                </div>
                <div className="text-right flex items-center space-x-4">
                  <div>
                    <p className="font-bold text-brand-600 text-base">${item.monthlyRent}<span className="text-xs font-normal text-gray-400">/mo</span></p>
                  </div>
                  <button onClick={() => removeFromCart(item._id)} className="text-gray-400 hover:text-red-500 p-1">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery & Schedule Setup Form */}
          <form onSubmit={handleCheckoutSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-4">
            <h2 className="font-bold text-gray-800 text-lg border-b border-gray-50 pb-3 flex items-center space-x-2">
              <MapPin size={20} className="text-brand-500" />
              <span>Logistics & Scheduling Details</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Street Address</label>
                <input type="text" required value={street} onChange={(e) => setStreet(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-hidden focus:border-brand-500" placeholder="Apt #, Suite, Building, Street" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">City</label>
                <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-hidden focus:border-brand-500" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">State</label>
                  <input type="text" required value={stateName} onChange={(e) => setStateName(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-hidden focus:border-brand-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Zip Code</label>
                  <input type="text" required value={zipCode} onChange={(e) => setZipCode(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-hidden focus:border-brand-500" />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center space-x-1">
                <Calendar size={14} className="text-gray-400" />
                <span>Preferred Delivery Date</span>
              </label>
              <input type="date" required min={new Date().toISOString().split('T')[0]} value={startDate} onChange={(e) => setStartDate(e.target.value)} className="max-w-xs w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-hidden focus:border-brand-500 text-gray-600" />
            </div>
          </form>
        </div>

        {/* Right Column: Pricing Recaps Summary & Actions */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs h-fit space-y-6">
          <h2 className="font-bold text-gray-800 text-lg border-b border-gray-50 pb-3 flex items-center space-x-2">
            <CreditCard size={20} className="text-gray-700" />
            <span>Financial Breakdown</span>
          </h2>

          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Monthly Subscription Rate</span>
              <span className="font-semibold text-gray-800">${totalMonthlyRent}/mo</span>
            </div>
            <div className="flex justify-between border-b border-gray-50 pb-3">
              <span>Refundable Security Deposit</span>
              <span className="font-semibold text-gray-800">${totalSecurityDeposit}</span>
            </div>
            <div className="flex justify-between pt-1 text-gray-900 font-extrabold text-base">
              <span>Initial Amount Due Today</span>
              <span className="text-brand-600">${totalMonthlyRent + totalSecurityDeposit}</span>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-xl p-3.5 border border-emerald-100 text-xs text-emerald-800 flex items-start space-x-2">
            <ShieldCheck size={18} className="text-emerald-600 shrink-0 mt-0.5" />
            <p>Your security deposit is 100% refundable. It will be returned directly to your bank account upon item hand-off at the end of your lease contract.</p>
          </div>

          {error && <p className="text-xs text-red-500 bg-red-50 border border-red-100 p-2 rounded-lg text-center font-medium">{error}</p>}

          <button
            onClick={handleCheckoutSubmit}
            disabled={loading}
            className={`w-full text-white font-bold py-3.5 rounded-xl transition shadow-xs flex items-center justify-center ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-gray-800'
            }`}
          >
            {loading ? 'Processing Schedule...' : 'Confirm Rental Order'}
          </button>
        </div>

      </div>
    </div>
  );
}