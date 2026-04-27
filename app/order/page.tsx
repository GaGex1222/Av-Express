"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJsApiLoader } from '@react-google-maps/api';
import { 
  Package, Search, Plus, Trash2, ArrowRight, 
  Phone, User, Edit3, Check, Mail, Box, Truck, AlertCircle 
} from 'lucide-react';

const libraries: ("places")[] = ["places"];

const SIZES = [
  { id: 'מעטפה', label: 'מעטפה', icon: <Mail size={18} /> },
  { id: 'קטן', label: 'קטן', icon: <Box size={18} /> },
  { id: 'בינוני', label: 'בינוני', icon: <Package size={18} /> },
  { id: 'גדול', label: 'גדול', icon: <Truck size={18} /> },
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
    { id: Math.random().toString(), address: '', apartment: '', floor: '', notes: '', contactName: '', contactPhone: '', packageSize: 'קטן' }
  ]);
  
  const [collapsedStates, setCollapsedStates] = useState<Record<string, boolean>>({});
  const [totalPrice, setTotalPrice] = useState(35);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries, language: 'he', region: 'IL'
  });

  useEffect(() => {
    setTotalPrice(35 + (dropOffs.length - 1) * 15);
  }, [dropOffs]);

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-44 px-4 md:px-12 pt-6 md:pt-10 font-['Heebo']" dir="rtl">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@800;900&family=Heebo:wght@700;800;900&display=swap');
        * { font-family: 'Montserrat', 'Heebo', sans-serif !important; }
        
        .input-fix {
          width: 100%;
          height: 60px !important;
          border-radius: 1.25rem;
          background-color: #F1F5F9 !important;
          border: 2.5px solid transparent;
          color: #1E293B !important;
          font-size: 1.1rem !important;
          font-weight: 700 !important;
          outline: none;
          transition: all 0.2s ease;
        }

        .input-fix:focus {
          border-color: #0066FF;
          background-color: white !important;
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

      <div className="max-w-4xl mx-auto space-y-5">
        <PointSection 
          title="איסוף" 
          point={pickup} 
          isPickup 
          onUpdate={(val: DeliveryPoint) => setPickup(val)} 
          isCollapsed={!!collapsedStates['pickup']}
          setCollapsed={(s: boolean) => setCollapsedStates(prev => ({ ...prev, pickup: s }))}
        />

        {dropOffs.map((drop, index) => (
          <PointSection 
            key={drop.id}
            title={`מסירה ${index + 1}`}
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
            setDropOffs([...dropOffs, { id: newId, address: '', apartment: '', floor: '', notes: '', contactName: '', contactPhone: '', packageSize: 'קטן' }]);
          }} 
          className="w-full h-16 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-[#0066FF] hover:border-[#0066FF] hover:bg-blue-50/30 transition-all flex items-center justify-center gap-2 font-black text-lg uppercase italic"
        >
          <Plus size={24} /> הוסף יעד מסירה
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white/90 backdrop-blur-md border-t border-slate-100 flex items-center justify-between shadow-2xl z-50">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">מחיר סופי</span>
          <div className="text-3xl font-black text-[#00E676]">₪{totalPrice}</div>
        </div>
        <button className="bg-[#0066FF] text-white px-10 h-14 rounded-2xl text-lg font-black flex items-center gap-2 shadow-xl shadow-blue-200 active:scale-95 transition-all">
          לתשלום <ArrowRight size={20}/>
        </button>
      </div>
    </div>
  );
}

