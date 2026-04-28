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
  Phone,
  ShieldCheck,
  TrendingUp,
  MapPin,
  MessageCircle 
} from 'lucide-react';
import Link from 'next/link';

// --- ANIMATION CONFIGS ---
const fadeInUp = {
  initial: { y: 30, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
};

const AnimatedNumber = ({ value, duration = 0.8 }: { value: number, duration?: number }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration,
        ease: "easeOut",
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
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-md border-b border-gray-100 py-3 px-6 h-[64px] flex items-center">
        <div className="max-w-5xl mx-auto w-full flex justify-between items-center" dir="rtl">
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <span className="text-xl font-black italic uppercase tracking-tighter text-black">
              DELIVERY <span className="text-[#FF5100]">NOW</span>
            </span>
            <img 
              src="https://flagcdn.com/w40/il.png" 
              alt="Israel" 
              className="h-3.5 rounded-sm border border-gray-200" 
            />
          </Link>

          <div className="hidden md:flex items-center gap-6 font-extrabold text-[11px] uppercase italic tracking-wide">
            <Link href="/" className="text-black hover:text-[#FF5100] transition-colors">בית</Link>
            <Link href="#services" className="text-black/60 hover:text-[#FF5100] transition-colors">שירותים</Link>
            <Link href="#process" className="text-black/60 hover:text-[#FF5100] transition-colors">איך זה עובד</Link>
            <Link href="#why-us" className="text-black/60 hover:text-[#FF5100] transition-colors">למה אנחנו</Link>
            <Link href="/order" className="bg-black text-white px-4 py-1.5 rounded-full hover:bg-[#FF5100] transition-all shadow-sm">
              הזמן עכשיו
            </Link>
          </div>
          
          <button className="md:hidden text-black p-2" onClick={() => setIsOpen(true)}>
            <Menu size={28} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/60 z-[998] md:hidden backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-[340px] z-[999] bg-white flex flex-col md:hidden"
              dir="rtl"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-white">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black italic uppercase tracking-tighter text-black">
                    DELIVERY <span className="text-[#FF5100]">NOW</span>
                  </span>
                  <img src="https://flagcdn.com/w40/il.png" alt="Israel" className="h-3 rounded-sm" />
                </div>
                <button onClick={() => setIsOpen(false)} className="text-black p-1">
                  <X size={30} />
                </button>
              </div>
              <div className="flex-1 flex flex-col pt-8 px-8 space-y-6 overflow-y-auto font-black italic uppercase">
                <Link href="/" onClick={() => setIsOpen(false)} className="text-slate-900 text-xl border-b border-slate-50 pb-4">בית</Link>
                <Link href="#services" onClick={() => setIsOpen(false)} className="text-slate-900 text-xl border-b border-slate-50 pb-4">שירותים</Link>
                <Link href="#process" onClick={() => setIsOpen(false)} className="text-slate-900 text-xl border-b border-slate-50 pb-4">התהליך</Link>
                <Link href="/order" onClick={() => setIsOpen(false)} className="bg-[#FF5100] text-white p-4 rounded-xl text-center shadow-lg">הזמן שליח</Link>
              </div>
              <div className="p-8 bg-slate-50 flex justify-center items-center gap-3">
                <span className="text-slate-900 font-black text-lg">0523409255</span>
                <Phone size={18} className="text-[#FF5100]" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const BenefitCard = ({ icon, title, text }: { icon: React.ReactNode, title: string, text: string }) => (
  <motion.div variants={fadeInUp} className="bg-white p-8 md:p-7 rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-col items-center text-center group hover:shadow-lg transition-all">
    <div className="bg-[#FF5100]/10 p-4 md:p-3.5 rounded-xl text-[#FF5100] mb-4 md:mb-4 group-hover:bg-[#FF5100] group-hover:text-white transition-colors">
      {React.cloneElement(icon as React.ReactElement, { size: 24 })}
    </div>
    <h4 className="text-lg md:text-base font-black text-slate-900 mb-2 md:mb-2 uppercase italic">{title}</h4>
    <p className="text-slate-500 font-bold text-xs md:text-[11px] leading-relaxed">{text}</p>
  </motion.div>
);

export default function DeliveryNowLanding() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <div className="min-h-screen bg-[#0F172A] text-white font-['Heebo'] antialiased overflow-x-hidden selection:bg-[#FF5100] selection:text-white" dir="rtl">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,800;0,900;1,800;1,900&family=Heebo:wght@700;800;900&display=swap');
        * { font-family: 'Montserrat', 'Heebo', sans-serif !important; }
      `}</style>
      
      <Navbar />
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-[#FF5100] origin-right z-[301]" style={{ scaleX }} />

      {/* Floating WhatsApp Button (Animation Removed) */}
      <motion.a
        href="https://wa.me/972523409255"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 left-6 z-[400] bg-[#25D366] text-white p-4 rounded-full shadow-2xl flex items-center justify-center"
      >
        <MessageCircle size={28} className="fill-current" />
      </motion.a>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20 md:py-16">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/90 via-[#0F172A]/40 to-[#0F172A] z-10" />
          <img src="/landing_page.png" alt="Background" className="w-full h-full object-cover brightness-[0.5]" />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-20 pt-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl xs:text-5xl sm:text-6xl md:text-6xl font-black leading-[1.2] md:leading-[1.1] italic mb-8 md:mb-8 text-white uppercase drop-shadow-2xl"
          >
            <span className="block">שליחויות</span>
            <span className="block">לעסקים ופרטיים - <span className="text-[#FF5100]">בלי</span></span>
            <span className="text-[#FF5100] block">לרדוף</span>
            <span className="block">אחרי אף אחד</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="text-lg md:text-lg font-extrabold text-slate-300 mb-10 md:mb-10 max-w-xl mx-auto leading-relaxed px-4"
          >
            הפתרון הלוגיסטי המהיר בישראל. מזמינים שליח ב-60 שניות, מקבלים אישור מסירה בזמן אמת, ונהנים מראש שקט באמת.
          </motion.p>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-wrap gap-4 justify-center">
            <Link href="/order" className="bg-[#FF5100] text-white px-10 py-5 md:py-4 md:px-8 rounded-full font-black text-xl md:text-lg shadow-xl hover:scale-105 transition-all flex items-center gap-3">
              <Zap className="fill-current w-5 h-5 md:w-4 md:h-4" /> הזמינו עכשיו
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Package Types Section */}
      <section id="services" className="py-24 md:py-24 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 md:mb-16">
            <h2 className="text-4xl md:text-4xl font-black italic text-slate-900 uppercase mb-4 md:mb-3">
              מה <span className="text-[#FF5100]">שולחים</span> היום?
            </h2>
            <p className="text-slate-500 font-black text-lg md:text-base">הפתרון המושלם לכל גודל של משלוח</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-6">
            {[
              { label: "מעטפה", sub: "מסמכים / ניירת", icon: <Mail size={32} />, type: "envelope" },
              { label: "קטן", sub: "שקית / עד 2 ק״ג", icon: <ShoppingBag size={32} />, type: "small" },
              { label: "בינוני", sub: "קרטון / עד 10 ק״ג", icon: <Package size={32} />, type: "medium" },
              { label: "גדול", sub: "חבילה כבדה / קרטון", icon: <Archive size={32} />, type: "large" }
            ].map((pkg, i) => (
              <Link key={i} href={`/order?type=${pkg.type}`}>
                <motion.div 
                  whileHover={{ y: -8, borderColor: '#FF5100' }}
                  className="group bg-white border-2 border-slate-100 p-8 md:p-8 rounded-[1.5rem] flex flex-col items-center text-center transition-all shadow-sm hover:shadow-xl"
                >
                  <div className="w-16 md:w-14 h-16 md:h-14 bg-slate-50 rounded-xl flex items-center justify-center mb-5 md:mb-4 text-[#FF5100] group-hover:bg-[#FF5100] group-hover:text-white transition-colors">
                    {React.cloneElement(pkg.icon as React.ReactElement, { size: 24 })}
                  </div>
                  <h3 className="text-xl md:text-lg font-black text-slate-900 mb-2 uppercase italic">{pkg.label}</h3>
                  <p className="text-slate-500 font-black text-xs md:text-[11px]">{pkg.sub}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section id="why-us" className="py-32 md:py-28 px-6 bg-white text-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16 md:gap-16">
            <div className="lg:w-1/2 space-y-8 md:space-y-6 text-right">
              <h2 className="text-5xl md:text-5xl font-black italic leading-tight uppercase">
                השקט שלכם <br /> מתחיל <span className="text-[#FF5100]">כאן.</span>
              </h2>
              <p className="text-xl md:text-lg text-slate-600 font-extrabold leading-relaxed">
                אנחנו לא רק מעבירים חבילות, אנחנו מעבירים שקט נפשי. במקום לבזבז שעות על טלפונים לשליחים - אנחנו בונים לכם תשתית לוגיסטית שעובדת בשבילכם.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-y-3">
                {["מחיר סופי וקבוע מראש", "שליחים מקצועיים ומנומסים", "ביטוח מלא על כל משלוח", "מערכת הזמנות פשוטה"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 font-black text-lg md:text-sm">
                    <CheckCircle2 className="text-[#FF5100] shrink-0" size={18} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/order" className="inline-flex items-center gap-4 bg-slate-900 text-white px-10 md:px-8 py-5 md:py-4 rounded-full font-black text-xl md:text-base hover:bg-[#FF5100] transition-all group shadow-xl">
                בואו נתחיל לעבוד <ArrowRight className="group-hover:translate-x-[-8px] transition-transform" size={18} />
              </Link>
            </div>
            <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-5 w-full">
              <BenefitCard icon={<ShieldCheck />} title="ביטחון מלא" text="כל חבילה מבוטחת ומצולמת ברגע המסירה ישירות למייל שלכם." />
              <BenefitCard icon={<TrendingUp />} title="צמיחה עסקית" text="תתמקדו במכירות, אנחנו נדאג שהלקוחות שלכם יקבלו את המוצר בשיא המהירות." />
              <BenefitCard icon={<MapPin />} title="פריסה רחבה" text="שירות מהיר ומקצועי בפריסה רחבה עם דגש על זמני איסוף קצרים." />
              <BenefitCard icon={<Zap />} title="טכנולוגיה" text="מערכת חכמה שמחברת אתכם לשליח הקרוב ביותר תוך שניות." />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 md:py-24 px-6 bg-[#0F172A]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-5">
          {[
            { label: "זמן איסוף", val: 24, unit: " דק'", icon: <Timer size={22} /> },
            { label: "דיוק", val: 99.8, unit: "%", icon: <CheckCircle2 size={22} /> },
            { label: "חיסכון", val: 30, unit: "%", icon: <BarChart3 size={22} /> },
            { label: "לקוחות חוזרים", val: 92, unit: "%", icon: <Users size={22} /> },
            { label: "זמינות מערכת", val: 24, unit: "/6", icon: <CalendarClock size={22} />, featured: true },
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              className={`p-8 md:p-7 bg-white/5 border border-white/10 rounded-[1.5rem] text-center hover:border-white/30 transition-all ${stat.featured ? 'col-span-2 md:col-span-1' : ''}`}
            >
              <div className="text-[#FF5100] mb-3 flex justify-center">{stat.icon}</div>
              <div className="text-4xl md:text-3xl font-black text-white">
                <AnimatedNumber value={stat.val} duration={0.8} />{stat.unit}
              </div>
              <div className="text-xs md:text-[10px] font-black uppercase text-slate-400 mt-2 tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 md:py-32 px-6 bg-[#0F172A] text-white overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative">
          <motion.h2 initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} className="text-[10vw] md:text-[6vw] font-black italic leading-none mb-10 md:mb-8 uppercase drop-shadow-2xl">DELIVERY NOW.</motion.h2>
          <Link href="/order" className="bg-[#FF5100] text-white px-16 md:px-14 py-8 md:py-6 rounded-full font-black text-2xl md:text-xl hover:scale-105 transition-all inline-flex items-center gap-4 shadow-2xl">
            סגור משלוח עכשיו <ArrowRight className="text-white w-8 md:w-7 h-8 md:h-7" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 md:py-16 px-6 bg-[#0F172A] border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-right gap-10 md:gap-0">
          <div>
            <div className="text-3xl md:text-2xl font-black italic uppercase text-white">DELIVERY<span className="text-[#FF5100]">NOW</span></div>
            <p className="text-slate-400 mt-2 font-black italic text-md md:text-base">המהירות של המחר, בשירות של היום.</p>
          </div>
          <div className="flex gap-10 text-slate-300 font-black italic uppercase text-sm md:text-[11px] tracking-wider">
            <Link href="/" className="hover:text-white transition-colors">בית</Link>
            <Link href="/order" className="hover:text-[#FF5100] transition-colors">הזמנה</Link>
            <Link href="tel:0523409255" className="hover:text-white transition-colors">052-3409255</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}