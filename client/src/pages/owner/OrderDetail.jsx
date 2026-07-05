import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Truck, Download, ArrowLeft } from 'lucide-react';
import api from '../../lib/api';

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        console.error('Failed to fetch order', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  const getStatusText = (status) => {
    switch (status) {
      case 'processing': return 'Processing';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      default: return 'Draft';
    }
  };

  const handleDownload = async () => {
    try {
      const res = await api.get(`/orders/${id}/receipt`);
      if (res.data && res.data.receiptUrl) {
        const a = document.createElement('a');
        a.href = res.data.receiptUrl.startsWith('http') ? res.data.receiptUrl : `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${res.data.receiptUrl}`;
        a.target = '_blank';
        a.download = `Receipt_${id}.pdf`;
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

  if (loading) {
    return <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">Loading...</div>;
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex flex-col items-center justify-center">
        <p className="mb-4 text-slate-500">Order not found</p>
        <button onClick={() => navigate(-1)} className="px-6 py-2 bg-blue-600 text-white rounded-lg">Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#1c1b1b] flex flex-col font-body relative z-0">
      
      <header className="px-6 pt-12 pb-4 flex items-center sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="mr-4 text-slate-500 hover:text-slate-800">
          <ArrowLeft size={24} />
        </button>
      </header>

      {/* Background Decorative Micro-Interaction */}
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#00347010_1px,transparent_1px)] [background-size:24px_24px]"></div>
      </div>

      <main className="flex-grow flex items-center justify-center px-4 pb-12 pt-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-md w-full bg-white rounded-xl border border-black/5 shadow-[0px_4px_24px_rgba(0,0,0,0.02)] p-8 text-center"
        >
          {/* Headline */}
          <div className="mb-8">
            <h1 className="font-display text-[28px] font-semibold tracking-tight text-[#1c1b1b] mb-2">Order Details</h1>
            <p className="font-body text-[14px] text-[#434751] capitalize">{order.tier} Tier Sticker</p>
          </div>

          {/* Signature Plate-Tag Device */}
          <div className="mb-8 flex flex-col items-center w-full">
            <div className="font-body text-[12px] font-bold tracking-[0.08em] text-[#434751] uppercase mb-3 text-center">ORDER REFERENCE</div>
            <div className="border-[2px] border-[#1A1A1A] bg-white px-4 md:px-6 py-2 md:py-3 rounded-lg inline-flex flex-wrap items-center justify-center hover:bg-black/5 transition-colors cursor-default mb-4 max-w-full overflow-hidden">
              <span className="font-mono text-[14px] md:text-[16px] font-semibold text-[#1A1A1A] tracking-wider truncate">{order._id}</span>
            </div>
            
            <button 
              onClick={handleDownload}
              className="flex items-center justify-center space-x-2 border-2 border-[#1E3A8A] text-[#1E3A8A] font-body text-[14px] font-bold tracking-[0.08em] uppercase py-2 px-6 rounded-lg hover:bg-slate-50 active:scale-[0.98] transition-all"
            >
              <Download size={18} />
              <span>Download Receipt (PDF)</span>
            </button>
          </div>

          {/* Meta Information */}
          <div className="grid grid-cols-1 gap-4 mb-10">
            <div className="bg-[#F7F8FA] p-5 rounded-lg border border-black/5 flex flex-col items-center">
              <Truck size={28} className="text-[#003470] mb-2" strokeWidth={1.5} />
              <span className="font-body text-[12px] font-bold tracking-[0.08em] text-[#434751] uppercase mb-1">STATUS</span>
              <span className="font-display text-[20px] font-semibold text-[#1c1b1b]">{getStatusText(order.fulfillmentStatus)}</span>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
