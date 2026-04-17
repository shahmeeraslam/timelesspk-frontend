import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  RiFileList3Line, RiCheckDoubleLine, RiTruckLine, 
  RiTimeLine, RiCloseCircleLine, RiCloseLine, RiMapPinLine, RiUserLine, RiSearchLine 
} from '@remixicon/react';

const AdminOrders = () => {
  // 1. GLOBAL STATE: Shared with Dashboard
  const { orders, setOrders } = useStore();

  // 2. UI STATE
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // 3. LOGIC: Update Status & Search
  const updateStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => ({ ...prev, status: newStatus }));
    }
    setToast(`Order ${orderId} marked as ${newStatus}`);
  };

  const filteredOrders = orders.filter(o => {
    const matchesStatus = filterStatus === "All" || o.status === filterStatus;
    const matchesSearch = o.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          o.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusTheme = (status) => {
    switch(status) {
      case 'Delivered': return { color: 'text-emerald-500', icon: <RiCheckDoubleLine size={16} />, border: 'border-emerald-500/30' };
      case 'Shipped': return { color: 'text-blue-500', icon: <RiTruckLine size={16} />, border: 'border-blue-500/30' };
      case 'Cancelled': return { color: 'text-red-500', icon: <RiCloseCircleLine size={16} />, border: 'border-red-500/30' };
      default: return { color: 'text-amber-500', icon: <RiTimeLine size={16} />, border: 'border-amber-500/30' };
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* MAIN VIEW */}
      <div className={`space-y-12 transition-all duration-500 ${selectedOrder ? 'blur-md opacity-40 scale-[0.98] pointer-events-none' : ''}`}>
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end border-b border-[var(--brand-border)] pb-8 gap-6">
          <div>
            <h1 style={{ color: 'var(--brand-main)' }} className="text-4xl font-serif italic">Archive Log</h1>
            <div className="mt-6 flex items-center gap-4 border-b border-[var(--brand-border)] pb-2 min-w-[320px]">
              <RiSearchLine size={18} style={{ color: 'var(--brand-muted)' }} />
              <input 
                type="text" 
                placeholder="Search Customer or ID..." 
                className="bg-transparent outline-none text-[10px] uppercase tracking-[0.2em] w-full placeholder:opacity-30"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-4">
            {["All", "Processing", "Shipped", "Delivered", "Cancelled"].map(tab => (
              <button 
                key={tab} 
                onClick={() => setFilterStatus(tab)} 
                className={`text-[9px] uppercase tracking-widest pb-2 px-2 transition-all ${filterStatus === tab ? 'text-[var(--brand-main)] border-b border-[var(--brand-main)]' : 'text-[var(--brand-muted)] opacity-50 hover:opacity-100'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              const theme = getStatusTheme(order.status);
              return (
                <div key={order.id} style={{ borderColor: 'var(--brand-border)', backgroundColor: 'var(--brand-soft-bg)' }} className="p-8 border flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:translate-x-1 transition-all group">
                  <div className="flex items-center gap-6">
                    <div style={{ backgroundColor: 'var(--brand-main)', color: 'var(--brand-alt)' }} className="w-12 h-12 flex items-center justify-center">
                      <RiFileList3Line size={20} />
                    </div>
                    <div>
                      <h3 style={{ color: 'var(--brand-main)' }} className="text-sm font-bold tracking-tight">{order.id}</h3>
                      <p style={{ color: 'var(--brand-muted)' }} className="text-[10px] uppercase tracking-widest">{order.customer}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-12">
                    <div className={`flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold ${theme.color}`}>
                      {theme.icon} {order.status}
                    </div>
                    <button onClick={() => setSelectedOrder(order)} style={{ color: 'var(--brand-main)', borderColor: 'var(--brand-main)' }} className="px-8 py-3 border text-[9px] uppercase tracking-[0.3em] hover:bg-[var(--brand-main)] hover:text-[var(--brand-alt)] transition-all">
                      View Details
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-20 text-center border border-dashed border-[var(--brand-border)]">
               <p className="text-[10px] uppercase tracking-[0.5em] opacity-40">No matching records found in archive</p>
            </div>
          )}
        </div>
      </div>

      {/* DETAIL PANEL & TOAST (Same as before) */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div style={{ backgroundColor: 'var(--brand-alt)', borderColor: 'var(--brand-border)' }} className="relative w-full max-w-xl border-l h-full shadow-2xl p-12 animate-in slide-in-from-right duration-500 overflow-y-auto">
            <button onClick={() => setSelectedOrder(null)} className="absolute top-8 right-8 hover:rotate-90 transition-transform p-2">
              <RiCloseLine size={28} style={{ color: 'var(--brand-main)' }} />
            </button>
            <header className="mb-16">
              <span style={{ color: 'var(--brand-muted)' }} className="text-[10px] uppercase tracking-[0.4em]">Transaction Record</span>
              <h2 style={{ color: 'var(--brand-main)' }} className="text-4xl font-serif italic mt-2 tracking-tighter">{selectedOrder.id}</h2>
            </header>
            <div className="space-y-12">
              <section className="space-y-4">
                <h4 className="text-[11px] uppercase tracking-widest opacity-50 font-bold">Logistics Update</h4>
                <select 
                  value={selectedOrder.status}
                  onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
                  style={{ backgroundColor: 'var(--brand-soft-bg)', color: 'var(--brand-main)' }}
                  className={`w-full p-5 text-[10px] uppercase tracking-[0.2em] font-bold border outline-none transition-all ${getStatusTheme(selectedOrder.status).border}`}
                >
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </section>
              <section className="space-y-8 pt-8 border-t border-[var(--brand-border)]">
                <div className="flex items-start gap-4">
                  <RiUserLine size={20} className="opacity-30" />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Customer</p>
                    <p className="text-md font-medium">{selectedOrder.customer}</p>
                    <p className="text-xs opacity-60 font-light mt-1">{selectedOrder.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <RiMapPinLine size={20} className="opacity-30" />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Dispatch To</p>
                    <p className="text-sm font-light leading-relaxed max-w-sm">{selectedOrder.address}</p>
                  </div>
                </div>
              </section>
              <section style={{ backgroundColor: 'var(--brand-soft-bg)', borderColor: 'var(--brand-border)' }} className="p-10 border">
                <div className="flex justify-between items-center mb-8 pt-6 border-t border-[var(--brand-border)]">
                  <span className="text-[12px] uppercase tracking-[0.2em] font-black">Archive Value</span>
                  <span style={{ color: 'var(--brand-main)' }} className="text-3xl font-serif italic">${selectedOrder.total}</span>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[var(--brand-main)] text-[var(--brand-alt)] px-8 py-4 text-[10px] uppercase tracking-[0.4em] shadow-2xl animate-in fade-in slide-in-from-bottom-4 z-[200]">
          {toast}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;