"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Check, Home, ShoppingBag, Loader2, MapPin, User, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

// רכיב התוכן הפנימי שמשתמש ב-SearchParams
function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    async function fetchOrderDetails() {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('orders')
          .select('customer_name, pickup_address, created_at')
          .eq('id', orderId)
          .single();

        if (error) throw error;
        setOrderData(data);
      } catch (err) {
        console.log('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#003594] w-12 h-12" />
      </div>
    );
  }

  const isOrderFound = !!orderData;

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
        {isOrderFound && (
          <div className="relative mb-12 flex justify-center pt-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute w-48 h-48 bg-green-100/40 rounded-full blur-3xl"
              />
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                className="relative w-44 h-44 bg-[#22C55E] rounded-full flex items-center justify-center shadow-[0_25px_50px_-12px_rgba(34,197,94,0.5)] border-[10px] border-white"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  <Check size={64} className="text-white stroke-[5px]" />
                </motion.div>
              </motion.div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={!isOrderFound ? "pt-4" : ""}
        >
          <h1 className={`text-3xl font-black mb-2 ${isOrderFound ? 'text-[#0F172A]' : 'text-slate-400'}`}>
            {isOrderFound ? "ההזמנה התקבלה!" : "הזמנה לא נמצאה"}
          </h1>
          <p className="text-slate-500 font-medium text-base mb-6">
            {isOrderFound ? (
              <>תודה שבחרת ב-<span className="text-[#FF5100] font-bold">DELIVERY</span><span className="text-[#FF5100] font-black">NOW</span>.</>
            ) : (
              "לא הצלחנו לאתר את פרטי ההזמנה במערכת."
            )}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-50 rounded-2xl p-5 mb-8 text-right space-y-3 border border-slate-100 min-h-[100px] flex flex-col justify-center"
        >
          {isOrderFound ? (
            <>
              <div className="flex mb-2 items-center gap-3 text-slate-700">
                <User size={18} className="text-[#003594]" />
                <span className="font-bold">{orderData.customer_name}</span>
              </div>
              <div className="flex mb-2 items-center gap-3 text-slate-700">
                <MapPin size={18} className="text-[#FF5100]" />
                <span className="text-sm leading-tight font-medium">{orderData.pickup_address}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <Clock size={18} />
                <span className="text-xs">
                  {new Date(orderData.created_at).toLocaleString('he-IL', {
                    hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit'
                  })}
                </span>
              </div>
            </>
          ) : (
            <div className="text-center py-2">
              <AlertCircle size={24} className="mx-auto text-slate-300 mb-2" />
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                מזהה הזמנה: <span className="block text-xs opacity-70 mt-1 select-all">{orderId || "לא צוין"}</span>
                <span className="block mt-2 text-xs">בדוק שהקישור תקין או פנה לתמיכה.</span>
              </p>
            </div>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-3"
        >
          <Link 
            href="/"
            className="w-full mb-4 bg-[#003594] text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-[#002a75] transition-all shadow-lg shadow-blue-100"
          >
            חזרה לדף הבית <Home size={20} />
          </Link>
          <Link 
            href="/order"
            className="w-full bg-white text-[#003594] border-2 border-[#003594] py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-slate-50 transition-all"
          >
            {isOrderFound ? "הזמנה חדשה" : "ביצוע הזמנה"} <ShoppingBag size={20} />
          </Link>
        </motion.div>

        <p className="mt-8 text-slate-400 text-xs font-bold uppercase tracking-widest">
          מענה אנושי תמיד זמין ב-052-3409255
        </p>
      </motion.div>
    </div>
  );
}

// הרכיב הראשי ש-Next.js מחפש - עטוף ב-Suspense
export default function OrderSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#003594] w-12 h-12" />
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}