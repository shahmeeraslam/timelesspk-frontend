import React, { useMemo } from 'react';

const formatDate = (dateSource) => {
  if (!dateSource) return "N/A";
  const d = dateSource.$date ? new Date(dateSource.$date) : new Date(dateSource);
  return isNaN(d.getTime()) 
    ? "N/A" 
    : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
};

const InvoicePrint = ({ order, getOrderId }) => {
  const { items, address, amount, createdAt, status, paymentMethod, payment } = useMemo(() => {
    return order || { items: [], address: {}, amount: 0 };
  }, [order]);

  // Calculate Subtotal of items
  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }, [items]);

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
              background: white !important;
            }
            @page { size: A4; margin: 0; }
          }
        `}
      </style>

      <div 
        id="invoice-root"
        className="hidden print:flex flex-col bg-white text-black font-sans relative overflow-hidden box-border"
        style={{ width: '210mm', height: '297mm', WebkitPrintColorAdjust: 'exact' }}
      >
        {/* 1. HEADER */}
        <header className="grid grid-cols-12 gap-4 border-t-[8px] border-black pt-5 mb-8">
          <div className="col-span-7">
            <h1 className="text-[75px] font-black tracking-tighter leading-[0.8] uppercase italic -ml-1">Invoice</h1>
            <div className="mt-6 flex flex-wrap gap-8 text-xs font-mono font-black italic">
               <div className="space-y-0.5">
                  <span className="text-[7px] tracking-[0.3em] text-black/40 block">Reference_ID</span>
                  <span>#{orderReference}</span>
               </div>
               <div className="space-y-0.5">
                  <span className="text-[7px] tracking-[0.3em] text-black/40 block">Issued_Date</span>
                  <span>{formattedDate}</span>
               </div>
            </div>
          </div>
          
          <div className="col-span-5 text-right flex flex-col justify-between items-end">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter">Your Brand</h2>
              <p className="text-[8px] font-mono font-bold tracking-[0.2em] opacity-30 italic">Karachi // PK</p>
            </div>
            <div className="bg-black text-white px-3 py-2 w-full max-w-[180px] text-left">
              <p className="text-[6px] font-mono uppercase tracking-[0.4em] opacity-50 leading-none">System_Hash</p>
              <p className="text-[8px] font-mono break-all font-bold">{order._id}</p>
            </div>
          </div>
        </header>

        {/* 2. LOGISTICS */}
        <section className="grid grid-cols-12 border-y-[2px] border-black divide-x-[2px] divide-black">
          <div className="col-span-5 p-5 bg-zinc-50/50">
            <p className="text-[8px] font-black uppercase tracking-[0.4em] mb-3 text-black/30 italic">01 // Ship_To</p>
            <p className="text-xl font-serif italic font-black uppercase">{address?.firstName} {address?.lastName}</p>
            <div className="text-[10px] font-mono font-bold mt-2 opacity-70">
              <p>{address?.street}</p>
              <p>{address?.city}, {address?.state} {address?.zipcode}</p>
              <p className="mt-2 text-black font-black border-l-2 border-black pl-2">TEL_{address?.phone}</p>
            </div>
          </div>
          <div className="col-span-7 p-5 flex justify-between items-center bg-white">
            <div className="space-y-4">
               <div>
                 <p className="text-[7px] font-black uppercase tracking-[0.3em] text-black/30 italic">Method</p>
                 <p className="text-sm font-black uppercase italic border-b-2 border-black">{paymentMethod || "COD"}</p>
               </div>
               <div>
                 <p className="text-[7px] font-black uppercase tracking-[0.3em] text-black/30 italic">Status</p>
                 <p className="text-sm font-black uppercase italic">{status}</p>
               </div>
            </div>
            <div className="text-right space-y-4">
               <div>
                 <p className="text-[7px] font-black uppercase tracking-[0.3em] text-black/30 italic">Payment</p>
                 <p className={`text-sm font-black uppercase italic ${payment ? 'text-black' : 'text-zinc-300'}`}>{payment ? "Verified" : "Pending"}</p>
               </div>
               <div>
                 <p className="text-[7px] font-black uppercase tracking-[0.3em] text-black/30 italic">Units</p>
                 <p className="text-sm font-black italic">[{items?.length.toString().padStart(2, '0')}]</p>
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
                <th className="pb-2 text-right w-32">Unit_Price</th>
                <th className="pb-2 text-right w-32">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {items.map((item, i) => (
                <tr key={i} className="break-inside-avoid">
                  <td className="py-3">
                    <span className="text-base font-black block tracking-tighter uppercase mb-1">{item.name}</span>
                    <div className="text-[7px] font-mono font-bold uppercase text-black/30 italic">
                      S: {item.size} // C: {item.color}
                    </div>
                  </td>
                  <td className="py-3 text-center text-[11px] font-mono font-black italic">{item.quantity}</td>
                  <td className="py-3 text-right font-mono text-[11px] opacity-40">{item.price?.toLocaleString()}</td>
                  <td className="py-3 text-right font-serif italic font-black text-lg">
                    {((item.price || 0) * item.quantity).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>

        {/* 4. TOTALS SECTION */}
        <footer className="mt-auto pt-5 flex justify-end">
          <div className="w-full max-w-lg">
            {/* Calculation Lines */}
            <div className="border-t-2 border-black flex flex-col gap-1 py-3 font-mono text-[10px] font-black uppercase tracking-tighter">
              <div className="flex justify-between">
                <span className="opacity-40 italic">Items_Subtotal</span>
                <span>{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-black/10 pb-1">
                <span className="opacity-40 italic">Logistics_Fee</span>
                <span>0.00</span>
              </div>
            </div>

            {/* Grand Total */}
            <div className="border-t-[8px] border-black pt-2 flex justify-between items-end">
              <div className="space-y-2">
                 <div className="bg-black text-white px-2 py-0.5 inline-block text-[9px] font-black uppercase italic">Grand_Total</div>
                 <p className="text-[7px] font-mono font-bold opacity-30 uppercase italic leading-tight max-w-[140px]">
                   Archival confirmation of dispatch value.
                 </p>
              </div>
              <div className="text-right flex items-baseline gap-2">
                <span className="text-base font-black font-mono border-b-2 border-black pb-1 italic font-black">PKR</span>
                <span className="text-[70px] font-black italic tracking-tighter leading-[0.7]">
                  {amount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </footer>

        {/* BOTTOM DECOR */}
        <div className="pt-5 flex justify-between items-end border-t border-black/10 mt-5 opacity-40">
          <p className="text-[7px] font-mono font-black tracking-widest uppercase">A4_PROTOCOL_MANIFEST_2026</p>
          <div className="text-right">
            <p className="text-[9px] font-black uppercase italic leading-none">Stay Authentic.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(InvoicePrint);