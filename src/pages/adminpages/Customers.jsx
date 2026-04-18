import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  RiHistoryLine, RiSearchLine, RiCheckLine, 
  RiProhibited2Line, RiArrowRightUpLine, RiCloseLine,
  RiMapPin2Line, RiPhoneLine, RiMailLine, RiFocus2Line
} from '@remixicon/react';

const Customers = () => {
  const { orders } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatron, setSelectedPatron] = useState(null);
  const [blacklistedEmails, setBlacklistedEmails] = useState(new Set());

  // Handle Scroll Locking for UX
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    if (selectedPatron) {
      document.body.style.overflow = 'hidden';
    }
    return () => (document.body.style.overflow = originalStyle);
  }, [selectedPatron]);

  // DATA PROCESSING
  const customers = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return [];
    
    const registry = orders.reduce((acc, order) => {
      const email = order.address?.email ?? "GUEST_USER";
      const name = `${order.address?.firstName ?? "GUEST"} ${order.address?.lastName ?? ""}`.trim();
      
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
          image: profilePic || `https://ui-avatars.com/api/?name=${name}&background=random`,
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

  // SEARCH LOGIC
  const filteredMembers = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return customers;
    return customers.filter(m => 
      m.name.toLowerCase().includes(query) || 
      m.email.toLowerCase().includes(query)
    );
  }, [customers, searchTerm]);

  return (
    <div className="w-full min-h-screen bg-[#fafafa] text-black p-4 md:p-10 font-sans selection:bg-black selection:text-white">
      
      {/* RESPONSIVE HEADER */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12 border-b-4 border-black pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-red-600 rounded-full animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] opacity-40">System_Status: Operational</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">Patron_Log</h1>
        </div>

        <div className="relative w-full lg:w-[400px] group">
          <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity" size={20} />
          <input 
            type="text" 
            placeholder="SEARCH BY NAME OR EMAIL..." 
            className="w-full bg-white border-2 border-black py-4 pl-12 pr-4 text-xs font-mono font-bold uppercase outline-none shadow-[4px_4px_0px_black] focus:shadow-none focus:translate-x-1 focus:translate-y-1 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* RESPONSIVE LIST VIEW */}
      <div className="space-y-4">
        {filteredMembers.length > 0 ? (
          filteredMembers.map((member) => (
            <div 
              key={member.email} 
              className="flex flex-col md:grid md:grid-cols-12 items-center p-5 bg-white border-2 border-black hover:shadow-[8px_8px_0px_black] transition-all group"
            >
              {/* Identity Column */}
              <div className="w-full md:col-span-5 flex items-center gap-4">
                <img src={member.image} alt="" className="w-14 h-14 border-2 border-black object-cover bg-zinc-100" />
                <div className="truncate">
                  <h3 className="text-xl font-black uppercase tracking-tighter leading-tight truncate">{member.name}</h3>
                  <p className="text-[10px] font-mono opacity-40 truncate uppercase">{member.email}</p>
                </div>
              </div>

              {/* Stats Columns - Hidden on very small mobile, shown as row on tablets */}
              <div className="w-full md:col-span-5 grid grid-cols-2 gap-4 my-4 md:my-0 border-y md:border-y-0 md:border-x border-black/10 py-4 md:py-0 px-6">
                <div>
                  <p className="text-[9px] font-black uppercase opacity-30">Manifests</p>
                  <p className="text-lg font-mono font-bold italic">[{member.orders.toString().padStart(2, '0')}]</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black uppercase opacity-30">Settlement</p>
                  <p className="text-lg font-mono font-bold">PKR {member.spent.toLocaleString()}</p>
                </div>
              </div>

              {/* Actions Column */}
              <div className="w-full md:col-span-2 flex justify-end gap-2">
                <button 
                  onClick={() => setSelectedPatron(member)}
                  className="w-full md:w-auto bg-black text-white px-6 py-3 font-black uppercase italic text-xs flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors"
                >
                  View_Profile <RiArrowRightUpLine size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-black/20">
            <RiFocus2Line size={40} className="mx-auto mb-4 opacity-10 animate-spin-slow" />
            <p className="text-xs font-mono font-black uppercase opacity-30 tracking-[0.5em]">No_Patron_Matches_Found</p>
          </div>
        )}
      </div>

      {/* FULLY RESPONSIVE MODAL OVERLAY */}
      {selectedPatron && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-6 lg:p-12">
          <div 
            className="absolute inset-0 bg-black/95 backdrop-blur-sm cursor-crosshair" 
            onClick={() => setSelectedPatron(null)}
          />
          
          <div className="relative bg-white w-full max-w-6xl h-full md:h-auto md:max-h-[90vh] flex flex-col md:flex-row border-[4px] border-black shadow-[20px_20px_0px_rgba(255,255,255,0.1)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* MOBILE CLOSE BUTTON */}
            <button 
              onClick={() => setSelectedPatron(null)}
              className="absolute top-4 right-4 z-[110] p-2 bg-black text-white md:hidden"
            >
              <RiCloseLine size={24} />
            </button>

            {/* SIDEBAR: PATRON INFO */}
            <div className="w-full md:w-[350px] lg:w-[400px] bg-zinc-50 border-b-4 md:border-b-0 md:border-r-4 border-black p-6 md:p-10 shrink-0 overflow-y-auto">
              <div className="space-y-8">
                <img 
                  src={selectedPatron.image} 
                  alt="" 
                  className="w-32 h-32 lg:w-48 lg:h-48 border-4 border-black shadow-[10px_10px_0px_black] object-cover mx-auto md:mx-0" 
                />
                
                <div className="space-y-4">
                  <h2 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase italic leading-[0.85]">{selectedPatron.name}</h2>
                  <div className="space-y-2 pt-4 border-t border-black/10">
                    <p className="flex items-center gap-3 font-mono text-[10px] font-bold uppercase truncate"><RiMailLine size={14}/> {selectedPatron.email}</p>
                    <p className="flex items-center gap-3 font-mono text-[10px] font-bold uppercase"><RiPhoneLine size={14}/> {selectedPatron.phone}</p>
                    <p className="flex items-start gap-3 font-mono text-[10px] font-bold uppercase text-red-600">
                      <RiMapPin2Line size={14} className="mt-0.5 shrink-0"/> 
                      <span>{selectedPatron.address?.street}, {selectedPatron.address?.city}</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-6">
                  <div className="bg-black text-white p-4">
                    <span className="text-[8px] block opacity-40 uppercase font-black">Total_Spent</span>
                    <span className="text-lg font-black italic">PKR {selectedPatron.spent.toLocaleString()}</span>
                  </div>
                  <div className="border-2 border-black p-4">
                    <span className="text-[8px] block opacity-40 uppercase font-black">Orders</span>
                    <span className="text-lg font-black italic">#{selectedPatron.orders}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* MAIN AREA: ORDER HISTORY */}
            <div className="flex-1 flex flex-col min-h-0 bg-white">
              <div className="p-4 md:p-6 border-b-2 border-black bg-white flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <RiHistoryLine size={18} />
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Purchase_History</h4>
                </div>
                <button 
                  onClick={() => setSelectedPatron(null)}
                  className="hidden md:block p-2 bg-black text-white hover:rotate-90 transition-transform"
                >
                  <RiCloseLine size={24} />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-4 md:p-10 space-y-8 custom-scrollbar">
                {selectedPatron.history.map((order, idx) => (
                  <div key={idx} className="group border-2 border-black p-4 md:p-6 bg-zinc-50/50 hover:bg-zinc-50 transition-colors">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-black/5 pb-4">
                      <div className="font-mono">
                        <p className="text-[9px] font-black opacity-30 uppercase">Entry_Point: {idx + 1}</p>
                        <p className="text-xs font-bold">REF: {order._id?.$oid || order._id}</p>
                        <p className="text-[10px] opacity-40">{new Date(order.createdAt?.$date || order.createdAt).toDateString()}</p>
                      </div>
                      <span className="px-3 py-1 bg-white border-2 border-black text-[10px] font-black uppercase italic">{order.status}</span>
                    </div>

                    <div className="space-y-2">
                      {order.items?.map((item, i) => (
                        <div key={i} className="flex gap-4 p-3 bg-white border border-black/10 items-center">
                          <img src={item.img || item.image?.[0]?.url} alt="" className="w-12 h-12 object-cover border border-black" />
                          <div className="flex-grow flex flex-col sm:flex-row sm:justify-between sm:items-center">
                            <div>
                              <p className="text-xs font-black uppercase leading-none">{item.name}</p>
                              <p className="text-[9px] font-mono opacity-40 uppercase mt-1">Size: {item.size} | Qty: {item.quantity}</p>
                            </div>
                            <p className="text-xs font-mono font-black italic mt-2 sm:mt-0">PKR {item.price?.toLocaleString()}</p>
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
    </div>
  );
};

export default Customers;