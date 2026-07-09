import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shield, Calendar, Truck, CheckCircle2, ShoppingBag } from 'lucide-react';
import API from '../utils/api';
import { CartContext } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTenure, setSelectedTenure] = useState(null);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
        // Default select the shortest available tenure option
        if (data.tenureOptions && data.tenureOptions.length > 0) {
          setSelectedTenure(data.tenureOptions[0].months);
        }
      } catch (err) {
        setError('Could not retrieve product information.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Check if item is already added to cart across renders
  useEffect(() => {
    if (product && cartItems.some(item => item._id === product._id)) {
      setIsAdded(true);
    }
  }, [product, cartItems]);

  if (loading) return <div className="text-center py-20 text-gray-500 font-medium">Loading catalog specifications...</div>;
  if (error || !product) return <div className="text-center py-20 text-red-500 font-medium">{error || 'Product context missing.'}</div>;

  // Calculate long-term lease commitment discount drops
  const activeOption = product.tenureOptions.find(o => o.months === Number(selectedTenure));
  const discount = activeOption ? activeOption.discountPercentage : 0;
  const activeMonthlyRent = Math.round(product.monthlyRent * (1 - discount / 100));

  const handleCartSubmission = () => {
    addToCart(product, selectedTenure);
    setIsAdded(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden grid md:grid-cols-2 gap-8 p-6 md:p-10">
        
        {/* Left Side: Product Gallery Display */}
        <div className="flex flex-col space-y-4">
          <div className="aspect-video w-full rounded-xl bg-gray-50 overflow-hidden">
            <img 
              src={product.images[0] || 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=600'} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="border border-brand-500 rounded-lg overflow-hidden p-0.5 bg-brand-50 aspect-video">
              <img src={product.images[0]} alt="" className="w-full h-full object-cover rounded-md" />
            </div>
          </div>
        </div>

        {/* Right Side: Configuration System */}
        <div className="flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full uppercase tracking-wider">
              {product.category} &gt; {product.subCategory}
            </span>
            <h1 className="text-3xl font-extrabold text-gray-900 mt-3 mb-2">{product.name}</h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">{product.description}</p>
            
            {/* Realtime Pricing Display Widget */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center justify-between mb-6">
              <div>
                <span className="text-xs text-gray-400 font-medium">Adjusted Rent Rate</span>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-extrabold text-brand-600">${activeMonthlyRent}</span>
                  <span className="text-xs font-normal text-gray-500">/mo</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400 font-medium flex items-center justify-end space-x-1">
                  <Shield size={14} className="text-brand-500" />
                  <span>Refundable Deposit</span>
                </span>
                <p className="text-2xl font-bold text-gray-800">${product.securityDeposit}</p>
              </div>
            </div>

            {/* Tenure Adjustment Selectors */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-1">
                <Calendar size={16} className="text-gray-400" />
                <span>Choose Rental Plan Duration</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {product.tenureOptions.map((option) => (
                  <button
                    key={option.months}
                    type="button"
                    onClick={() => setSelectedTenure(option.months)}
                    className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center ${
                      selectedTenure === option.months
                        ? 'border-gray-900 bg-gray-900 text-white shadow-xs'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-lg font-bold">{option.months}</span>
                    <span className="text-xs opacity-80">Months</span>
                    {option.discountPercentage > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md mt-1 font-medium ${
                        selectedTenure === option.months ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-600'
                      }`}>
                        -{option.discountPercentage}% Off
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Core Action Button Trigger */}
          <div className="border-t border-gray-100 pt-6 mt-6">
            {isAdded ? (
              <button
                type="button"
                onClick={() => navigate('/cart')}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center space-x-2"
              >
                <CheckCircle2 size={20} />
                <span>Added • Proceed to Cart</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCartSubmission}
                disabled={product.stock < 1}
                className={`w-full text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center space-x-2 ${
                  product.stock < 1 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-gray-900 hover:bg-gray-800'
                }`}
              >
                <ShoppingBag size={20} />
                <span>{product.stock < 1 ? 'Out of Stock' : 'Reserve & Rent Now'}</span>
              </button>
            )}
            
            {/* Trust Logistics Markers */}
            <div className="grid grid-cols-2 gap-4 mt-4 text-xs text-gray-400">
              <div className="flex items-center space-x-1.5 justify-center">
                <Truck size={14} className="text-brand-500" />
                <span>Free Delivery within 48h</span>
              </div>
              <div className="flex items-center space-x-1.5 justify-center">
                <Shield size={14} className="text-brand-500" />
                <span>Free Service Maintenance</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}