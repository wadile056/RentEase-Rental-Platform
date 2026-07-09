import { Link } from 'react-router-dom';
import { Sofa, Tv, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100 py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-brand-600 font-semibold bg-brand-50 px-3 py-1 rounded-full text-sm">Smart Living Solutions</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mt-4 mb-6">
            Rent Premium Furniture & Appliances Without the Heavy Cost
          </h1>
          <p className="text-lg text-gray-500 mb-8 leading-relaxed">
            Flexible tenures, complimentary maintenance, and seamless relocation support tailored for modern urban living.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/catalog" className="bg-brand-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-brand-700 transition shadow-sm flex items-center space-x-2">
              <span>Explore Products</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Category Grids */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Browse by Ecosystem Category</h2>
        <div className="grid sm:grid-cols-2 gap-8">
          <Link to="/catalog?category=furniture" className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-brand-500 transition shadow-xs flex items-center space-x-6 group">
            <div className="p-4 bg-brand-50 rounded-xl text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition">
              <Sofa size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">Premium Furniture</h3>
              <p className="text-gray-500 text-sm">Beds, Designer Sofas, Modular Worktables.</p>
            </div>
          </Link>

          <Link to="/catalog?category=appliances" className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-brand-500 transition shadow-xs flex items-center space-x-6 group">
            <div className="p-4 bg-brand-50 rounded-xl text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition">
              <Tv size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">Smart Appliances</h3>
              <p className="text-gray-500 text-sm">Refrigerators, Inverter Washing Machines, Smart Smart TVs.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}