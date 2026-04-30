"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJsApiLoader } from '@react-google-maps/api';
import { 
  Package, Search, Plus, Trash2, ArrowRight, 
  Phone, User, Edit3, Check, Mail, Box, Truck 
} from 'lucide-react';

const libraries: ("places")[] = ["places"];

const COLORS = {
  primary: '#FF5100', 
  secondary: '#003594', 
  accent: '#0056D2', 
  lightBg: '#F8FAFC',
  highlight: '#D9EFFF', 
};

const SIZES = [
  { id: 'מעטפה', label: 'מעטפה', price: 35, icon: <Mail size={18} />, desc: 'עד 0.25 ק"ג' },
  { id: 'קטן', label: 'קטנה', price: 45, icon: <Box size={18} />, desc: 'עד 5 ק"ג' },
  { id: 'בינוני', label: 'בינונית', price: 60, icon: <Package size={18} />, desc: 'עד 10 ק"ג' },
  { id: 'גדול', label: 'גדולה', price: 75, icon: <Truck size={18} />, desc: 'עד 20 ק"ג' },
];

interface DeliveryPoint {
  id: string; address: string; apartment: string; floor: string; notes: string; contactName: string; contactPhone: string;
}

export default function ProfessionalOrderPage() {
  const [packageSize, setPackageSize] = useState('קטן');
  const [isSizeCollapsed, setIsSizeCollapsed] = useState(false);
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

  useEffect(() => {
    const selectedSize = SIZES.find(s => s.id === packageSize);
    const basePrice = selectedSize ? selectedSize.price : 0;
    const additionalPointsPrice = (dropOffs.length - 1) * 15;
    setTotalPrice(basePrice + additionalPointsPrice);
  }, [dropOffs, packageSize]);

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-44 px-4 md:px-12 pt-6 md:pt-10 font-['Heebo']" dir="rtl">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@700;800;900&display=swap');
        * { font-family: 'Heebo', sans-serif !important; }
        .input-fix { width: 100%; height: 60px !important; border-radius: 1.25rem; background-color: white !important; border: 2px solid #E2E8F0; color: #0F172A !important; font-size: 1.1rem !important; font-weight: 700 !important; outline: none; transition: all 0.2s ease; }
        .input-fix:focus { border-color: ${COLORS.accent}; box-shadow: 0 0 0 4px ${COLORS.highlight}; }
        .input-error { border-color: #EF4444 !important; background-color: #FEF2F2 !important; }
      `}</style>

      <div className="max-w-4xl mx-auto space-y-5">
        
        {/* Package Size Section with Auto-Collapse */}
        <motion.section 
            layout
            className={`bg-white rounded-[2.5rem] shadow-sm border-2 transition-all duration-500 overflow-hidden ${isSizeCollapsed ? 'border-slate-100 bg-slate-50/50' : 'border-white p-6 shadow-xl shadow-slate-200/50'}`}
        >
          <AnimatePresence mode="wait">
            {isSizeCollapsed ? (
              <motion.div 
                key="size-collapsed"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="p-5 flex items-center justify-between cursor-pointer"
                onClick={() => setIsSizeCollapsed(false)}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-500 p-2 rounded-full text-white shrink-0">
                    <Check size={18} strokeWidth={4} />
                  </div>
                  <div>
                    <div className="text-slate-400 font-black text-[10px] uppercase mb-0.5">גודל משלוח</div>
                    <div className="text-slate-800 font-bold text-sm">
                        {SIZES.find(s => s.id === packageSize)?.label} — {SIZES.find(s => s.id === packageSize)?.desc}
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
                      onClick={() => {
                        setPackageSize(size.id);
                        setTimeout(() => setIsSizeCollapsed(true), 400);
                      }}
                      className={`flex flex-col items-center justify-center gap-1 h-24 rounded-2xl font-bold transition-all border-2 ${
                        packageSize === size.id 
                        ? `bg-white border-[${COLORS.primary}] text-[${COLORS.primary}] shadow-xl shadow-orange-100` 
                        : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'
                      }`}
                      style={packageSize === size.id ? { borderColor: COLORS.primary, color: COLORS.primary } : {}}
                    >
                      <div className="p-2 rounded-full mb-1">{size.icon}</div>
                      <span className="text-sm font-black">{size.label}</span>
                      <span className="text-[10px] opacity-70">{size.desc}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        <PointSection 
          title="נקודת איסוף" 
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
            setDropOffs([...dropOffs, { id: newId, address: '', apartment: '', floor: '', notes: '', contactName: '', contactPhone: '' }]);
          }} 
          className="w-full h-16 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 hover:text-[#0056D2] hover:border-[#0056D2] hover:bg-blue-50 transition-all flex items-center justify-center gap-2 font-black text-lg"
        >
          <Plus size={24} /> הוסף יעד נוסף
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/95 backdrop-blur-md border-t border-slate-100 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">סה"כ לתשלום</span>
          <div className="text-4xl font-black" style={{ color: COLORS.secondary }}>₪{totalPrice}</div>
        </div>
        <button 
          className="text-white px-12 h-16 rounded-full text-xl font-black flex items-center gap-3 shadow-2xl transition-all active:scale-95"
          style={{ backgroundColor: COLORS.primary, boxShadow: `0 10px 25px -5px ${COLORS.primary}44` }}
        >
          המשך לתשלום <ArrowRight size={22}/>
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
  const isReadyToCollapse = isAddressValid && isNameValid && isPhoneValid;

  // AUTO-COLLAPSE LOGIC: When clicking away or losing focus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sectionRef.current && !sectionRef.current.contains(event.target as Node) && !isCollapsed) {
        if (isReadyToCollapse) {
          setCollapsed(true);
          setShowErrors(false);
        } else if (point.address || point.contactName) {
          // If the user has started typing but clicks away without finishing, show errors
          setShowErrors(true);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isReadyToCollapse, isCollapsed, setCollapsed, point]);

  return (
    <motion.section 
      ref={sectionRef} layout
      className={`bg-white rounded-[2.5rem] shadow-sm border-2 transition-all duration-500 overflow-hidden ${isCollapsed ? 'border-slate-100 bg-slate-50/50' : 'border-white shadow-xl shadow-slate-200/50'}`}
    >
      <AnimatePresence mode="wait">
        {isCollapsed ? (
          <motion.div 
            key="collapsed"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="p-5 flex items-center justify-between cursor-pointer"
            onClick={() => setCollapsed(false)}
          >
            <div className="flex items-center gap-4 overflow-hidden">
              <div className="bg-emerald-500 p-2 rounded-full text-white shrink-0">
                <Check size={18} strokeWidth={4} />
              </div>
              <div className="truncate">
                <div className="text-slate-400 font-black text-[10px] uppercase mb-0.5">{title}</div>
                <div className="text-slate-800 font-bold text-sm truncate max-w-[250px]">{point.address}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Edit3 size={18} className="text-slate-400" />
              {canDelete && <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-red-300 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="expanded"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="p-8 space-y-6"
          >
            <div className="flex justify-between items-center border-b border-slate-50 pb-4">
              <h2 className="text-2xl font-black tracking-tight" style={{ color: COLORS.secondary }}>{title}</h2>
              {canDelete && <button onClick={onDelete} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={22}/></button>}
            </div>

            <div className="space-y-1">
              <AddressInput 
                value={point.address} 
                hasError={showErrors && !isAddressValid}
                onChange={(addr: string) => onUpdate({ ...point, address: addr })} 
                placeholder={isPickup ? "כתובת לאיסוף" : "כתובת למסירה"}
              />
              {showErrors && !isAddressValid && <p className="text-red-500 text-[10px] font-bold mr-4">חובה להזין כתובת</p>}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <input type="text" placeholder="דירה" className="input-fix text-center" value={point.apartment} onChange={e => onUpdate({...point, apartment: e.target.value})} />
              <input type="text" placeholder="קומה" className="input-fix text-center" value={point.floor} onChange={e => onUpdate({...point, floor: e.target.value})} />
              <input type="text" placeholder="הערות" className="input-fix px-4" value={point.notes} onChange={e => onUpdate({...point, notes: e.target.value})} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="relative group">
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 transition-colors ${showErrors && !isNameValid ? 'text-red-400' : 'text-slate-300 group-focus-within:text-blue-600'}`}><User size={20}/></div>
                  <input type="text" placeholder="שם איש קשר" className={`input-fix pl-12 pr-5 text-right ${showErrors && !isNameValid ? 'input-error' : ''}`} value={point.contactName} onChange={e => onUpdate({...point, contactName: e.target.value})} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="relative group">
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 transition-colors ${showErrors && !isPhoneValid ? 'text-red-400' : 'text-slate-300 group-focus-within:text-blue-600'}`}><Phone size={20}/></div>
                  <input type="tel" placeholder="מספר טלפון" className={`input-fix pl-12 pr-5 text-right ${showErrors && !isPhoneValid ? 'input-error' : ''}`} value={point.contactPhone} onChange={e => onUpdate({...point, contactPhone: e.target.value})} />
                </div>
              </div>
            </div>

            {isReadyToCollapse && (
              <motion.button 
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                onClick={() => setCollapsed(true)} 
                className="w-full py-4 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2"
                style={{ backgroundColor: COLORS.secondary }}
              >
                <Check size={18} strokeWidth={3} /> אישור פרטים
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
        componentRestrictions: { country: "il" }, fields: ["formatted_address", "geometry"], types: ["address"]
      });
      const stopEnter = (e: KeyboardEvent) => { if (e.key === 'Enter') e.preventDefault(); };
      inputRef.current.addEventListener('keydown', stopEnter);
      autoCompleteRef.current.addListener("place_changed", () => {
        const place = autoCompleteRef.current?.getPlace();
        if (place?.formatted_address) onChange(place.formatted_address);
      });
      return () => { if (inputRef.current) inputRef.current.removeEventListener('keydown', stopEnter); };
    }
  }, [onChange]);

  return (
    <div className="relative group">
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 ${hasError ? 'text-red-400' : 'text-blue-500'}`}><Search size={22} /></div>
      <input ref={inputRef} type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`input-fix pl-12 pr-5 text-right placeholder:text-slate-400 ${hasError ? 'input-error' : ''}`} />
    </div>
  );
}