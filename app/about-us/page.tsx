"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Rocket, Target, ShieldCheck, Heart, 
  ArrowRight, Menu, X, Zap, Globe, Package
} from 'lucide-react';
import Link from 'next/link';

// --- ANIMATION CONFIGS ---
const fadeInUp = {
  initial: { y: 40, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
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
                <Link href="/order" onClick={() => setIsOpen(false)} className="text-[#FF5100]">הזמינו עכשיו</Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// --- CORE VALUE COMPONENT ---
const ValueCard = ({ icon, title, text }: { icon: React.ReactNode, title: string, text: string }) => (
  <motion.div variants={fadeInUp} className="p-10 bg-[#111] border border-white/5 rounded-[2.5rem] group hover:border-[#FF5100] transition-colors">
    <div className="text-[#FF5100] mb-6">{icon}</div>
    <h3 className="text-2xl font-black italic uppercase mb-4">{title}</h3>
    <p className="text-gray-400 font-bold leading-relaxed">{text}</p>
  </motion.div>
);

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans antialiased overflow-x-hidden selection:bg-[#FF5100] selection:text-black" dir="rtl">
      
      <Navbar />
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#FF5100] text-xs font-black uppercase italic tracking-widest"
          >
            <Rocket size={14} /> המהפכה כבר כאן
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10vw] md:text-[7vw] font-black leading-[0.85] tracking-tighter italic uppercase mb-12"
          >
            אנחנו לא רק <br />
            <span className="text-[#FF5100]">שליחויות.</span> <br />
            אנחנו זמן.
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl"
          >
            <p className="text-xl md:text-2xl text-gray-400 font-medium leading-relaxed italic">
              ב-DeliveryNow נולדנו מתוך תסכול. נמאס לנו מחוסר וודאות, משיחות טלפון שלא נענות ומשירותים איטיים שלא מתאימים לקצב של 2026. בנינו מערכת ששמה את המהירות והשקיפות במרכז.
            </p>
          </motion.div>
        </div>

        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
            <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-[#FF5100] blur-[150px] rounded-full" />
        </div>
      </section>

      {/* 2. THE VISION SECTION */}
      <section className="py-32 px-6 bg-[#080808] border-y border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div variants={fadeInUp} initial="initial" whileInView="whileInView">
            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-8 leading-none">
              החזון שלנו: <br />
              <span className="text-[#FF5100]">אפס המתנה.</span>
            </h2>
            <div className="space-y-6 text-gray-400 font-bold text-lg italic">
              <p>
                אנחנו מאמינים שלוגיסטיקה היא עמוד השדרה של כל עסק מצליח. כשהמשלוח שלך תקוע, העסק שלך תקוע.
              </p>
              <p>
                המטרה שלנו היא להפוך את תהליך השילוח למשהו שקורה "על הדרך" – בלי לתכנן שבועות מראש, בלי טפסים ובלי בירוקרטיה. פשוט לוחצים, והחבילה בדרך.
              </p>
              <div className="flex gap-10 pt-8">
                <div>
                  <div className="text-4xl font-black text-white italic">24/6</div>
                  <div className="text-xs text-[#FF5100] uppercase tracking-widest mt-1">זמינות מלאה</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-white italic">100%</div>
                  <div className="text-xs text-[#FF5100] uppercase tracking-widest mt-1">אחריות אישית</div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="aspect-square rounded-[3rem] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                <img 
                    src="/delivery_guy.png" 
                    alt="Our Speed"
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="absolute -bottom-10 -right-10 bg-[#FF5100] p-10 rounded-full hidden md:block">
                <Zap size={60} className="text-black fill-black" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. CORE VALUES */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter">הערכים שמניעים <span className="text-[#FF5100]">אותנו</span></h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right" dir="rtl">
            <ValueCard 
              icon={<ShieldCheck size={48} />}
              title="ביטחון מוחלט"
              text="כל חבילה היא עולם ומלואו עבור הלקוח. אנחנו מתייחסים לכל משלוח כאילו הוא שלנו, עם ביטוח מלא וטיפול VIP."
            />
            <ValueCard 
              icon={<Target size={48} />}
              title="דיוק כירורגי"
              text="זמן הוא המשאב היקר ביותר שלכם. אנחנו מתחייבים לאיסוף המהיר ביותר באזור נתניה והמרכז ללא פשרות."
            />
            <ValueCard 
              icon={<Heart size={48} />}
              title="שירות אנושי"
              text="מאחורי כל אפליקציה יש אנשים. המענה שלנו הוא אנושי, מהיר וזמין לכל שאלה או שינוי ברגע האחרון."
            />
          </div>
        </div>
      </section>

      {/* 4. TEAM / COMMUNITY SECTION */}
      <section className="py-32 px-6 bg-white text-black">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.8] mb-12">
            JOIN THE <br /> <span className="text-[#FF5100]">ELITE.</span>
          </h2>
          <p className="text-2xl font-black italic max-w-3xl mx-auto mb-16 uppercase">
            אנחנו לא מחפשים רק שליחים, אנחנו מחפשים שותפים לדרך. הצוות שלנו מורכב מהאנשים המקצועיים ביותר בכביש.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border-4 border-black p-8 italic font-black text-3xl uppercase">מהירות</div>
            <div className="border-4 border-black p-8 italic font-black text-3xl uppercase">אחריות</div>
            <div className="border-4 border-black p-8 italic font-black text-3xl uppercase">ביצועים</div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA (Matched to main page) */}
      <section className="py-40 px-6 bg-[#FF5100] text-black relative">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-[12vw] md:text-[9vw] font-black italic leading-[0.8] tracking-tighter mb-12 uppercase">
            READY TO <br /> GO NOW?
          </h2>
          <Link href="/order" className="bg-black text-white px-20 py-10 rounded-full font-black text-3xl hover:scale-105 transition-all inline-flex items-center gap-4 group uppercase italic">
            בואו נצא לדרך
            <ArrowRight size={48} className="group-hover:translate-x-3 transition-transform" />
          </Link>
        </div>
      </section>

      {/* 6. FOOTER */}
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