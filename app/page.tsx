"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useInView, animate, AnimatePresence } from 'framer-motion';
import { 
  Timer, CheckCircle2, Zap, Users, 
  ArrowRight, BarChart3, Menu, X, CalendarClock,
  Mail,
  Box,
  Package,
  ShoppingBag,
  Archive,
  Phone
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

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Navbar הראשי */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-white border-b border-gray-100 py-4 px-6 h-[72px] flex items-center">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center" dir="rtl">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-2xl font-black italic uppercase tracking-tighter text-black">
              DELIVERY <span className="text-[#FF5100]">NOW</span>
            </span>
            <img 
              src="https://flagcdn.com/w40/il.png" 
              alt="Israel" 
              className="h-4 w-auto rounded-sm border border-gray-200" 
            />
          </Link>
          
          <button 
            className="md:hidden text-black p-2" 
            onClick={() => setIsOpen(true)}
          >
            <Menu size={30} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 z-[998] md:hidden backdrop-blur-sm"
            />

            {/* ה-Dropdown שיושב מעל הכל (Overlap) */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-[340px] z-[999] bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.2)] flex flex-col md:hidden"
              dir="rtl"
            >
              {/* Header פנימי בתוך התפריט עם כפתור סגירה */}
              <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-white">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black italic uppercase tracking-tighter text-black">
                    DELIVERY <span className="text-[#FF5100]">NOW</span>
                  </span>
                  <img 
                    src="https://flagcdn.com/w40/il.png" 
                    alt="Israel" 
                    className="h-3 w-auto rounded-sm border border-gray-100" 
                  />
                </div>
                <button onClick={() => setIsOpen(false)} className="text-black p-1">
                  <X size={30} />
                </button>
              </div>

              {/* רשימת לינקים */}
              <div className="flex-1 flex flex-col pt-8 px-8 space-y-6 overflow-y-auto">
                <Link href="/" onClick={() => setIsOpen(false)} className="text-gray-900 text-xl font-bold border-b border-gray-50 pb-4 active:text-[#FF5100]">בית</Link>
                <Link href="/about-us" onClick={() => setIsOpen(false)} className="text-gray-900 text-xl font-bold border-b border-gray-50 pb-4">הפתרון בקצרה</Link>
                <Link href="#process" onClick={() => setIsOpen(false)} className="text-gray-900 text-xl font-bold border-b border-gray-50 pb-4">התהליך</Link>
                <Link href="#services" onClick={() => setIsOpen(false)} className="text-gray-900 text-xl font-bold border-b border-gray-50 pb-4">שירותים</Link>
                <Link href="#why-us" onClick={() => setIsOpen(false)} className="text-gray-900 text-xl font-bold border-b border-gray-50 pb-4">למה אנחנו</Link>
                <Link href="#faq" onClick={() => setIsOpen(false)} className="text-gray-900 text-xl font-bold border-b border-gray-50 pb-4">שאלות נפוצות</Link>
              </div>

              {/* פוטר עם טלפון מקובע למטה */}
              <div className="p-8 bg-gray-50 flex justify-center items-center gap-3">
                <span className="text-black font-bold text-lg tracking-wide">0523409255</span>
                <div className="bg-[#FF5100]/10 p-2 rounded-full">
                  <Phone size={18} className="text-[#FF5100]" />
                </div>
              </div>
            </motion.div>
          </>
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
      
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-[#FF5100] origin-right z-[301]" style={{ scaleX }} />

      <section className="relative min-h-screen flex items-center justify-center px-6">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A1C1E]/80 via-[#1A1C1E]/40 to-[#1A1C1E] z-10" />
          <img src="/landing_page.png" alt="Background" className="w-full h-full object-cover brightness-[0.4]" />
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-20 pt-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl xs:text-5xl sm:text-6xl md:text-8xl font-black leading-[1.2] md:leading-[1.1] italic mb-8 text-white uppercase break-words"
          >
            <span className="block">שליחויות</span>
            
            <span className="block">
              לעסקים/פרטיים - <span className="text-[#FF5100] inline-block px-1">בלי</span>
            </span>

            <span className="text-[#FF5100] block">לרדוף</span>
            
            <span className="block">אחרי אף אחד</span>
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
            <Link href="/order" className="bg-[#FF5100] text-white px-10 py-4 rounded-full font-black text-xl shadow-lg hover:scale-105 transition-all flex items-center gap-3">
              <Zap className="fill-current w-6 h-6" /> הזמינו עכשיו
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Package Types Section */}
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
              { label: "מעטפה", sub: "גודל", icon: <Mail size={32} />, type: "envelope" },
              { label: "קטן", sub: "שקית קטנה / עד 2 ק״ג", icon: <ShoppingBag size={32} />, type: "small" },
              { label: "בינוני", sub: "קרטון קטן / עד 10 ק״ג", icon: <Package size={32} />, type: "medium" },
              { label: "גדול", sub: "קרטון גדול / חבילה כבדה", icon: <Archive size={32} />, type: "large" }
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
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
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

      {/* Process Section */}
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

      {/* Final CTA */}
      <section className="py-40 px-6 bg-[#FF5100] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative">
          <h2 className="text-[10vw] font-black italic leading-none mb-12 uppercase drop-shadow-lg">DELIVERY NOW.</h2>
          <Link href="/order" className="bg-white text-[#FF5100] px-16 py-8 rounded-full font-black text-2xl hover:scale-105 transition-all inline-flex items-center gap-4 shadow-2xl">
            סגור משלוח עכשיו <ArrowRight className="text-[#FF5100]" />
          </Link>
        </div>
      </section>

      {/* Footer */}
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