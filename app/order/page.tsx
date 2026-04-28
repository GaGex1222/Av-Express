"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJsApiLoader } from '@react-google-maps/api';
import { 
  Package, Search, Plus, Trash2, ArrowRight, 
  Phone, User, Edit3, Check, Mail, Box, Truck, AlertCircle,
  Grape, Flower2, UtensilsCrossed, Zap
} from 'lucide-react';

const libraries: ("places")[] = ["places"];

// עדכון האייקונים והקטגוריות שיתאימו לעסק של רכבים
const SIZES = [
  { id: 'קטן', label: 'חבילה קטנה', icon: <Box size={18} /> },
  { id: 'בינוני', label: 'מארז/ארגז', icon: <Package size={18} /> },
  { id: 'גדול', label: 'משלוח רכב', icon: <Truck size={18} /> },
  { id: 'מיוחד', label: 'פרחים/אוכל', icon: <Flower2 size={18} /> },
];

interface DeliveryPoint {
  id: string;
  address: string;
  apartment: string;
  floor: string;
  notes: string;
  contactName: string;
  contactPhone: string;
  packageSize: string;
}

export default function ProfessionalOrderPage() {
  const [pickup, setPickup] = useState<DeliveryPoint>({
    id: 'pickup', address: '', apartment: '', floor: '', notes: '', contactName: '', contactPhone: '', packageSize: ''
  });
  const [dropOffs, setDropOffs] = useState<DeliveryPoint[]>([
    { id: Math.random().toString(), address: '', apartment: '', floor: '', notes: '', contactName: '', contactPhone: '', packageSize: 'בינוני' }
  ]);
  
  const [collapsedStates, setCollapsedStates] = useState<Record<string, boolean>>({});
  const [totalPrice, setTotalPrice] = useState(45); // מחיר בסיס גבוה יותר לרכב

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries, language: 'he', region: 'IL'
  });

  useEffect(() => {
    // לוגיקת תמחור רכב (למשל 45 ש"ח בסיס + 20 לכל יעד נוסף)
    setTotalPrice(45 + (dropOffs.length - 1) * 20);
  }, [dropOffs]);

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#F1F7FC] pb-44 px-4 md:px-12 pt-6 md:pt-10 font-['Heebo']" dir="rtl">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@700;800;900&display=swap');
        * { font-family: 'Heebo', sans-serif !important; }
        
        .input-fix {
          width: 100%;
          height: 60px !important;
          border-radius: 1.25rem;
          background-color: #white !important;
          border: 2px solid #E2E8F0;
          color: #0F172A !important;
          font-size: 1.1rem !important;
          font-weight: 700 !important;
          outline: none;
          transition: all 0.2s ease;
        }

        .input-fix:focus {
          border-color: #003594;
          box-shadow: 0 0 0 4px rgba(0, 53, 148, 0.1);
        }

        .input-error {
          border-color: #EF4444 !important;
          background-color: #FEF2F2 !important;
        }

        .pac-container { 
          border-radius: 1.25rem !important; 
          z-index: 9999 !important; 
          border: none !important; 
          box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important; 
        }
      `}</style>

      <div className="max-w-4xl mx-auto space-y-6">
        <header className="mb-10 text-center">
            <h1 className="text-3xl font-black text-[#0F172A] tracking-tighter uppercase">הזמנת <span className="text-[#FF5100]">שליח רכב</span></h1>
            <p className="text-slate-500 font-bold">* לפי זמינות בלבד</p>
        </header>

        <PointSection 
          title="נקודת איסוף (העסק שלך)" 
          point={pickup} 
          isPickup 
          onUpdate={(val: DeliveryPoint) => setPickup(val)} 
          isCollapsed={!!collapsedStates['pickup']}
          setCollapsed={(s: boolean) => setCollapsedStates(prev => ({ ...prev, pickup: s }))}
        />

        {dropOffs.map((drop, index) => (
          <PointSection 
            key={drop.id}
            title={`יעד מסירה ${index + 1}`}
            point={drop}
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
          onClick={() => {
            const newId = Math.random().toString();
            setDropOffs([...dropOffs, { id: newId, address: '', apartment: '', floor: '', notes: '', contactName: '', contactPhone: '', packageSize: 'בינוני' }]);
          }} 
          className="w-full h-20 border-2 border-dashed border-[#003594]/20 rounded-[2rem] text-[#003594] hover:bg-[#003594]/5 transition-all flex items-center justify-center gap-2 font-black text-lg"
        >
          <Plus size={24} /> הוסף יעד למסלול
        </button>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-slate-100 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50">
        <div className="flex flex-col">
          <span className="text-xs text-slate-400 font-black uppercase tracking-widest">סה"כ לתשלום</span>
          <div className="text-4xl font-black text-[#0F172A]">₪{totalPrice}</div>
        </div>
        <button className="bg-[#FF5100] text-white px-12 h-16 rounded-2xl text-xl font-black flex items-center gap-3 shadow-xl shadow-orange-200 active:scale-95 transition-all">
          המשך לתשלום <Zap size={22} className="fill-current" />
        </button>
      </div>
    </div>
  );
}

function PointSection({ title, point, onUpdate, isPickup, onDelete, canDelete, isCollapsed, setCollapsed }: any) {
  const sectionRef = useRef<HTMLElement>(null);
  const [showErrors, setShowErrors] = useState(false);

  const isAddressValid = point.address && point.address.length > 5;
  const isNameValid = point.contactName && point.contactName.length > 1;
  const isPhoneValid = point.contactPhone && point.contactPhone.length >= 9;
  const isSizeValid = isPickup ? true : point.packageSize !== '';
  const isReadyToCollapse = isAddressValid && isNameValid && isPhoneValid && isSizeValid;

  return (
    <motion.section 
      ref={sectionRef}
      layout
      className={`bg-white rounded-[2.5rem] shadow-sm border-2 transition-all duration-500 overflow-hidden ${isCollapsed ? 'border-[#003594] bg-[#F1F7FC]' : 'border-white'}`}
    >
      <AnimatePresence mode="wait">
        {isCollapsed ? (
          <motion.div 
            key="collapsed"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="p-6 flex items-center justify-between cursor-pointer"
            onClick={() => setCollapsed(false)}
          >
            <div className="flex items-center gap-5">
              <div className="bg-[#003594] p-3 rounded-2xl text-white">
                <Check size={22} strokeWidth={4} />
              </div>
              <div>
                <div className="text-[#003594] font-black text-xs uppercase tracking-wider mb-1">
                   {title} • {isPickup ? 'איסוף' : point.packageSize}
                </div>
                <div className="text-[#0F172A] font-bold text-lg truncate max-w-[200px] md:max-w-md">{point.address}</div>
              </div>
            </div>
            <Edit3 size={20} className="text-[#003594]/40" />
          </motion.div>
        ) : (
          <motion.div 
            key="expanded"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="p-8 md:p-10 space-y-8"
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-6">
              <h2 className="text-2xl font-black text-[#0F172A] uppercase tracking-tighter">{title}</h2>
              {canDelete && <button onClick={onDelete} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={24}/></button>}
            </div>

            {!isPickup && (
              <div className="space-y-4">
                <label className="text-sm font-black text-[#0F172A] uppercase">סוג המשלוח</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {SIZES.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => onUpdate({ ...point, packageSize: size.id })}
                      className={`flex flex-col items-center justify-center gap-2 h-24 rounded-[1.5rem] font-bold transition-all border-2 ${
                        point.packageSize === size.id 
                        ? 'bg-[#003594] border-[#003594] text-white shadow-xl scale-105' 
                        : 'bg-white border-slate-100 text-slate-400 hover:border-[#003594]/20'
                      }`}
                    >
                      {size.icon}
                      <span className="text-xs">{size.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                 <label className="text-sm font-black text-[#0F172A] uppercase">כתובת מלאה</label>
                 <AddressInput 
                    value={point.address} 
                    hasError={showErrors && !isAddressValid}
                    onChange={(addr: string) => onUpdate({ ...point, address: addr })} 
                    placeholder={isPickup ? "מהיכן נאסוף את הסחורה?" : "לאן השליח צריך להגיע?"}
                  />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                    <input type="text" placeholder="דירה" className="input-fix text-center" value={point.apartment} onChange={e => onUpdate({...point, apartment: e.target.value})} />
                </div>
                <div className="space-y-1">
                    <input type="text" placeholder="קומה" className="input-fix text-center" value={point.floor} onChange={e => onUpdate({...point, floor: e.target.value})} />
                </div>
                <div className="space-y-1">
                    <input type="text" placeholder="הערות לשליח" className="input-fix px-5" value={point.notes} onChange={e => onUpdate({...point, notes: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#003594]"><User size={20}/></div>
                  <input 
                    type="text" placeholder="שם איש קשר ביעד" 
                    className={`input-fix pl-14 pr-6 ${showErrors && !isNameValid ? 'input-error' : ''}`} 
                    value={point.contactName} 
                    onChange={e => onUpdate({...point, contactName: e.target.value})} 
                  />
                </div>

                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#003594]"><Phone size={20}/></div>
                  <input 
                    type="tel" placeholder="טלפון לתיאום" 
                    className={`input-fix pl-14 pr-6 ${showErrors && !isPhoneValid ? 'input-error' : ''}`} 
                    value={point.contactPhone} 
                    onChange={e => onUpdate({...point, contactPhone: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {isReadyToCollapse && (
              <motion.button 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                onClick={() => setCollapsed(true)} 
                className="w-full py-5 bg-[#003594] text-white rounded-2xl font-black text-lg uppercase shadow-2xl hover:bg-[#002870] transition-all flex items-center justify-center gap-3"
              >
                <Check size={20} strokeWidth={4} /> שמירה והמשך ליעד הבא
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

function AddressInput({ value, onChange, placeholder, hasError }: any) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (inputRef.current && window.google) {
      autoCompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: "il" },
        fields: ["formatted_address", "geometry"],
        types: ["address"]
      });
      autoCompleteRef.current.addListener("place_changed", () => {
        const place = autoCompleteRef.current?.getPlace();
        if (place?.formatted_address) onChange(place.formatted_address);
      });
    }
  }, [onChange]);

  return (
    <div className="relative group">
      <div className={`absolute left-5 top-1/2 -translate-y-1/2 z-10 ${hasError ? 'text-red-400' : 'text-[#FF5100]'}`}><Search size={22} /></div>
      <input 
        ref={inputRef} 
        type="text" 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder={placeholder} 
        className={`input-fix pl-14 pr-6 ${hasError ? 'input-error' : ''}`} 
      />
    </div>
  );
}