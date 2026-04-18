import React, { useState, useRef } from "react";
import PageTransition from "../components/PageTransition";
import emailjs from "@emailjs/browser"; // [Step 1: Install & Import]
import { 
  RiMailSendLine, 
  RiGlobalLine, 
  RiCustomerService2Line, 
  RiArrowRightUpLine,
  RiMapPinLine,
  RiLoader3Line
} from "@remixicon/react";

const Contact = () => {
  const form = useRef();
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState("READY"); // READY, SENDING, SUCCESS, ERROR

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSending(true);
    setStatus("SENDING");

    // Replace these strings with your actual EmailJS IDs
    const SERVICE_ID = "service_fjpbhrt";
    const TEMPLATE_ID = "template_jso3aqw";
    const PUBLIC_KEY = "1ct0-NJRob_z-TrRp";

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
      .then((result) => {
          setStatus("SUCCESS");
          setIsSending(false);
          form.current.reset(); // Clear form
          setTimeout(() => setStatus("READY"), 5000); // Reset UI after 5s
      }, (error) => {
          setStatus("ERROR");
          setIsSending(false);
          console.error(error.text);
      });
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[var(--brand-alt)] text-[var(--brand-main)] font-sans antialiased overflow-x-hidden">
        
        {/* --- 1. HEADER: COMMS_UPLINK --- */}
        <section className="relative pt-48 pb-24 px-6 md:px-12 max-w-7xl mx-auto border-x border-[var(--brand-border)]">
          <div className="flex items-center gap-6 mb-12">
            <div className="flex items-center gap-2 px-3 py-1 border border-[var(--brand-border)] bg-[var(--brand-soft-bg)]">
              <RiMailSendLine size={12} className={isSending ? "animate-spin" : "text-[var(--brand-accent)]"} />
              <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-[var(--brand-muted)]">
                Status: {status}
              </span>
            </div>
            <div className="h-[1px] flex-grow bg-gradient-to-r from-[var(--brand-border)] to-transparent" />
          </div>
          <h1 className="text-6xl md:text-9xl font-serif italic mb-8 uppercase tracking-tighter">Connect_</h1>
        </section>

        <section className="relative max-w-7xl mx-auto px-6 md:px-12 py-24 flex flex-col lg:flex-row gap-0 border-x border-[var(--brand-border)]">
          {/* --- 2. LEFT SIDE: GLOBAL NODES (Omitted for brevity, keep your existing code here) --- */}
          <div className="w-full lg:w-1/3 space-y-20 pb-20 lg:pb-0 lg:pr-20 border-b lg:border-b-0 lg:border-r border-[var(--brand-border)]">
              {/* Keep Atelier info from previous step */}
          </div>

          {/* --- 3. RIGHT SIDE: THE TRANSMISSION FORM --- */}
          <div className="w-full lg:w-2/3 lg:pl-20 py-20 lg:py-0">
            <div className="flex items-center gap-4 mb-12">
               <span className="text-[10px] font-mono text-[var(--brand-accent)]">[ Transmission_Input ]</span>
               <div className="h-[1px] flex-grow bg-[var(--brand-border)]" />
            </div>

            <form ref={form} onSubmit={sendEmail} className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="flex flex-col border-b border-[var(--brand-border)] focus-within:border-[var(--brand-accent)] transition-all duration-500 py-3">
                  <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-[var(--brand-muted)]">Identifier_Full_Name</label>
                  <input
                    type="text"
                    name="from_name" // Ensure this matches EmailJS template key
                    className="bg-transparent outline-none text-sm pt-4 font-light text-[var(--brand-main)]"
                    required
                  />
                </div>
                <div className="flex flex-col border-b border-[var(--brand-border)] focus-within:border-[var(--brand-accent)] transition-all duration-500 py-3">
                  <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-[var(--brand-muted)]">Electronic_Mail</label>
                  <input
                    type="email"
                    name="from_email" // Ensure this matches EmailJS template key
                    className="bg-transparent outline-none text-sm pt-4 font-light text-[var(--brand-main)]"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col border-b border-[var(--brand-border)] focus-within:border-[var(--brand-accent)] transition-all duration-500 py-3">
                <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-[var(--brand-muted)]">Subject_Manifest</label>
                <select
                  name="subject"
                  className="bg-transparent outline-none text-[11px] pt-4 cursor-pointer uppercase tracking-widest text-[var(--brand-main)] font-mono"
                >
                  <option className="bg-[var(--brand-alt)]">General Inquiry</option>
                  <option className="bg-[var(--brand-alt)]">Bespoke Appointment</option>
                  <option className="bg-[var(--brand-alt)]">Archive Access Request</option>
                </select>
              </div>

              <div className="flex flex-col border-b border-[var(--brand-border)] focus-within:border-[var(--brand-accent)] transition-all duration-500 py-3">
                <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-[var(--brand-muted)]">Message_Payload</label>
                <textarea
                  name="message"
                  rows="4"
                  className="bg-transparent outline-none text-sm pt-6 resize-none font-light leading-relaxed"
                  placeholder="Encrypt your message here..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="group relative flex items-center justify-center gap-6 border border-[var(--brand-accent)] px-12 py-5 text-[10px] font-mono uppercase tracking-[0.5em] transition-all disabled:opacity-50 hover:bg-[var(--brand-accent)] hover:text-[var(--brand-alt)]"
              >
                {status === "SENDING" ? (
                  <RiLoader3Line className="animate-spin" size={16} />
                ) : status === "SUCCESS" ? (
                  "Transmission Received"
                ) : (
                  <>Log Inquiry <RiArrowRightUpLine size={16} /></>
                )}
              </button>
              
              {status === "ERROR" && (
                <p className="text-[9px] font-mono text-red-500 uppercase tracking-widest">
                  System Error: Transmission Failed. Please try direct email.
                </p>
              )}
            </form>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Contact;