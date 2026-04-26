"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, Star, Zap, Shield, Menu, X, Check, ArrowLeft, MousePointer2, Smartphone, PackageCheck, Flame, Timer, Users, CalendarClock, MapPin } from 'lucide-react';

const ReviewCard = ({ name, role, content }: { name: string, role: string, content: string }) => (
  <div className="bg-white border-2 border-slate-100 p-6 md:p-8 rounded-[2.5rem] shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:border-blue-600 transition-all group text-right">
    <div className="flex gap-1 mb-4 justify-start flex-row-reverse">
      {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={14} fill="#2563eb" className="text-blue-600" />)}
    </div>
    <p className="text-slate-600 mb-8 text-lg font-bold italic leading-relaxed">"{content}"</p>
    <div className="flex items-center gap-4 border-t border-slate-50 pt-6 justify-start flex-row-reverse">
      <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white font-black shadow-lg order-1">
        {name[0]}
      </div>
      <div className="text-right order-2">
        <h5 className="font-black text-slate-900">{name}</h5>
        <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">{role}</p>
      </div>
    </div>
  </div>
);

// רכיב הסטטיסטיקה המעודכן - בסגנון כרטיס המעקב
const StatCard = ({ icon, title, value, subtitle, highlight = false }: { icon: React.ReactNode, title: string, value: string, subtitle: string, highlight?: boolean }) => (
  <div className={`bg-white border-2 ${highlight ? 'border-blue-600' : 'border-slate-100'} p-8 rounded-[2.5rem] shadow-sm flex flex-col items-center justify-center text-center group hover:shadow-xl transition-all h-full`}>
    <div className="mb-4 text-blue-600 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div className="text-4xl font-black italic tracking-tighter text-slate-900 mb-1">{value}</div>
    <div className="text-lg font-black uppercase text-slate-900 italic leading-tight">{title}</div>
    <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">{subtitle}</p>
  </div>
);

