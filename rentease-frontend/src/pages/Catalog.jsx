import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import API from '../utils/api';
import ProductCard from '../components/ProductCard';

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');

  const activeCategory = searchParams.get('category') || '';

  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (activeCategory) queryParams.append('category', activeCategory);
        if (search) queryParams.append('search', search);

        const { data } = await API.get(`/products?${queryParams.toString()}`);
        setProducts(data);
      } catch (err) {
        console.error("Error connecting to catalog endpoints:", err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchCatalog();
    }, 400); // 400ms search filtering debounce

    return () => clearTimeout(delayDebounce);
  }, [activeCategory, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      {/* Dynamic Navigation Tabs & Search Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-4 rounded-xl shadow-xs border border-gray-100">
        <div className="flex space-x-2">
          {['', 'furniture', 'appliances'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSearchParams(cat ? { category: cat } : {})}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
                activeCategory === cat 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat || 'All Items'}
            </button>
          ))}
        </div>

        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search matching rental items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-hidden focus:border-brand-500 text-sm transition"
          />
        </div>
      </div>

      {/* Grid Container rendering layer */}
      {loading ? (
        <div className="text-center py-20 text-gray-500 font-medium">Fetching available rentals inventory...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 text-gray-400">
          No rental products found matching selected constraints.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}