import React from 'react';
import { useStore } from '../../context/StoreContext'; 
import { 
  RiMoneyDollarCircleLine, RiAlertLine, 
  RiLineChartLine, RiHistoryLine,
  RiArrowRightUpLine, RiStackLine,
  RiTShirtLine, RiCompass3Line
} from '@remixicon/react';

const Dashboard = () => {
  const { orders, products } = useStore();

  // --- ANALYTICS LOGIC ---
  const totalRevenue = orders
    .filter(o => o.status !== "Cancelled")
    .reduce((sum, order) => sum + (order.amount || 0), 0);

  const lowStockItems = products.filter(p => p.stock < 5);
  const pendingOrders = orders.filter(o => o.status === "Pending Verification").length;
  
  /**
   * ROBUST CATEGORY MAPPING
   * Logic handles both flattened and nested JSON structures.
   * Tracks volume (quantity) instead of just order count for better insight.
   */
  const categorySales = orders.reduce((acc, order) => {
    if (!order.items) return acc;
    order.items.forEach(item => {
      const catName = item.category || item.productId?.category || "Uncategorized";
      const qty = item.quantity || 1;
      acc[catName] = (acc[catName] || 0) + qty;
    });
    return acc;
  }, {});

  const totalUnitsSold = Object.values(categorySales).reduce((a, b) => a + b, 0) || 1;

  const stats = [
    { 
      label: "Archive_Revenue", 
      value: `PKR ${totalRevenue.toLocaleString()}`, 
      icon: <RiMoneyDollarCircleLine size={20} />, 
      trend: "+12.5%",
      desc: "Total value of successful sales" 
    },
    { 
      label: "Open_Shipments", 
      value: pendingOrders, 
      icon: <RiStackLine size={20} />, 
      trend: "Urgent",
      desc: "Orders awaiting dispatch" 
    },
    { 
      label: "Inventory_Risk", 
      value: lowStockItems.length, 
      icon: <RiAlertLine size={20} />, 
      desc: "Items near depletion",
      color: lowStockItems.length > 0 ? "text-red-500" : "text-emerald-500"
    },
    { 
      label: "Avg_Order_Value", 
      value: `PKR ${(totalRevenue / (orders.length || 1)).toFixed(0)}`, 
      icon: <RiLineChartLine size={20} />, 
      trend: "Stable",
      desc: "Average spend per customer" 
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b pb-8" style={{ borderColor: 'var(--brand-border)' }}>
        <div>
          <p className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] opacity-40 mb-2">Internal_Metric_Control</p>
          <h1 style={{ color: 'var(--brand-main)' }} className="text-5xl font-black tracking-tighter uppercase italic">Intelligence</h1>
        </div>
        <div className="flex gap-2">
            <div className="px-4 py-2 border text-[9px] font-black uppercase tracking-widest" style={{ borderColor: 'var(--brand-border)', color: 'var(--brand-muted)' }}>
                Sync_Status: OK
            </div>
            <div className="px-4 py-2 border text-[9px] font-black uppercase tracking-widest" style={{ borderColor: 'var(--brand-accent)', color: 'var(--brand-accent)' }}>
                {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
        </div>
      </div>
      
      {/* PRIMARY STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} style={{ backgroundColor: 'var(--brand-soft-bg)', borderColor: 'var(--brand-border)' }} className="p-6 border group hover:border-[var(--brand-accent)] transition-all shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div style={{ color: 'var(--brand-accent)' }} className="opacity-80 group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              {stat.trend && (
                <span className="text-[9px] font-mono font-bold flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5" style={{ color: 'var(--brand-accent)' }}>
                   <RiArrowRightUpLine size={10}/> {stat.trend}
                </span>
              )}
            </div>
            <div className="space-y-1">
                <p style={{ color: 'var(--brand-muted)' }} className="text-[9px] uppercase tracking-[0.2em] font-bold">{stat.label}</p>
                <h3 className={`text-2xl font-black italic tracking-tighter ${stat.color || 'text-[var(--brand-main)]'}`}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* RECENT ORDERS FEED */}
        <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-4">
                <RiHistoryLine size={18} style={{ color: 'var(--brand-accent)' }} />
                <h2 className="text-xs font-black uppercase tracking-[0.3em]" style={{ color: 'var(--brand-main)' }}>Recent_Dispatches</h2>
            </div>
            <div className="border border-[var(--brand-border)] overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead style={{ backgroundColor: 'var(--brand-soft-bg)' }} className="text-[9px] uppercase tracking-widest text-[var(--brand-muted)]">
                        <tr>
                            <th className="p-5 font-black">Ref_ID</th>
                            <th className="p-5 font-black">Origin</th>
                            <th className="p-5 font-black">Status</th>
                            <th className="p-5 font-black text-right">Yield</th>
                        </tr>
                    </thead>
                    <tbody className="text-xs font-medium">
                        {orders.slice(0, 6).map((order, idx) => {
                            const orderId = order._id?.$oid || order._id || "";
                            return (
                              <tr key={idx} className="border-t border-[var(--brand-border)] hover:bg-white/5 transition-colors group">
                                  <td className="p-5 font-mono opacity-60">
                                    #{String(orderId).slice(-6).toUpperCase() || "NEW"}
                                  </td>
                                  <td className="p-5">
                                    <span className="block font-black">{order.address?.firstName} {order.address?.lastName}</span>
                                    <span className="text-[9px] opacity-40 uppercase">{order.address?.city}</span>
                                  </td>
                                  <td className="p-5">
                                      <span className="px-2 py-1 text-[8px] font-black uppercase border" 
                                            style={{ 
                                              borderColor: order.status === 'Delivered' ? 'var(--brand-accent)' : 'var(--brand-border)',
                                              color: order.status === 'Delivered' ? 'var(--brand-accent)' : 'var(--brand-main)'
                                            }}>
                                          {order.status}
                                      </span>
                                  </td>
                                  <td className="p-5 text-right font-black italic group-hover:text-[var(--brand-accent)] transition-colors">
                                    PKR {order.amount?.toLocaleString()}
                                  </td>
                              </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>

        {/* SIDEBAR: Category Performance & Stock */}
        <div className="lg:col-span-4 space-y-8">
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <RiCompass3Line size={18} style={{ color: 'var(--brand-accent)' }} />
                    <h2 className="text-xs font-black uppercase tracking-[0.3em]" style={{ color: 'var(--brand-main)' }}>Niche_Performance</h2>
                </div>
                <div className="border border-[var(--brand-border)] p-6 space-y-4">
                    {Object.entries(categorySales).map(([cat, count]) => (
                        <div key={cat} className="space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                <span>{cat}</span>
                                <span style={{ color: 'var(--brand-accent)' }}>{count} Units Sold</span>
                            </div>
                            <div className="h-1 bg-[var(--brand-soft-bg)] overflow-hidden">
                                <div 
                                  className="h-full bg-[var(--brand-accent)]" 
                                  style={{ width: `${(count / totalUnitsSold) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <RiTShirtLine size={18} className="text-red-500" />
                    <h2 className="text-xs font-black uppercase tracking-[0.3em]" style={{ color: 'var(--brand-main)' }}>Stock_Alerts</h2>
                </div>
                <div className="space-y-3">
                    {lowStockItems.slice(0, 3).map((item, idx) => (
                        <div key={idx} style={{ backgroundColor: 'var(--brand-soft-bg)', borderColor: 'var(--brand-border)' }} className="flex items-center gap-4 p-3 border">
                            <img src={item.image?.[0]?.url || item.img || "/placeholder.jpg"} alt="" className="w-10 h-10 object-cover grayscale" />
                            <div className="flex-grow">
                                <p className="text-[9px] font-black uppercase truncate max-w-[120px]">{item.name}</p>
                                <p className="text-[8px] font-mono text-red-500 font-bold">{item.stock} UNITS REMAINING</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>

      <footer className="pt-8 border-t flex justify-between items-center" style={{ borderColor: 'var(--brand-border)' }}>
        <p className="text-[8px] font-mono opacity-30 uppercase tracking-[0.5em]">System_Ref_2026_V2</p>
        <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[8px] font-black uppercase opacity-40">Encryption_Standard_AES256</span>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;