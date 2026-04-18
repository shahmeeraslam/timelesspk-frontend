import React, { useMemo } from 'react';

// Moved outside to prevent re-creation on every render
const formatDate = (dateSource) => {
  if (!dateSource) return "N/A";
  const d = dateSource.$date ? new Date(dateSource.$date) : new Date(dateSource);
  return isNaN(d.getTime()) 
    ? "N/A" 
    : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
};

const InvoicePrint = ({ order, getOrderId }) => {
  // Memoize the order data extraction
  const { items, address, amount, createdAt, status, paymentMethod, payment } = useMemo(() => {
    return order || { items: [], address: {}, amount: 0 };
  }, [order]);

  // Memoize the formatted date to avoid recalculation
  const formattedDate = useMemo(() => formatDate(createdAt), [createdAt]);
  const orderReference = useMemo(() => getOrderId?.(order)?.toUpperCase() || "N/A", [order, getOrderId]);

  if (!order) return null;

  return (
    <>
      <style>
        {`
          @media print {
            body * { visibility: hidden !important; }
            #invoice-root, #invoice-root * { visibility: visible !important; }
            #invoice-root { 
              position: fixed !important; 
              left: 0 !important; 
              top: 0 !important; 
              width: 210mm; 
              height: 297mm;
              margin: 0 !important;
              padding: 15mm !important;
            }
            @page { size: A4; margin: 0; }
          }
        `}
      </style>

      <div 
        id="invoice-root"
        className="hidden print:flex flex-col bg-white text-black font-sans relative overflow-hidden box-border"
        style={{ 
          width: '210mm', 
          height: '297mm', 
          WebkitPrintColorAdjust: 'exact'
        }}
      >
        {/* 1. HEADER */}
        <header className="grid grid-cols-12 gap-4 border-t-[8px] border-black pt-5 mb-8">
          <div className="col-span-7">
            <h1 className="text-[75px] font-black tracking-tighter leading-[0.8] uppercase italic -ml-1">
              Invoice
            </h1>
            <div className="mt-6 flex flex-wrap gap-8">
               <div className="space-y-0.5">
                  <span className="text-[7px] font-black uppercase tracking-[0.3em] text-black/40 italic font-mono block">Reference_ID</span>
                  <span className="text-xs font-mono font-black italic">#{orderReference}</span>
               </div>
               <div className="space-y-0.5">
                  <span className="text-[7px] font-black uppercase tracking-[0.3em] text-black/40 italic font-mono block">Issued_Date</span>
                  <span className="text-xs font-mono font-black italic">{formattedDate}</span>
               </div>
            </div>
          </div>
          
          <div className="col-span-5 text-right flex flex-col justify-between items-end">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter leading-none">Your Brand</h2>
              <p className="text-[8px] font-mono font-bold tracking-[0.2em] opacity-30 uppercase mt-1 italic">Karachi // Pakistan</p>
            </div>
            <div className="bg-black text-white px-3 py-2 w-full max-w-[180px] text-left mt-2">
              <p className="text-[6px] font-mono uppercase tracking-[0.4em] opacity-50 mb-1 leading-none">System_Hash</p>
              <p className="text-[8px] font-mono break-all leading-none font-bold">{order._id}</p>
            </div>
          </div>
        </header>

        {/* 2. LOGISTICS */}
        <section className="grid grid-cols-12 border-y-[2px] border-black divide-x-[2px] divide-black">
          <div className="col-span-5 p-5 bg-zinc-50/50">
            <p className="text-[8px] font-black uppercase tracking-[0.4em] mb-3 text-black/30 italic">01 // Ship_To</p>
            <p className="text-xl font-serif italic font-black leading-tight uppercase tracking-tight">
              {address?.firstName} {address?.lastName}
            </p>
            <div className="text-[10px] font-mono font-bold mt-3 uppercase leading-relaxed opacity-70">
              <p>{address?.street}</p>
              <p>{address?.city}, {address?.state} {address?.zipcode}</p>
              <p className="mt-2 text-black font-black border-l-2 border-black pl-2 italic">TEL_{address?.phone}</p>
            </div>
          </div>

          <div className="col-span-7 grid grid-rows-2">
            <div className="border-b-[2px] border-black p-5 flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-[7px] font-black uppercase tracking-[0.3em] text-black/30 italic">Protocol</p>
                <p className="text-base font-black uppercase tracking-tighter italic border-b-2 border-black">{paymentMethod || "COD"}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-[7px] font-black uppercase tracking-[0.3em] text-black/30 italic">Settlement</p>
                <p className={`text-base font-black uppercase tracking-tighter italic ${payment ? 'text-black' : 'text-zinc-300'}`}>
                  {payment ? "Verified" : "Pending"}
                </p>
              </div>
            </div>
            <div className="p-5 flex justify-between items-center bg-black text-white">
              <div>
                <p className="text-[7px] font-black uppercase tracking-[0.3em] opacity-40 italic">State</p>
                <p className="text-base font-black uppercase tracking-tighter italic leading-none">{status}</p>
              </div>
              <div className="text-right">
                  <p className="text-[7px] font-black uppercase tracking-[0.3em] opacity-40 italic">Items</p>
                  <p className="text-base font-black uppercase tracking-tighter italic leading-none">
                    [{items?.length.toString().padStart(2, '0')}]
                  </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. MANIFEST TABLE */}
        <main className="flex-grow pt-5">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-[4px] border-black text-[8px] font-black uppercase tracking-[0.4em]">
                <th className="pb-2 text-left">Manifest_Description</th>
                <th className="pb-2 text-center w-20">Qty</th>
                <th className="pb-2 text-right w-32">Value (PKR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {items.map((item, i) => (
                <tr key={i} className="break-inside-avoid">
                  <td className="py-3">
                    <span className="text-base font-black block tracking-tighter leading-none uppercase mb-1">{item.name}</span>
                    <div className="flex gap-2 text-[7px] font-mono font-bold tracking-widest uppercase text-black/30 italic">
                      <span>SIZE: {item.size}</span>
                      <span>COLOR: {item.color}</span>
                    </div>
                  </td>
                  <td className="py-3 text-center">
                    <span className="text-[11px] font-mono font-black italic border border-black px-1.5 py-0.5">{item.quantity.toString().padStart(2, '0')}</span>
                  </td>
                  <td className="py-3 text-right font-serif italic font-black text-lg">
                    {((item.price || 0) * item.quantity).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>

        {/* 4. TOTALS */}
        <footer className="mt-auto pt-5 flex justify-end">
          <div className="w-full max-w-md border-t-[8px] border-black pt-3">
            <div className="flex justify-between items-end">
              <div className="space-y-2">
                 <div className="bg-black text-white px-2 py-0.5 inline-block text-[9px] font-black uppercase italic">Grand_Total</div>
                 <p className="text-[7px] font-mono font-bold opacity-30 uppercase italic leading-tight max-w-[140px]">
                   Archival confirmation of dispatch value.
                 </p>
              </div>
              <div className="text-right flex items-baseline gap-2">
                <span className="text-base font-black font-mono border-b-2 border-black pb-1 italic">PKR</span>
                <span className="text-[70px] font-black italic tracking-tighter leading-[0.7]">
                  {amount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </footer>

        {/* DECORATIVE */}
        <div className="absolute right-1 top-1/2 -rotate-90 origin-right pointer-events-none opacity-5 text-[7px] font-mono font-black tracking-[1.2em] uppercase">
          A4_PROTOCOL_MANIFEST_2026
        </div>

        <div className="pt-5 flex justify-between items-end border-t border-black/10 mt-5">
          <div className="flex gap-1 h-6 items-end opacity-40">
            {[...Array(30)].map((_, i) => (
              <div key={i} className={`w-[1.5px] bg-black ${i % 5 === 0 ? 'h-full' : 'h-1/2'}`} />
            ))}
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black uppercase tracking-widest italic leading-none">Stay Authentic.</p>
            <p className="text-[6px] font-mono uppercase tracking-[0.2em] mt-1 opacity-20 font-black italic">Electronic_Receipt_Protocol</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(InvoicePrint);