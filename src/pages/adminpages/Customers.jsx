import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  RiHistoryLine, RiSearchLine, RiArrowRightUpLine, RiCloseLine,
  RiMapPin2Line, RiPhoneLine, RiMailLine, RiFocus2Line, RiShieldUserLine
} from '@remixicon/react';
import { AnimatePresence } from 'framer-motion';

const Customers = () => {
  const { orders } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatron, setSelectedPatron] = useState(null);

  // Sync scroll lock with modal state
  useEffect(() => {
    document.body.style.overflow = selectedPatron ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedPatron]);

  // DATA PROCESSING: Aggregating unique customers from orders
  const customers = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return [];
    
    const registry = orders.reduce((acc, order) => {
      const email = order.address?.email ?? "GUEST_USER";
      const name = `${order.address?.firstName ?? "GUEST"} ${order.address?.lastName ?? ""}`.trim();
      
      // Attempt to find a review image from any item in the order to use as avatar
      const profilePic = order.items?.[0]?.reviews?.find(r => 
        r.name.toLowerCase() === name.toLowerCase()
      )?.userImg;

      if (acc[email]) {
        acc[email].spent += Number(order.amount) || 0;
        acc[email].orders += 1;
        acc[email].history.push(order);
      } else {
        acc[email] = {
          name,
          email,
          phone: order.address?.phone ?? "N/A",
          image: profilePic || `https://ui-avatars.com/api/?name=${name}&background=0D0D0D&color=fff`,
          spent: Number(order.amount) || 0,
          orders: 1,
          history: [order],
          address: order.address,
        };
      }
      return acc;
    }, {});
    
    return Object.values(registry).sort((a, b) => b.spent - a.spent);
  }, [orders]);

  const filteredMembers = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    return customers.filter(m => 
      m.name.toLowerCase().includes(query) || 
      m.email.toLowerCase().includes(query)
    );
  }, [customers, searchTerm]);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      
      {/* HEADER: Brutalist Terminal Style */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b pb-8" style={{ borderColor: 'var(--brand-border)' }}>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <RiShieldUserLine size={14} style={{ color: 'var(--brand-accent)' }} />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] opacity-40">Database_Query: Active</span>
          </div>
          <h1 style={{ color: 'var(--brand-main)' }} className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">Patrons</h1>
        </div>

        <div className="relative w-full lg:w-[450px] group">
          <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity" size={18} />
          <input 
            type="text" 
            placeholder="FILTER BY IDENTITY OR NODE..." 
            style={{ 
              backgroundColor: 'var(--brand-soft-bg)', 
              borderColor: 'var(--brand-border)',
              color: 'var(--brand-main)'
            }}
            className="w-full border py-5 pl-12 pr-4 text-[10px] font-mono font-bold uppercase outline-none focus:border-[var(--brand-accent)] transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* PATRON LIST */}
      <div className="grid grid-cols-1 gap-4">
        {filteredMembers.length > 0 ? (
          filteredMembers.map((member) => (
            <div 
              key={member.email} 
              style={{ backgroundColor: 'var(--brand-soft-bg)', borderColor: 'var(--brand-border)' }}
              className="flex flex-col md:grid md:grid-cols-12 items-center p-6 border group hover:border-[var(--brand-accent)] transition-all"
            >
              <div className="w-full md:col-span-5 flex items-center gap-6">
                <div className="relative">
                  <img src={member.image} alt="" className="w-14 h-14 border border-[var(--brand-border)] grayscale group-hover:grayscale-0 transition-all object-cover" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-[var(--brand-alt)] rounded-full"></div>
                </div>
                <div className="truncate">
                  <h3 style={{ color: 'var(--brand-main)' }} className="text-lg font-black uppercase tracking-tighter truncate">{member.name}</h3>
                  <p style={{ color: 'var(--brand-muted)' }} className="text-[9px] font-mono uppercase tracking-widest">{member.email}</p>
                </div>
              </div>

              <div className="w-full md:col-span-4 grid grid-cols-2 gap-8 my-6 md:my-0 md:border-x border-[var(--brand-border)] px-8">
                <div>
                  <p className="text-[8px] font-black uppercase opacity-30 mb-1">Engagements</p>
                  <p style={{ color: 'var(--brand-main)' }} className="text-sm font-mono font-bold">[{member.orders.toString().padStart(2, '0')}]</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-black uppercase opacity-30 mb-1">Lifetime_Yield</p>
                  <p style={{ color: 'var(--brand-accent)' }} className="text-sm font-mono font-bold">PKR {member.spent.toLocaleString()}</p>
                </div>
              </div>

              <div className="w-full md:col-span-3 flex justify-end">
                <button 
                  onClick={() => setSelectedPatron(member)}
                  style={{ backgroundColor: 'var(--brand-main)', color: 'var(--brand-alt)' }}
                  className="w-full md:w-auto px-8 py-3 font-black uppercase italic text-[10px] flex items-center justify-center gap-3 hover:bg-[var(--brand-accent)] transition-all"
                >
                  Access_Node <RiArrowRightUpLine size={14} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-32 text-center border border-dashed" style={{ borderColor: 'var(--brand-border)' }}>
            <RiFocus2Line size={32} className="mx-auto mb-4 opacity-10 animate-spin-slow" style={{ color: 'var(--brand-main)' }} />
            <p className="text-[10px] font-mono font-black uppercase opacity-20 tracking-[0.5em]">No_Patron_Data_Found</p>
          </div>
        )}
      </div>

      {/* MODAL: Full Screen Tactical View */}
      <AnimatePresence>
        {selectedPatron && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-12">
            <div 
              className="absolute inset-0 bg-black/90 backdrop-blur-xl" 
              onClick={() => setSelectedPatron(null)}
            />
            
            <div 
              style={{ backgroundColor: 'var(--brand-alt)', borderColor: 'var(--brand-border)' }}
              className="relative w-full max-w-7xl h-[90vh] flex flex-col md:flex-row border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
            >
              {/* SIDEBAR: Profile Meta */}
              <div style={{ backgroundColor: 'var(--brand-soft-bg)' }} className="w-full md:w-[380px] border-b md:border-b-0 md:border-r border-[var(--brand-border)] p-10 overflow-y-auto">
                <button onClick={() => setSelectedPatron(null)} className="mb-10 text-[var(--brand-muted)] hover:text-[var(--brand-main)] transition-colors flex items-center gap-2">
                   <RiCloseLine size={20} /> <span className="text-[10px] font-black uppercase">Terminate_View</span>
                </button>

                <div className="space-y-10">
                  <div className="relative inline-block">
                    <img src={selectedPatron.image} alt="" className="w-40 h-40 border border-[var(--brand-border)] grayscale object-cover" />
                    <div className="absolute -top-3 -left-3 px-3 py-1 bg-[var(--brand-accent)] text-[var(--brand-alt)] text-[8px] font-black uppercase tracking-widest">Patron_Lvl_1</div>
                  </div>
                  
                  <div className="space-y-6">
                    <h2 style={{ color: 'var(--brand-main)' }} className="text-5xl font-black tracking-tighter uppercase italic leading-[0.85]">{selectedPatron.name}</h2>
                    <div className="space-y-4 pt-6 border-t" style={{ borderColor: 'var(--brand-border)' }}>
                      <p className="flex items-center gap-4 font-mono text-[9px] font-bold uppercase opacity-60"><RiMailLine size={14} className="text-[var(--brand-accent)]"/> {selectedPatron.email}</p>
                      <p className="flex items-center gap-4 font-mono text-[9px] font-bold uppercase opacity-60"><RiPhoneLine size={14} className="text-[var(--brand-accent)]"/> {selectedPatron.phone}</p>
                      <p className="flex items-start gap-4 font-mono text-[9px] font-bold uppercase opacity-60">
                        <RiMapPin2Line size={14} className="mt-0.5 shrink-0 text-[var(--brand-accent)]"/> 
                        <span>{selectedPatron.address?.street}, <br/> {selectedPatron.address?.city}, {selectedPatron.address?.country}</span>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 border border-[var(--brand-border)]">
                    <div className="p-5 border-r" style={{ borderColor: 'var(--brand-border)' }}>
                      <span className="text-[8px] block opacity-30 uppercase font-black mb-1">Revenue_Yield</span>
                      <span className="text-lg font-black italic" style={{ color: 'var(--brand-accent)' }}>PKR {selectedPatron.spent.toLocaleString()}</span>
                    </div>
                    <div className="p-5">
                      <span className="text-[8px] block opacity-30 uppercase font-black mb-1">Manifests</span>
                      <span className="text-lg font-black italic" style={{ color: 'var(--brand-main)' }}>#{selectedPatron.orders}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* MAIN CONTENT: Transaction Feed */}
              <div className="flex-1 flex flex-col min-h-0">
                <div className="p-8 border-b flex justify-between items-center" style={{ borderColor: 'var(--brand-border)' }}>
                  <div className="flex items-center gap-4">
                    <RiHistoryLine size={18} style={{ color: 'var(--brand-accent)' }} />
                    <h4 style={{ color: 'var(--brand-main)' }} className="text-[10px] font-black uppercase tracking-[0.4em]">Transaction_Manifest_History</h4>
                  </div>
                </div>

                <div className="flex-grow overflow-y-auto p-10 space-y-12">
                  {selectedPatron.history.map((order, idx) => (
                    <div key={idx} className="group border border-[var(--brand-border)] p-8 hover:border-[var(--brand-accent)] transition-all">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 border-b pb-6" style={{ borderColor: 'var(--brand-border)' }}>
                        <div className="font-mono">
                          <p className="text-[9px] font-black opacity-30 uppercase mb-1">Log_Index: {idx + 1}</p>
                          <p className="text-xs font-bold" style={{ color: 'var(--brand-main)' }}>REF: {order._id?.$oid || order._id}</p>
                          <p className="text-[9px] opacity-40 uppercase tracking-widest">{new Date(order.createdAt?.$date || order.createdAt).toDateString()}</p>
                        </div>
                        <span className="px-4 py-1 border text-[9px] font-black uppercase italic" style={{ borderColor: 'var(--brand-accent)', color: 'var(--brand-accent)' }}>{order.status}</span>
                      </div>

                      <div className="space-y-4">
                        {order.items?.map((item, i) => (
                          <div key={i} style={{ backgroundColor: 'var(--brand-soft-bg)' }} className="flex gap-6 p-4 border border-transparent hover:border-[var(--brand-border)] transition-all items-center">
                            <img src={item.img || item.image?.[0]?.url} alt="" className="w-14 h-14 object-cover border border-[var(--brand-border)] grayscale group-hover:grayscale-0" />
                            <div className="flex-grow flex flex-col sm:flex-row sm:justify-between sm:items-center">
                              <div>
                                <p style={{ color: 'var(--brand-main)' }} className="text-xs font-black uppercase leading-none">{item.name}</p>
                                <p className="text-[9px] font-mono opacity-40 uppercase mt-2 tracking-widest">SZ: {item.size} / QNT: {item.quantity}</p>
                              </div>
                              <p style={{ color: 'var(--brand-accent)' }} className="text-sm font-mono font-black italic mt-4 sm:mt-0">PKR {item.price?.toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Customers;