"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJsApiLoader } from '@react-google-maps/api';
import { 
  Package, Search, Plus, Trash2, ArrowRight, 
  Phone, User, Edit3, Check, Mail, 
  ShoppingBag,
  Cuboid,
  Clock,
  Calendar,
  Loader2,
  ReceiptText
} from 'lucide-react';

import { calculateFinalPrice, getFrontendPrice } from '@/lib/maps';

const libraries: ("places")[] = ["places"];

const COLORS = {
  primary: '#FF5100', 
  secondary: '#003594', 
  accent: '#0056D2', 
  lightBg: '#F8FAFC',
  highlight: '#D9EFFF', 
};

const SIZES = [
  { id: 'מעטפה', label: 'מעטפה', price: 35, icon: <Mail size={22} />, weight: 'עד 0.25 ק"ג', dimensions: '20x20' },
  { id: 'קטן', label: 'קטן', price: 45, icon: <ShoppingBag size={22} />, weight: 'עד 5 ק"ג', dimensions: '30x30' },
  { id: 'בינוני', label: 'בינוני', price: 60, icon: <Cuboid size={35} />, weight: 'עד 10 ק"ג', dimensions: '40x40' },
  { id: 'גדול', label: 'גדול', price: 75, icon: <Package size={35} />, weight: 'עד 20 ק"ג', dimensions: '50x50' },
];

const isValidIsraeliPhone = (phone: string) => {
  const regex = /^05\d{8}$/;
  return regex.test(phone);
};


const isValidFullName = (name: string) => {
  const parts = name.trim().split(/\s+/);
  return parts.length >= 2 && parts.every(part => part.length >= 2);
};

interface DeliveryPoint {
  id: string; 
  address: string; 
  apartment: string; 
  floor: string; 
  notes: string; 
  contactName: string; 
  contactPhone: string;
  lat?: number;
  lng?: number;
}

