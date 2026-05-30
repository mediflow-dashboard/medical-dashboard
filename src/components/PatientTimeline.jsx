import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Clock, HelpCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export function PatientTimeline({ appointment, currentTime }) {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState({});
  const triggerRef = useRef(null);

  if (!appointment.checkInTime) {
    return (
      <div className="flex items-center gap-1.5 text-gray-400 italic text-xs">
        <Clock className="w-3.5 h-3.5 text-gray-300" />
        <span>Sin recepción</span>
      </div>
    );
  }

  // Parse scheduled time
  const [hours, minutes] = appointment.time.split(':').map(Number);
  const scheduledDate = new Date(currentTime);
  scheduledDate.setHours(hours, minutes, 0, 0);

  // Parse check-in/arrival time
  const checkInDate = new Date(appointment.checkInTime);
  const isEarly = checkInDate < scheduledDate;
  const isLate = checkInDate > scheduledDate;

  // Arrival diff in minutes
  const diffCheckInScheduled = Math.floor((scheduledDate - checkInDate) / 60000);
  const earlyMins = isEarly ? diffCheckInScheduled : 0;
  const lateMins = isLate ? -diffCheckInScheduled : 0;

  // Determine when they were attended (or if they are still waiting)
  let attendedDate;
  if (appointment.status === 'waiting' || appointment.status === 'called') {
    attendedDate = currentTime;
  } else if (appointment.attendedTime) {
    attendedDate = new Date(appointment.attendedTime);
  } else {
    // Fallback using waitTime
    attendedDate = new Date(checkInDate.getTime() + appointment.waitTime * 60000);
  }

  // Total time spent in sala de espera
  const totalWaitMins = Math.max(0, Math.floor((attendedDate - checkInDate) / 60000));

  // Waiting before scheduled turn (if arrived early)
  let waitBeforeTurnMins = 0;
  if (isEarly) {
    if (attendedDate < scheduledDate) {
      waitBeforeTurnMins = totalWaitMins;
    } else {
      waitBeforeTurnMins = earlyMins;
    }
  }

  // Waiting after scheduled turn
  const waitAfterTurnMins = Math.max(0, totalWaitMins - waitBeforeTurnMins);

  // Calculate the total segment scale for the bar
  const totalBarLength = Math.max(10, (isEarly ? earlyMins : 0) + (isLate ? lateMins : 0) + waitAfterTurnMins);

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const THRESHOLD = 160; // Tooltip height estimate

      if (spaceBelow < THRESHOLD) {
        // Position above the trigger
        setTooltipStyle({
          bottom: (window.innerHeight - rect.top) + 6,
          left: rect.left + (rect.width / 2) - 100 // Center horizontally (width is 200px)
        });
      } else {
        // Position below the trigger
        setTooltipStyle({
          top: rect.bottom + 6,
          left: rect.left + (rect.width / 2) - 100
        });
      }
      setIsTooltipVisible(true);
    }
  };

  const handleMouseLeave = () => {
    setIsTooltipVisible(false);
  };

  const tooltip = (
    <div
      className="fixed z-[9999] w-64 bg-slate-900 text-slate-100 rounded-xl shadow-2xl border border-slate-800 p-4 space-y-3 animate-in fade-in zoom-in-95 duration-150 pointer-events-none text-xs"
      style={tooltipStyle}
    >
      <div className="font-bold border-b border-slate-800 pb-1.5 flex justify-between items-center text-[11px] uppercase tracking-wider text-slate-400">
        <span>Desglose de Tiempos</span>
        <span>ID #{appointment.id}</span>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between">
          <span className="text-slate-400">Horario de Turno:</span>
          <span className="font-bold text-white">{appointment.time} hs</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Hora de Recepción:</span>
          <span className="font-bold text-white">
            {new Date(appointment.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} hs
          </span>
        </div>
        
        <div className="flex justify-between border-t border-slate-800/60 pt-1.5">
          <span className="text-slate-400">Llegada del Paciente:</span>
          {isEarly ? (
            <span className="text-teal-400 font-semibold">{earlyMins} min Temprano</span>
          ) : isLate ? (
            <span className="text-amber-400 font-semibold">{lateMins} min Tarde</span>
          ) : (
            <span className="text-emerald-400 font-semibold">A la hora exacta</span>
          )}
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Espera en Sala:</span>
          <span className="text-blue-400 font-bold">{totalWaitMins} min totales</span>
        </div>

        {totalWaitMins > 0 && (
          <div className="pl-3 border-l border-slate-800 space-y-0.5 text-[10px] text-slate-400">
            {waitBeforeTurnMins > 0 && (
              <div className="flex justify-between">
                <span>• Espera Pre-Turno:</span>
                <span>{waitBeforeTurnMins}m</span>
              </div>
            )}
            {waitAfterTurnMins > 0 && (
              <div className="flex justify-between">
                <span>• Espera Post-Turno:</span>
                <span>{waitAfterTurnMins}m</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-slate-800/60 pt-2 text-[10px] text-slate-500 italic">
        {appointment.status === 'consulting' || appointment.status === 'finished' 
          ? "El paciente ya fue atendido." 
          : "El paciente continúa en la sala."}
      </div>
    </div>
  );

  return (
    <>
      <div
        ref={triggerRef}
        className="flex flex-col gap-1 w-full max-w-[180px] cursor-help"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Visual progress/stacked timeline bar */}
        <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden flex shadow-inner border border-gray-300/30">
          {/* 1. Early Arrival Segment */}
          {isEarly && earlyMins > 0 && (
            <div
              style={{ width: `${(earlyMins / totalBarLength) * 100}%` }}
              className="h-full bg-teal-400 hover:bg-teal-500 transition-colors"
            />
          )}

          {/* 2. Late Arrival Segment */}
          {isLate && lateMins > 0 && (
            <div
              style={{ width: `${(lateMins / totalBarLength) * 100}%` }}
              className="h-full bg-amber-400 hover:bg-amber-500 transition-colors"
            />
          )}

          {/* 3. Wait After Turn / Actual Wait Segment */}
          {waitAfterTurnMins > 0 && (
            <div
              style={{ width: `${(waitAfterTurnMins / totalBarLength) * 100}%` }}
              className={cn(
                "h-full transition-colors",
                appointment.status === 'consulting' || appointment.status === 'finished'
                  ? "bg-slate-400 hover:bg-slate-500"
                  : "bg-blue-500 hover:bg-blue-600 animate-pulse"
              )}
            />
          )}
        </div>

        {/* Labels below the bar */}
        <div className="flex justify-between text-[10px] font-semibold px-0.5">
          {isEarly ? (
            <span className="text-teal-600">-{earlyMins}m</span>
          ) : isLate ? (
            <span className="text-amber-600">+{lateMins}m</span>
          ) : (
            <span className="text-gray-500">0m</span>
          )}
          <span className={cn(
            appointment.status === 'waiting' || appointment.status === 'called'
              ? "text-blue-600 font-bold"
              : "text-gray-500 font-medium"
          )}>
            {totalWaitMins}m sala
          </span>
        </div>
      </div>
      {isTooltipVisible && createPortal(tooltip, document.body)}
    </>
  );
}
