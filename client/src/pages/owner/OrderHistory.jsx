import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';

import api from '../../lib/api';

export default function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'processing': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'shipped': return 'bg-blue-100 text-[#1E3A8A] border-blue-200';
      case 'delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleDownload = async (e, orderId) => {
    e.stopPropagation(); // prevent row click
    try {
      const res = await api.get(`/orders/${orderId}/receipt`);
      if (res.data && res.data.receiptUrl) {
        // Create an invisible link to download the file
        const a = document.createElement('a');
        a.href = res.data.receiptUrl.startsWith('http') ? res.data.receiptUrl : `${import.meta.env.VITE_API_URL}${res.data.receiptUrl}`;
        a.target = '_blank';
        a.download = `Receipt_${orderId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        alert('Receipt not available yet.');
      }
    } catch (err) {
      console.error('Download failed', err);
      alert('Could not download receipt.');
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50 relative">
      <header className="px-6 pt-12 pb-4 bg-white shadow-sm flex items-center sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="mr-4 text-slate-400 hover:text-slate-600">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-800">Order History</h1>
      </header>

      <main className="flex-1 px-4 pt-6 pb-24 overflow-y-auto">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
               <span className="text-slate-400 font-bold text-xl">0</span>
            </div>
            <p className="text-slate-500 font-medium mb-4">No sticker orders yet.</p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 bg-[#1E3A8A] text-white rounded-lg font-medium text-sm"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div 
                key={order._id}
                onClick={() => navigate(`/order-history/${order._id}`)}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 cursor-pointer hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-slate-800 capitalize">{order.tier} Sticker</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {order.vehicleId ? (order.vehicleId.displayName || order.vehicleId.registrationNumber) : 'Unknown Vehicle'}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-wider ${getStatusColor(order.fulfillmentStatus)}`}>
                    {order.fulfillmentStatus}
                  </span>
                </div>
                
                <div className="flex justify-between items-end mt-4 pt-4 border-t border-slate-100">
                  <div>
                    <p className="text-xs text-slate-400">Order Date</p>
                    <p className="text-sm font-medium text-slate-700">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button 
                    onClick={(e) => handleDownload(e, order._id)}
                    className="flex items-center space-x-1 text-[#1E3A8A] bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 active:bg-blue-100 transition-colors"
                  >
                    <Download size={14} />
                    <span className="text-xs font-bold uppercase tracking-wider">Receipt</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