export default function ProfessionalOrderPage() {
  const [packageSize, setPackageSize] = useState('');
  const [isSizeCollapsed, setIsSizeCollapsed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); 
  
  const [deliveryType, setDeliveryType] = useState('instant'); 
  const [scheduledTime, setScheduledTime] = useState('');
  const [latestDeliveryTime, setLatestDeliveryTime] = useState('');

  // פרטי לקוח משלם (עבור קבלה)
  const [customer, setCustomer] = useState({ fullName: '', phone: '' });
  const [customerErrors, setCustomerErrors] = useState({ fullName: false, phone: false });

  const [pickup, setPickup] = useState<DeliveryPoint>({
    id: 'pickup', address: '', apartment: '', floor: '', notes: '', contactName: '', contactPhone: ''
  });
  const [dropOffs, setDropOffs] = useState<DeliveryPoint[]>([
    { id: Math.random().toString(), address: '', apartment: '', floor: '', notes: '', contactName: '', contactPhone: '' }
  ]);
  
  const [collapsedStates, setCollapsedStates] = useState<Record<string, boolean>>({});
  const [totalPrice, setTotalPrice] = useState(0);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries, language: 'he', region: 'IL'
  });

  const isFormValid = () => {
    const validateCustomer = isValidFullName(customer.fullName) && isValidIsraeliPhone(customer.phone);
    const validatePoint = (p: DeliveryPoint) => 
      p.address && p.apartment && p.floor && p.contactName.trim().length > 0 && isValidIsraeliPhone(p.contactPhone);
    
    const isTimingValid = deliveryType === 'instant' || (deliveryType === 'scheduled' && scheduledTime !== '');

    return validateCustomer && validatePoint(pickup) && dropOffs.every(validatePoint) && isTimingValid && packageSize;
  };

  useEffect(() => {
    const updateQuote = async () => {
      if (!packageSize) {
        setTotalPrice(0);
        return;
      }

      const hasPickup = pickup.lat && pickup.lng;
      const hasFirstDropoff = dropOffs[0]?.lat && dropOffs[0]?.lng;

      if (!hasPickup || !hasFirstDropoff) {
        const basePriceOnly = calculateFinalPrice(0, packageSize);
        setTotalPrice(basePriceOnly);
        return;
      }

      try {
        const price = await getFrontendPrice(
          { lat: pickup.lat!, lng: pickup.lng! },
          dropOffs.filter(d => d.lat && d.lng) as { lat: number; lng: number }[],
          packageSize
        );

        setTotalPrice(price);
      } catch (error) {
        console.error("Error updating price:", error);
      }
    };

    if (isLoaded) {
      const timer = setTimeout(updateQuote, 500); 
      return () => clearTimeout(timer);
    }
  }, [dropOffs, pickup, packageSize, isLoaded]);

  const handlePayment = async () => {
    if (!isFormValid() || isSubmitting) {
        setCustomerErrors({ 
            fullName: !isValidFullName(customer.fullName), 
            phone: !isValidIsraeliPhone(customer.phone) 
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    setIsSubmitting(true); 

    const orderData = {
      customer: customer,
      packageType: packageSize,
      isScheduled: deliveryType === 'scheduled',
      scheduledDate: scheduledTime,
      latestDeliveryTime: latestDeliveryTime,
      pickup: pickup,
      dropOffs: dropOffs,
      totalPrice: totalPrice
    };

    try {
      const response = await fetch('/api/order/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      
      if (result.status === 'success' && result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      } else {
        alert('חלה שגיאה ביצירת התשלום. נא לנסות שוב.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Failed to send order:', error);
      alert('שגיאת תקשורת. נא לנסות שוב.');
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-44 px-4 md:px-12 pt-6 md:pt-10 font-['Heebo']" dir="rtl">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@700;800;900&display=swap');
        * { font-family: 'Heebo', sans-serif !important; }
        .input-fix { width: 100%; height: 60px !important; border-radius: 1.25rem; background-color: white !important; border: 2px solid #E2E8F0; color: #0F172A !important; font-size: 1.1rem !important; font-weight: 700 !important; outline: none; transition: all 0.2s ease; }
        .input-fix:focus { border-color: ${COLORS.accent}; box-shadow: 0 0 0 4px ${COLORS.highlight}; }
        .input-error { border-color: #ef4444 !important; background-color: #fff1f1 !important; }
      `}</style>

      <div className="max-w-4xl mx-auto space-y-5">
        
        {/* Customer Info (Billing) */}
        <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border-2 border-white space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
            <ReceiptText className="text-[#003594]" size={28} />
            <div>
                <h2 className="text-2xl font-black text-[#0F172A]">פרטי לקוח</h2>
                <p className="text-sm text-slate-400 font-medium">מידע זה ישמש להנפקת קבלה עבור התשלום</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 text-slate-300 group-focus-within:text-blue-600"><User size={20}/></div>
                <input 
                  type="text" 
                  placeholder="שם מלא (פרטי ומשפחה) *" 
                  className={`input-fix pl-12 pr-5 text-right ${customerErrors.fullName ? 'input-error' : ''}`} 
                  value={customer.fullName} 
                  onChange={e => {
                    setCustomer(prev => ({ ...prev, fullName: e.target.value }));
                    if (customerErrors.fullName) setCustomerErrors(prev => ({ ...prev, fullName: false }));
                  }}
                  onBlur={() => setCustomerErrors(prev => ({ ...prev, fullName: !isValidFullName(customer.fullName) }))}
                />
                {customerErrors.fullName && (
                    <span className="text-[10px] text-red-500 mt-1 mr-2 font-bold">נא להזין שם פרטי ומשפחה (לפחות 2 מילים)</span>
                )}
            </div>
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 text-slate-300 group-focus-within:text-blue-600"><Phone size={20}/></div>
                <input 
                  type="tel" 
                  placeholder="טלפון ליצירת קשר *" 
                  className={`input-fix pl-12 pr-5 text-right ${customerErrors.phone ? 'input-error' : ''}`} 
                  value={customer.phone} 
                  onChange={e => {
                    setCustomer(prev => ({ ...prev, phone: e.target.value }));
                    if (customerErrors.phone) setCustomerErrors(prev => ({ ...prev, phone: false }));
                  }}
                  onBlur={() => setCustomerErrors(prev => ({ ...prev, phone: !isValidIsraeliPhone(customer.phone) }))}
                />
                {customerErrors.phone && (
                    <span className="text-[10px] text-red-500 mt-1 mr-2 font-bold">נא להזין מספר טלפון תקין (לדוגמה: 0501234567)</span>
                )}
            </div>
          </div>
        </section>

        {/* Timing Section */}
        <section className="bg-white rounded-[2.5rem] p-6 shadow-sm border-2 border-white space-y-4">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest mr-2 block">מתי לאסוף את המשלוח?</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={() => setDeliveryType('instant')}
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${deliveryType === 'instant' ? 'border-[#FF5100] bg-orange-50/30' : 'border-slate-100 bg-white'}`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${deliveryType === 'instant' ? 'border-[#FF5100]' : 'border-slate-300'}`}>
                {deliveryType === 'instant' && <div className="w-3 h-3 rounded-full bg-[#FF5100]" />}
              </div>
              <div className="flex items-center gap-3">
                <Clock size={20} className={deliveryType === 'instant' ? 'text-[#FF5100]' : 'text-slate-400'} />
                <span className={`font-bold ${deliveryType === 'instant' ? 'text-slate-900' : 'text-slate-500'}`}>מעכשיו לעכשיו</span>
              </div>
            </button>

            <button 
              onClick={() => setDeliveryType('scheduled')}
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${deliveryType === 'scheduled' ? 'border-[#FF5100] bg-orange-50/30' : 'border-slate-100 bg-white'}`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${deliveryType === 'scheduled' ? 'border-[#FF5100]' : 'border-slate-300'}`}>
                {deliveryType === 'scheduled' && <div className="w-3 h-3 rounded-full bg-[#FF5100]" />}
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={20} className={deliveryType === 'scheduled' ? 'text-[#FF5100]' : 'text-slate-400'} />
                <span className={`font-bold ${deliveryType === 'scheduled' ? 'text-slate-900' : 'text-slate-500'}`}>משלוח עתידי</span>
              </div>
            </button>
          </div>

          <AnimatePresence>
            {deliveryType === 'scheduled' && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden pt-2 space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 mr-2">שעת איסוף:</label>
                  <input 
                    type="datetime-local" 
                    className="input-fix px-6" 
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 mr-2">השעה הכי מאוחרת להספקת המשלוח:</label>
                  <input 
                    type="time" 
                    className="input-fix px-6" 
                    value={latestDeliveryTime}
                    onChange={(e) => setLatestDeliveryTime(e.target.value)}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Package Size Section */}
        <motion.section 
            layout
            className={`bg-white rounded-[2.5rem] shadow-sm border-2 transition-all duration-500 overflow-hidden ${isSizeCollapsed ? 'border-slate-100 bg-slate-50/50' : 'border-white p-6 shadow-xl shadow-slate-200/50'}`}
        >
          <AnimatePresence mode="wait">
            {isSizeCollapsed ? (
              <motion.div 
                key="size-collapsed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="p-5 flex items-center justify-between cursor-pointer"
                onClick={() => setIsSizeCollapsed(false)}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-500 p-2 rounded-full text-white shrink-0"><Check size={18} strokeWidth={4} /></div>
                  <div>
                    <div className="text-slate-400 font-black text-[10px] uppercase mb-0.5">גודל משלוח</div>
                    <div className="text-slate-800 font-bold text-sm">
                        {SIZES.find(s => s.id === packageSize)?.label} — {SIZES.find(s => s.id === packageSize)?.weight}
                    </div>
                  </div>
                </div>
                <Edit3 size={18} className="text-slate-400" />
              </motion.div>
            ) : (
              <motion.div key="size-expanded" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mr-2 block mb-4">סוג המשלוח:</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {SIZES.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => { setPackageSize(size.id); setTimeout(() => setIsSizeCollapsed(true), 600); }}
                      className={`flex flex-col items-center justify-center gap-1 h-32 rounded-3xl font-bold transition-all border-2 relative overflow-hidden ${
                        packageSize === size.id ? 'bg-white shadow-xl shadow-orange-100' : 'bg-slate-50 border-transparent text-slate-400'
                      }`}
                      style={packageSize === size.id ? { borderColor: COLORS.primary, color: COLORS.primary } : {}}
                    >
                      <div className={`p-2 rounded-full mb-1 transition-transform ${packageSize === size.id ? 'scale-110' : ''}`}>{size.icon}</div>
                      <span className="text-base font-black leading-tight">{size.label}</span>
                      <span className="text-[10px] opacity-70 px-2 leading-tight">{size.weight}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        <PointSection 
          title="נקודת איסוף" point={pickup} isPickup 
          onUpdate={(val: DeliveryPoint) => setPickup(val)} 
          isCollapsed={!!collapsedStates['pickup']}
          setCollapsed={(s: boolean) => setCollapsedStates(prev => ({ ...prev, pickup: s }))}
        />

        {dropOffs.map((drop, index) => (
          <PointSection 
            key={drop.id} title={`יעד מסירה ${index + 1}`} point={drop}
            onUpdate={(val: DeliveryPoint) => {
              const updated = [...dropOffs];
              updated[index] = val;
              setDropOffs(updated);
            }}
            onDelete={() => setDropOffs(dropOffs.filter(d => d.id !== drop.id))}
            canDelete={dropOffs.length > 1}
            isCollapsed={!!collapsedStates[drop.id]}
            setCollapsed={(s: boolean) => setCollapsedStates(prev => ({ ...prev, [drop.id]: s }))}
          />
        ))}

        <button 
          onClick={() => setDropOffs([...dropOffs, { id: Math.random().toString(), address: '', apartment: '', floor: '', notes: '', contactName: '', contactPhone: '' }])} 
          className="w-full h-16 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 hover:text-[#0056D2] transition-all flex items-center justify-center gap-2 font-black text-lg"
        >
          <Plus size={24} /> הוסף יעד נוסף
        </button>
      </div>

      {/* Payment Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-white/95 backdrop-blur-md border-t border-slate-100 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50">
        <div className="max-w-4xl mx-auto w-full flex items-center justify-between gap-4 md:gap-12">
          <div className="flex items-center gap-3 md:gap-8 shrink-0">
            <div className="flex flex-col">
              <span className="text-[10px] md:text-xs text-slate-400 font-black uppercase tracking-wider whitespace-nowrap">סה"כ לתשלום</span>
              <div className="text-2xl md:text-4xl font-black" style={{ color: COLORS.secondary }}>₪{totalPrice}</div>
            </div>
          </div>
          
          <button 
            disabled={!isFormValid() || isSubmitting}
            onClick={handlePayment}
            className={`text-white px-6 md:px-16 h-14 md:h-18 rounded-full text-lg md:text-2xl font-black flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-95 shrink-0 ${(!isFormValid() || isSubmitting) ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
            style={{ 
              backgroundColor: COLORS.primary, 
              boxShadow: isFormValid() && !isSubmitting ? `0 10px 30px -5px ${COLORS.primary}66` : 'none'
            }}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-3">
                <Loader2 size={24} className="animate-spin" />
                <span>מעבד הזמנה...</span>
              </div>
            ) : (
              <><span>המשך לתשלום</span><ArrowRight size={24} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function PointSection({ title, point, onUpdate, isPickup, onDelete, canDelete, isCollapsed, setCollapsed }: any) {
  const [showErrors, setShowErrors] = useState(false);

  const validate = () => {
    const isPhoneValid = isValidIsraeliPhone(point.contactPhone);
    const isNameProvided = point.contactName.trim().length > 0;
    const isAllFilled = point.address && point.apartment && point.floor;

    if (isAllFilled && isPhoneValid && isNameProvided) {
      setCollapsed(true);
      setShowErrors(false);
    } else {
      setShowErrors(true);
    }
  };

  const getErrorClass = (val: string, type: 'text' | 'phone' = 'text') => {
    if (!showErrors) return '';
    if (type === 'phone') return !isValidIsraeliPhone(val) ? 'input-error' : '';
    return !val ? 'input-error' : '';
  };

  return (
    <motion.section 
      layout
      className={`bg-white rounded-[2.5rem] shadow-sm border-2 transition-all duration-500 overflow-hidden ${isCollapsed ? 'border-slate-100 bg-slate-50/50' : 'border-white shadow-xl shadow-slate-200/50'}`}
    >
      <AnimatePresence mode="wait">
        {isCollapsed ? (
          <motion.div 
            key="collapsed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="p-5 flex items-center justify-between cursor-pointer"
            onClick={() => setCollapsed(false)}
          >
            <div className="flex items-center gap-4 overflow-hidden">
              <div className="bg-emerald-500 p-2 rounded-full text-white shrink-0"><Check size={18} strokeWidth={4} /></div>
              <div className="truncate">
                <div className="text-slate-400 font-black text-[10px] uppercase mb-0.5">{title}</div>
                <div className="text-slate-800 font-bold text-sm truncate max-w-[250px]">{point.address}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Edit3 size={18} className="text-slate-400" />
              {canDelete && <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-red-300"><Trash2 size={18}/></button>}
            </div>
          </motion.div>
        ) : (
          <motion.div key="expanded" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-50 pb-4">
              <h2 className="text-2xl font-black tracking-tight" style={{ color: COLORS.secondary }}>{title}</h2>
              {canDelete && <button onClick={onDelete} className="text-red-400"><Trash2 size={22}/></button>}
            </div>

            <AddressInput 
              value={point.address} 
              error={showErrors && !point.address}
              onAddressSelect={(addr: string, lat: number, lng: number) => onUpdate({ ...point, address: addr, lat, lng })} 
              placeholder={isPickup ? "כתובת לאיסוף *" : "כתובת למסירה *"}
            />

            <div className="grid grid-cols-3 gap-3">
              <input type="text" placeholder="דירה *" className={`input-fix text-center ${getErrorClass(point.apartment)}`} value={point.apartment} onChange={e => onUpdate({...point, apartment: e.target.value})} />
              <input type="text" placeholder="קומה *" className={`input-fix text-center ${getErrorClass(point.floor)}`} value={point.floor} onChange={e => onUpdate({...point, floor: e.target.value})} />
              <input type="text" placeholder="הערות" className="input-fix px-4" value={point.notes} onChange={e => onUpdate({...point, notes: e.target.value})} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 text-slate-300 group-focus-within:text-blue-600"><User size={20}/></div>
                <input 
                  type="text" 
                  placeholder="שם ליצירת קשר *" 
                  className={`input-fix pl-12 pr-5 text-right ${showErrors && point.contactName.trim().length === 0 ? 'input-error' : ''}`} 
                  value={point.contactName} 
                  onChange={e => onUpdate({...point, contactName: e.target.value})} 
                />
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 text-slate-300 group-focus-within:text-blue-600"><Phone size={20}/></div>
                <input type="tel" placeholder="מספר טלפון *" className={`input-fix pl-12 pr-5 text-right ${getErrorClass(point.contactPhone, 'phone')}`} value={point.contactPhone} onChange={e => onUpdate({...point, contactPhone: e.target.value})} />
              </div>
            </div>

            <button 
              onClick={validate} 
              className="w-full py-4 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-2"
              style={{ backgroundColor: COLORS.secondary }}
            >
              <Check size={18} strokeWidth={3} /> אישור פרטים
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

function AddressInput({ value, onAddressSelect, placeholder, error }: any) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => { setInputValue(value); }, [value]);

  useEffect(() => {
    if (inputRef.current && window.google) {
      autoCompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: "il" }, 
        fields: ["formatted_address", "geometry"], 
        types: ["address"]
      });
      
      autoCompleteRef.current.addListener("place_changed", () => {
        const place = autoCompleteRef.current?.getPlace();
        if (place?.formatted_address && place.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          setInputValue(place.formatted_address);
          onAddressSelect(place.formatted_address, lat, lng);
        }
      });
    }
  }, []);

  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 text-blue-500"><Search size={22} /></div>
      <input 
        ref={inputRef} type="text" value={inputValue} 
        onChange={(e) => setInputValue(e.target.value)} 
        placeholder={placeholder} 
        className={`input-fix pl-12 pr-5 text-right ${error ? 'input-error' : ''}`} 
      />
    </div>
  );
}