function PointSection({ title, point, onUpdate, isPickup, onDelete, canDelete, isCollapsed, setCollapsed }: any) {
  const sectionRef = useRef<HTMLElement>(null);
  const [showErrors, setShowErrors] = useState(false);

  // לוגיקת וולידציה (Auto-collapse logic)
  const isAddressValid = point.address && point.address.length > 5;
  const isNameValid = point.contactName && point.contactName.length > 1;
  const isPhoneValid = point.contactPhone && point.contactPhone.length >= 9;
  const isSizeValid = isPickup ? true : point.packageSize !== '';

  const isReadyToCollapse = isAddressValid && isNameValid && isPhoneValid && isSizeValid;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sectionRef.current && !sectionRef.current.contains(event.target as Node)) {
        if (isReadyToCollapse) {
          setCollapsed(true);
          setShowErrors(false);
        } else if (point.address || point.contactName) {
          // מציג שגיאות רק אם המשתמש התחיל למלא ויצא באמצע
          setShowErrors(true);
        }
      }
    };
    if (!isCollapsed) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isReadyToCollapse, isCollapsed, setCollapsed, point]);

  return (
    <motion.section 
      ref={sectionRef}
      layout
      className={`bg-white rounded-[2rem] shadow-sm border-2 transition-all duration-500 overflow-hidden ${isCollapsed ? 'border-blue-500 bg-blue-50/20' : 'border-slate-100'}`}
    >
      <AnimatePresence mode="wait">
        {isCollapsed ? (
          <motion.div 
            key="collapsed"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="p-4 flex items-center justify-between cursor-pointer border-r-[6px] border-blue-600"
            onClick={() => setCollapsed(false)}
          >
            <div className="flex items-center gap-4 overflow-hidden">
              <div className="bg-blue-600 p-2 rounded-xl text-white shrink-0 shadow-lg shadow-blue-100">
                <Check size={20} strokeWidth={4} />
              </div>
              <div className="truncate">
                <div className="text-blue-600 font-black text-[10px] uppercase tracking-tighter leading-none mb-1">
                   {title} הושלם {!isPickup && `• ${point.packageSize}`}
                </div>
                <div className="text-slate-800 font-bold text-sm truncate max-w-[250px]">{point.address}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Edit3 size={18} className="text-blue-500" />
              {canDelete && <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-red-200 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="expanded"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="p-6 md:p-8 space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-800 italic uppercase tracking-tighter">{title}</h2>
              {canDelete && <button onClick={onDelete} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={24}/></button>}
            </div>

            {!isPickup && (
              <div className="space-y-3">
                <div className="flex justify-between">
                   <label className="text-xs font-black text-slate-400 uppercase tracking-widest mr-2">מה הגודל?</label>
                   {showErrors && !isSizeValid && <span className="text-red-500 text-[10px] font-bold">חובה לבחור</span>}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {SIZES.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => onUpdate({ ...point, packageSize: size.id })}
                      className={`flex items-center justify-center gap-2 h-14 rounded-xl font-bold transition-all border-2 ${
                        point.packageSize === size.id 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                        : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      {size.icon}
                      <span className="text-sm">{size.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="space-y-1">
              <AddressInput 
                value={point.address} 
                hasError={showErrors && !isAddressValid}
                onChange={(addr: string) => onUpdate({ ...point, address: addr })} 
                placeholder={isPickup ? "מאיפה אוספים?" : "לאן מוסרים?"}
              />
              {showErrors && !isAddressValid && <p className="text-red-500 text-[10px] font-bold mr-4 italic">כתובת נדרשת</p>}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <input type="text" placeholder="דירה" className="input-fix text-center" value={point.apartment} onChange={e => onUpdate({...point, apartment: e.target.value})} />
              <input type="text" placeholder="קומה" className="input-fix text-center" value={point.floor} onChange={e => onUpdate({...point, floor: e.target.value})} />
              <input type="text" placeholder="הערות" className="input-fix px-4" value={point.notes} onChange={e => onUpdate({...point, notes: e.target.value})} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="relative group">
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${showErrors && !isNameValid ? 'text-red-400' : 'text-slate-300 group-focus-within:text-blue-600'}`}><User size={20}/></div>
                  <input 
                    type="text" placeholder="שם איש קשר" 
                    className={`input-fix pl-12 pr-5 text-right ${showErrors && !isNameValid ? 'input-error' : ''}`} 
                    value={point.contactName} 
                    onChange={e => onUpdate({...point, contactName: e.target.value})} 
                  />
                </div>
                {showErrors && !isNameValid && <p className="text-red-500 text-[10px] font-bold mr-4 italic">שם נדרש</p>}
              </div>

              <div className="space-y-1">
                <div className="relative group">
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${showErrors && !isPhoneValid ? 'text-red-400' : 'text-slate-300 group-focus-within:text-blue-600'}`}><Phone size={20}/></div>
                  <input 
                    type="tel" placeholder="מספר טלפון" 
                    className={`input-fix pl-12 pr-5 text-right ${showErrors && !isPhoneValid ? 'input-error' : ''}`} 
                    value={point.contactPhone} 
                    onChange={e => onUpdate({...point, contactPhone: e.target.value})}
                    onBlur={() => { if (isReadyToCollapse) setCollapsed(true); }}
                  />
                </div>
                {showErrors && !isPhoneValid && <p className="text-red-500 text-[10px] font-bold mr-4 italic">טלפון לא תקין</p>}
              </div>
            </div>

            {isReadyToCollapse && (
              <motion.button 
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                onClick={() => setCollapsed(true)} 
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
              >
                <Check size={18} strokeWidth={3} /> אישור פרטי יעד
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
      const stopEnter = (e: KeyboardEvent) => { if (e.key === 'Enter') e.preventDefault(); };
      inputRef.current.addEventListener('keydown', stopEnter);
      autoCompleteRef.current.addListener("place_changed", () => {
        const place = autoCompleteRef.current?.getPlace();
        if (place?.formatted_address) onChange(place.formatted_address);
      });
      return () => {
        if (inputRef.current) inputRef.current.removeEventListener('keydown', stopEnter);
      };
    }
  }, [onChange]);

  return (
    <div className="relative group">
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 ${hasError ? 'text-red-400' : 'text-[#0066FF]'}`}><Search size={22} /></div>
      <input 
        ref={inputRef} 
        type="text" 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder={placeholder} 
        className={`input-fix pl-12 pr-5 text-right placeholder:text-slate-400 ${hasError ? 'input-error' : ''}`} 
      />
    </div>
  );
}