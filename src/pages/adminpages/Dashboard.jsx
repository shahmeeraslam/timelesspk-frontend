import React from 'react';
import { useStore } from '../../context/StoreContext'; // Path to your context
import { RiMoneyDollarCircleLine, RiShoppingBag3Line, RiAlertLine } from '@remixicon/react';

const Dashboard = () => {
  const { orders, products } = useStore();

  // 1. Calculate Total Revenue
  const totalRevenue = orders
    .filter(o => o.status !== "Cancelled")
    .reduce((sum, order) => sum + order.total, 0);

  // 2. Count Low Stock Items (Stock < 5)
  const lowStockCount = products.filter(p => p.stock < 5).length;

  const stats = [
    { 
      label: "Archive Revenue", 
      value: `$${totalRevenue.toLocaleString()}`, 
      icon: <RiMoneyDollarCircleLine />, 
      desc: "Gross from non-cancelled orders" 
    },
    { 
      label: "Active Shipments", 
      value: orders.filter(o => o.status === "Shipped").length, 
      icon: <RiShoppingBag3Line />, 
      desc: "Currently in transit" 
    },
    { 
      label: "Inventory Alerts", 
      value: lowStockCount, 
      icon: <RiAlertLine />, 
      desc: "Pieces with stock below 5",
      color: lowStockCount > 0 ? "text-red-500" : "text-emerald-500"
    }
  ];

  return (
    <div className="space-y-10">
      <h1 style={{ color: 'var(--brand-main)' }} className="text-4xl font-serif italic">At a Glance</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <div key={i} style={{ backgroundColor: 'var(--brand-soft-bg)', borderColor: 'var(--brand-border)' }} className="p-8 border group hover:translate-y-[-4px] transition-all">
            <div className="flex justify-between items-start mb-4">
              <div style={{ color: 'var(--brand-main)' }} className="opacity-40 group-hover:opacity-100 transition-opacity">
                {stat.icon}
              </div>
              <span className={`text-2xl font-serif italic ${stat.color || 'text-[var(--brand-main)]'}`}>{stat.value}</span>
            </div>
            <p style={{ color: 'var(--brand-main)' }} className="text-[10px] uppercase tracking-[0.2em] font-bold">{stat.label}</p>
            <p style={{ color: 'var(--brand-muted)' }} className="text-[9px] mt-1">{stat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;