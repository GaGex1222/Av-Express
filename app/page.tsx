"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import useMeasure from 'react-use-measure';
import { Truck, MapPin, CheckCircle, Smartphone, ArrowLeft, Zap, Menu, X, Layers, Clock, Shield, Zap as ZapIcon } from 'lucide-react';

// קומפוננטת כרטיס עם אפקט 3D במעבר עכבר
const FloatingCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative ${className}`}
    >
      <div style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </motion.div>
  );
};

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [heroRef, { height: heroHeight }] = useMeasure();
  const { scrollY } = useScroll();

  const heroOpacity = useTransform(scrollY, [0, heroHeight || 500], [1, 0]);
  const heroScale = useTransform(scrollY, [0, heroHeight || 500], [1, 0.9]);
  const bgY = useTransform(scrollY, [0, 1000], ["0%", "15%"]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-blue-600/30 overflow-x-hidden antialiased" dir="rtl">
      
      {/* רקע אימרסיבי */}
      <motion.div style={{ y: bgY }} className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-blue-600/10 blur-[140px] rounded-full opacity-60"></div>
        <div className="absolute bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[140px] rounded-full opacity-40"></div>
      </motion.div>

      {/* Nav */}
      <nav className="fixed top-0 w-full z-[100] px-4 py-4 md:px-8">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="max-w-7xl mx-auto flex items-center justify-between bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl px-5 py-3 shadow-2xl relative z-[101]"
        >
          <div className="flex items-center gap-3">
            <div className="bg-linear-to-br from-blue-500 to-indigo-600 p-2 rounded-xl">
              <Truck className="text-white w-5 h-5" />
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tighter text-white uppercase">
              A.V EXPRESS
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-300">
            <a href="#features" className="hover:text-white transition">מה אנחנו עושים</a>
            <a href="#tracking" className="hover:text-white transition">מעקב משלוח</a>
            <button className="bg-white text-black px-6 py-2 rounded-xl font-black hover:bg-blue-50 transition-transform active:scale-95 shadow-lg">הזמן עכשיו</button>
          </div>

          {/* Mobile Toggle Button */}
          <button className="md:hidden p-2 text-white relative z-[102]" onClick={toggleMenu}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </motion.div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-150 md:hidden bg-[#020617]/90 backdrop-blur-2xl flex flex-col justify-center items-center p-8"
            >
              {/* כפתור סגירה צף למעלה */}
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-8 left-8 p-3 bg-white/5 border border-white/10 rounded-full text-white"
              >
                <X size={32} />
              </button>

              <div className="flex flex-col gap-10 text-center">
                {[
                  { name: "מה אנחנו עושים", href: "#features" },
                  { name: "מעקב משלוח", href: "#tracking" },
                  { name: "צור קשר", href: "#contact" }
                ].map((item, i) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 + 0.2 }}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-4xl font-black text-white hover:text-blue-500 transition-colors tracking-tighter"
                  >
                    {item.name}
                  </motion.a>
                ))}
                
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <button className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-6 rounded-3xl font-black text-2xl shadow-[0_20px_50px_rgba(37,99,235,0.4)]">
                    הזמן עכשיו
                  </button>
                </motion.div>
              </div>

              {/* אלמנט עיצובי בתחתית */}
              <div className="absolute bottom-12 flex items-center gap-3 opacity-30">
                <Truck className="text-white w-6 h-6" />
                <span className="text-white font-black tracking-widest uppercase">A.V EXPRESS</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <motion.header 
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative pt-32 pb-20 md:pt-56 md:pb-40 px-6 z-10 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-8">
            <Zap size={14} className="text-blue-400 fill-blue-400" />
            <span className="text-blue-400 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">משלוח אחד • אינספור יעדים</span>
          </div>
          
          <h1 className="text-5xl md:text-[7rem] font-black text-white mb-8 tracking-tighter leading-[0.95]">
            משלוחים חכמים.<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-600">לכולם.</span>
          </h1>
          
          <p className="text-slate-400 text-lg md:text-2xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            בין אם אתם צריכים לשלוח חבילה לחבר או להפיץ סחורה לעשרה לקוחות בבת אחת – אנחנו עושים את זה פשוט, מהיר ובטוח.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-xl shadow-[0_20px_50px_rgba(37,99,235,0.3)] flex items-center justify-center gap-3"
            >
              התחל משלוח חדש
              <ArrowLeft size={24} />
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto bg-white/5 border border-white/10 text-white px-10 py-5 rounded-2xl font-black text-xl backdrop-blur-md transition-colors"
            >
              איך זה עובד?
            </motion.button>
          </div>
        </motion.div>
      </motion.header>

      {/* Bento Grid Features */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto z-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          
          {/* Multi-dropoff Card */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-4"
          >
            <FloatingCard className="h-full">
              <div className="h-full bg-linear-to-br from-blue-600 to-indigo-800 rounded-[2.5rem] p-8 md:p-12 border border-white/10 shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-8">
                    <Layers className="text-white" />
                  </div>
                  <h3 className="text-3xl md:text-5xl font-black mb-6">איסוף אחד, פיזור אינסופי</h3>
                  <p className="text-blue-100 text-lg mb-8 max-w-md leading-relaxed">
                    המערכת שלנו מאפשרת לכם להזין נקודת איסוף אחת ולפזר אותה לעשרות יעדים שונים. אידיאלי להפצות מכל סוג.
                  </p>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-white font-bold text-sm bg-white/10 px-4 py-2 rounded-lg">
                      <CheckCircle size={16} /> חיסכון בזמן
                    </div>
                    <div className="flex items-center gap-2 text-white font-bold text-sm bg-white/10 px-4 py-2 rounded-lg">
                      <CheckCircle size={16} /> מחיר משתלם
                    </div>
                  </div>
                </div>
                <MapPin className="absolute -bottom-10 -left-10 w-64 h-64 text-white/5 rotate-12 transition-transform group-hover:rotate-0 duration-700" />
              </div>
            </FloatingCard>
          </motion.div>

          {/* Simple Process Card */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/5 flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6">
                <Clock className="text-indigo-400" />
              </div>
              <h3 className="text-2xl font-black mb-4">בזמן שלך</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                קובעים משלוח להיום או מתזמנים לעתיד. אנחנו נגיע בדיוק מתי שנוח לכם.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-white/5 font-black text-blue-400 flex items-center gap-2 group-hover:gap-4 transition-all cursor-pointer">
              תזמן משלוח <ArrowLeft size={18} />
            </div>
          </motion.div>

          {/* Feature 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-3 bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/5 flex items-center gap-6"
          >
            <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-400"><Smartphone /></div>
            <div>
              <h4 className="font-black text-xl mb-1">הזמנה ללא הרשמה</h4>
              <p className="text-slate-500 text-sm italic">מזינים פרטים, משלמים והשליח בדרך. פשוט ככה.</p>
            </div>
          </motion.div>

          {/* Feature 2: Flexible Delivery */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-3 bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/5 flex items-center gap-6 group"
          >
            <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-400"><CheckCircle /></div>
            <div>
              <h4 className="font-black text-xl mb-1">כל דרכי המסירה</h4>
              <p className="text-slate-500 text-sm italic">ישר לידיים, בפתח המשרד או צילום ליד הדלת. אתם קובעים.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto z-10 relative border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center group"
          >
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20 group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300">
              <Clock className="text-blue-400 group-hover:text-white" size={32} />
            </div>
            <h3 className="text-2xl font-black mb-3 text-white">מגיעים הכי מהר מכולם</h3>
            <p className="text-slate-400 leading-relaxed font-medium">
               אנחנו ממוקדים באזורי הפעילות שלנו, מה שמאפשר לנו לקצר זמני המתנה ולהגיע אליכם במהירות מזמן הקריאה.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center text-center group"
          >
            <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:scale-110 transition-all duration-300">
              <Shield className="text-indigo-400 group-hover:text-white" size={32} />
            </div>
            <h3 className="text-2xl font-black mb-3 text-white">אפס תקלות, מאה אחוז שקט</h3>
            <p className="text-slate-400 leading-relaxed font-medium">
              הביטחון שלכם הוא בראש סדר העדיפויות שלנו. כל חבילה מטופלת כאילו הייתה שלנו, עם אחריות מלאה בכל שלב.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center text-center group"
          >
            <div className="w-16 h-16 bg-blue-400/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-400/20 group-hover:bg-blue-400 group-hover:scale-110 transition-all duration-300">
              <ZapIcon className="text-blue-400 group-hover:text-white" size={32} />
            </div>
            <h3 className="text-2xl font-black mb-3 text-white">מחיר הוגן ושקיפות מלאה</h3>
            <p className="text-slate-400 leading-relaxed font-medium">
              בלי עמלות נסתרות ובלי הפתעות. המחיר שאתם רואים באתר הוא המחיר שתשלמו, כולל מעקב חי עד למסירה.
            </p>
          </motion.div>

        </div>
      </section>

      {/* Footer CTA */}
      <footer className="relative py-32 px-6 text-center">
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-7xl font-black mb-10 tracking-tight text-white"
          >
            לא משנה מה הכמות,<br />
            אנחנו נביא את זה.
          </motion.h2>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-white text-black px-12 py-5 rounded-2xl font-black text-2xl shadow-2xl hover:bg-blue-50 transition-all"
          >
            הזמן משלוח עכשיו
          </motion.button>
          
          <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-xs font-bold uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-blue-500" />
              <span className="text-white font-black">A.V EXPRESS</span>
            </div>
            <p>© 2026 כל הזכויות שמורות – לוגיסטיקה חכמה לכולם</p>
          </div>
        </div>
      </footer>
    </div>
  );
}