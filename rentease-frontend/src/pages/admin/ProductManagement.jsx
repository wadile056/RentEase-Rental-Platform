import { useState } from 'react';
import { PlusCircle, Box, DollarSign, Shield, Image, Layers } from 'lucide-react';
import API from '../../utils/api';

export default function ProductManagement() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('furniture');
  const [subCategory, setSubCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');
  const [stock, setStock] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await API.post('/products', {
        name,
        description,
        category,
        subCategory,
        images: [imageUrl || 'https://images.unsplash.com/photo-1524758631624-e2822e304c36'], // Fallback preview
        monthlyRent: Number(monthlyRent),
        securityDeposit: Number(securityDeposit),
        stock: Number(stock),
        tenureOptions: [
          { months: 3, discountPercentage: 0 },
          { months: 6, discountPercentage: 10 },
          { months: 12, discountPercentage: 20 }
        ]
      });

      setSuccess(true);
      setName('');
      setDescription('');
      setSubCategory('');
      setImageUrl('');
      setMonthlyRent('');
      setSecurityDeposit('');
      setStock('');
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating item manifest registry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Fleet Inventory Provisioning</h1>
        <p className="text-gray-500 text-sm mt-1">Introduce new assets into the automated ecosystem pool with baseline structural discount options.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-xs">
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl font-medium text-sm">
            🚀 Product successfully provisioned and live on the public browsing catalog interface!
          </div>
        )}

        <form onSubmit={handleCreateProduct} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Asset Commercial Name</label>
              <div className="relative">
                <Box className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Ultra-Slim Inverter AC" className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-hidden focus:border-brand-500" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Core Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full text-sm border border-gray-200 rounded-lg p-2 focus:outline-hidden focus:border-brand-500 bg-white">
                  <option value="furniture">Furniture</option>
                  <option value="appliances">Appliances</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Sub-Type Tag</label>
                <div className="relative">
                  <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input type="text" required value={subCategory} onChange={(e) => setSubCategory(e.target.value)} placeholder="e.g., AC, Sofa" className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-hidden focus:border-brand-500" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Product Operational Description</label>
            <textarea rows="4" required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Provide specifications, dimensions, power consumption metrics, and structural wear guarantees..." className="w-full text-sm border border-gray-200 rounded-lg p-3 focus:outline-hidden focus:border-brand-500"></textarea>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Asset Image Link (Unsplash/CDN URL)</label>
            <div className="relative">
              <Image className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://images.unsplash.com/photo-..." className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-hidden focus:border-brand-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Base Monthly Rent Rate</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="number" required min="1" value={monthlyRent} onChange={(e) => setMonthlyRent(e.target.value)} placeholder="25" className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-hidden focus:border-brand-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Security Deposit Amount</label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="number" required min="1" value={securityDeposit} onChange={(e) => setSecurityDeposit(e.target.value)} placeholder="100" className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-hidden focus:border-brand-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Initial Allocatable Stock Pool</label>
              <input type="number" required min="1" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="5" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-hidden focus:border-brand-500" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-xl transition flex items-center justify-center space-x-2">
            <PlusCircle size={18} />
            <span>{loading ? 'Publishing to Registry Store...' : 'Deploy Asset to Live Catalog'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}