import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition flex flex-col h-full">
      <div className="relative aspect-video bg-gray-50 overflow-hidden">
        <img 
          src={product.images[0] || 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=600'} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs text-xs font-semibold px-2.5 py-1 rounded-full text-gray-700 capitalize">
          {product.subCategory}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-gray-800 text-lg line-clamp-1 mb-1">{product.name}</h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">{product.description}</p>
        
        <div className="border-t border-gray-50 pt-3 flex items-center justify-between mt-auto">
          <div>
            <p className="text-xs text-gray-400">Monthly Rent</p>
            <p className="text-xl font-bold text-brand-600">${product.monthlyRent}<span className="text-xs font-normal text-gray-500">/mo</span></p>
          </div>
          <div className="text-right flex items-center space-x-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
            <Shield size={14} className="text-brand-500" />
            <span>Deposit: ${product.securityDeposit}</span>
          </div>
        </div>

        <Link 
          to={`/product/${product._id}`}
          className="mt-4 block w-full text-center bg-gray-900 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-brand-600 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}