"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Home, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function OrderSuccess() {
  // טעינת הפונט Heebo כדי לשמור על אחידות
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  return (
    <div 
      className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6 antialiased" 
      dir="rtl" 
      style={{ fontFamily: "'Heebo', sans-serif" }}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[3rem] shadow-xl shadow-slate-200/60 p-10 text-center border border-slate-100"
      >
        {/* Success Icon Container */}
        <div className="relative mb-8 flex justify-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              delay: 0.2 
            }}
            className="w-24 h-24 bg-[#22C55E] rounded-full flex items-center justify-center shadow-lg shadow-green-100"
          >
            <Check size={48} className="text-white stroke-[4px]" />
          </motion.div>
          
          {/* Decorative Sparks */}
          <motion.div 
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-2 -right-2 w-4 h-4 bg-green-200 rounded-full"
          />
        </div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-3xl font-black text-[#0F172A] mb-4">
            ההזמנה התקבלה בהצלחה!
          </h1>
          <p className="text-slate-500 font-medium text-lg leading-relaxed mb-10">
            תודה שבחרת ב-<span className="text-[#003594] font-bold">DELIVERY</span><span className="text-[#FF5100] font-black">NOW</span>. 
            <br />
            אנחנו כבר מתחילים לעבוד על המשלוח שלך. הודעת אישור תשלח אליך בקרוב.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <Link 
            href="/"
            className="w-full bg-[#003594] text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-[#002a75] transition-all shadow-lg shadow-blue-100"
          >
            חזרה לדף הבית <Home size={20} />
          </Link>
          
          <Link 
            href="/order"
            className="w-full bg-white text-[#003594] border-2 border-[#003594] py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-slate-50 transition-all"
          >
            הזמנה חדשה <ShoppingBag size={20} />
          </Link>
        </motion.div>

        {/* Footer info */}
        <p className="mt-8 text-slate-400 text-sm font-bold uppercase tracking-widest">
          מענה אנושי תמיד זמין ב-052-3409255
        </p>
      </motion.div>
    </div>
  );
}