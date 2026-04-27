"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useInView, animate, AnimatePresence } from 'framer-motion';
import { 
  Timer, CheckCircle2, MessageSquare, Zap, Users, 
  ArrowRight, BarChart3, Store,
  Briefcase, Menu, X, CalendarClock,
  Mail,
  Box,
  Package,
  Truck
} from 'lucide-react';
import Link from 'next/link';

// --- ANIMATION CONFIGS ---
const fadeInUp = {
  initial: { y: 40, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
};

const AnimatedNumber = ({ value, duration = 2 }: { value: number, duration?: number }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration,
        onUpdate: (latest) => setDisplayValue(latest),
      });
      return () => controls.stop();
    }
  }, [isInView, value, duration]);

  return <span ref={ref}>{displayValue.toLocaleString(undefined, { maximumFractionDigits: 1 })}</span>;
};

// Navbar remains untouched as requested
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[300] bg-white border-b border-gray-200 py-4 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center" dir="rtl">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-2xl font-black italic uppercase tracking-tighter text-black">
              DELIVERY <span className="text-[#FF5100]">NOW</span>
            </span>
            <img src="https://flagcdn.com/w40/il.png" alt="Israel" className="h-4 rounded-sm border border-black/20" />
          </Link>
          
          <div className="hidden md:flex gap-8 items-center font-bold text-sm uppercase italic">
            <Link href="/" className="text-black/80 hover:text-[#FF5100] transition-colors">בית</Link>
            <Link href="/about-us" className="text-black/80 hover:text-[#FF5100] transition-colors">אודות</Link>
            <Link href="#how-it-works" className="text-black/80 hover:text-[#FF5100] transition-colors">איך זה עובד</Link>
            <Link href="/order" className="bg-black text-white px-5 py-2 rounded-full hover:bg-[#FF5100] transition-all">הזמינו שליח</Link>
          </div>

          <button className="md:hidden text-black z-[301]" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu with Animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden fixed inset-0 z-[299] bg-white pt-24 px-6 space-y-6 flex flex-col font-black italic uppercase text-2xl" 
            dir="rtl"
          >
              <Link href="/" onClick={() => setIsOpen(false)} className="text-black/80 hover:text-[#FF5100] transition-colors border-b border-gray-100 pb-4">בית</Link>
              <Link href="/about-us" onClick={() => setIsOpen(false)} className="text-black/80 hover:text-[#FF5100] transition-colors border-b border-gray-100 pb-4">אודות</Link>
              <Link href="#how-it-works" onClick={() => setIsOpen(false)} className="text-black/80 hover:text-[#FF5100] transition-colors border-b border-gray-100 pb-4">איך זה עובד</Link>
              <Link href="/order" onClick={() => setIsOpen(false)} className="bg-[#FF5100] text-white px-5 py-4 rounded-xl transition-all text-center mt-4">הזמינו שליח</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const StepCard = ({ number, title, text }: { number: string, title: string, text: string }) => (
  <motion.div variants={fadeInUp} className="relative p-8 bg-white/[0.05] backdrop-blur-sm border border-white/10 border-r-4 border-r-[#FF5100] group hover:bg-white/[0.08] transition-all rounded-xl">
    <div className="text-7xl font-black text-white/[0.05] absolute top-2 right-4 group-hover:text-[#FF5100]/10 transition-colors">{number}</div>
    <h4 className="text-2xl font-black text-white mb-3 italic uppercase relative z-10">{title}</h4>
    <p className="text-slate-300 font-medium text-sm leading-relaxed relative z-10">{text}</p>
  </motion.div>
);

