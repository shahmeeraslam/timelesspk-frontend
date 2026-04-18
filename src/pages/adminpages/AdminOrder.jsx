import React, { useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx'; // 1. Import XLSX
import { useStore } from '../../context/StoreContext';
import API from '../../../api'; 
import { AnimatePresence, motion } from 'framer-motion';
import { 
  RiSearchLine, RiRefreshLine, RiInboxArchiveLine, RiCheckDoubleLine, RiDownload2Line 
} from '@remixicon/react';

// Sub-Components
import InvoicePrint from '../../components/Adminorders/InvoicePrint';
import OrderSidebar from '../../components/Adminorders/OrderSidebar';
import OrderRow from '../../components/Adminorders/OrderRow';

const AdminOrders = () => {
  const { orders, setOrders, fetchOrders } = useStore();
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (fetchOrders) fetchOrders();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const getOrderId = (order) => {
    if (!order) return "";
    const rawId = order._id?.$oid || order._id || order.id;
    return typeof rawId === 'string' ? rawId : String(rawId || "");
  };

  /**
   * EXCEL EXPORT LOGIC
   * Flattens the nested JSON structure into spreadsheet-friendly rows
   */
  const exportToExcel = () => {
    if (filteredOrders.length === 0) return setToast("No_Data_To_Export");

    const excelData = filteredOrders.map(o => ({
      ORDER_ID: getOrderId(o),
      DATE: new Date(o.date).toLocaleDateString('en-GB'),
      CUSTOMER: `${o.address?.firstName} ${o.address?.lastName}`,
      EMAIL: o.address?.email,
      PHONE: o.address?.phone,
      TOTAL_PKR: o.amount,
      STATUS: o.status,
      CITY: o.address?.city,
      ADDRESS: `${o.address?.street}, ${o.address?.state}`,
      ITEM_LOG: o.items.map(i => `${i.name} (${i.size}x${i.quantity})`).join(" | ")
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Order_Manifest");

    // Dynamic filename based on current filter
    const fileName = `BC_Archive_${filterStatus.replace(/\s+/g, '_')}_${Date.now()}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    setToast("Excel_Export_Successful");
  };

  const getStatusTheme = (status) => {
    const s = status?.toLowerCase() ?? "";
    if (s.includes('delivered')) return { color: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/10' };
    if (s.includes('shipped') || s.includes('processing')) return { color: 'text-sky-400', border: 'border-sky-500/20', bg: 'bg-sky-500/10' };
    if (s.includes('cancelled')) return { color: 'text-rose-400', border: 'border-rose-500/20', bg: 'bg-rose-500/10' };
    return { color: 'text-amber-400', border: 'border-amber-500/20', bg: 'bg-amber-500/10' };
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      setOrders(prev => prev.map(o => getOrderId(o) === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder && getOrderId(selectedOrder) === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
      const response = await API.post('/api/orders/status', { orderId, status: newStatus });
      if (response.data.success) setToast(`Status Synchronized: ${newStatus}`);
    } catch (error) {
      setToast("Terminal Error: Sync Failed");
      if (fetchOrders) fetchOrders(); 
    }
  };

  const filteredOrders = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return [];
    return orders.filter(o => {
      const matchesStatus = filterStatus === "All" || o.status === filterStatus;
      const searchStr = searchTerm.toLowerCase();
      const firstName = o.address?.firstName?.toLowerCase() || "";
      const email = o.address?.email?.toLowerCase() || "";
      const orderId = getOrderId(o).toLowerCase();
      return matchesStatus && (orderId.includes(searchStr) || firstName.includes(searchStr) || email.includes(searchStr));
    }).reverse();
  }, [orders, filterStatus, searchTerm]);

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black font-sans">
      <InvoicePrint order={selectedOrder} getOrderId={getOrderId} />

      <div className={`p-6 lg:p-16 space-y-12 transition-all duration-700 print:hidden ${selectedOrder ? 'blur-2xl scale-[0.98] opacity-30 pointer-events-none' : ''}`}>
        <header className="flex flex-col lg:flex-row justify-between items-end gap-10">
          <div className="space-y-8 w-full">
            <div className="flex items-center gap-4">
              <span className="text-[9px] font-mono tracking-[0.5em] text-white/30 uppercase font-black">Archive_Protocol_v2.4</span>
              <div className="h-[1px] flex-grow bg-white/10" />
              
              <div className="flex items-center gap-6">
                {/* EXCEL DOWNLOAD BUTTON */}
                <button 
                  onClick={exportToExcel}
                  className="flex items-center gap-2 text-[9px] font-mono text-emerald-400 border border-emerald-500/20 px-4 py-2 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all uppercase tracking-widest"
                >
                  <RiDownload2Line size={14} /> Download_XLSX
                </button>

                <button 
                  onClick={() => fetchOrders && fetchOrders()} 
                  className="flex items-center gap-2 text-[9px] font-mono text-white/40 hover:text-emerald-400 transition-colors uppercase tracking-widest"
                >
                  <RiRefreshLine size={14} /> Re-Fetch_Logs
                </button>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <h2 className="text-8xl font-serif italic tracking-tighter leading-none">Archives</h2>
              <div className="flex items-center gap-4 bg-white/[0.03] border border-white/10 p-5 w-full md:max-w-md focus-within:border-white/30 focus-within:bg-white/[0.05] transition-all">
                <RiSearchLine size={18} className="text-white/20" />
                <input 
                  type="text" 
                  placeholder="SEARCH_BY_HASH_OR_USER..." 
                  className="bg-transparent outline-none text-[10px] uppercase tracking-[0.2em] w-full placeholder:text-white/10 font-mono"
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-8 border-b border-white/5 pb-4 overflow-x-auto no-scrollbar">
            {["All", "Pending Verification", "Processing", "Shipped", "Delivered", "Cancelled"].map(tab => (
              <button 
                key={tab} 
                onClick={() => setFilterStatus(tab)} 
                className={`text-[10px] uppercase tracking-[0.3em] font-black py-4 transition-all relative whitespace-nowrap ${filterStatus === tab ? 'text-white' : 'text-white/20 hover:text-white/40'}`}
              >
                {tab}
                {filterStatus === tab && (
                  <motion.div 
                    layoutId="tab-active" 
                    className="absolute bottom-0 left-0 w-full h-[3px] bg-white" 
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
        </div>

        {/* Order Grid */}
        <div className="grid grid-cols-1 gap-[1px] bg-white/10 border border-white/10">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderRow 
                key={getOrderId(order)}
                order={order}
                getOrderId={getOrderId}
                getStatusTheme={getStatusTheme}
                onSelect={setSelectedOrder}
              />
            ))
          ) : (
            <div className="py-60 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md">
              <RiInboxArchiveLine size={60} className="text-white/5 mb-8" />
              <p className="text-[11px] font-mono uppercase tracking-[0.8em] text-white/20 italic">No_Matching_Data_Points</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <OrderSidebar 
            order={selectedOrder} 
            getOrderId={getOrderId}
            onClose={() => setSelectedOrder(null)}
            onUpdateStatus={updateStatus}
            onPrint={() => window.print()}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: 20, opacity: 0 }} 
            className="fixed bottom-12 right-12 z-[1000] flex items-center gap-5 bg-white text-black px-8 py-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white"
          >
              <RiCheckDoubleLine size={20} />
              <div className="space-y-1">
                <p className="text-[10px] font-mono font-black uppercase tracking-widest leading-none">{toast}</p>
                <p className="text-[8px] font-mono uppercase opacity-40">Database_Sync_Complete</p>
              </div>
              <motion.div 
                initial={{ scaleX: 1 }} 
                animate={{ scaleX: 0 }} 
                transition={{ duration: 3, ease: "linear" }} 
                className="absolute bottom-0 left-0 h-[3px] w-full bg-black origin-left" 
              />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrders;