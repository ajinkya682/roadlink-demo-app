import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ChevronRight } from 'lucide-react';
import AppHeader from '../../components/AppHeader';
import PlateTag from '../../components/PlateTag';
import { useAppData } from '../../context/AppContext';

const filters = ['All', 'Unresolved', 'Resolved'];

const getNotificationStyle = (type, resolved, categoryId) => {
  const baseStyle = { cardOpacity: 'bg-white' };
  const cat = categoryId || type || '';
  
  let materialIcon = 'notifications';
  let label = type;
  
  if (cat === 'wrong-parking' || cat.includes('Parking')) { materialIcon = 'local_parking'; label = 'WRONG PARKING'; }
  else if (cat === 'blocking-road' || cat.includes('Blocking')) { materialIcon = 'block'; label = 'BLOCKING ROAD'; }
  else if (cat === 'hit-and-run' || cat.includes('Hit')) { materialIcon = 'car_crash'; label = 'HIT & RUN'; }
  else if (cat === 'vehicle-damage' || cat.includes('Damage')) { materialIcon = 'build'; label = 'VEHICLE DAMAGE'; }
  else if (cat === 'fire' || cat.includes('Fire')) { materialIcon = 'fire_truck'; label = 'FIRE'; }
  else if (cat === 'theft' || cat.includes('Theft')) { materialIcon = 'lock_reset'; label = 'VEHICLE THEFT'; }
  else if (cat === 'tow-alert' || cat.includes('Tow')) { materialIcon = 'minor_crash'; label = 'TOW ALERT'; }
  else if (cat === 'headlights-on' || cat.includes('Headlights')) { materialIcon = 'light_mode'; label = 'HEADLIGHTS ON'; }
  else if (cat === 'windows-open' || cat.includes('Windows')) { materialIcon = 'sensor_window'; label = 'WINDOWS OPEN'; }
  else if (cat === 'emergency' || cat.includes('Emergency')) { materialIcon = 'e911_emergency'; label = 'EMERGENCY'; }
  else if (cat === 'lost-vehicle' || cat.includes('Lost')) { materialIcon = 'location_searching'; label = 'LOST VEHICLE'; }
  else if (cat === 'abandoned' || cat.includes('Abandoned')) { materialIcon = 'delete_forever'; label = 'ABANDONED VEHICLE'; }
  else if (cat === 'accident-alert' || cat.includes('Accident')) { materialIcon = 'emergency_share'; label = 'ACCIDENT ALERT'; }

  const isRed = cat.includes('theft') || cat.includes('emergency') || cat.includes('fire');
  const iconColor = isRed ? 'text-[#ba1a1a]' : 'text-[#003470]';
  const bgClass = isRed ? 'bg-[#ba1a1a]/5' : 'bg-[#003470]/5';
  const borderClass = isRed ? 'border-[#ba1a1a]/20' : 'border-[#003470]/20';

  if (resolved) {
    return {
      borderClass: 'border-[#005834]', 
      bgClass: 'bg-[#90f7ba]/20',
      iconColor: 'text-[#005834]',
      Icon: CheckCircle,
      cardOpacity: 'opacity-80 hover:opacity-100 bg-white',
      label
    };
  }

  return { ...baseStyle, borderClass, bgClass, iconColor, materialIcon, label };
};

export default function NotificationsInbox() {
  const navigate = useNavigate();
  const { notifications, markRead } = useAppData();
  const [filter, setFilter] = useState('All');

  const filtered = notifications.filter(n => {
    if (filter === 'Unresolved') return !n.resolved;
    if (filter === 'Resolved') return n.resolved;
    return true;
  });

  const handleNotificationClick = (n) => {
    if (!n.read) markRead(n.id);
    navigate(`/notification-detail/${n.id}`);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#1c1b1b] font-body pb-24">
      <AppHeader title="Notifications" />

      <main className="max-w-2xl mx-auto px-4 pt-4 w-full space-y-6">
        {/* Filter Bar */}
        <section className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full font-body text-[13px] font-bold transition-all active:scale-95 whitespace-nowrap ${
                filter === f 
                  ? 'bg-[#1b4b8f] text-[#ffffff]' 
                  : 'bg-[#f0eded] text-[#434751] hover:bg-[#eae7e7]'
              }`}
            >
              {f}
            </button>
          ))}
        </section>

        {/* Notification Feed */}
        <div className="pb-10 space-y-4">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
              <div className="w-14 h-14 bg-[#f0eded] rounded-2xl flex items-center justify-center text-[#434751]">
                <Bell size={24} />
              </div>
              <p className="font-display text-[20px] font-semibold text-[#1c1b1b]">No reports yet.</p>
              <p className="font-body text-[14px] text-[#737782]">That's a good thing.</p>
            </div>
          ) : (
            filtered.map((n) => {
              const style = getNotificationStyle(n.type, n.resolved);
              return (
                <article
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`rounded-2xl border-l-[6px] ${style.borderClass} ${style.cardOpacity} shadow-sm border-t border-r border-b border-[#1c1b1b]/10 flex items-start p-5 transition-transform hover:translate-x-1 duration-200 cursor-pointer group origin-top`}
                >
                  <div className={`mr-4 mt-0.5 flex-shrink-0 ${style.bgClass} w-10 h-10 flex items-center justify-center rounded-xl`}>
                    {style.Icon ? (
                      <style.Icon size={20} className={style.iconColor} />
                    ) : (
                      <span
                        className={`material-symbols-outlined text-[20px] ${style.iconColor}`}
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {style.materialIcon}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`font-display text-[14px] font-bold tracking-widest uppercase ${n.resolved ? 'text-[#434751]' : style.iconColor}`}>
                        {style.label || n.type}
                      </h3>
                      <span className="font-body text-[12px] text-[#c3c6d2] font-medium mt-1">{n.time}</span>
                    </div>
                    
                    {n.plate && (
                      <div className="mb-3">
                        <PlateTag plateNumber={n.plate} size="sm" />
                      </div>
                    )}
                    
                    <p className={`font-body text-[15px] leading-relaxed line-clamp-2 ${n.resolved ? 'text-[#434751]/70' : 'text-[#434751]'}`}>
                      {n.message || n.notes || "A civil report indicates your vehicle requires attention."}
                    </p>
                  </div>

                  {/* Right side indicators */}
                  <div className="ml-3 self-center flex items-center justify-center min-w-[24px]">
                    {!n.read && !n.resolved ? (
                      <div className="w-2.5 h-2.5 bg-[#ba1a1a] rounded-full shadow-sm shadow-[#ba1a1a]/40 group-active:opacity-30 transition-opacity"></div>
                    ) : n.resolved ? (
                      <CheckCircle size={16} className="text-[#005834]" />
                    ) : (
                      <ChevronRight size={20} className="text-[#c3c6d2] opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                </article>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
