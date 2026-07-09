import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Package, Clock, ShieldCheck, AlertCircle } from 'lucide-react';
import API from '../utils/api';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [myRentals, setMyRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [issueText, setIssueText] = useState('');
  const [selectedRental, setSelectedRental] = useState('');

  useEffect(() => {
    const fetchMyContracts = async () => {
      try {
        const res = await API.get('/rentals/my-rentals');
        setMyRentals(res.data);
      } catch (err) {
        console.error("Error fetching active customer assets:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchMyContracts();
  }, [user]);

  const handleFileTicket = async (e) => {
    e.preventDefault();
    if (!selectedRental || !issueText) return alert("Please specify the item contract.");
    
    try {
      await API.post('/maintenance', {
        rentalId: selectedRental,
        issueType: 'hardware',
        description: issueText,
        scheduledDate: new Date(Date.now() + 86400000 * 2) // Auto-schedule 48h out
      });
      alert("Support ticket filed! Technicians will arrive on the scheduled date.");
      setIssueText('');
    } catch (err) {
      alert("Error logging technical report.");
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500 font-medium">Loading your rental dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-gray-50 min-h-screen">
      {/* Safe Object Text Render */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Welcome back, {user?.name || 'Valued Customer'}
        </h1>
        <p className="text-gray-500 text-sm mt-1">Track your active subscriptions, contract terms, and request engineering support.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Active Contract Ledger List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-4">
          <h2 className="font-bold text-gray-800 text-lg flex items-center space-x-2 border-b border-gray-50 pb-3">
            <Package size={20} className="text-brand-600" />
            <span>Your Live Subscriptions</span>
          </h2>

          {myRentals.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">You don't have any active rental asset agreements currently.</p>
          ) : (
            <div className="space-y-4">
              {myRentals.map((rental) => (
                <div key={rental._id} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 flex justify-between items-center">
                  <div>
                    {/* Safe fallback for populated or embedded sub-objects */}
                    <h4 className="font-bold text-gray-900 text-sm">
                      {typeof rental.product === 'object' ? rental.product?.name : 'Rental Unit'}
                    </h4>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                      <span className="flex items-center space-x-1">
                        <Clock size={12} />
                        <span>Plan: {rental.tenureMonths} Months</span>
                      </span>
                      <span className="font-semibold text-brand-600">${rental.monthlyRentPrice}/mo</span>
                    </div>
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                    rental.status === 'delivered' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {rental.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Support Request Portal */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs h-fit space-y-4">
          <h2 className="font-bold text-gray-800 text-lg flex items-center space-x-2 border-b border-gray-50 pb-3">
            <AlertCircle size={20} className="text-amber-500" />
            <span>Request Maintenance</span>
          </h2>
          
          <form onSubmit={handleFileTicket} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Select Item Contract</label>
              <select 
                value={selectedRental} 
                onChange={(e) => setSelectedRental(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg p-2 bg-white"
              >
                <option value="">-- Choose Active Lease --</option>
                {myRentals.map(r => (
                  <option key={r._id} value={r._id}>
                    {typeof r.product === 'object' ? r.product?.name : `Contract ${r._id.slice(-6)}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Describe the Issue</label>
              <textarea 
                rows="3" 
                required
                value={issueText}
                onChange={(e) => setIssueText(e.target.value)}
                placeholder="Describe structural wear, appliance error codes, or physical damage flags..."
                className="w-full text-sm border border-gray-200 rounded-lg p-2.5 focus:outline-hidden focus:border-brand-500"
              ></textarea>
            </div>

            <button type="submit" className="w-full bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold py-2.5 rounded-lg transition">
              Dispatch Service Representative
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}