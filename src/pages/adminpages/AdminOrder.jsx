import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import API from '../../../api'; // Added for status update transmission
import { AnimatePresence, motion } from 'framer-motion';
import { 
  RiCheckDoubleLine, RiTruckLine, RiInformationLine,
  RiTimeLine, RiCloseCircleLine, RiCloseLine, RiSearchLine,
  RiRefreshLine, RiInboxArchiveLine
} from '@remixicon/react';

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
    const rawId = order._id || order.id;
    if (typeof rawId === 'object' && rawId?.$oid) return rawId.$oid;
    return typeof rawId === 'string' ? rawId : String(rawId || "");
  };

  /**
   * TRANSMISSION LOGIC:
   * Sends the new status to the backend to persist changes.
   */
  const updateStatus = async (orderId, newStatus) => {
    try {
      // Optimistic Update: Change UI immediately
      setOrders(prev => prev.map(o => getOrderId(o) === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder && getOrderId(selectedOrder) === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }

      // Backend Sync: Matches standard admin status update routes
      const response = await API.post('/orders/status', { orderId, status: newStatus });
      
      if (response.data.success) {
        setToast(`Archive Updated: ${newStatus}`);
      }
    } catch (error) {
      console.error("Status_Update_Failure:", error);
      setToast("Terminal Error: Sync Failed");
      // Revert on failure
      fetchOrders(); 
    }
  };

  const filteredOrders = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return [];
    return orders.filter(o => {
      const matchesStatus = filterStatus === "All" || o.status === filterStatus;
      const searchStr = searchTerm.toLowerCase();
      
      const firstName = o.address?.firstName?.toLowerCase() || o.customer?.toLowerCase() || "";
      const email = o.address?.email?.toLowerCase() || "";
      const orderId = getOrderId(o).toLowerCase();

      return matchesStatus && (orderId.includes(searchStr) || firstName.includes(searchStr) || email.includes(searchStr));
    });
  }, [orders, filterStatus, searchTerm]);

  const getStatusTheme = (status) => {
    const s = status?.toLowerCase() ?? "";
    if (s.includes('delivered')) return { color: 'text-emerald-500', icon: <RiCheckDoubleLine size={14} />, border: 'border-emerald-500/20', bg: 'bg-emerald-500/5' };
    if (s.includes('shipped') || s.includes('processing')) return { color: 'text-blue-500', icon: <RiTruckLine size={14} />, border: 'border-blue-500/20', bg: 'bg-blue-500/5' };
    if (s.includes('cancelled')) return { color: 'text-red-500', icon: <RiCloseCircleLine size={14} />, border: 'border-red-500/20', bg: 'bg-red-500/5' };
    return { color: 'text-amber-500', icon: <RiTimeLine size={14} />, border: 'border-amber-500/20', bg: 'bg-amber-500/5' };
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black">
      <div className={`p-6 lg:p-12 space-y-10 transition-all duration-700 ${selectedOrder ? 'blur-xl scale-[0.99] opacity-20' : ''}`}>
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-[1px] bg-[var(--brand-main)]" />
              <button 
                onClick={() => fetchOrders()} 
                className="group flex items-center gap-2 text-[10px] font-mono tracking-[0.4em] uppercase text-white/40 hover:text-white transition-colors"
              >
                <RiRefreshLine size={12} className="group-hover:rotate-180 transition-transform duration-500" />
                Sync_Active_Logs
              </button>
            </div>
            <h2 className="text-5xl font-serif italic tracking-tighter">Archive Log</h2>
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-4 py-3 min-w-[350px]">
              <RiSearchLine size={16} className="text-white/20" />
              <input 
                type="text" 
                placeholder="ID / CUSTOMER / EMAIL..." 
                className="bg-transparent outline-none text-[9px] uppercase tracking-[0.2em] w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {["All", "Pending Verification", "Processing", "Shipped", "Delivered", "Cancelled"].map(tab => (
              <button 
                key={tab} 
                onClick={() => setFilterStatus(tab)} 
                className={`text-[8px] uppercase tracking-widest px-4 py-2 border transition-all ${filterStatus === tab ? 'bg-white text-black border-white' : 'border-white/10 text-white/40 hover:border-white/20'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        <div className="space-y-1">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              const theme = getStatusTheme(order.status);
              const currentId = getOrderId(order);
              const displayName = order.address ? `${order.address.firstName} ${order.address.lastName}` : (order.customer || "Unknown Collector");

              return (
                <div key={currentId} className="group flex flex-col lg:flex-row lg:items-center justify-between p-6 bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all">
                  <div className="flex items-center gap-8">
                    <span className="text-[9px] font-mono text-white/10 group-hover:text-[var(--brand-main)]">
                      {currentId.slice(-6).toUpperCase()}
                    </span>
                    <div>
                      <h3 className="text-sm font-medium tracking-tight uppercase">{displayName}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">{order.items?.length || 0} Item(s)</span>
                        <div className="w-1 h-1 rounded-full bg-white/10" />
                        <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">PKR {order.amount || order.total}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 mt-4 lg:mt-0">
                    <div className={`px-3 py-1 border ${theme.border} ${theme.bg} ${theme.color} flex items-center gap-2 text-[8px] font-mono uppercase tracking-[0.2em]`}>
                      {theme.icon} {order.status}
                    </div>
                    <button onClick={() => setSelectedOrder(order)} className="p-3 border border-white/10 hover:border-white hover:bg-white hover:text-black transition-all">
                      <RiInformationLine size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-20 flex flex-col items-center justify-center border border-dashed border-white/5 bg-white/[0.01]">
              <RiInboxArchiveLine size={40} className="text-white/5 mb-4" />
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/20 italic">No matching records in active_log</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[500] flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSelectedOrder(null)} />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              className="relative w-full max-w-2xl bg-[#0a0a0a] border-l border-white/10 h-full p-8 md:p-16 overflow-y-auto shadow-2xl"
            >
              <button onClick={() => setSelectedOrder(null)} className="absolute top-8 right-8 text-white/20 hover:text-white"><RiCloseLine size={32} /></button>

              <div className="space-y-16">
                <header className="space-y-4">
                  <span className="text-[9px] font-mono tracking-[0.5em] text-[var(--brand-main)] uppercase">Transmission_Details</span>
                  <h2 className="text-5xl font-serif italic tracking-tighter">
                    Archive_{(getOrderId(selectedOrder)).slice(-6).toUpperCase()}
                  </h2>
                </header>

                <div className="space-y-4">
                  <p className="text-[8px] font-mono uppercase tracking-[0.4em] text-white/30">Action: Update_Status</p>
                  <select 
                    value={selectedOrder.status}
                    onChange={(e) => updateStatus(getOrderId(selectedOrder), e.target.value)}
                    className="w-full bg-black border border-white/10 p-5 text-[10px] font-mono uppercase tracking-[0.2em] outline-none focus:border-white transition-all cursor-pointer"
                  >
                    <option value="Pending Verification">Pending Verification</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="space-y-6">
                  <p className="text-[8px] font-mono uppercase tracking-[0.4em] text-white/30">Manifest_Inventory</p>
                  <div className="space-y-4">
                    {selectedOrder.items?.map((item, idx) => (
                      <div key={idx} className="flex gap-6 p-4 border border-white/5 bg-white/[0.01]">
                        <div className="flex flex-col justify-center gap-1">
                          <h4 className="text-[10px] font-bold uppercase tracking-widest leading-tight">{item.name || "Premium Piece"}</h4>
                          <span className="text-[9px] font-mono text-white/40 uppercase">Size: {item.size} / Color: {item.color}</span>
                          <span className="text-[9px] font-mono text-white">{item.quantity} x {item.price || 0} PKR</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-10 pt-10 border-t border-white/5">
                  <div className="space-y-4">
                    <p className="text-[8px] font-mono uppercase tracking-[0.4em] text-white/30 italic">Collector_Data</p>
                    <div className="space-y-1">
                      <p className="text-sm font-serif italic">{selectedOrder.address?.firstName} {selectedOrder.address?.lastName}</p>
                      <p className="text-[10px] font-mono text-white/40">{selectedOrder.address?.phone}</p>
                      <p className="text-[10px] font-mono text-white/40 truncate">{selectedOrder.address?.email}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[8px] font-mono uppercase tracking-[0.4em] text-white/30 italic">Terminal_Node</p>
                    <p className="text-[10px] font-mono leading-relaxed text-white/60 uppercase">
                      {selectedOrder.address?.street}<br />
                      {selectedOrder.address?.city}, {selectedOrder.address?.state}
                    </p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-8 flex justify-between items-center">
                   <span className="text-[10px] font-mono uppercase tracking-[0.5em]">Consolidated_Value</span>
                   <span className="text-3xl font-serif italic text-white">{selectedOrder.amount || selectedOrder.total} PKR</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: 20, opacity: 0 }} 
            className="fixed bottom-8 left-8 bg-white text-black px-6 py-3 text-[9px] font-mono uppercase tracking-[0.2em] z-[600] border border-black shadow-2xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrders;