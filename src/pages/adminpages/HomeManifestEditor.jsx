import React, { useState, useEffect } from "react";
import API from "../../../api";
import { 
  RiSave3Line, RiTerminalBoxLine, RiLayout4Line, 
  RiListCheck, RiShieldFlashLine, RiPulseLine,
  RiInformationLine 
} from "@remixicon/react";

// Modular Sub-Components
import TickerSection from "../../components/SystemTicker.jsx";
import HeroSection from "../../components/cms/HeroSection.jsx";
import ContentSection from "../../components/cms/ContentSection";
import CurationModule from "../../components/cms/CurationModule";
import FooterMetadata from "../../components/cms/FooterMetadata";
import VisualHUD from "../../components/cms/VisualHUD";
import AboutManifestEditor from "../../components/cms/AboutManifestEditor.jsx";
import toast from "react-hot-toast";

const HomeManifestEditor = () => {
  const [activeTab, setActiveTab] = useState("TEXT_CONFIG"); 
  const [config, setConfig] = useState({
    hero: { titleTop: "", titleBottom: "", subtitle: "", bgImage: "", tagline: "" },
    highlights: { title: "", tagline: "" },
    lookbook: { title: "", tagline: "" },
    footwear: { title: "", subtitle: "", tagline: "" },
    tickerMessages: [],
    featuredProducts: [],
    lookbookProducts: [],
    footwearProducts: [],
    announcement: { text: "", isVisible: false },
    footer: { brandTitleTop: "", brandTitleBottom: "", missionStatement: "", socials: {} },
    aboutPage: { hero: {}, manifesto: {}, disciplines: [] } // Ensure aboutPage is initialized
  });
  
  const [allProducts, setAllProducts] = useState([]); 
  const [searchQuery, setSearchQuery] = useState(""); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [configRes, productRes] = await Promise.all([
          API.get("/api/admin/home-config"),
          API.get("/api/products")
        ]);
        if (configRes.data) setConfig(configRes.data);
        setAllProducts(productRes.data);
      } catch (err) { console.error("MANIFEST_SYNC_ERROR", err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      await API.put("/api/admin/home-config", config);
      toast.success("HOME_PROTOCOL_SYNC_SUCCESS");
    } catch (err) { toast.error("CRITICAL_SYNC_FAILURE"); }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px] font-mono text-[10px] animate-pulse">
      <RiTerminalBoxLine size={20} className="mr-3" /> INITIALIZING_CORE_MANIFEST...
    </div>
  );

  return (
    <div className="max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
      
      {/* --- COMMAND HEADER --- */}
      <header className="sticky top-0 z-[100] bg-[var(--brand-alt)]/80 backdrop-blur-md border-b border-[var(--brand-border)] pb-6 pt-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-[14px] font-black uppercase tracking-[0.4em] flex items-center gap-2">
            <RiPulseLine size={16} className="text-[var(--brand-main)]" /> Interface_Protocol_v2.6
          </h2>
          <nav className="flex gap-4">
            <TabItem active={activeTab === "TEXT_CONFIG"} onClick={() => setActiveTab("TEXT_CONFIG")} label="Text_Nodes" icon={RiLayout4Line} />
            <TabItem active={activeTab === "CURATION"} onClick={() => setActiveTab("CURATION")} label="Product_Curation" icon={RiListCheck} />
            <TabItem active={activeTab === "ABOUT_PAGE"} onClick={() => setActiveTab("ABOUT_PAGE")} label="About_Archive" icon={RiInformationLine} />
            <TabItem active={activeTab === "SYSTEM"} onClick={() => setActiveTab("SYSTEM")} label="Global_System" icon={RiShieldFlashLine} />
          </nav>
        </div>
        
        <button onClick={handleSave} className="group relative overflow-hidden px-10 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:bg-[var(--brand-main)]">
          <span className="relative z-10 flex items-center gap-3">
            <RiSave3Line size={14} /> Commit_Changes
          </span>
        </button>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-16 items-start">
        
        {/* --- LEFT: ACTIVE CONTROL ZONE --- */}
        <div className="xl:col-span-7 space-y-12">
          
          {activeTab === "TEXT_CONFIG" && (
            <div className="space-y-16 animate-in slide-in-from-left-4 duration-500">
              <HeroSection data={config.hero} update={(val) => setConfig({...config, hero: val})} />
              <ContentSection id="02" label="Highlights" data={config.highlights} update={(val) => setConfig({...config, highlights: val})} />
              <ContentSection id="03" label="Lookbook" data={config.lookbook} update={(val) => setConfig({...config, lookbook: val})} />
              <ContentSection id="04" label="Footwear" data={config.footwear} isLarge update={(val) => setConfig({...config, footwear: val})} />
            </div>
          )}

          {activeTab === "CURATION" && (
            <div className="animate-in slide-in-from-left-4 duration-500">
              <CurationModule allProducts={allProducts} config={config} setConfig={setConfig} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </div>
          )}

          {activeTab === "ABOUT_PAGE" && (
            <div className="animate-in slide-in-from-left-4 duration-500">
              <AboutManifestEditor config={config} setConfig={setConfig} />
            </div>
          )}

          {activeTab === "SYSTEM" && (
            <div className="space-y-16 animate-in slide-in-from-left-4 duration-500">
              <TickerSection config={config} setConfig={setConfig} />
              <FooterMetadata config={config} setConfig={setConfig} />
            </div>
          )}
        </div>

        {/* --- RIGHT: PERSISTENT HUD & TELEMETRY --- */}
        <div className="xl:col-span-5">
          <div className="sticky top-32 space-y-8">
            <VisualHUD config={config} setConfig={setConfig} />
            
            {/* TELEMETRY DATA BOX */}
            <div className="p-8 border border-white/5 bg-white/[0.02] space-y-6">
               <h4 className="text-[9px] font-mono uppercase tracking-[0.4em] opacity-30">Archive_Status</h4>
               <div className="space-y-3">
                  <StatusRow label="Selected_Products" val={`${config.featuredProducts.length + config.lookbookProducts.length + config.footwearProducts.length} Items`} color="text-[var(--brand-main)]" />
                  <StatusRow label="Ticker_Feed" val={`${config.tickerMessages.length} Messages`} />
                  <StatusRow label="Visibility" val={config.announcement.isVisible ? "BROADCASTING" : "OFFLINE"} color={config.announcement.isVisible ? "text-green-500" : "text-red-500"} />
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// UI Components
const TabItem = ({ active, onClick, label, icon: Icon }) => (
  <button onClick={onClick} className={`flex items-center gap-3 px-4 py-2 text-[9px] font-mono uppercase tracking-widest border transition-all ${active ? 'bg-white text-black border-white' : 'text-white/40 border-white/5 hover:border-white/20'}`}>
    <Icon size={12} /> {label}
  </button>
);

const StatusRow = ({ label, val, color = "text-white" }) => (
  <div className="flex justify-between text-[9px] font-mono border-b border-white/5 pb-2">
    <span className="opacity-40 uppercase">{label}</span>
    <span className={`${color} font-black`}>{val}</span>
  </div>
);

export default HomeManifestEditor;