export default function DeliveryNowLanding() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <div className="min-h-screen bg-[#1A1C1E] text-white font-sans antialiased overflow-x-hidden selection:bg-[#FF5100] selection:text-white" dir="rtl">
      <Navbar />
      
      {/* ProgressBar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-[#FF5100] origin-right z-[301]" style={{ scaleX }} />

      {/* Hero Section - Using a Deep Charcoal instead of Black */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A1C1E]/80 via-[#1A1C1E]/40 to-[#1A1C1E] z-10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 blur-[120px] rounded-full z-0" />
          <img src="/landing_page.png" alt="Background" className="w-full h-full object-cover brightness-[0.4]" />
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-20 pt-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black leading-tight italic mb-6 text-white"
          >
            שליחויות <br />
            לעסקים - <span className="text-[#FF5100]">בלי</span> <br />
            <span className="text-[#FF5100]">לרדוף</span> אחרי אף <br />
            אחד
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl font-medium text-slate-300 mb-12 max-w-2xl mx-auto"
          >
            תוך דקה אחת סוגרים איסוף – <span className="text-white font-bold underline decoration-[#FF5100]">בפשטות, במהירות ובשקט.</span>
          </motion.p>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-wrap gap-4 justify-center">
            <Link href="/order" className="bg-[#FF5100] text-white px-10 py-4 rounded-full font-black text-xl shadow-lg hover:shadow-[#FF5100]/20 hover:scale-105 transition-all flex items-center gap-3">
              <Zap className="fill-current w-6 h-6" /> הזמינו עכשיו
            </Link>
            <Link href="#how-it-works" className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-4 rounded-full font-black text-xl hover:bg-white/20 transition-all">
              איך זה עובד?
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Package Types - Changed bg-white to bg-slate-50 (Soft Gray) */}
      <section className="py-20 px-6 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black italic text-[#1A1C1E] uppercase mb-4">
              מה <span className="text-[#FF5100]">שולחים</span> היום?
            </h2>
            <p className="text-slate-500 font-bold">בחרו את סוג החבילה למעבר מהיר להזמנה</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "מעטפה", sub: "מסמכים וניירת", icon: <Mail size={32} />, type: "envelope" },
              { label: "קטן", sub: "עד 2 ק״ג", icon: <Box size={32} />, type: "small" },
              { label: "בינוני", sub: "עד 10 ק״ג", icon: <Package size={32} />, type: "medium" },
              { label: "גדול", sub: "חבילות כבדות", icon: <Truck size={32} />, type: "large" }
            ].map((pkg, i) => (
              <Link key={i} href={`/order?type=${pkg.type}`}>
                <motion.div 
                  whileHover={{ y: -10, borderColor: '#FF5100' }}
                  className="group bg-white border-2 border-slate-100 p-8 rounded-3xl flex flex-col items-center text-center transition-all shadow-sm hover:shadow-xl"
                >
                  <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 text-[#FF5100] shadow-sm group-hover:bg-[#FF5100] group-hover:text-white transition-colors">
                    {pkg.icon}
                  </div>
                  <h3 className="text-2xl font-black text-[#1A1C1E] mb-2">{pkg.label}</h3>
                  <p className="text-slate-500 font-medium text-sm">{pkg.sub}</p>
                  <div className="mt-6 text-[#FF5100] opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight size={24} />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Using the deep charcoal background */}
      <section className="py-24 px-6 bg-[#1A1C1E]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-6">
          {[
            { label: "זמן איסוף", val: 24, unit: " דק'", icon: <Timer /> },
            { label: "דיוק", val: 99.8, unit: "%", icon: <CheckCircle2 /> },
            { label: "חיסכון", val: 30, unit: "%", icon: <BarChart3 /> },
            { label: "חוזרים", val: 92, unit: "%", icon: <Users /> },
            { label: "זמינות", val: 24, unit: "/6", icon: <CalendarClock /> },
          ].map((stat, i) => (
            <motion.div key={i} className="p-8 bg-white/5 border border-white/10 rounded-3xl text-center hover:border-white/30 transition-all">
              <div className="text-[#FF5100] mb-3 flex justify-center">{stat.icon}</div>
              <div className="text-4xl font-black text-white"><AnimatedNumber value={stat.val} />{stat.unit}</div>
              <div className="text-xs font-bold uppercase text-slate-400 mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Process Section - Using a slightly lighter charcoal for depth */}
      <section id="how-it-works" className="py-32 px-6 bg-white/[0.03] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-right">
            <h2 className="text-6xl md:text-7xl font-black italic text-white uppercase">המסלול <span className="text-[#FF5100]">המהיר.</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard number="01" title="הזמנה באתר" text="שולחים הודעה עם כתובת. מקבלים מחיר סופי תוך 60 שניות." />
            <StepCard number="02" title="איסוף מיידי" text="השליח הקרוב ביותר יוצא אליכם מיד." />
            <StepCard number="03" title="אישור מסירה" text="מקבלים צילום מסירה ואישור חתום למייל." />
          </div>
        </div>
      </section>

      {/* CTA Section - Vibrant Orange stays */}
      <section className="py-40 px-6 bg-[#FF5100] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative">
          <h2 className="text-[10vw] font-black italic leading-none mb-12 uppercase drop-shadow-lg">DELIVERY NOW.</h2>
          <Link href="/order" className="bg-white text-[#FF5100] px-16 py-8 rounded-full font-black text-2xl hover:scale-105 transition-all inline-flex items-center gap-4 shadow-2xl">
            סגור משלוח עכשיו <ArrowRight className="text-[#FF5100]" />
          </Link>
        </div>
      </section>

      {/* Footer - Slate background */}
      <footer className="py-20 px-6 bg-[#1A1C1E] border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-right gap-10">
          <div>
            <div className="text-3xl font-black italic uppercase text-white">DELIVERY<span className="text-[#FF5100]">NOW</span></div>
            <p className="text-slate-400 mt-2 font-medium">המהירות של המחר, בשירות של היום.</p>
          </div>
          <div className="flex gap-10 text-slate-300 font-bold">
            <Link href="/" className="hover:text-white">בית</Link>
            <Link href="/order" className="hover:text-[#FF5100]">הזמנה</Link>
            <Link href="tel:0523409255" className="hover:text-white">052-3409255</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}