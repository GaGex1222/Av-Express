"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useInView, animate, AnimatePresence } from 'framer-motion';
import { 
  Timer, CheckCircle2, MessageSquare, Zap, Users, Phone, 
  ArrowRight, BarChart3, HardHat, Store, Landmark, Scale,
  AlertCircle, XCircle, Rocket, ShieldCheck, Gauge, Briefcase, Menu, X, User, CalendarClock
} from 'lucide-react';
import Link from 'next/link';

// --- ANIMATION CONFIGS ---
const fadeInUp = {
  initial: { y: 40, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
};

// --- ANIMATED NUMBER COMPONENT ---
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

// --- NAVBAR COMPONENT ---
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[300] bg-black/50 backdrop-blur-xl border-b border-white/5 py-3 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center" dir="rtl">
          
          {/* לוגו + דגל ישראל (תמונה) */}
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-2xl font-black italic uppercase tracking-tighter">
              DELIVERY<span className="text-[#FF5100]">NOW</span>
            </span>
            <img 
              src="https://flagcdn.com/w40/il.png" 
              alt="Israel Flag" 
              className="h-4 w-auto rounded-sm shadow-sm border border-white/10 group-hover:border-[#FF5100]/50 transition-all"
            />
          </Link>
          
          {/* Desktop Links */}
          <div className="hidden md:flex gap-8 items-center font-bold text-sm uppercase italic">
            <Link href="/" className="hover:text-[#FF5100] transition-colors">בית</Link>
            <Link href="/about-us" className="hover:text-[#FF5100] transition-colors">אודות</Link>
            <Link href="#how-it-works" className="hover:text-[#FF5100] transition-colors">איך זה עובד</Link>
            <Link href="#solutions" className="hover:text-[#FF5100] transition-colors">פתרונות</Link>
            <Link href="/order" className="bg-white text-black px-4 py-2 rounded-lg hover:bg-[#FF5100] transition-all">הזמינו שליח</Link>
          </div>

          {/* Mobile Toggle Button */}
          <button 
            className="md:hidden text-white relative z-[400] p-2 hover:text-[#FF5100] transition-colors" 
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={32} strokeWidth={3} /> : <Menu size={32} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/95 backdrop-blur-md md:hidden z-[310]"
            />

            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-[#0A0A0A] border-l border-white/10 z-[315] md:hidden flex flex-col p-8 pt-24"
              dir="rtl"
            >
              <div className="flex flex-col gap-8 text-right font-black italic uppercase text-4xl">
                <Link href="/" onClick={() => setIsOpen(false)}>בית</Link>
                <Link href="/about-us" onClick={() => setIsOpen(false)}>אודות</Link>
                <Link href="#how-it-works" onClick={() => setIsOpen(false)}>איך זה עובד</Link>
                <Link href="#solutions" onClick={() => setIsOpen(false)}>פתרונות</Link>
                <Link href="/order" onClick={() => setIsOpen(false)} className="text-[#FF5100]">הזמינו עכשיו</Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const FloatingContact = () => (
  <div className="fixed bottom-8 left-8 z-[200]">
    <Link href="https://wa.me/972523409255" className="bg-[#25D366] p-3 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center opacity-80 hover:opacity-100">
      <MessageSquare className="text-white w-5 h-5" fill="white" />
    </Link>
  </div>
);

const StepCard = ({ number, title, text }: { number: string, title: string, text: string }) => (
  <motion.div variants={fadeInUp} className="relative p-8 bg-[#111] border-r-4 border-[#FF5100] group">
    <div className="text-7xl font-black text-white/5 absolute top-2 right-4 group-hover:text-[#FF5100]/10 transition-colors">{number}</div>
    <h4 className="text-2xl font-black text-white mb-3 italic uppercase relative z-10">{title}</h4>
    <p className="text-gray-400 font-bold text-sm leading-relaxed relative z-10">{text}</p>
  </motion.div>
);

const SolutionItem = ({ icon, title }: { icon: React.ReactNode, title: string }) => (
  <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col items-center p-8 bg-white/5 rounded-3xl border border-white/5 hover:border-[#FF5100]/40 transition-all">
    <div className="text-[#FF5100] mb-4">{icon}</div>
    <span className="text-sm font-black uppercase italic tracking-tighter text-center">{title}</span>
  </motion.div>
);

export default function DeliveryNowLanding() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0A0A0A] text-white font-sans antialiased overflow-x-hidden selection:bg-[#FF5100] selection:text-black" dir="rtl">
      
      <Navbar />
      <FloatingContact />
      
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-[#FF5100] origin-right z-[301]" style={{ scaleX }} />

      {/* 2. HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[#0A0A0A] z-10" />
          <img 
            src="/landing_page.png" 
            alt="Delivery Background"
            className="w-full h-full object-cover brightness-50"
          />
        </div>
        
        <div className="max-w-6xl mx-auto text-center relative z-20 pt-20">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[12vw] md:text-[8vw] font-black leading-[0.9] tracking-tighter italic mb-8 uppercase"
          >
            שליחויות - <br />
            <span className="text-[#FF5100]">בלי לרדוף</span> אחרי אף אחד
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-2xl text-white/90 max-w-3xl mx-auto mb-12 font-medium leading-relaxed"
          >
            נמאס לכם להתקשר, לחכות למענה, ולא לדעת איפה החבילה? תוך דקה אחת סוגרים איסוף - 
            רואים שנכנס, מקבלים עדכון בדרך, ומקבלים בשקט.
          </motion.p>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
            <Link href="/order" className="bg-[#FF5100] text-black px-12 py-6 rounded-2xl font-black italic text-2xl shadow-[0_0_40px_rgba(255,81,0,0.3)] hover:scale-105 transition-all flex items-center gap-4">
              <Zap className="fill-black" size={24} />
              הזמן שליחות עכשיו
            </Link>
            <Link href="#how-it-works" className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-12 py-6 rounded-2xl font-black text-2xl hover:bg-white/20 transition-all">
              איך זה עובד?
            </Link>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-white/60 text-xs font-black uppercase italic tracking-widest">
            <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#FF5100]" /> הזמנה בתוך דקה</div>
            <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#FF5100]" /> עדכונים בזמן אמת</div>
            <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#FF5100]" /> נתניה, הסביבה והמרכז</div>
          </div>
        </div>
      </section>

      {/* 3. STATS SECTION - Updated with Extra Reason */}
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: "זמן ממוצע לאיסוף", val: 24, unit: " דק'", icon: <Timer /> },
          { label: "מסירות מוצלחות", val: 99.8, unit: "%", icon: <CheckCircle2 /> },
          { label: "חיסכון בעלויות שילוח", val: 30, unit: "%", icon: <BarChart3 /> },
          { label: "לקוחות חוזרים", val: 92, unit: "%", icon: <Users /> },
          { label: "זמינות מסביב לשעון", val: 24, unit: "/6", icon: <CalendarClock /> },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            variants={fadeInUp} 
            initial="initial" 
            whileInView="whileInView"
            // כאן הקסם: אם זה האלמנט האחרון (אינדקס 4), הוא מקבל col-span-2 במובייל
            // ובמסכים גדולים יותר (lg) הוא חוזר להיות עמודה אחת (col-span-1)
            className={`p-8 bg-[#111] border border-white/5 rounded-[2rem] text-center group hover:border-[#FF5100] transition-colors ${
              i === 4 ? "col-span-2 lg:col-span-1" : "col-span-1"
            }`}
          >
            <div className="text-[#FF5100] mb-4 flex justify-center">{stat.icon}</div>
            <div className="text-4xl font-black italic text-white mb-2 leading-none">
              {typeof stat.val === "number" ? <AnimatedNumber value={stat.val} /> : stat.val}{stat.unit}
            </div>
            <div className="text-[10px] font-black uppercase text-gray-500 tracking-widest">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </section>

      {/* 4. PROCESS SECTION */}
      <section id="how-it-works" className="py-32 px-6 bg-[#080808] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">המסלול <br/><span className="text-[#FF5100]">המהיר.</span></h2>
            <p className="text-gray-500 font-bold max-w-sm italic">ב-DeliveryNow אנחנו לא מאמינים בבירוקרטיה. 3 צעדים ואנחנו בדרך אליך.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard number="01" title="הזמנה באתר" text="שולחים הודעה עם כתובת איסוף ויעד. מקבלים מחיר סגור וסופי תוך 60 שניות." />
            <StepCard number="02" title="איסוף מיידי" text="השליח הכי קרוב יוצא אליכם במהירות שיא." />
            <StepCard number="03" title="אישור מסירה" text="החבילה הגיעה. אתם מקבלים צילום של המסירה ואישור חתום למייל באופן אוטומטי." />
          </div>
        </div>
      </section>

      {/* 5. INDUSTRY SOLUTIONS */}
      <section id="solutions" className="py-32 px-6 bg-[#0F0F0F]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-black italic uppercase mb-16 text-white">
            פתרונות לכל <span className="text-[#FF5100]">התחומים</span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <SolutionItem icon={<User size={48}/>} title="לקוח פרטי" />
            <SolutionItem icon={<Scale size={48}/>} title="עורכי דין" />
            <SolutionItem icon={<Store size={48}/>} title="חנויות וקמעונאות" />
            <SolutionItem icon={<Landmark size={48}/>} title="הייטק ופיננסים" />
            
            {/* שימוש ב-col-span-2 במובייל וביטולו (col-span-1) בדסקטופ */}
            <div className="col-span-2 md:col-span-1">
              <SolutionItem 
                icon={<HardHat size={48}/>} 
                title="תעשייה ולוגיסטיקה" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA */}
      <section className="py-40 px-6 bg-[#FF5100] text-black relative">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-[12vw] md:text-[9vw] font-black italic leading-[0.8] tracking-tighter mb-12 uppercase">
            DELIVERY NOW. <br /> NOT LATER.
          </h2>
          <Link href="/order" className="bg-black text-white px-20 py-10 rounded-full font-black text-3xl hover:scale-105 transition-all inline-flex items-center gap-4 group uppercase italic text-center">
            סגור משלוח עכשיו
            <ArrowRight size={48} className="group-hover:translate-x-3 transition-transform" />
          </Link>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="py-20 px-6 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 text-right">
          <div className="max-w-sm">
            <div className="text-4xl font-black italic uppercase mb-4">DELIVERY<span className="text-[#FF5100]">NOW</span></div>
            <p className="text-gray-500 font-bold italic leading-relaxed">
              השותף הלוגיסטי שלך לעסקים. אנחנו מביאים את המהירות של העתיד לשירות המשלוחים של היום.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-20">
            <div>
              <h5 className="font-black italic uppercase mb-6 text-[#FF5100]">ניווט</h5>
              <ul className="space-y-4 font-bold text-gray-400">
                <li><Link href="/" className="hover:text-white transition-colors">בית</Link></li>
                <li><Link href="/about-us" className="hover:text-white transition-colors">אודות</Link></li>
                <li><Link href="#how-it-works" className="hover:text-white transition-colors">איך זה עובד</Link></li>
                <li><Link href="tel:0523409255" className="hover:text-white transition-colors">צור קשר</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-black italic uppercase mb-6 text-[#FF5100]">קשר ישיר</h5>
              <ul className="space-y-4 font-bold text-gray-400">
                <li dir="ltr">052-3409255</li>
                <li>support@deliverynow.co.il</li>
                <li>זמינות 24/6</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 text-center text-[10px] font-black text-gray-600 tracking-[0.5em] uppercase">
          © 2026 DELIVERYNOW LOGISTICS • PREMIER BUSINESS SHIPPING
        </div>
      </footer>
    </div>
  );
}