import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Truck, Wrench, ShieldAlert, Check, RefreshCw, PlusCircle } from 'lucide-react';
import API from '../../utils/api';

export default function AdminDashboard() {
  const [rentals, setRentals] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 1. Analytics & Financial metrics state
  const [metrics, setMetrics] = useState({
    monthlyRecurringRevenue: 0,
    securityDepositsHeld: 0,
    assetUtilizationRate: 0,
    activeSubscriptions: 0
  });

  // 2. Updated data runner to capture analytics metrics in parallel
  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [rentalRes, ticketRes, analyticsRes] = await Promise.all([
        API.get('/rentals/admin/all'), 
        API.get('/maintenance/admin/all'),
        API.get('/admin/analytics/overview') // New analytics endpoint
      ]);
      
      setRentals(rentalRes.data);
      setTickets(ticketRes.data);
      
      if (analyticsRes.data?.success) {
        setMetrics(analyticsRes.data.metrics);
      }
    } catch (err) {
      console.error("Error communicating with admin management layer:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdateStatus = async (rentalId, currentStatus) => {
    const nextStatus = currentStatus === 'pending' ? 'delivered' : 'returned';
    try {
      await API.put(`/rentals/${rentalId}/status`, { status: nextStatus });
      fetchAdminData(); 
    } catch (err) {
      alert("Failed to modify logistics lifecycle.");
    }
  };

  const handleResolveTicket = async (ticketId) => {
    try {
      await API.put(`/maintenance/${ticketId}/resolve`);
      fetchAdminData();
    } catch (err) {
      alert("Failed to sign off support ticket.");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500 font-medium">
        Loading asset infrastructure control logs...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-gray-50 min-h-screen">
      
      {/* Dynamic Action Header Block */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Admin Control Panel</h1>
          <p className="text-gray-500 text-sm mt-1">
            Fulfillment pipelines, hardware lifecycle records, and support operations management.
          </p>
        </div>
        <div className="flex items-center space-x-3 shrink-0">
          <Link 
            to="/admin/inventory" 
            className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition flex items-center space-x-2 shadow-xs"
          >
            <PlusCircle size={16} />
            <span>Add New Product</span>
          </Link>
          <button 
            onClick={fetchAdminData} 
            className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* 3. Analytics Metric Grid Layer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Card 1: MRR */}
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-xs">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Monthly Recurring Revenue</p>
          <p className="text-3xl font-extrabold text-brand-600 mt-2">
            ${metrics.monthlyRecurringRevenue}<span className="text-sm font-medium text-gray-500">/mo</span>
          </p>
          <p className="text-[10px] text-emerald-600 font-medium mt-1">↑ Active subscription cash flow</p>
        </div>

        {/* Card 2: Security Deposits */}
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-xs">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Escrow Deposits Held</p>
          <p className="text-3xl font-extrabold text-gray-900 mt-2">${metrics.securityDepositsHeld}</p>
          <p className="text-[10px] text-gray-400 font-medium mt-1">100% Refundable reserve liability</p>
        </div>

        {/* Card 3: Utilization Rate */}
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-xs">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Fleet Utilization</p>
          <p className="text-3xl font-extrabold text-amber-500 mt-2">{metrics.assetUtilizationRate}%</p>
          <p className="text-[10px] text-gray-400 font-medium mt-1">Ratio of deployed vs warehouse items</p>
        </div>

        {/* Card 4: Active Contracts */}
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-xs">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Leases</p>
          <p className="text-3xl font-extrabold text-gray-900 mt-2">{metrics.activeSubscriptions} Units</p>
          <p className="text-[10px] text-brand-600 font-medium mt-1">Live customer accounts streaming rent</p>
        </div>
      </div>

      {/* Main Operational Split-Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Logistics & Delivery Dispatch Queue */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-4">
          <h2 className="font-bold text-gray-800 text-lg flex items-center space-x-2 border-b border-gray-50 pb-3">
            <Truck size={20} className="text-brand-600" />
            <span>Fulfillment & Delivery Queues</span>
          </h2>

          {rentals.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">No pending deployment logs recorded.</p>
          ) : (
            <div className="space-y-4">
              {rentals.map((rental) => (
                <div key={rental._id} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{rental.product?.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Customer: {typeof rental.user === 'object' ? rental.user.name : rental.user}
                    </p>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">{rental.deliveryAddress?.street}, {rental.deliveryAddress?.city}</p>
                  </div>
                  <div className="flex items-center gap-3 justify-between sm:justify-end">
                    <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                      rental.status === 'delivered' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {rental.status}
                    </span>
                    {rental.status === 'pending' && (
                      <button 
                        onClick={() => handleUpdateStatus(rental._id, rental.status)}
                        className="bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center space-x-1"
                      >
                        <Check size={14} />
                        <span>Dispatch</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Maintenance Dispatch Center */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-4">
          <h2 className="font-bold text-gray-800 text-lg flex items-center space-x-2 border-b border-gray-50 pb-3">
            <Wrench size={20} className="text-amber-500" />
            <span>Active Maintenance Tickets</span>
          </h2>

          {tickets.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">No technical support tickets open.</p>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div key={ticket._id} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                        {ticket.issueType}
                      </span>
                      <h4 className="font-bold text-gray-900 text-sm mt-1.5">Rental Agreement: {ticket.rentalId}</h4>
                    </div>
                    <span className="text-xs text-gray-400 font-medium">Target: {new Date(ticket.scheduledDate).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-gray-600 bg-white p-2.5 rounded-lg border border-gray-50">{ticket.description}</p>
                  
                  {ticket.status === 'open' && (
                    <div className="flex justify-end">
                      <button 
                        onClick={() => handleResolveTicket(ticket._id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
                      >
                        Mark Fixed & Clear
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}