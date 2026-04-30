"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useInView, animate, AnimatePresence } from 'framer-motion';
import { 
  Timer, CheckCircle2, Zap, Users, 
  ArrowRight, Menu, X, 
  Package, ShoppingBag, 
  ShieldCheck, MessageCircle, Truck, FileText, 
  ClipboardCheck, PackageCheck, ChevronDown,
  XCircle, CheckCircle, Smartphone, MapPin, Receipt, BellRing,
  Motorbike,
  Car
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

// --- COMPONENTS ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-white border-b border-gray-100 py-3 px-6 h-[70px] flex items-center shadow-sm">
        <div className="max-w-6xl mx-auto w-full flex justify-between items-center" dir="rtl">
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <img src="https://flagcdn.com/w40/il.png" alt="Israel" className="h-3.5 rounded-sm border border-gray-100" />
            <span className="text-xl font-black uppercase tracking-tighter text-[#0F172A]">
              DELIVERY <span className="text-[#FF5100]">NOW</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 font-bold text-sm uppercase tracking-wide">
            <Link href="/" className="text-[#0F172A] hover:text-[#FF5100] transition-colors">בית</Link>
            <Link href="#how-it-works" className="text-[#0F172A]/70 hover:text-[#FF5100] transition-colors">איך זה עובד</Link>
            <Link href="#services" className="text-[#0F172A]/70 hover:text-[#FF5100] transition-colors">שירותים</Link>
            <Link href="#target-audience" className="text-[#0F172A]/70 hover:text-[#FF5100] transition-colors">למי זה מתאים</Link>
            <Link href="#faq" className="text-[#0F172A]/70 hover:text-[#FF5100] transition-colors">שאלות נפוצות</Link>
            <Link href="/order" className="bg-black text-white px-5 py-1.5 rounded-full text-xs font-black uppercase hover:bg-[#FF5100] transition-all">
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
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsOpen(false)} 
              className="fixed inset-0 bg-slate-900/40 z-[998] md:hidden backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ x: "100%" }} 
              animate={{ x: 0 }} 
              exit={{ x: "100%" }} 
              transition={{ type: "spring", damping: 30, stiffness: 300 }} 
              className="fixed top-0 right-0 bottom-0 w-full z-[999] bg-[#F1F7FC] flex flex-col md:hidden" 
              dir="rtl"
            >
              <div className="flex justify-between items-center p-6 bg-white/50">
                <button onClick={() => setIsOpen(false)} className="text-slate-400 border-2 border-slate-200 rounded-full p-1">
                  <X size={20} />
                </button>
                <div className="flex items-center gap-3">
                   <span className="text-2xl font-black text-[#0F172A] tracking-tighter">
                     DELIVERY <span className="text-[#FF5100]">NOW</span>
                   </span>
                   <div className="bg-white p-1 rounded-full border border-slate-200 shadow-sm overflow-hidden flex items-center justify-center">
                    <img src="https://flagcdn.com/w40/il.png" alt="Israel" className="h-5 w-7 object-cover rounded-sm" />
                   </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center items-end px-10 space-y-10">
                <Link href="/" onClick={() => setIsOpen(false)} className="text-4xl font-black text-[#0F172A] hover:text-[#FF5100] transition-colors">בית</Link>
                <Link href="#how-it-works" onClick={() => setIsOpen(false)} className="text-4xl font-black text-[#0F172A] hover:text-[#FF5100] transition-colors">איך זה עובד</Link>
                <Link href="#services" onClick={() => setIsOpen(false)} className="text-4xl font-black text-[#0F172A] hover:text-[#FF5100] transition-colors">שירותים</Link>
                <Link href="#faq" onClick={() => setIsOpen(false)} className="text-4xl font-black text-[#0F172A] hover:text-[#FF5100] transition-colors">שאלות נפוצות</Link>
              </div>

              <div className="p-8 space-y-6 border-t border-slate-200 bg-white/30 text-center">
                <Link 
                  href="/order" 
                  onClick={() => setIsOpen(false)} 
                  className="bg-[#FF5100] text-white py-4 rounded-2xl text-xl font-black shadow-lg shadow-orange-200 block"
                >
                  הזמן שליח עכשיו
                </Link>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-slate-400 font-bold text-xs uppercase tracking-widest ">על פי זמינות</span>
                  <a href="tel:0523409255" className="text-3xl font-black text-[#0F172A] tracking-tighter">052-3409255</a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-200">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-right group"
      >
        <span className="text-lg font-bold text-[#0F172A] group-hover:text-[#FF5100] transition-colors">{question}</span>
        <ChevronDown className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-slate-500 font-medium leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function DeliveryNowLanding() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased overflow-x-hidden selection:bg-[#FF5100] selection:text-white" dir="rtl" style={{ fontFamily: "'Heebo', sans-serif" }}>
      <Navbar />
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-[#FF5100] origin-right z-[101]" style={{ scaleX }} />

      {/* WhatsApp FAB */}
      <a href="https://wa.me/972523409255" target="_blank" rel="noopener" className="fixed bottom-6 left-6 z-[400] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform">
        <MessageCircle size={30} className="fill-current" />
      </a>

      {/* HERO SECTION */}
{/* HERO SECTION */}
      <section className="relative min-h-screen w-full flex items-center justify-center px-6 overflow-hidden">
        {/* Background Image Container - stretched to cover everything */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 bg-slate-900/60 z-10" />
          <img 
            src="/landing_page.png" 
            alt="Background" 
            className="w-full h-full object-cover object-center" 
          />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-20 pt-20 pb-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-4xl md:text-7xl lg:text-6xl font-black leading-tight mb-8 text-white uppercase tracking-tighter"
          >
            שליחויות רכב <br />
            לחנויות ומסעדות - <span className="text-[#FF5100]">בלי</span> <br />
            <span className="text-[#FF5100]">לרדוף</span> אחרי אף אחד
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.4 }} 
            className="text-lg md:text-2xl font-bold text-slate-100 mb-12 max-w-2xl mx-auto drop-shadow-md"
          >
            מארזים גדולים? ארגזי שתייה? פרחים? <br />
            צי הרכבים שלנו מוכן למשימה. מהיר, בטוח ומקצועי.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.5 }} 
            className="flex flex-col items-center gap-4"
          >
            <Link 
              href="/order" 
              className="bg-[#FF5100] text-white px-10 py-4 md:px-12 md:py-5 rounded-full font-black text-xl md:text-2xl shadow-2xl hover:bg-white hover:text-[#FF5100] transition-all flex items-center gap-3"
            >
              <Zap className="fill-current" /> הזמינו עכשיו
            </Link>
            
            {/* הכיתוב החדש שהוספת */}
            <span className="text-white/70 text-xs md:text-sm font-medium tracking-wide italic">
              * על פי זמינות בלבד
            </span>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-[#0F172A] mb-4 ">איך זה עובד?</h2>
            <p className="text-slate-500 font-bold text-lg">ארבעה שלבים פשוטים והחבילה ביעד</p>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 border-t-2 border-dashed border-slate-300 -translate-y-1/2 z-0" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {[
                { 
                  step: "01", 
                  title: "לקוח מזמין", 
                  desc: "מזינים פרטים באתר וסוגרים משלוח תוך פחות מ-60 שניות.", 
                  icon: <Smartphone size={32} className="text-[#FF5100]" /> 
                },
                { 
                  step: "02", 
                  title: "איסוף החבילה", 
                  desc: "השליח מגיע לאסוף. הודעה נשלחת אליכם בזמן אמת ברגע האיסוף.", 
                  icon: <Package size={32} className="text-[#FF5100]" /> 
                },
                { 
                  step: "03", 
                  title: "יוצא למסירה", 
                  desc: "השליח יוצא ישירות לנקודת היעד ללא עיכובים מיותרים.", 
                  icon: <Car size={32} className="text-[#FF5100]" /> 
                },
                { 
                  step: "04", 
                  title: "מסירה ליעד", 
                  desc: "החבילה נמסרה! הודעת אישור נשלחת אליכם מיד עם סיום המשימה.", 
                  icon: <BellRing size={32} className="text-[#FF5100]" /> 
                }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  variants={fadeInUp} 
                  initial="initial" 
                  whileInView="whileInView"
                  className="flex flex-col items-center text-center bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-full"
                >
                  <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 border border-orange-100">
                    {item.icon}
                  </div>
                  <span className="text-[#FF5100] font-black text-sm mb-2">{item.step}</span>
                  <h3 className="text-2xl font-black text-[#0F172A] mb-4">{item.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-16 text-center">
            {/* כפתור שונה לכתום */}
            <Link href="/order" className="bg-[#FF5100] text-white px-12 py-5 rounded-full font-black text-xl hover:bg-white hover:text-[#FF5100] border-2 border-transparent hover:border-[#FF5100] transition-all inline-flex items-center gap-3 shadow-xl">
              הזמן שליח עכשיו <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* SELLING CONTENT & BENEFITS */}
      <div className="max-w-6xl mx-auto px-6">

        {/* TARGET AUDIENCE SECTION */}
        <section id="target-audience" className="py-20 bg-[#D9EFFF] rounded-[3rem] px-8 md:px-16 mb-24">
            <div className="text-center mb-16">
              <span className="text-[#0056D2] font-black text-sm uppercase tracking-widest mb-4 block">למי זה מתאים</span>
              <h2 className="text-3xl md:text-4xl font-black text-[#0F172A] mb-6">
                 מסעדות, סופרמרקטים, עסקים, פרטיים, 
                <span className="text-[#0056D2]"> אם אתם עמוסים במשלוחים כל יום - זה בשבילכם.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <motion.div variants={fadeInUp} initial="initial" whileInView="whileInView" className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-blue-100">
                <div className="flex items-center gap-3 mb-8">
                  <CheckCircle className="text-[#0056D2]" size={28} />
                  <h3 className="text-xl font-black text-[#0F172A]">זה בשבילך אם...</h3>
                </div>
                <ul className="space-y-5">
                  {[
                    "צריכים שליחויות מהיום להיום/מעכשיו לעכשיו.",
                    "צריכים שליח עם רכב לחבילות גדולות.",
                    "צריכים שליח מקצועי, מהיר, אחראי ואמין.",
                    "רוצים להיות בטוחים שהחבילה נמסרה לנמען בבטחה."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4 text-slate-600 font-bold text-sm md:text-base">
                      <CheckCircle2 className="text-[#0056D2] shrink-0 mt-1" size={18} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div variants={fadeInUp} initial="initial" whileInView="whileInView" className="bg-white/50 p-8 md:p-10 rounded-[2rem] border border-slate-200">
                <div className="flex items-center gap-3 mb-8">
                  <XCircle className="text-slate-400" size={28} />
                  <h3 className="text-xl font-black text-slate-500">פחות מתאים אם...</h3>
                </div>
                <ul className="space-y-5">
                  {[
                    "מחפשים את המחיר הכי זול בשוק",
                    "זמני ההגעה פחות קריטיים לכם",
                    "אין צורך בשירות לקוחות זמין",
                    "מעדיפים לעבוד מול מוקדים עמוסים"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4 text-slate-400 font-medium text-sm md:text-base">
                      <XCircle className="text-slate-300 shrink-0 mt-1" size={18} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
        </section>

        {/* STATS SECTION */}
        <section className="py-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { val: 100, unit: "+", label: "שליחויות בחודש", icon: <PackageCheck className="text-[#0056D2]" /> },
              { val: 50, unit: "+", label: "לקוחות קבועים", icon: <Users className="text-[#0056D2]" /> },
              { val: 10, unit: ">", label: "דקות לאישור", icon: <Timer className="text-[#0056D2]" /> },
              { val: 99, unit: "%", label: "דיוק בזמנים", icon: <ClipboardCheck className="text-[#0056D2]" /> }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="mb-4 flex justify-center">{stat.icon}</div>
                <div className="text-4xl md:text-5xl font-black text-[#003594]">{stat.unit}<AnimatedNumber value={stat.val} /></div>
                <div className="text-base font-bold text-[#0F172A]">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ SECTION */}
        <section id="faq" className="py-24">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <span className="bg-[#0056D2] text-white px-4 py-1 rounded-full text-xs font-black mb-4 inline-block">שאלות ותשובות</span>
              <h2 className="text-3xl md:text-4xl font-black text-[#0F172A]">כל מה שרצית לדעת - <span className="text-[#0056D2]">לפני שמזמינים</span></h2>
            </div>
            
            <div className="space-y-2">
              {[
                { q: "איך מזמינים שליחות? מה התהליך בפועל?", a: "תהליך פשוט: נכנסים להזמנה באתר שלנו מזינים את הפרטים ומשלמים, בלי התחברות ובלי כאבי ראש." },
                { q: "כמה מהר מגיע שליח אחרי שמזמינים?", a: "אנחנו מתחייבים לאיסוף מהיר ככל הניתן, לרוב תוך פחות מ-60 דקות באזורי הפעילות המרכזיים." },
                { q: "לאילו אזורים אתם מגיעים?", a: "אנחנו פועלים בפריסה רחבה במרכז הארץ ובשרון. לבירור לגבי יישוב ספציפי ניתן לשלוח הודעה מהירה." },
                { q: "מה קורה אם יש עיכוב בדרך? מי מעדכן אותי?", a: "המערכת שלנו שקופה לחלוטין. תקבלו עדכונים בזמן אמת, ובכל מקרה שירות הלקוחות שלנו זמין תמיד למענה אנושי מהיר." },
                { q: "האם המחיר קבוע מראש, או שיש הפתעות בסוף?", a: "המחיר שנקבע במעמד ההזמנה הוא המחיר הסופי. אין עמלות נסתרות או הפתעות בדוח החודשי." }
              ].map((faq, i) => (
                <FAQItem key={i} question={faq.q} answer={faq.a} />
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* FINAL CTA - Blue Background */}
      <section className="py-24 px-6 bg-[#003594] text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-10 ">צריכים שליח עכשיו?</h2>
          <Link href="/order" className="bg-[#FF5100] text-white px-10 py-4 rounded-full font-black text-lg md:text-xl hover:scale-105 transition-all inline-flex items-center gap-4 shadow-2xl">
            בואו נסגור הזמנה<ArrowRight size={24} />
          </Link>
        </div>
      </section>

      {/* FOOTER - Matching Deep Blue/Slate */}
      <footer className="py-12 px-6 bg-slate-950 text-white text-center border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xl font-black">DELIVERY<span className="text-[#FF5100]">NOW</span></div>
          <div className="flex gap-8 font-bold text-slate-400 text-sm">
            <Link href="/" className="hover:text-white">בית</Link>
            <Link href="#faq" className="hover:text-white">שאלות נפוצות</Link>
            <div className="flex flex-col items-center md:items-end">
              <span className="text-[10px] uppercase text-slate-500 ">על פי זמינות</span>
              <Link href="tel:0523409255" className="hover:text-[#FF5100]">052-3409255</Link>
            </div>
          </div>
          <p className="text-slate-500 text-xs font-medium">© 2026 DeliveryNow. כל הזכויות שמורות.</p>
        </div>
      </footer>
    </div>
  );
}