export default function HebrewDeliveryLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const steps = [
    { title: "הזמנה ב-60 שניות", desc: "מזינים כתובת איסוף ויעד בממשק הקליל שלנו. בלי טלפונים ובלי המתנה.", icon: <MousePointer2 size={24} /> },
    { title: "איתור שליח", desc: "השליח הקרוב ביותר אליכם מקבל את הקריאה ויוצא לדרך תוך רגעים.", icon: <Smartphone size={24} /> },
    { title: "טיסה ליעד", desc: "החבילה שלכם מקבלת עדיפות עליונה וטסה ליעד במסלול המהיר ביותר.", icon: <Flame size={24} /> },
    { title: "אישור מסירה", desc: "מקבלים חיוך והודעת SMS שהחבילה הגיעה בבטחה. פשוט ומושלם.", icon: <PackageCheck size={24} /> }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased overflow-x-hidden" dir="rtl">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-[100] bg-white/90 backdrop-blur-xl border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
              <Truck className="text-white w-6 h-6" />
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tighter italic text-slate-900">
              AV Express
            </span>
          </div>

          <div className="hidden lg:flex gap-10 font-black text-sm text-slate-500">
            <a href="#how" className="hover:text-blue-600 transition-colors tracking-tight">איך זה עובד?</a>
            <a href="#reviews" className="hover:text-blue-600 transition-colors tracking-tight">מה אומרים עלינו?</a>
            <a href="#stats" className="hover:text-blue-600 transition-colors tracking-tight">למה אנחנו?</a>
          </div>

          <div className="flex items-center gap-4">
            <button className="bg-slate-900 text-white px-6 md:px-8 py-3 rounded-full font-black text-sm hover:bg-blue-600 transition-all transform hover:scale-105 shadow-xl active:scale-95">
              הזמן עכשיו
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden text-slate-900"><Menu size={28} /></button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 md:pt-48 pb-16 md:pb-24 px-6 bg-white overflow-hidden">
        <div className="absolute top-0 left-0 w-1/3 h-full bg-blue-50/50 -skew-x-12 -translate-x-20 -z-10" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10 flex flex-col items-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-6 py-2 rounded-full text-xs font-black mb-10 tracking-widest border border-blue-100 uppercase">
            <Zap size={14} className="fill-blue-600" />
            משלוחים מעכשיו לעכשיו!
          </motion.div>

          <h1 className="text-[14vw] md:text-[9vw] lg:text-[8rem] font-black leading-[0.9] tracking-[-0.04em] italic mb-12 text-slate-900 uppercase">
            הזמן <span className="text-blue-600">טס.</span> <br />
            גם <span className="relative">
                אנחנו.
                <div className="absolute bottom-2 md:bottom-4 right-0 w-full h-2 md:h-4 bg-blue-100 -z-10 -rotate-1" />
            </span>
          </h1>

          <p className="text-slate-500 text-lg md:text-2xl font-bold max-w-2xl mx-auto mb-10 leading-relaxed px-4">
            החבילה שלך לא צריכה לחכות לבוקר. <br />
            מעכשיו לעכשיו, מחר בבוקר או מתי שנוח לך — אנחנו שם.
          </p>

          <button className="bg-blue-600 text-white px-10 py-6 md:px-16 md:py-8 rounded-[2.5rem] font-black text-xl md:text-3xl shadow-[0_25px_50px_rgba(37,99,235,0.2)] hover:bg-slate-900 hover:scale-105 transition-all flex items-center gap-6 group mb-10 uppercase">
            להזמנת משלוח מיידי
            <ArrowLeft size={32} className="group-hover:translate-x-3 transition-transform" />
          </button>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="how" className="py-24 md:py-32 px-6 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-20 gap-8 text-right">
            <div>
                <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter text-slate-900 uppercase">המסלול המהיר</h2>
                <p className="text-blue-600 font-black mt-4 uppercase">מבצעים הזמנה ב-4 שלבים פשוטים</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                <div className="bg-white p-8 md:p-10 rounded-[3rem] border-2 border-slate-100 shadow-sm relative z-10 hover:border-blue-600 transition-all h-full text-right">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    {step.icon}
                  </div>
                  <h4 className="text-2xl font-black mb-4 text-slate-900 uppercase">{step.title}</h4>
                  <p className="text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Unification with Card Style */}
      <section id="stats" className="py-24 md:py-32 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-20 items-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 order-2 lg:order-1">
                <StatCard 
                  icon={<Timer size={32} />} 
                  value="42" 
                  title="דקות למסירה" 
                  subtitle="זמן הגעה ממוצע"
                  highlight={false} 
                />
                <StatCard 
                  icon={<Users size={32} />} 
                  value="2.4K" 
                  title="ביקורות חיוביות" 
                  subtitle="לקוחות מרוצים"
                />
                <StatCard 
                  icon={<Shield size={32} />} 
                  value="אבטחה" 
                  title="מלאה" 
                  subtitle="ביטוח מלא על כל חבילה"
                />
                <StatCard 
                  icon={<CalendarClock size={32} />} 
                  value="גמישות" 
                  title="שיא" 
                  subtitle="עכשיו, מחר או מתי שנוח"
                />
            </div>

            <div className="text-center lg:text-right order-1 lg:order-2">
                <h2 className="text-5xl md:text-7xl font-black mb-10 leading-tight tracking-tighter italic text-slate-900 uppercase">
                  אנחנו לא שליחים. <br /> אנחנו <span className="text-blue-600 font-black">הפתרון.</span>
                </h2>
                <p className="text-slate-500 text-lg md:text-xl font-medium mb-12 leading-relaxed">
                  נמאס לכם לחכות ימים לחבילה? נמאס לכם מתירוצים? 
                  AV Express הוקמה כדי לתת לכם שקט נפשי. מהירות שהיא סטנדרט, לא בונוס.
                </p>
                <div className="flex gap-4 justify-center lg:justify-end">
                    <div className="bg-white px-6 py-4 rounded-2xl border-2 border-slate-100 flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-slate-900 font-black text-sm uppercase italic">ACTIVE DELIVERY NOW</span>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-24 md:py-32 bg-[#F8FAFC] px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-8xl font-black italic mb-6 tracking-tighter text-slate-900 uppercase">הביקורות מדברות.</h2>
            <div className="w-24 h-2 bg-blue-600 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <ReviewCard name="יונתן ל." role="לקוח מרוצה" content="הזמנתי בשעה 22:00 בלילה, ותוך 35 דקות השליח כבר דפק בדלת. אין דברים כאלה בארץ." />
            <ReviewCard name="מעיין כ." role="בעלת עסק" content="סוף סוף שירות שאפשר לסמוך עליו. הצילו לי הזמנה דחופה של לקוחה והפכו אותי למלכה." />
            <ReviewCard name="אסף ד." role="משתמש קבוע" content="האפליקציה הכי נוחה שיצא לי לעבוד איתה. שני קליקים והשליח אצלי. פשוט תענוג." />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 md:py-32 px-6 text-center bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/10 -skew-y-6 translate-y-20" />
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center px-4">
          <h3 className="text-4xl md:text-7xl font-black mb-12 italic leading-none text-white uppercase">
            החבילה שלך <br /> <span className="text-blue-600 font-black">לא תחכה לבד.</span>
          </h3>
          <button className="bg-blue-600 text-white px-10 py-6 md:px-16 md:py-8 rounded-[2.5rem] font-black text-xl md:text-3xl shadow-2xl hover:scale-105 hover:bg-white hover:text-blue-600 transition-all mb-20 uppercase">
            בואו נצא לדרך
          </button>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4">© 2026 AV Express - הסטנדרט החדש במהירות</p>
          <div className="flex flex-wrap justify-center items-center gap-4">
            <div className="flex items-center gap-2">
                <Check size={14} className="text-blue-600" />
                <span className="text-[10px] font-black text-slate-400 italic uppercase">שירות בפריסה ארצית</span>
            </div>
            <div className="flex items-center gap-2">
                <Check size={14} className="text-blue-600" />
                <span className="text-[10px] font-black text-slate-400 italic uppercase">אחריות וביטוח מלא</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}