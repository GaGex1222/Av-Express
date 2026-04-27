"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJsApiLoader } from '@react-google-maps/api';
import { Package, Search, Plus, Trash2, ArrowRight, Phone, User, Edit3, Check } from 'lucide-react';

const libraries: ("places")[] = ["places"];

interface DeliveryPoint {
  id: string;
  address: string;
  apartment: string;
  floor: string;
  notes: string;
  contactName: string;
  contactPhone: string;
}

export default function ProfessionalOrderPage() {
  const [packageSize, setPackageSize] = useState<string | null>(null);
  const [pickup, setPickup] = useState<DeliveryPoint>({
    id: 'pickup', address: '', apartment: '', floor: '', notes: '', contactName: '', contactPhone: ''
  });
  const [dropOffs, setDropOffs] = useState<DeliveryPoint[]>([
    { id: Math.random().toString(), address: '', apartment: '', floor: '', notes: '', contactName: '', contactPhone: '' }
  ]);
  
  const [collapsedStates, setCollapsedStates] = useState<Record<string, boolean>>({});
  const [totalPrice, setTotalPrice] = useState(35);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries, language: 'he', region: 'IL'
  });

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
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .input-fix:focus {
          border-color: #0066FF;
          background-color: white !important;
          box-shadow: 0 10px 25px rgba(0, 102, 255, 0.1);
        }

        .pac-container { 
          border-radius: 1.25rem !important; 
          z-index: 9999 !important; 
          border: none !important; 
          box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important; 
        }
      `}</style>

      <div className="max-w-4xl mx-auto space-y-5">
        
        {/* בחירת גודל חבילה - נקי וללא בחירה אוטומטית */}
        <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
           <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
             <Package size={20} className="text-blue-600" /> גודל החבילה
           </h2>
           <div className="grid grid-cols-4 gap-3">
              {['מעטפה', 'קטן', 'בינוני', 'גדול'].map((size) => (
                <button 
                  key={size}
                  onClick={() => setPackageSize(size)}
                  className={`h-14 rounded-xl font-bold transition-all border-2 ${packageSize === size ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'}`}
                >
                  {size}
                </button>
              ))}
           </div>
        </section>

        {/* איסוף */}
        <PointSection 
          title="איסוף" 
          point={pickup} 
          isPickup 
          onUpdate={(val: DeliveryPoint) => setPickup(val)} 
          isCollapsed={!!collapsedStates['pickup']}
          setCollapsed={(s: boolean) => setCollapsedStates(prev => ({ ...prev, pickup: s }))}
        />

        {/* יעדי מסירה */}
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
          onClick={() => setDropOffs([...dropOffs, { id: Math.random().toString(), address: '', apartment: '', floor: '', notes: '', contactName: '', contactPhone: '' }])} 
          className="w-full h-16 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-[#0066FF] hover:border-[#0066FF] hover:bg-blue-50/30 transition-all flex items-center justify-center gap-2 font-black text-lg uppercase italic"
        >
          <Plus size={24} /> הוסף יעד מסירה
        </button>
      </div>

      {/* Mobile Footer */}
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

  // בדיקה אם הטופס מוכן לכיווץ
  const isReadyToCollapse = 
    point.address.trim().length > 5 && 
    point.contactName.trim().length > 1 && 
    point.contactPhone.trim().length >= 9;

  // לוגיקת לחיצה בחוץ - גורמת להתכווצות
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sectionRef.current && !sectionRef.current.contains(event.target as Node)) {
        if (isReadyToCollapse) {
          setCollapsed(true);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isReadyToCollapse, setCollapsed]);

  return (
    <motion.section 
      ref={sectionRef}
      layout
      className={`bg-white rounded-[2rem] shadow-sm border-2 transition-all duration-500 overflow-hidden ${isCollapsed ? 'border-blue-500 bg-blue-50/10' : 'border-slate-100'}`}
    >
      <AnimatePresence mode="wait">
        {isCollapsed ? (
          /* מצב "בר" קטן ומכווץ */
          <motion.div 
            key="collapsed" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="p-4 flex items-center justify-between cursor-pointer"
            onClick={() => setCollapsed(false)}
          >
            <div className="flex items-center gap-4 overflow-hidden">
              <div className="bg-blue-600 p-2 rounded-xl text-white shrink-0 shadow-lg shadow-blue-100">
                <Check size={20} strokeWidth={3} />
              </div>
              <div className="truncate">
                <div className="text-blue-600 font-black text-[10px] uppercase tracking-tighter leading-none mb-1">{title} הושלם</div>
                <div className="text-slate-800 font-bold text-sm truncate">{point.address}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
               <Edit3 size={18} className="text-blue-500" />
               {canDelete && <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-red-300 hover:text-red-500 p-1"><Trash2 size={18}/></button>}
            </div>
          </motion.div>
        ) : (
          /* מצב טופס פתוח */
          <motion.div key="expanded" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 md:p-8 space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-800 italic uppercase tracking-tighter">{title}</h2>
              {canDelete && <button onClick={onDelete} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={24}/></button>}
            </div>
            
            <AddressInput 
              value={point.address} 
              onChange={(addr: string) => onUpdate({ ...point, address: addr })} 
              placeholder={isPickup ? "מאיפה אוספים?" : "לאן מוסרים?"}
            />

            <div className="grid grid-cols-3 gap-3">
              <div className="relative">
                <input type="text" placeholder="דירה" className="input-fix text-center px-2" value={point.apartment} onChange={e => onUpdate({...point, apartment: e.target.value})} />
              </div>
              <div className="relative">
                <input type="text" placeholder="קומה" className="input-fix text-center px-2" value={point.floor} onChange={e => onUpdate({...point, floor: e.target.value})} />
              </div>
              <div className="relative col-span-1">
                <input type="text" placeholder="הערות" className="input-fix px-4" value={point.notes} onChange={e => onUpdate({...point, notes: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="relative group">
                {/* אייקון שם - מקובע לשמאל */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-focus-within:text-[#0066FF] transition-colors">
                  <User size={20}/>
                </div>
                <input 
                  type="text" 
                  placeholder="שם איש קשר" 
                  className="input-fix pl-12 pr-5 text-right" 
                  value={point.contactName} 
                  onChange={e => onUpdate({...point, contactName: e.target.value})} 
                />
              </div>
              <div className="relative group">
                {/* אייקון טלפון - מקובע לשמאל */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-focus-within:text-[#0066FF] transition-colors">
                  <Phone size={20}/>
                </div>
                <input 
                  type="tel" 
                  placeholder="מספר טלפון" 
                  className="input-fix pl-12 pr-5 text-right" 
                  value={point.contactPhone} 
                  onChange={e => onUpdate({...point, contactPhone: e.target.value})} 
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

function AddressInput({ value, onChange, placeholder }: any) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      autoCompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: "il" },
        fields: ["formatted_address"],
        types: ["address"]
      });
      autoCompleteRef.current.addListener("place_changed", () => {
        const place = autoCompleteRef.current?.getPlace();
        if (place?.formatted_address) {
          onChange(place.formatted_address);
        }
      });
    }
  }, []);

  return (
    <div className="relative group">
      {/* אייקון חיפוש - מקובע לשמאל */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0066FF] pointer-events-none z-10">
        <Search size={22} />
      </div>
      <input 
        ref={inputRef}
        type="text" 
        defaultValue={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-fix pl-12 pr-5 text-right placeholder:text-slate-400" 
      />
    </div>
  );
}