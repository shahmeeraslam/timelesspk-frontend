import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  RiMailSendLine, RiHistoryLine, RiVipCrownLine, 
   RiSearchLine, RiCheckLine, 
  RiProhibited2Line
} from '@remixicon/react';

const Customers = () => {
  const { orders } = useStore();
  const [searchTerm, setSearchTerm] = useState("");

  // 1. DYNAMIC LOGIC: Aggregate customer data from the Archive Log (orders)
 // 1. DYNAMIC LOGIC: Aggregate customer data
  const customers = orders.reduce((acc, order) => {
    // We check if BOTH name and email match to define a "Unique Patron"
    const existing = acc.find(c => 
      c.email === order.email && c.name === order.customer
    );

    if (existing) {
      existing.spent += order.total;
      existing.orders += 1;
    } else {
      acc.push({
        name: order.customer,
        email: order.email || "no-email@archive.com", // Fallback if email is missing
        spent: order.total,
        orders: 1,
        isBlacklisted: false,
        isVIP: order.total > 2000 
      });
    }
    return acc;
   }, []);

  const filteredMembers = customers.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 style={{ color: 'var(--brand-main)' }} className="text-4xl font-serif italic">Archive Members</h1>
          <p style={{ color: 'var(--brand-muted)' }} className="text-[10px] uppercase tracking-[0.5em] mt-2">Manage the Bold_Comfort Community</p>
        </div>
        
        {/* Search Bar */}
        <div className="flex items-center gap-3 border-b border-[var(--brand-border)] pb-2 min-w-[300px]">
          <RiSearchLine size={16} className="opacity-30" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="bg-transparent outline-none text-[10px] uppercase tracking-widest w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {filteredMembers.map((member, i) => (
          <div 
            key={i} 
            style={{ 
              borderColor: member.isBlacklisted ? 'rgba(239, 68, 68, 0.2)' : 'var(--brand-border)', 
              backgroundColor: member.isBlacklisted ? 'rgba(239, 68, 68, 0.02)' : 'var(--brand-soft-bg)' 
            }}
            className="p-8 border flex flex-col lg:flex-row lg:items-center justify-between gap-8 group hover:border-[var(--brand-main)] transition-all"
          >
            <div className="flex items-center gap-6">
              <div 
                style={{ backgroundColor: 'var(--brand-main)', color: 'var(--brand-alt)' }} 
                className={`w-14 h-14 flex items-center justify-center text-xs font-bold tracking-tighter ${member.isBlacklisted ? 'opacity-20' : ''}`}
              >
                {member.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 style={{ color: 'var(--brand-main)' }} className={`text-sm font-bold ${member.isBlacklisted ? 'line-through opacity-40' : ''}`}>
                    {member.name}
                  </h3>
                  {member.isVIP && <RiVipCrownLine size={14} className="text-amber-500 animate-pulse" />}
                </div>
                <p style={{ color: 'var(--brand-muted)' }} className="text-[10px] uppercase tracking-widest">{member.email}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-12">
              <div className="text-center">
                <p style={{ color: 'var(--brand-muted)' }} className="text-[9px] uppercase tracking-widest mb-1">Orders</p>
                <p style={{ color: 'var(--brand-main)' }} className="text-sm font-light">{member.orders}</p>
              </div>
              <div className="text-center">
                <p style={{ color: 'var(--brand-muted)' }} className="text-[9px] uppercase tracking-widest mb-1">Contribution</p>
                <p style={{ color: 'var(--brand-main)' }} className="text-sm font-light">${member.spent.toLocaleString()}</p>
              </div>
              
              {/* Management Actions */}
              <div className="flex items-center gap-6 pl-6 border-l border-[var(--brand-border)]">
                <button title="View History" className="text-[var(--brand-muted)] hover:text-[var(--brand-main)] transition-colors">
                  <RiHistoryLine size={18} />
                </button>
                <button 
                  title={member.isBlacklisted ? "Restore Member" : "Blacklist Member"}
                  className={`transition-colors ${member.isBlacklisted ? 'text-emerald-500' : 'text-[var(--brand-muted)] hover:text-red-500'}`}
                >
                  {member.isBlacklisted ? <RiCheckLine size={18} /> : <RiProhibited2Line size={18} />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Customers;